/**
 * function: 存储数据到本地
 * author  : wq
 * update  : 2018/5/21 17:11
 */
import Dialog from './dialog'

const storage = weex.requireModule('storage')
const localStorageManage = {
  // 获取本地数据
  getLocalStorage(id, func) {
    return new Promise(function (resolve) {
      try {
        storage.getItem(id, res => {
          if (res.result === 'success') {
            typeof func === 'function' && func(res.data)
            resolve(res.data)
          } else {
            typeof func === 'function' && func('')
            resolve('')
          }
        })
      } catch (e) {
        Dialog.toast('get storage data error')
      }
    })
  },

  // 保存本地数据
  saveLocalStorage(id, data, func) {
    return new Promise(function (resolve, reject) {
      try {
        storage.setItem(id, data, res => {
          if (res.result === 'success') {
            typeof func === 'function' && func(res.data)
            resolve(res.data)
          } else {
            reject('save data error')
          }
        })
      } catch (e) {
        Dialog.toast('save storage data error')
      }
    }).catch(function (reason) {
      Dialog.toast(reason || 'error')
    })
  },

  // 清除本地数据
  clearLocalStorage(id, func) {
    return new Promise(function (resolve) {
      try {
        storage.removeItem(id, res => {
          if (res.result === 'success') {
            typeof func === 'function' && func(true)
            resolve(true)
          } else {
            typeof func === 'function' && func(false)
            resolve(false)
          }
        })
      } catch (e) {
        Dialog.toast('clear storage data error')
      }
    })
  }
}
export default localStorageManage
