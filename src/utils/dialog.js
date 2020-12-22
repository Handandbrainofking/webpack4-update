const modal = weex.requireModule('modal')
const msgList = []
const dialog = {
  /**
   * msg      : 消息内容
   * time     : 显示时间
   * position : 显示位置 (String) (top | middle | bottom, default: middle)
   */
  toast(msg, time) {
    //处理换行
    msg = msg && msg.replace(/<\/?br\/?>/ig, '\n')
    let timer = null
    if (msgList.indexOf(msg) > -1) {
      return {
        then() {}
      }
    }
    msgList.push(msg)
    return new Promise(function (resolve, reject) {
      try {
        const tmpTime = time || 3
        modal.toast({
          message: msg || '错误',
          duration: tmpTime
        })
        timer = setTimeout(() => {
          msgList.splice(0, 1)
          resolve()
        }, tmpTime * 1000)
      } catch (e) {
        reject('toast error')
      }
    }).catch((msg) => {
      timer && clearTimeout(timer)
      throw new Error(msg)
    })
  },

  /**
   * option:
   * title    : 消息标题 (String) (default: "提示")
   * message  : 显示内容 (String) (default: "")
   * okButton : 按钮内容 (String) (default: "确定")
   * callback   : 点击确认，回掉函数
   */
  alert: (option, callback) => {
    const defaultOption = {
      message: '',
      okTitle: '确定'
    }
    try {
      modal.alert(Object.assign({}, defaultOption, option), (value) => {
        typeof callback === 'function' && callback(value)
      })
    } catch (e) {

    }
  },

  /**
   * option:
   * title    : 消息标题 (String) (default: "提示")
   * message  : 显示内容 (String) (default: "")
   * okButton : 按钮内容 (String) (default: "确定")
   * callback   : 点击确认，回掉函数
   * errback    : 点击取消，回掉函数
   */
  confirm: (option, callback) => {
    const defaultOption = {
      message: '',
      okTitle: '确定',
      cancelTitle: '取消'
    }
    try {
      modal.confirm(Object.assign({}, defaultOption, option), (value) => {
        typeof callback === 'function' && callback(value)
      })
    } catch (e) {

    }
  },

  /**
   * option:
   * title    : 消息标题 (String) (default: "提示")
   * message  : 显示内容 (String) (default: "")
   * text     : 提示内容 (String) (default: "")
   * okButton : 按钮内容 (String) (default: "确定")
   * cancelButton : 按钮内容 (String) (default: "取消")
   * callback   : 点击确认，回掉函数
   * errback    : 点击取消，回掉函数
   */
  prompt: (option, callback, errback) => {
    const defaultOption = {
      title: '提示',
      message: '',
      text: '',
      okTitle: '确定',
      cancelTitle: '取消'
    }
    try {
      modal.prompt(Object.assign({}, defaultOption, option), (err, ret) => {
        if (ret && ret.result === 'OK') {
          typeof callback === 'function' && callback(ret.data)
        } else {
          typeof errback === 'function' && errback()
        }
      })
    } catch (e) {
    }
  }

}

export default dialog
