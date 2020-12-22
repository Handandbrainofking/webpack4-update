import { native_logMessage } from '@/utils/deal_native'
import LocalStorageManage from '@/utils/storage'

/**
 * function: pageParams
 * author  : wq
 * update  : 2019/3/5 15:07
 */
const splitWord = '||'
const params_data = 'PARAMS_LIST'
export const pageParams = (function () {
  let _params = null
  return {
    getPageParams: function () {
      return new Promise(function (resolve, reject) {
        if (_params) {
          resolve(_params)
          return _params
        }
        const params = {}
        let url = weex.config.bundleUrl.replace(/#[^?$]*/, '')
        native_logMessage('getPageParams url=' + url)
        let index = url.indexOf('?')
        if (index > 0) {
          let query = url.substring(index + 1)
          let temp = query.split('&')
          let key, value
          for (var p in temp) {
            if (temp[p]) {
              key = temp[p].split('=')[0]
              value = decodeURIComponent(temp[p].split('=')[1])
              if (value && (value[0] === '{' || value[0] === '[')) {
                value = JSON.parse(value)
              }
              params[key] = value
            }
          }
        }
        LocalStorageManage.getLocalStorage(params_data).then((_data) => {
          const paramsList = _data.split(splitWord)
          let _saveParams = JSON.parse(paramsList.pop() || '{}')
          Object.keys(_saveParams).forEach(item => {
            if (item[0] === '_') {
              _saveParams[item] = undefined
              delete _saveParams[item]
              return false
            }
            if (typeof _saveParams[item] !== 'string') {
              return true
            }
            _saveParams[item] = decodeURIComponent(_saveParams[item])
            if (_saveParams[item] && (_saveParams[item][0] === '{' || _saveParams[item][0] === '[')) {
              _saveParams[item] = JSON.parse(_saveParams[item])
            }
          })
          const paramsStr = paramsList.join(splitWord)
          if (paramsStr) {
            LocalStorageManage.saveLocalStorage(params_data, paramsList.join(splitWord))
              .then((data) => {
                resolve(_params = Object.assign({}, params, _saveParams))
                return data
              })
          } else {
            resolve(_params = Object.assign({}, params, _saveParams))
          }
        })
      })
    },
    clearPageParams: function (force = false) {
      _params = null
      if (force) {
        LocalStorageManage.clearLocalStorage(params_data)
      }
    },
    getSyncPageParams() {
      return _params || {}
    },
    getSyncParamItem(id) {
      return (_params || {})[id] || ''
    },
    // 方便测试的时候设置值
    setSyncParamItem(params) {
      _params = params
    }
  }
}())

export default {
  methods: {
    setPageParams(params) {
      pageParams.setSyncParamItem(params)
    },

    clearPageParams(force) {
      return pageParams.clearPageParams(force)
    },

    getAllPageParams() {
      return pageParams.getSyncPageParams()
    },

    // force 表示获取或多页面js跳转的方式
    getPageParams: (function () {
      return function (id, force) {
        if (this.$router && !force) {
          return this.$route.params[id]
        } else {
          return pageParams.getSyncParamItem(id)
        }
      }
    }())
  }
}
