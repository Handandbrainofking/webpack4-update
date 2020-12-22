/**
 * function: 产品关联
 * author  : wq
 * update  : 2018/5/21 17:03
 */
import InterviewProductAssociationPage from '../page/task/task_product_association/task_product.vue'
import BeforeEntry from './common/before_entry'
import { native_logMessage } from '@/utils/deal_native.js'
import { Layout, LayoutScroll, Image, Table, AddList,Form, FormTitle,} from '@ddjf/ddpad'
import './common/set-view-port'
import StatisticsPlugin from '@/mixins/time_statistics'

[StatisticsPlugin, Layout, LayoutScroll, Image, Table, AddList,Form, FormTitle,].forEach(component => {
  Vue.use(component)
})

InterviewProductAssociationPage.el = '#root'
BeforeEntry.then(() => {
  new Vue(InterviewProductAssociationPage)
})
Vue.config.errorHandler = function (err, vm, info) {
  try {
    native_logMessage('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack, 'error')
  } catch (error) {
    console.error('vue 发生错误==vm=' + vm + ' info=' + info + ' err=' + err.stack, 'error')
  }
}
