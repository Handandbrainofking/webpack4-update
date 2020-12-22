/**
 * function: 资料详情
 * author  : wq
 * update  : 2018/5/21 17:03
 */
import DataDetailPage from '../page/data/data-detail.vue'
import { Layout, LayoutScroll, Image } from '@ddjf/ddpad'
import { native_logMessage } from '@/utils/deal_native.js'
import PageParams from './common/initData'
import SetLoginInfo from './common/setLoginInfo'
import './common/set-view-port'
import StatisticsPlugin from '@/mixins/time_statistics'

[StatisticsPlugin, Layout, LayoutScroll, Image].forEach(component => {
  Vue.use(component)
})

DataDetailPage.el = '#root'
Promise.all([PageParams, SetLoginInfo]).then(() => {
  new Vue(DataDetailPage)
})

Vue.config.errorHandler = function (err, vm, info) {
  try {
    native_logMessage('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error") 
  } catch (error) {
    console.error('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack ,"error");
  }
}
