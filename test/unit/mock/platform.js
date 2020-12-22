import Vue from 'vue'
import Vuex from 'vuex'
import store from '@/store'
import Mixins from '@/mixins'
import MixinsPageParams from '@/mixins/pageParams'
import MixinsRoute from '@/mixins/route'
import {mockSuccess, mockFail} from '../utils/mock'
import RequestApi from '@/api'
import DDPadUI from '@ddjf/ddpad'
import SetDict from '@/entry/common/setDict'

Vue.use(DDPadUI)
Vue.mixin(MixinsRoute)
Vue.mixin(MixinsPageParams)
Vue.mixin(Mixins)
Vue.prototype.$store = window.$store = new Vuex.Store(store.start())
Vue.prototype.$eventHub = new Vue()
Vue.prototype.requestApi = RequestApi

/**
 * 延迟执行
 * @param ms 延迟毫秒数
 */
window.delay = function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

window.nextTick = function nextTick() {
  return new Promise((resolve) => {
    Vue.nextTick(() => resolve())
  })
}

window.mockSuccess = mockSuccess
window.mockFail = mockFail
