/**
 * function: 放置协议，mixin，从内存中获取数据等
 * author  : wq
 * update  : 2018/5/21 17:03
 */
import PageParams from './initData'
import SetDict from './setDict'
import SetLoginInfo from './setLoginInfo'

export default Promise.all([PageParams, SetDict, SetLoginInfo])
