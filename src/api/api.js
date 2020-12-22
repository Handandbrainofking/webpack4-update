import { stream } from 'natjs/lib/network'
// import Mock from './mock';
import Dialog from '../utils/dialog'
import {
  native_logMessage,
  native_common_events,
  DEFINE_OPEN_LOAD,
  DEFINE_CLOSE_LOAD,
  DEFINE_NETWORK_REQUEST
} from '../utils/deal_native'
import AppConfig from '../config/index'
import loginApi from '../utils/login'
import { httpEvent } from '@/mixins/time_statistics' // 加载统计插件
import globalRouter from '@/utils/save-router'
import { IndexJs, Login } from '@/router/defined'
import { currentEnvironment } from '@/config/environment.js'
import mockApi from './mock'

const Nat = stream

class RequestApi {
  loadNum = 0
  loading = false
  saveUrl = {}
  logoutDialogStatus = null

  // 默认配置
  defaultSendParams = {
    method: 'POST', // (String) (GET | POST | PUT | PATCH | DELETE | HEAD, default: GET)
    headers: {
      'Content-Type': 'application/json'
    },
    // H5 一般采用new Headers 的方式
    // headers: new Headers({
    //   'Content-Type': 'application/json'
    // }),     // (Object)
    type: 'JSON', // (String) (json | jsonp | text, default: json)
    body: '' // (String)
  }

  addLoading() {
    native_logMessage('打开加载中:')
    native_common_events(DEFINE_OPEN_LOAD, false)
  }

  removeLoading() {
    native_logMessage('关闭加载中:')
    native_common_events(DEFINE_CLOSE_LOAD)
  }

  sendRequest(url, param) {
    this.dealBeforeRequest(url, param)
  }

  // 请求之前，做一些处理
  dealBeforeRequest(url, param) {
    if (this.saveUrl[url]) {
      // 1s内相同协议只请求一次，防止多次点击
      if (JSON.stringify((param || {}).data) === JSON.stringify(this.saveUrl[url].params) && (new Date().getTime() - this.saveUrl[url].time < 1000)) {
        if (process.env.NODE_ENV !== 'test') {
          return false
        }
      }
    }
    this.saveUrl[url] = {
      params: (param || {}).data,
      time: new Date()
    }
    native_logMessage('请求数据:', url, JSON.stringify(param))
    const data = param.data || {}
    const success = param.success
    const error = param.error
    const beforeSend = param.beforeSend
    param.success = undefined
    delete param.success
    param.error = undefined
    delete param.error
    param.url = undefined
    delete param.url
    param.data = undefined
    delete param.data
    beforeSend === 'function' && beforeSend()
    param.error = undefined
    delete param.error
    if (!beforeSend) {
      this.loadNum++
      if (!this.loading) {
        this.loading = true
        this.addLoading()
      }
    }

    var that = this
    const userInfo = loginApi.getLoginData()
    if (userInfo && userInfo.accessToken) {
      typeof data === 'object' && (data.companyCode = userInfo.companyCode)
      param.headers = Object.assign({}, that.defaultSendParams.headers, {accessToken: userInfo.accessToken || data.accessToken})
    }
    var sendParam = Object.assign({}, that.defaultSendParams, param, {
      body: data
    })

    that.judgeRequest(url, sendParam, success, error, !beforeSend)
  }

  // 判断请求是发送mock还是实际请求
  judgeRequest(url, param, success, error, beforeSend) {
    // if (!AppConfig.DEBUG) {
    this.requestFun(url, param, success, error, beforeSend)
    // } else { // 使用mock数据
    //   var result = Mock[url](param);
    //   if (result) {
    //     this.dealAfterResponse(result, success, error, beforeSend, url);
    //   } else {
    //     this.requestFun(url, param, success, error, beforeSend);
    //   }
    // }
  }

