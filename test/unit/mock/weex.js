import Vue from 'vue'
window.Vue = Vue

let nativeEvents = {}

const eventModule = {
  _uploadLogFile: {
    success: true,
    result: '{code:"200"}'
  },
  _getSystemInfo: {
    success: true
  },

  companyChange(companyCode, companyName) {
    nativeEvents['companyChange'] = [companyCode, companyName]
  },
  uploadLogFile(cb) {
    nativeEvents['uploadLogFile'] = [cb]
    cb(this._uploadLogFile)
    return nativeEvents['uploadLogFile']
  },
  getSystemInfo(cb) {
    nativeEvents['getSystemInfo'] = [cb]
    cb(this._getSystemInfo)
    return nativeEvents['getSystemInfo']
  },
  eventStatisticHttp(...args) {
    nativeEvents['eventStatisticHttp'] = args
    return nativeEvents['getSystemInfo']
  },
  eventStatisticRender(...args) {
    nativeEvents['eventStatisticRender'] = args
    return nativeEvents['getSystemInfo']
  }
}

const eventCommon = {
  jsLogOut(msg) {
    console.log(msg)
  },
  clearMemory() {},
  jumpPage() {},
  dismissDialog(...args) {
    let cb = args.pop()
    console.log(...args)
    cb({ success: true, result: '' })
  },
  showDialog(...args) {
    let cb = args.pop()
    console.log(...args)
    cb({ success: true, result: '' })
  },
  getLocation(cb) {
    nativeEvents['getLocation'] = [cb]
    cb({
      success: true,
      result:{
        longitude: 100.08,
        latitude: 38.58,
        address: '广东深圳'
      },
      code: 0,
      msg: ''
    })
    return nativeEvents['getLocation']
  }
}

const modal = {
  promptResult: {
    result: 'OK'
  },
  setPromptResult(result) {
    this.promptResult = result
  },
  async toast(...args) {
    nativeEvents['toast'] = args
    return args
  },
  async alert(...args) {
    nativeEvents['alert'] = args
    args[args.length](true)
    return args
  },
  async confirm(...args) {
    nativeEvents['confirm'] = args
    args[args.length](true)
    return args
  },
  async prompt(...args) {
    nativeEvents['prompt'] = args
    args[args.length](this.promptResult)
    return args
  }
}

const storage = {
  items: {},
  result: 'success',
  getItem(id, cb) {
    cb({
      result: this.result,
      data: this.items[id]
    })
  },
  setItem(id, data, cb) {
    this.items[id] = data
    cb({
      data
    })
  },
  removeItem(id, cb) {
    if (this.items.hasOwnProperty(id)) {
      delete this.items[id]
      cb({
        result: this.result
      })
    }
  }
}

export const modules = {
  eventModule,
  eventCommon,
  modal,
  storage
}

window.WXEnvironment = {
  platform: 'Web'
}

window.weex = {
  clearEvents() {
    nativeEvents = {}
  },
  getEvents() {
    return nativeEvents
  },
  get emitted() {
    return nativeEvents
  },
  requireModule(moduleName) {
    return modules[moduleName]
  },
  native_logMessage() {},
  config: {
    bundleUrl: 'http://10.11.0.166:11001/',
    env: {
      platform: 'web'
    }
  }
}
