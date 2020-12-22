/**
 * function: 初始化数据
 * author  : wq
 * update  : 2018/12/29 9:58
 */
import Mixins from '@/mixins'
import MixinsPageParams, { pageParams } from '@/mixins/pageParams'
import MixinsRoute from '@/mixins/route'
import RequestApi from '@/api'
import { native_logMessage } from '@/utils/deal_native'

Vue.mixin(MixinsRoute)
Vue.mixin(MixinsPageParams)
Vue.mixin(Mixins)
export const emptyVue = new Vue()
Vue.prototype.$eventHub = Vue.prototype.$eventHub || emptyVue
Vue.prototype.requestApi = RequestApi

export default new Promise((resolve, reject) =>
  // 获取页面参数
  pageParams.getPageParams().then((data) => {
    native_logMessage('获取页面参数')
    resolve(data)
  }).catch(() => {
    reject()
  }))
