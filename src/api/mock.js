const mockItems = {}
const mockApi = {}
const queryRegexp = /([^?]+?)\?([^#]+)/i

const findMockItem = function findMockItem(method = 'get', url, params, showNotFoundError = true, symbol) {
  method = method.toLowerCase()
  const urls = url.match(queryRegexp) || []
  url = urls[1] || url
  const queryString = urls[2]
  const mockUrlItems = mockItems[url]

  if (showNotFoundError && (!mockUrlItems || !mockUrlItems.length)) {
    const message = `[mock.js] Url 没有MOCK===》 ${url}  params: ${JSON.stringify(params)}`
    console.error(message)
    throw Error(message)
  }

  const result = mockUrlItems.find(item => {
    if (method !== item.method) return false
    if (queryString && !matchQueryString(queryString, item.params)) return false
    if ((method === 'post' || method === 'put') && !matchQuerybody(params, item.body)) {
      if (symbol) {
        console.log(params, item.body)
      }
      return false
    }
    return true
  })

  if (showNotFoundError && !result) {
    const message = `[mock.js] Url 对应的params 不一致===》 ${url}  params: ${JSON.stringify(params)}`
    console.error(message)
    throw Error(message)
  }

  return result
}

/**
 * 新增响应数据
 * @param {*} response 响应数据
 */
const appendMockItem = function appendMockItem(response) {
  const {
    method,
    params,
    url
  } = response
  mockItems[url] = mockItems[url] || []

  // 因为 findMockItem 在 get/delete 的时候是通过 queryString 进行匹配的，所以这里会先生成 queryString
  let queryString = ''
  if (method === 'get' || method === 'delete') {
    for (let key in response.params) {
      queryString += `${key}=${encodeURIComponent(response.params[key])}&`
    }
    queryString = queryString.replace(/&$/, '')
    queryString = queryString ? '?' + queryString : queryString
  }

  // 查找出已经存在的项
  const existItem = findMockItem(response.method, url + queryString, params, false)

  // 移除相同的查询条件项
  if (existItem) {
    const index = mockItems[url].findIndex(item => item === existItem)
    mockItems[url].splice(index, 1)
  }
  // 新增项
  mockItems[url].push(response)
}

/**
 * 把URL 中的queryString 转换成 Object
 * @param {String} queryString 查询字符串
 */
const converQueryToObject = function converQueryToObject(queryString) {
  // 去掉前面和后面的 &
  let queryStringTrimed = queryString.replace(/^&|&$/g, '')
  let params = queryStringTrimed.split('&')
  const reuslt = {}

  for (const param of params) {
    const [key, val] = param.split('=')
    if (!key) {
      continue
    }
    reuslt[key] = decodeURIComponent(val)
  }
  return reuslt
}

/**
 * 对比val1 与 val2 是否相等，如果类型不一样，则先把 val2 转找成与 val1 相同的类型再对比
 * @param {Object} val1 值1
 * @param {Object} val2 值2
 */
const compareVal = function (val1, val2) {
  const typeVal1 = typeof val1

  switch (typeVal1) {
    case 'string':
    case 'boolean':
    case 'undefined':
    case 'null':
    case 'bigint':
      return String(val1) === String(val2)
    case 'number':
      return val1 === Number(val2)
    default:
      return JSON.stringify(val1) === JSON.stringify(val2)
  }
}

/**
 * queryString 中的参数与params 是否完全匹配
 * @param {*} url 包含 queryString 的 url
 * @param {*} params queryString 的对象参数
 */
const matchQueryString = function matchQueryString(queryString, params) {
  // const queryString = url.match(/\?([^#]+)/i)[1]
  if (typeof queryString === 'string') {
    queryString = converQueryToObject(queryString)
  }
  if (typeof params === 'string') {
    params = converQueryToObject(params)
  }

  return matchQuerybody(queryString, params)
}

/**
 * 比对两个请求的 body 是否相等
 * @param {*} requestBody 请求的body对象
 * @param {*} body 对比的缓存 body 属性
 */
const matchQuerybody = function matchQuerybody(requestBody, body) {
  const requestBodyKeys = Object.keys(requestBody)
  const bodyKeys = Object.keys(body)
  if (requestBodyKeys.length !== bodyKeys.length) return false
  for (let key of requestBodyKeys) {
    const isEqual = compareVal(body[key], requestBody[key])    
    if (!isEqual) {
      // console.warn(`key is not equal ${key} ${body[key]}!==${requestBody[key]}`)
      return false
    }
  }
  return true
}

mockApi.resolve = function (DEFINE_NETWORK_REQUEST, url, param, cb) {
  const res = findMockItem(param.method, url, param.body, true, true)
  let response
  if (res) {
    // 保证每次获取的数据都是原始的一份数据，防止数据的改变
    response = JSON.parse(JSON.stringify(res))
    cb(response)
  }
  return new Promise((resolve, reject) => {
    if (!response) {
      const error = `[mock.js] url not found ${url}`
      console.error(error)
      reject({
        status: 404,
        message: error
      })
      throw error
    }
    if (response.status >= 200 && response.status < 300) resolve(response)
    else reject(response)
  })
}

mockApi.reset = function reset(url) {
  if (!url) return
  mockItems[url] = []
}

/**
 * 模拟成功请求的数据
 * @param {*} method http method
 * @param {*} url http url
 * @param {*} params get/delete params, put/post body
 * @param {*} data 响应的数据
 * @param {*} msg 响应的提示语,默认成功
 */
mockApi.mockSuccess = function mockSuccess(method, url, params, data, msg = '成功') {
  const response = {
    url,
    method,
    status: 200,
    body: params,
    params,
    data: {
      success: true,
      code: '200',
      msg,
      result: typeof data === 'function' ? data() : data
    }
  }

  appendMockItem(response)
}

/**
 * 模拟失败请求的数据
 * @param {*} method http method
 * @param {*} url http url
 * @param {*} params get/delete params, put/post body
 * @param {*} data 响应的数据, 默认空字符串
 * @param {*} status 错误的状态码，默认 500
 * @param {*} error 错误提示语，默认 "测试错误"
 */
mockApi.mockFail = function mockFail(method, url, params, data = '', status = 500, error = '测试错误') {
  const response = {
    url,
    method,
    status: status,
    body: params,
    params,
    data: {
      success: false,
      code: status + '',
      msg: error,
      result: typeof data === 'function' ? data() : data
    }
  }
  appendMockItem(response)
}

export default mockApi