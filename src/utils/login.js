import LocalStorageManage from './storage'

const loginDataApi = (() => {
  let login_data = null
  return {
    initLoginData() {
      return LocalStorageManage.getLocalStorage('loginInfo').then((data) => {
        if (data === null || data.length === 0) {
          return (login_data = null)
        }
        login_data = JSON.parse(data || '{}')
      })
    },
    getLastLoginUserInfo: (func) => {
      return LocalStorageManage.getLocalStorage('lastLoginUserInfo').then(func)
    },
    setLastLoginUserInfo: (data) => {
      // 最后登录的用户信息
      return LocalStorageManage.saveLocalStorage('lastLoginUserInfo', JSON.stringify(data))
    },
    getLoginData: () => {
      return login_data
    },
    setLoginData: (data) => {
      login_data = data
      return LocalStorageManage.saveLocalStorage('loginInfo', JSON.stringify(login_data))
    },
    clearLoginData: () => {
      login_data = null
      return LocalStorageManage.clearLocalStorage('loginInfo')
    }
  }
})()

export default loginDataApi
