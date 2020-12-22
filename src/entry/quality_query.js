/**
 * function: 资质查询
 * author  : wq
 * update  : 2018/5/21 17:03
 */
import QualityQueryPage from '../page/task/task_quality_inquiry/task_quality.vue'
import BeforeEntry from './common/before_entry'
import { native_logMessage } from '@/utils/deal_native.js'
import { Layout, LayoutScroll, Image, Table, Tab, TabPage, Paging } from '@ddjf/ddpad'
import './common/set-view-port'
import StatisticsPlugin from '@/mixins/time_statistics'

[StatisticsPlugin, Layout, LayoutScroll, Image, Table, Tab, TabPage, Paging].forEach(component => {
  Vue.use(component)
})

QualityQueryPage.el = '#root'
BeforeEntry.then(() => {
  new Vue(QualityQueryPage)
})
Vue.config.errorHandler = function (err, vm, info) {
  try {
    native_logMessage('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack, 'error')
  } catch (error) {
    console.error('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack, 'error')
  }
}
