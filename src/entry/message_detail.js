/**
 * function: 消息管理
 * author  : wq
 * update  : 2018/5/21 17:03
 */
import MessagePage from '../page/message/message-detail.vue'
import RequestApi from '../api/index'
import mixins from '../mixins'
import BeforeEntry from './common/before_entry'
import { native_logMessage } from '@/utils/deal_native.js'
import { Layout, LayoutScroll, Image } from '@ddjf/ddpad'
import './common/set-view-port'
import StatisticsPlugin from '@/mixins/time_statistics'

[StatisticsPlugin, Layout, LayoutScroll, Image].forEach(component => {
  Vue.use(component)
})
// import * as filters from './filters';
const meta = weex.requireModule('meta')
try {
  meta.setViewport({
    width: 2560
  })
} catch (e) {
}
Vue.mixin(mixins)
Vue.prototype.requestApi = RequestApi
MessagePage.el = '#root'
BeforeEntry.then(() => {
  new Vue(MessagePage)
})
Vue.config.errorHandler = function (err, vm, info) {
  try {
    native_logMessage('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error") 
  } catch (error) {
    console.error('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error");
  }
}
