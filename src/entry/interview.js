/**
 * function: 流程管理
 * author  : wq
 * update  : 2018/5/21 17:03
 */
import Vuex from 'vuex'
import InterViewPage from '../page/task/task_page_tab.vue'
import BeforeEntry from './common/before_entry'
import filters from '@/filters'
import store from '@/store/task/index'
import { native_logMessage } from '@/utils/deal_native.js'
import { Layout, LayoutScroll, Image, Table, Paging, Tab, TabPage, Form, FormTitle, AddList } from '@ddjf/ddpad'
import './common/set-view-port'
import StatisticsPlugin from '@/mixins/time_statistics'

[StatisticsPlugin, Layout, LayoutScroll, Image, Table, Paging, Tab, TabPage, Form, FormTitle, AddList].forEach(component => {
  Vue.use(component)
})

Vue.use(filters)

InterViewPage.el = '#root'
BeforeEntry.then(() => {
  new Vue(Vue.util.extend({
    el: '#root',
    store: new Vuex.Store(store.start())
  }, InterViewPage))
})
Vue.config.errorHandler = function (err, vm, info) {
  try {
    native_logMessage('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack, 'error')
  } catch (error) {
    console.error('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack, 'error')
  }
}
