import Dialog from '@/utils/dialog'
import { IndexJs, Login } from '@/router/defined'
import loginApi from './login'
import globalRouter from '@/utils/save-router'

/**
 * 处理与native的相关交互
 */
const EventModule = weex.requireModule('eventModule')
const EventCommon = weex.requireModule('eventCommon')

// 组织切换
export const native_companyChange = (companyCode, companyName) => {
  try {
    EventModule.companyChange(companyCode, companyName)
  } catch (e) {

  }
}

// 上传log日志
export const native_uploadLog = (func) => {
  try {
    EventModule.uploadLogFile(func)
  } catch (e) {

  }
}

// 获取系统信息
export const native_getSystemInfo = (func) => {
  try {
    EventModule.getSystemInfo(func)
  } catch (e) {
    typeof func === 'function' && func({})
  }
}

export const native_login = (userLoginInfo) => {
  try {
    EventModule.login(userLoginInfo)
  } catch (e) {

  }
}

export const native_getCurrentUserInfo = (func) => {
  try {
    EventModule.getCurrentUserInfo(func)
  } catch (e) {
    const data = {}
    data.status = false
    typeof func === 'function' && func(data)
  }
}

export const native_logout = (func) => {
  try {
    EventModule.logout(func)
  } catch (e) {
    typeof func === 'function' && func()
  }
}
//日志输出，默认是info类型。有error/info 2种类型
export const native_logMessage = (...list) => {
  try {
  	var level;
  	if(list && list.length > 2){
  		level = list[list.length -1] === 'error' ? 'error' : 'info';
  	}
  	//js 日志输出
    EventCommon.jsLogOut(list.join(' === '),level)
  } catch (e) {
    console.log(list.join(' === '))
  }
}

export const native_clearMemory = () => {
  try {
    EventCommon.clearMemory()
  } catch (e) {
    console.log()
  }
}

export const native_updateCacheData = () => {
  try {
    EventModule.updateCacheData()
  } catch (e) {

  }
}

export const native_jumpPage = (param, err) => {
  try {
    EventCommon.jumpPage(param)
  } catch (e) {
    typeof err === 'function' && err()
  }
}

// 百度自定义事件统计
// eventId事件ID（例如：‘personToDo’)
// eventDesc事件详情（例如：‘个人待办（tab-page.vue）’)
export const native_eventStatistic = (eventId, eventDesc) => {
  try {
    EventModule.eventStatisticBaidu(eventId, eventDesc)
  } catch (e) {

  }
}

// 图片上传  参数applyNo, fileType,customerNo, list,lastSortNo, 回掉
export const DEFINE_UPLOAD_IMAGE = 'uploadImage'
// 图片上传（上传到BPMS）  参数applyNo, fileType, fileKey,customerNo, 回掉
export const DEFINE_UPLOAD_IMAGE_BPMS = 'uploadImageToBPMS'
// 图片url获取  参数 list, type[0: 大图， 1、小图], 回掉
export const DEFINE_IMAGE_URL = 'getImageUrl'
// 获取上传中的图片  参数applyNo, fileType, 回掉
export const DEFINE_UNLOAD_IMAGE = 'getUploadingImage'
// 图片删除  参数applyNo, fileType, fileId, 回掉
export const DEFINE_DELETE_IMAGE = 'imageDelete'
// 图片选取 参数{},回调
export const DEFINE_CHOOSE_IMAGE = 'chooseImage'
// 图片预览 参数{}
export const DEFINE_PREVIEW_IMAGE = 'previewImage'
// 身份证识别  参数list, 回掉
export const DEFINE_UPLOAD_IDCARD = 'getIdCardForImage'
// 银行卡识别  参数list, 回掉
export const DEFINE_UPLOAD_BANKCARD = 'getBankCardForImage'
// 上传log日志
export const DEFINE_UPLOAD_LOG = 'uploadLogFile'
// 用户登录 参数 name,phone,token
export const DEFINE_LOGIN = 'login'
// 用户退出 参数 回掉
export const DEFINE_LOGOUT = 'logout'
// 获取省市区 (String provinceCode,String cityCode,function)
export const DEFINE_PROVINCE_CITY = 'getProvinceCity'
// 图片拷贝(typeNo,custNo,originFileIds) //custNo非必填
export const DEFINE_IMAGE_COPY = 'imageCopy'
// 图片重传(locationUrl,fileId)
export const AGAIN_UPLOAD_IMAGE = 'againUploadImage'
// 删除本地数据库图片
export const DELETE_DB_IAMGE = "deleteImageFormDb"
// 组织切换
export const COMPANY_CHANGE = 'companyChange'
// 页面渲染性能分析
export const RENDER_STAT = 'eventStatisticRender'
// HTTP性能分析
export const HTTP_STAT = 'eventStatisticHttp'

