import mockApi from '@/api/mock'

describe('mockApi功能验证', () => {
  // #region 用户测试用例
  beforeEach(() => {
    mockApi.reset('abc/cde')
  })
  it('mock get成功的数据-参数为对象', (done) => {
    mockApi.mockSuccess('get', 'abc/cde', {a: 1, b: 2, c: 'aa'}, {key: 'success', method: 'get'})
    mockApi.resolve('TTT', 'abc/cde?a=1&b=2&c=aa', {method: 'get'}, res => {
      expect(res.data.result.key).toBe('success')
      expect(res.data.result.method).toBe('get')
      done()
    })
  })

  it('mock get成功的数据-参数为查询字符串', (done) => {
    mockApi.mockSuccess('get', 'abc/cde', 'a=1&b=2&c=aa&', {key: 'success', method: 'get'})
    mockApi.resolve('TTT', 'abc/cde?a=1&b=2&c=aa', {method: 'get'}, res => {
      expect(res.data.result.key).toBe('success')
      expect(res.data.result.method).toBe('get')
      done()
    })
  })

  it('mock post成功的数据', (done) => {
    mockApi.mockSuccess('post', 'abc/cde', {a: 1, b: 2, c: 'aa'}, {key: 'success', method: 'post'})
    mockApi.resolve('TTT', 'abc/cde', {method: 'post', body: {a: 1, b: 2, c: 'aa'}}, res => {
      expect(res.data.result.key).toBe('success')
      expect(res.data.result.method).toBe('post')
      done()
    })
  })

  it('mock get 失败', (done) => {
    mockApi.mockFail('get', 'abc/cde', {a: 1, b: 2, c: 'aa'}, null, 501)
    mockApi.resolve('TTT', 'abc/cde?a=1&b=2&c=aa', {method: 'get'}, (res) => {
      expect(res.data.success).toBe(false)
      expect(res.data.code).toBe('501')
      expect(res.status).toBe(501)
    }).catch(() => {
      done()
    })
  })

  it('mock post 失败', (done) => {
    mockApi.mockFail('post', 'abc/cde', {a: 1, b: 2, c: 'aa'}, null, 502)
    mockApi.resolve('TTT', 'abc/cde', {method: 'post', body: {a: 1, b: 2, c: 'aa'}}, res => {
      expect(res.data.success).toBe(false)
      expect(res.data.code).toBe('502')
      expect(res.status).toBe(502)
    }).catch(() => {
      done()
    })
  })
  // #endregion
})
