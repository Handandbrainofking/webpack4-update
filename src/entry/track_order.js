/**
 * function: 跟踪订单
 * author  : wq
 * update  : 2018/5/21 17:03
 */
import Vuex from 'vuex'
import TrackOrderPage from '../page/track/trackOrder.vue'
import BeforeEntry from './common/before_entry'
import store from '@/store'
import filters from '@/filters'
import { native_logMessage } from '@/utils/deal_native.js'
import { Layout, LayoutScroll, Image, Table, Paging, Tab, TabPage, Form, Search, SearchInput, SearchTags, SearchKeys, SearchDate } from '@ddjf/ddpad'
import './common/set-view-port'
import StatisticsPlugin from '@/mixins/time_statistics'

[StatisticsPlugin, Layout, LayoutScroll, Image, Table, Paging, Tab, TabPage, Form, Search, SearchInput, SearchTags, SearchKeys, SearchDate].forEach(component => {
  Vue.use(component)
})

Vue.use(filters)
TrackOrderPage.el = '#root'
TrackOrderPage.store = new Vuex.Store(store.start())
BeforeEntry.then(() => {
  new Vue(TrackOrderPage)
})
Vue.config.errorHandler = function (err, vm, info) {
  try {
    native_logMessage('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error") 
  } catch (error) {
    console.error('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error");
  }
}
