/**
 * function: 跟踪订单
 * author  : xxz
 * update  : 2018/5/21 17:03
 */
import Vuex from 'vuex'
import OperationPage from '../page/performance/components/all-operation-recording.vue'
import BeforeEntry from './common/before_entry'
import store from '@/store'
import filters from '@/filters'
import { native_logMessage } from '@/utils/deal_native.js'
import { Layout, LayoutScroll, Image } from '@ddjf/ddpad'
import './common/set-view-port'
import StatisticsPlugin from '@/mixins/time_statistics'

[StatisticsPlugin, Layout, LayoutScroll, Image].forEach(component => {
  Vue.use(component)
})

Vue.use(filters)
OperationPage.el = '#root'
OperationPage.store = new Vuex.Store(store.start())
BeforeEntry.then(() => {
  new Vue(OperationPage)
})
Vue.config.errorHandler = function (err, vm, info) {
  try {
    native_logMessage('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error") 
  } catch (error) {
    console.error('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error");
  }
}