  // 发送请求
  requestFun(url, param, success, error, beforeSend) {
    if (param.method === 'GET' || param.method === 'get') {
      const tdata = param.body
      let paramsStr = ''
      if (tdata && typeof tdata === 'object') {
        for (let key in tdata) {
          if (tdata[key] === undefined || tdata[key] === null || tdata[key] === '') {
            continue
          }
          paramsStr += key + '=' + encodeURIComponent(tdata[key]) + '&'
        }
      } else {
        paramsStr = tdata || ''
      }
      url = url + '?' + paramsStr
      param.body = undefined
      delete param.body
    }
    let baseUrl = this.getUrl(url)
    // 加载统计事件
    httpEvent.httpStart(url, param)

    try {
      native_logMessage('网络请求地址', ' ' + baseUrl, JSON.stringify(param))
      // 当 test 时，我们直接通过 mockApi 进行响应
      const httpProxy = process.env.NODE_ENV === 'test' ? mockApi.resolve : native_common_events
      // if (process.env.NODE_ENV === 'test') {
      //   baseUrl = url
      // }
      // 部署APK时用
      httpProxy(DEFINE_NETWORK_REQUEST, baseUrl, param, (data) => {
        this.dealAfterResponse(data, success, error, beforeSend, url)
      }).catch(e => {
        // web部署时用
        Nat.fetch(baseUrl, param).then((ret) => {
          this.dealAfterResponse(ret, success, error, beforeSend, url)
        }).catch((ret) => {
          this.dealAfterResponse(null, success, error, beforeSend, url)
        })
      })
    } catch (e) {
      native_logMessage('网络请求失敗', baseUrl, JSON.stringify(e))
      // this.dealAfterResponse(null, success, error, beforeSend, url);
    }
  }

  // 对返回数据做拦截处理
  dealAfterResponse(ret, success, error, beforeSend, url) {
    const doError = function (msg, code, data) {
      if (typeof error === 'function') {
        error(msg, code, data)
      } else {
        native_logMessage('toast', msg)
        Dialog.toast(msg)
      }
    }
    ret = (typeof ret === 'string' && JSON.parse(ret)) || ret
    //  native_logMessage("响应数据:", url, JSON.stringify(ret));

    // 加载统计事件
    httpEvent.httpEnd(url, ret)

    if (ret && ret.status === 200) {
      const rdata = (typeof ret.data === 'string' && JSON.parse(ret.data || '{}')) || ret.data || {}
      if (rdata.success) {
        const data = (typeof rdata.result === 'string' && JSON.parse(rdata.result || '{}')) || rdata.result || {}
        try {
          let msg
          let code = rdata.code
          if (code !== '200') {
            msg = rdata.msg
          }
          typeof success === 'function' && success(data, msg, code)
        } catch (e) {
          console.error(e)
          native_logMessage('解析失败', 'url=' + url + '  返回数据' + JSON.stringify(ret) + '  失败原因=' + JSON.stringify(e))
          doError('-005, 解析失败')
        }
      } else if (rdata.code === '401' || rdata.code === '403') { // token不合法
        if (this.logoutDialogStatus) {
          native_logMessage('已经弹出了退出登录框，不需要在弹出。。')
          return
        }
        this.logoutDialogStatus = {}
        Dialog.confirm({
          message: '您长时间没有操作,请重新登录！'
        }, (value) => {
          if (value === '确定') {
            this.clearLocalData()
          }
          this.logoutDialogStatus = null
          this.removeLoading()
        })
      } else if (rdata.code === '404' || rdata.status === 404) {
        doError('未找到相关资源！')
      } else {
        doError(rdata.msg || '系统繁忙', rdata.code, rdata)
      }
    } else {
      doError('-001 网络连接失败')
    }
    if (beforeSend) {
      this.loadNum--
    }
    if (this.loadNum <= 0 && this.loading) {
      this.removeLoading()
      this.loading = false
    }
  }

  clearLocalData() {
    loginApi.clearLoginData()
    if (/[^(?:index)]\.(?:js|html)(\?|#|$)/.test(weex.config.bundleUrl)) {
      Vue.prototype.$eventHub.jump(IndexJs, true, true)
    } else {
      globalRouter.getRouter().replace(Login)
    }
  }

  getUrl(url) {
    let apiRoot = this.getBaseUrl() // dev 环境
    apiRoot = /^\/mobileapp\//.test(url) ? AppConfig['ServerAddressAPP_' + currentEnvironment]
      : AppConfig['ServerAddressBPMS_' + currentEnvironment]
      
    return apiRoot + url
  }

  getBaseUrl() {
    if (this.baseUrlStatic) {
      return this.baseUrlStatic
    }
    const bundleUrl = weex.config.bundleUrl
    const url = bundleUrl.split('/').slice(0, 3).join('/')
    return (this.baseUrlStatic = url)
  }
}

const requestSingle = new RequestApi()

export default requestSingle
