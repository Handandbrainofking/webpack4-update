import {
  pushRenderEvent,
  pushHttpEvent
} from '@/api/baiduStatService'

import {
  HTTP_STAT,
  RENDER_STAT
} from '@/utils/deal_native'

/**
 * 测试百度性能统计api代码
 */
describe('api/baiduStatService.js', () => {
  // 重置native events, 重置 console
  beforeEach(() => {
    weex.clearEvents()
    console.clear()
  })

  /**
   * 测试pushHttpEvent原生运行HTTP_STAT
   */
  it('should pushHttpEvent native_module_events called', () => {
    window.WXEnvironment = {platform: 'Andirod'}
    pushHttpEvent('key', 'name', 10, 11)
    expect(weex.emitted[HTTP_STAT]).toBeTruthy()
    expect(weex.emitted[HTTP_STAT][0]).toBe('key')
    expect(weex.emitted[HTTP_STAT][1]).toBe('name')
    expect(weex.emitted[HTTP_STAT][2]).toBe(10)
    expect(weex.emitted[HTTP_STAT][3]).toBe(11)
  })

  /**
   * 测试pushHttpEvent原生运行RENDER_STAT
   */
  it('should pushRenderEvent native_module_events called', () => {
    window.WXEnvironment = {platform: 'Andirod'}
    pushRenderEvent('key', 'name', 10, 11, 12)
    expect(weex.emitted[RENDER_STAT]).toBeTruthy()
    expect(weex.emitted[RENDER_STAT][0]).toBe('key')
    expect(weex.emitted[RENDER_STAT][1]).toBe('name')
    expect(weex.emitted[RENDER_STAT][2]).toBe(10)
    expect(weex.emitted[RENDER_STAT][3]).toBe(11)
    expect(weex.emitted[RENDER_STAT][4]).toBe(12)
  })

  it('should pushHttpEvent web events called ', () => {
    window.WXEnvironment = {platform: 'Web'}
    const key = 'key'
    const name = 'name'
    const count = 10
    const duration = 1500
    pushHttpEvent(key, name, count, duration)
    expect(console.logs[0][0]).toBe(`baidu stat http event key:${key} name:${name} count:${count} duration:${duration}`)
  })

  it('should pushRenderEvent web events called ', () => {
    window.WXEnvironment = {platform: 'Web'}
    const key = 'key'
    const name = 'name'
    const mount = 10
    const http = 1500
    const sum = 1510
    pushRenderEvent(key, name, mount, http, sum)
    expect(console.logs[0][0]).toBe(`baidu stat render event key:${key} name:${name} mount:${mount} http:${http} sum:${sum}`)
  })

  it('should pushHttpEvent has key and name', () => {
    window.WXEnvironment = {platform: 'Web'}
    pushHttpEvent('key', 'name')
    expect(console.logs[0][0]).toBeTruthy()
    console.clear()
    pushHttpEvent('', 'name')
    expect(console.logs[0]).toBeFalsy()
    console.clear()
    pushHttpEvent('key', '')
    expect(console.logs[0]).toBeFalsy()
  })

  it('should pushRenderEvent has key and name', () => {
    window.WXEnvironment = {platform: 'Web'}
    pushRenderEvent('key', 'name')
    expect(console.logs[0][0]).toBeTruthy()
    console.clear()
    pushRenderEvent('', 'name')
    expect(console.logs[0]).toBeFalsy()
    console.clear()
    pushRenderEvent('key', '')
    expect(console.logs[0]).toBeFalsy()
  })
})
