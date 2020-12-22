/**
 * function: 保存router实例，可以进行
 * author  : wq
 * update  : 2018/9/5 19:05
 */

const globalRouter = (function () {
  let router = ''
  return {
    saveRouter(r) {
      router = r
    },
    getRouter(r) {
      return router
    }
  }
}())

export const globalUrl = (function () {
  let router = ''
  return {
    saveRouter(r) {
      router = r
    },
    getRouter(r) {
      return router || weex.config.bundleUrl
    }
  }
}())

export default globalRouter
