import RequestApi from '@/api/api.js'
import { native_logMessage } from '@/utils/deal_native'
import Dialog from '@/utils/dialog'

/** ***************SECTION UTILS********************* */
function getQqueryString(params) {
  let queryString = ''
  for (let key of Object.keys(params)) {
    queryString += queryString && '&'
    queryString += `${key}=${encodeURIComponent(params[key])}`
  }
  return queryString
}

/**
 * 事件订阅类
 */
export class Messenger {
  constructor(name) {
    this.name = name
    this.handlers = []
  }

  register(handler) {
    if (this.handlers.indexOf(handler) === -1) {
      this.handlers.push(handler)
    }
  }

  fire(...args) {
    for (let handler of this.handlers) {
      handler.call(this, ...args)
    }
  }
}

/**
 * 带缓存的HTTP请求，通过该类发送的http请求会有2S的缓存 效果，最多可以缓存 20 个请求的结果
 * 该方法会在很大程度上减少接口重复请求的问题。
 */
class HttpCacheProxy {
  constructor() {
    // 当前被缓存的内容
    this.Caches = []
  }

  // 取得默认的超时设置，默认都 为2S
  getExpireTime(method) {
    return 2000
  }

  // 通过KEY取得缓存的内容
  checkCache(key) {
    let timeHash = new Date().valueOf()
    this.Caches = this.Caches.filter(x => timeHash < x.hash)
    let result = this.Caches.find(x => x.key === key) // key 相同，而且时间不能超过5S
    return result ? result.data : null
  }

  /**
   * 设置缓存信息
   * @param {*} key 缓存的KEY
   * @param {*} data 缓存的数据，或者当前请求中的订阅窗口(Messenger)
   * @param {*} cacheIndex 可以指定替换指定下标的缓存，但必需KEY一样
   * @param {*} expires 超时设置
   */
  setCache(key, data, cacheIndex, expires) {
    let index = this.Caches.length % 20 // 我们只缓存最近20条数据到内存中

    expires = (cacheIndex > 1000 ? cacheIndex : expires) || 2000 // 默认会是2S超时
    cacheIndex = cacheIndex > 1000 ? -1 : cacheIndex

    let hash = new Date().valueOf() + expires

    if (this.Caches[cacheIndex] && this.Caches[cacheIndex].key === key) {
      // 触发原有订阅方法
      this.Caches[cacheIndex].data.fire(data)
      // 重现当前的缓存
      this.Caches[cacheIndex] = { data, key, hash }
    } else {
      this.Caches[index] = { data, key, hash }
    }
    return index
  }

  /**
   * 调用带缓存功能的HTTP， POST类型可以防止适时间重复提交，GET操作可以优化服务器调用频率
   * @param {*} options HTTP参数，method, url, data
   */
  callCacheHttp(options) {
    let queryParams = typeof options.data === 'string' ? options.data : getQqueryString(options.data)
    let key = `-u-${options.url}-p-${queryParams}`

    return new Promise((resolve, reject) => {
      let cache = this.checkCache(key)

      if (cache instanceof Messenger) {
        cache.register(resolve)
        return
      } else if (cache) {
        resolve(cache)
        return
      }

      // 请求发求未返回的时候它都是是一个Messenger，当一下个请求过来会自动把其请求也加入到当前的请求队列中，
      // 也就是说同一个请求在2S内同时触发它们会按顺序得到同一个HTTP响应的结果
      let cacheIndex = this.setCache(key, new Messenger(key))
      let cacheLife = options.expires || this.getExpireTime(options.method.toUpperCase())

      RequestApi.sendRequest(options.url, {
        method: options.method,
        data: options.data,
        success: data => {
          resolve(data)
          this.setCache(key, data, cacheIndex, cacheLife)
        },
        error: msg => {
          reject(msg)
          native_logMessage('toast', msg)
          Dialog.toast(msg)
        },
        beforeSend: options.beforeSend
      })
    })
  }
}

// 声明一个全局的缓存 HTTP 对象
const cacheHttp = new HttpCacheProxy()

/**
 * HTTP 调用类
 * 带有get, post , put , delete 方法
 */
