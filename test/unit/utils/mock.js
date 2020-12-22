import mockApi from '@/api/mock'
import requestApi from '@/api/api'

function resolveData(dataUri) {
  if (typeof dataUri === 'object') return dataUri
  const uri = `@mock/http/${dataUri}`
  const jsonData = require(uri)
  if (jsonData.default) {
    return jsonData.default
  }
  return jsonData
}

function resolveUrl(url) {
  if (/https?:\/\//.test(url)) return url
  return requestApi.getUrl(url)
}

export function mockSuccess(method, url, params, data, msg) {
  let jsonData = resolveData(data)
  const mockParams = params.mockParams
  params.mockParams = undefined
  delete params.mockParams
  if (typeof jsonData === 'function') {
    jsonData = jsonData(params, mockParams)
  }
  mockApi.mockSuccess(method, resolveUrl(url), params, jsonData)
  return jsonData
}

export function mockFail(method, url, params, data = '', status = 500, error = '测试错误') {
  mockApi.mockFail(method, resolveUrl(url), params, resolveData(data), status, error)
}