/**
 * @param eventName
 * @param args
 * @returns {Promise<any>}
 * 处理所有带有回掉的原生方法，所有的原生方法需要进行统一，返回形式和后台接口形式一样，
 * 返回形式采用Promise的方式，便于修改
 */
export var logoutDialogStatus = null;
export const native_module_events = function (eventName, ...args) {
  const func = args[args.length - 1];
  typeof func === 'function' && (args.splice(args.length - 1))
  return new Promise(function (resolve, reject) {
    try {
      native_logMessage('处理原生方法', eventName, ...args)
      EventModule[eventName](...args, function (data) {
        const rdata = (typeof data === 'string' && JSON.parse(data)) || data
        native_logMessage('原生方法返回数据', JSON.stringify(rdata))
        if (rdata.success) {
          const mdata = (typeof rdata.result === 'string' && JSON.parse(rdata.result)) || rdata.result
          try {
            typeof func === 'function' && func(mdata)
            resolve(mdata)
          } catch (e) {
            reject('-005, native, 解析失败')
            native_logMessage('js 解析失败===' + JSON.stringify(e))
          }
        } else if (!rdata.success && (rdata.code === '401' || rdata.code === '403')) { // token不合法
          if (logoutDialogStatus) {
            native_logMessage('已经弹出了退出登录框，不需要在弹出。。')
            logoutDialogStatus = null
            return false
          }
          logoutDialogStatus = {}
          Dialog.confirm({
            message: '检测到有异常操作,麻烦您重新登录！'
          }, (value) => {
            if (value === '确定') {
              const clearLocalData = function () {
                loginApi.clearLoginData()
                Vue.prototype.$eventHub.jump(IndexJs, true, true)
              }
              clearLocalData()
            }
            logoutDialogStatus = null
          })
        } else {
          reject(rdata.msg || ('-002, native, ' + eventName + '返回错误'))
        }
      })
    } catch (e) {
      reject('处理原生方法' + eventName + '出错')
      native_logMessage(' 处理原生方法===' + JSON.stringify(e))
    }
  }).catch(function (reason) {
    // Dialog.toast(reason || "error");
    native_logMessage(' 处理原生方法===' + JSON.stringify(reason))
    throw new Error(reason || 'error')
  })
}

// 获取字典，参数 type, value【value 没有为null】 回掉
export const DEFINE_DISC = 'getDic'
// 获取字典，参数 types 数组  回掉
export const DEFINE_DISC_LIST = 'getDicArr'
// 输出日志，参数 types 数组  回掉
export const DEFINE_LOG_MESSAGE = 'testModel'
// 百度自定义事件统计，参数 eventId事件ID（例如：‘personToDo’) eventDesc事件详情（例如：‘个人待办（tab-page.vue）’)
export const DEFINE_STATISTIC_EVENT = 'eventStatisticBaidu'
// 页面跳转，参数url
export const DEFINE_JUMP_PAGE = 'jumpPage'
// 清理缓存，参数 无
export const DEFINE_CLEAR_MEMORY = 'clearMemory'
// 打开加载框，参数 bool false: 表示不能进行其他操作
export const DEFINE_OPEN_LOAD = 'showDialog'
// 关闭加载框，参数 无
export const DEFINE_CLOSE_LOAD = 'dismissDialog'
// 重新获取token
export const DEFINE_AGAIN_GET_TOKEN = 'againGetToken'
// 获取地理位置（经纬度）callback
export const DEFINE_GET_LOCATION = 'getLocation'
// 设备震动效果
export const DEFINE_DEVICES_VIBRATOR = 'devicesVibrator'
// 网络请求
export const DEFINE_NETWORK_REQUEST = 'networkRequest'
// 拷贝内容 参数：标签 内容 回调
export const DEFINE_COPY_CONTENT = 'copyContent'
// 隐藏键盘
export const DEFINE_HIDDEN_KEYBORAD = 'hiddenKeyborad'

export const native_common_events = function (eventName, ...args) {
  const func = args[args.length - 1]
  typeof func === 'function' && (args.splice(args.length - 1))
  return new Promise(function (resolve, reject) {
    try {
      native_logMessage('处理原生方法', eventName, ...args)
      EventCommon[eventName](...args, function (data) {
        const rdata = data || {}
        native_logMessage('原生方法返回数据', JSON.stringify(rdata))
        if (rdata.success) {
          const mdata = rdata.result
          try {
            typeof func === 'function' && func(mdata)
            resolve(mdata)
          } catch (e) {
            reject('-005, native, 解析失败')
            native_logMessage(' 处理原生方法===' + JSON.stringify(e))
          }
        } else {
          reject(rdata.msg || '-002, native, ' + eventName + '返回错误')
        }
      })
    } catch (e) {
      reject('处理原生方法' + eventName + '出错')
      native_logMessage('处理原生方法失败', eventName, JSON.stringify(e))
    }
  }).catch(function (reason) {
    native_logMessage('处理原生方法 error ===' + JSON.stringify(reason))
    throw new Error(reason || 'error')
  })
}
