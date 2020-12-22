/**
 * function: 设置登录信息
 * author  : wq
 * update  : 2018/12/29 10:08
 */
import LoginDataApi from '@/utils/login'
import { native_logMessage } from '@/utils/deal_native'

// 获取登录信息
export default new Promise((resolve, reject) => {
  LoginDataApi.initLoginData().then(() => {
    native_logMessage('请求到登录信息')
    resolve()
  }).catch(() => {
    reject()
  })
})
