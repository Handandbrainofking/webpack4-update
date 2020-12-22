/**
 * function: route
 * author  : wq
 * update  : 2019/3/5 15:11
 */
import { native_jumpPage } from '@/utils/deal_native'
import Dialog from '@/utils/dialog'
import { globalUrl } from '@/utils/save-router'
import LocalStorageManage from '@/utils/storage'
import { pageParams } from './pageParams'

const navigator = weex.requireModule('navigator')
const navigatorEx = weex.requireModule('NavigatorExModule')
const router_data = 'ROUTER_LIST'
const params_data = 'PARAMS_LIST'
const splitWord = '||'

function getContextPath() {
  const bundleUrl = weex.config.bundleUrl
  const url = bundleUrl.split('/').slice(0, -1).join('/')
  // if (!/.js(\?[^?]+)?$/.test(bundleUrl)) {
  //   url = url.replace(/\/web(\/)?/, '') + "/dist";
  // }
  return url
}

const routeManage = {
  // 历史出栈
  popRouterList: function (func) {
    return new Promise(function (resolve, reject) {
      LocalStorageManage.getLocalStorage(router_data).then((_data) => {
        const routerList = _data.split(splitWord)
        const list = decodeURIComponent(routerList.pop())
        LocalStorageManage.saveLocalStorage(router_data, routerList.join(splitWord)).then(() => {
          typeof func === 'function' && func()
          resolve(list)
        })
      })
    })
  },

  // 历史进栈
  saveRouterList: function (params, sucBack) {
    return new Promise(function (resolve, reject) {
      let save_router_data = false
      let save_params_data = false
      const doResolve = () => {
        if (save_router_data && save_params_data) {
          typeof sucBack === 'function' && sucBack()
          resolve()
        }
      }
      LocalStorageManage.getLocalStorage(router_data).then((_data) => {
        const routerList = _data.split(splitWord)
        routerList.push(encodeURIComponent(globalUrl.getRouter()))
        LocalStorageManage.saveLocalStorage(router_data, routerList.join(splitWord)).then(() => {
          doResolve(save_router_data = true)
        })
      })

      LocalStorageManage.getLocalStorage(params_data).then(_data => {
        const paramsList = _data.split(splitWord)
        const _params = Object.assign({}, pageParams.getPageParams(), params)
        paramsList.push(JSON.stringify(_params))
        paramsList.push('')
        LocalStorageManage.saveLocalStorage(params_data, paramsList.join(splitWord)).then(() => {
          doResolve(save_params_data = true)
        })
      })
    }).catch(function (reason) {
      Dialog.toast(reason || 'error')
    })
  },
  // 清空历史
  clearRouterList: function () {
    LocalStorageManage.clearLocalStorage(params_data)
    return LocalStorageManage.clearLocalStorage(router_data)
  }
}
/**
 * 加载一个新的页面(bundleJS)
 * @method push
 * @param url {string} bundle js 地址
 * @param params {object} 传递的参数
 */

function push(url, params, saveParams) {
  let paramsStr = ''
  if (params) {
    for (let key in params) {
      paramsStr += key + '=' + encodeURIComponent(params[key]) + '&'
    }
  }
  let isWeb = false
  try {
    if ((isWeb = /Web/i.test(weex.config.env.platform))) {
      url = url.replace(/\.js/, '.html')
    }
  } catch (e) {
  }

  if (url.indexOf('?') < 0) {
    url += '?'
  }
  url += paramsStr
  const _url = getContextPath() + url
  // link平台中使用navigatorEx,debugtool中使用navigator
  routeManage.saveRouterList(saveParams)
  try {
    if (isWeb) {
      navigatorEx.push(_url)
    } else {
      native_jumpPage(_url, () => {
        navigatorEx.push(_url)
      })
    }
  } catch (ex) {
    if (isWeb) {
      navigator.push({
        url: _url,
        animated: 'true'
      }, e => {
      })
    } else {
      native_jumpPage(_url, () => {
        navigator.push({
          url: _url,
          animated: 'true'
        }, e => {
        })
      })
    }
  }
}

/**
 * 返回上个页面
 * @method pop
 */
function pop() {
  routeManage.popRouterList().then((url) => {
    pageParams.clearPageParams()
    native_jumpPage(url, () => {
      navigator.pop({
        animated: 'true'
      }, e => {
      })
    })
  })
}

export default {
  methods: {
    jump(to, replace, force, param, saveParams) {
      // 请求保存的条件
      if (this.$router && !force) {
        if (replace) {
          this.$router.replace(to)
        } else {
          this.$router.push(to)
        }
      } else {
        push(to, param, saveParams)
      }
    },
    back(force) {
      if (this.$router && !force) {
        this.$router.back()
      } else {
        pop()
      }
    },
    clearRouter() {
      routeManage.clearRouterList()
    }
  }
}