export class Http {
  http(url, options) {
    let method = (options.method || 'POST').toUpperCase()
    let query = ''
    switch (method) {
      case 'GET':
      case 'DELETE':
        query = this.getQqueryString(options.params)
        break
      default:
        query = options.data || options.params
        break
    }

    return cacheHttp.callCacheHttp({
      url,
      method: options.method || 'POST',
      data: query,
      expires: options.expires
    })
  }

  /**
   * HTTP GET
   * @param {*} url url
   * @param {*} params 请求参数
   */
  get(url, params = {}, expires = 2000) {
    return this.http(url, { method: 'GET', params, expires })
  }

  /**
   * HTTP POST
   * @param {*} url url
   * @param {*} data post data object
   */
  post(url, data = {}, expires = 2000) {
    return this.http(url, { method: 'POST', data, expires })
  }

  /**
   * HTTP PUT
   * @param {*} data put data
   */
  put(data) {
    return this.http(url, { method: 'PUT', data })
  }

  /**
   * HTTP DELETE
   * @param {*} params delete params
   */
  del(params) {
    return this.http(url, { method: 'DELETE', params })
  }

  /**
   * convert params object to query string
   * {a:1,b:2}===> ?a=1&b=2
   * @param {*} params url params
   */
  getQqueryString(params) {
    return getQqueryString(params)
  }
}

/**
 * http 对象，可以用其完成 http.get, http.post, http.put, http.del等操作
 */
export const http = new Http()

export function isUndefined(obj) {
  return typeof obj === 'undefined'
}

// 空值检查
export function ensure(obj, def) {
  return isUndefined(obj) ? def : obj
}

export function assert(val, msg) {
  if (isUndefined(val)) {
    throw new Error(msg)
  }
}

/**
 * 取得数组的第一个项或者
 * 如果没有第一个项则返回默认项def
 */
export function firstOrDefault(arr, def) {
  arr = ensure(arr, [])
  return ensure(arr[0], def)
}

/**
 * 格式化日期显示
 * _date 支持 timestam, date string
 * format 默认是 YYYY-MM-DD hh:mm
 */
export function formatDate(_date, format = 'YYYY-MM-DD hh:mm') {
  let dateObj = null

  if (typeof _date === 'string') {
    _date = _date.replace(/-/g, '/') // ios , huawei pad 都识这个格式不认 2018-01-01这种
    dateObj = new Date(_date)
  }

  if (_date) {
    dateObj = new Date(_date)
  } else {
    return ''
  }

  var date = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'D+': dateObj.getDate(),
    'h+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    'S+': dateObj.getMilliseconds()
  }
  if (/(y+|Y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return format
}

/**
 * 映射列表中字典的显示字段
 */
export function mapListDict(state, rootState, items = []) {
  /**
   * 映射字典
   */
  const mapDict = (field, mapping, item) => {
    // userId: {dict:'users', key:'id', map:'userName'}
    let dictItems = ensure(state.dict[mapping.dict], rootState.dict[mapping.dict])
    // 如果字典中没有对应的字典设置，则直接返回并提示一个错误
    assert(dictItems, `state.dict 和 rootState.dict 都没有 ${mapping.dict} 的相关配置`)
    // 取得映射到的项
    let dictItem = firstOrDefault(dictItems.filter(x => x[mapping.key] === item[field]), {})
    // 对item添加一个新的值 item.field_userName
    mapping.map(item, dictItem)
    return item
  }

  for (let item of items) {
    for (let field of Object.keys(state.dictMappers)) {
      item = mapDict(field, state.dictMappers[field], item)
    }
  }

  return items
}

/**
 * 验证输入是否合法
 */
export function validateItem(pattern, target, key) {}

/**
 * 通过递归的方式执行插件
 */
function processPlugin(dispatch, plugins, index, params) {
  if (!plugins[index]) return params
  return dispatch(plugins[index++], params).then(
    result => {
      return processPlugin(dispatch, plugins, index, result)
    },
    err => {
      throw Error(err)
    }
  )
}

/**
 * 执行插件列表
 * @param {*} dispatch vuex dispatch
 * @param {*} plugins 插件列表
 * @param {*} params 插件运行参数
 */
export function prcessPlugins(dispatch, plugins, params) {
  return processPlugin(dispatch, plugins, 0, params)
}
