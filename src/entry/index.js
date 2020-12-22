/**
 * function: 首页入口文件
 * author  : wq
 * update  : 2018/5/21 17:03
 */
import Vuex from 'vuex'
import store from '@/store'
import App from '@/page/App.vue'
import router from '@/router/index'
import filters from '@/filters'
import { native_logMessage } from '@/utils/deal_native.js'
import BeforeEntry from './common/before_entry'
import { Layout, LayoutScroll, Image, Table, TableLineCell, Paging, Tab, TabPage, Form, Search, SearchInput, SearchTags, SearchKeys, SearchDate } from '@ddjf/ddpad'
import './common/set-view-port'
import StatisticsPlugin from '@/mixins/time_statistics'

[StatisticsPlugin, Layout, LayoutScroll, Image, Table, TableLineCell, Paging, Tab, TabPage, Form, Search, SearchInput, SearchTags, SearchKeys, SearchDate].forEach(component => {
  Vue.use(component)
})

Vue.use(filters)
// 获取登录信息
BeforeEntry.then(([data]) => {
  console.log(data)
  return data['hash_url']
}).then((data) => {
  const _data = decodeURIComponent(data || '/')
  router.push(_data)
  new Vue(Vue.util.extend({
    el: '#root',
    store: new Vuex.Store(store.start()),
    router
  }, App))
})
Vue.config.errorHandler = function (err, vm, info) {
  try {
    native_logMessage('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error") 
  } catch (error) {
    console.error('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error");
  }
}
