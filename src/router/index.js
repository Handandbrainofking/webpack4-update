import Router from 'vue-router'
import { native_logMessage } from '@/utils/deal_native'
import globalRouter from '@/utils/save-router'
import loginApi from '@/utils/login'
import { Login, Forget, Home } from './defined'
import RouterList from './menu'

Vue.use(Router)
const router = new Router({
  mode: 'abstract',
  routes: RouterList
})

router.beforeEach((to, from, next) => {
  native_logMessage('跳转地址', to.path)
  const loginData = loginApi.getLoginData()
  if (to.path === Login || to.path === Forget) {
    if (loginData && loginData.companyCode) {
      next(Home)
      return true
    }
  }
  if (to.meta.requireAuth) {
    if (!loginData || !loginData.companyCode) {
      next(Login)
      return true
    }
  }
  next()
})

globalRouter.saveRouter(router)
export default router
