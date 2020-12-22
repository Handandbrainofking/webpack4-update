import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { HTTP_STAT, RENDER_STAT } from '@/utils/deal_native'

import {
  httpEvent
} from '@/mixins/time_statistics'

describe('测试 mixins/time_statistics.js', () => {
  // 重置native events, 重置 console
  beforeEach(() => {
    weex.clearEvents()
    console.clear()
  })
  // 测试正常提交
  it('测试正常的带HTTP事件的提交', () => {
    const wrapper = mount(Vue.component('test_comp', {
      statistics: 'test|测试',
      template: '<div></div>'
    }))
    window.WXEnvironment = {
      platform: 'Andirod'
    }
    // add http event
    const urls = ['api/1', 'api/2', 'api/3']
    for (let url of urls) {
      httpEvent.httpStart(url, {})
      expect(httpEvent.statistics.length).toBe(1)
      httpEvent.httpEnd(url, {})
      expect(httpEvent.statistics.length).toBe(0)
    }

    expect(wrapper.vm.statistics.http.length).toBe(3)

    wrapper.vm.commitStastics()
    const events = window.weex.getEvents()
    expect(events[RENDER_STAT]).toBeTruthy()
    expect(events[HTTP_STAT]).toBeTruthy()
    // 提交后应该自动重置
    expect(wrapper.vm.statistics.http.length).toBe(0)
    // 提交后锁定提交
    expect(wrapper.vm.isStatCommited).toBe(true)
  })

  it('当http为空的时候测试是否会延时提交', (done) => {
    const wrapper = mount(Vue.component('test_comp', {
      statistics: 'test|测试',
      template: '<div></div>'
    }))
    window.WXEnvironment = {
      platform: 'Andirod'
    }
    expect(wrapper.vm.statistics.http.length).toEqual(0)

    wrapper.vm.commitStastics()
    const events = window.weex.getEvents()
    expect(events[RENDER_STAT]).toBeFalsy()
    expect(events[HTTP_STAT]).toBeFalsy()

    // 提交 Http
    // add http event
    httpEvent.httpStart('api/1', {})
    httpEvent.httpEnd('api/1', {})

    function callback() {
      const events = window.weex.getEvents()
      expect(events[RENDER_STAT]).toBeTruthy()
      expect(events[HTTP_STAT]).toBeTruthy()
      expect(wrapper.vm.isStatCommited).toBe(true)
      done()
    }
    setTimeout(callback, 1200)
  })

  it('测试多次收集', () => {
    const wrapper = mount(Vue.component('test_comp', {
      statistics: 'test|测试',
      template: '<div></div>'
    }))
    window.WXEnvironment = {
      platform: 'Andirod'
    }
    expect(wrapper.vm.statistics.http.length).toEqual(0)
    httpEvent.httpStart('api/1', {})
    httpEvent.httpEnd('api/1', {})
    expect(wrapper.vm.statistics.http.length).toEqual(1)

    wrapper.vm.commitStastics()
    // 第一次提交应该会有相关的事件
    expect(weex.emitted[RENDER_STAT]).toBeTruthy()
    expect(weex.emitted[HTTP_STAT]).toBeTruthy()
    // 重置事件
    weex.clearEvents()
    expect(weex.emitted[RENDER_STAT]).toBeFalsy()
    expect(weex.emitted[HTTP_STAT]).toBeFalsy()
    // 在没有重置的情况下，二次提交会失败
    httpEvent.httpStart('api/1', {})
    httpEvent.httpEnd('api/1', {})
    expect(wrapper.vm.statistics.http.length).toEqual(0)

    // 重置后再提次应该会有http数据
    wrapper.vm.startStasitcs()
    httpEvent.httpStart('api/1', {})
    httpEvent.httpEnd('api/1', {})
    expect(wrapper.vm.statistics.http.length).toEqual(1)
    wrapper.vm.commitStastics()
    expect(weex.emitted[RENDER_STAT]).toBeTruthy()
    expect(weex.emitted[HTTP_STAT]).toBeTruthy()
  })
})
