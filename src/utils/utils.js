/**
 * 常用工具集合
 */

// 判断两个对象是否相等
export const isEqual = (a, b) => {
  if (a === b) {
    return true
  }
  const classA = Object.prototype.toString.call(a)
  const classB = Object.prototype.toString.call(b)
  if (classA !== classB) {
    return false
  }
  if (Array.isArray(a)) {
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) {
        return false
      }
    }
  } else {
    const propsA = Object.getOwnPropertyNames(a)
    const propsB = Object.getOwnPropertyNames(b)
    if (propsA.length !== propsB.length) {
      return false
    }
    for (let i = 0; i < propsA.length; i++) {
      if (!isEqual(a[i], b[i])) {
        return false
      }
    }
  }
  return true
}
/**
 * 处理表单的默认值, 传递的值为对象或者数据，数组则批量处理，对象则处理这一个
 * width: 表示控制label标签的宽度，有的话批量加入
 */

export const FormDefaultValue = (list, width) => {
  if (Array.isArray(list)) {
    const len = list.length
    const _list = []
    let i = 0
    for (; i < len; i++) {
      list[i].sortIndex = i
      _list.push(FormDefaultValue(list[i], width))
    }
    return _list
  } else if (typeof list === 'object') {
    const obj = {
      text: ''
    }
    if (list.viewType === 'pick' || list.viewType === 'select') {
      obj.index = -1
      obj.list = []
    }
    if (!list.disabled) {
      if (list.viewType === 'input') {
        obj.placeHolder = '请输入' + (list.label || '').replace(/\([\S\s]+\)$/, '').replace(/（[\S\s]+）$/, '')
      } else {
        obj.placeHolder = '请选择' + (list.label || '').replace(/\([\S\s]+\)$/, '').replace(/（[\S\s]+）$/, '')
      }
    }

    if (Array.isArray(list.name)) {
      obj.values = []
    }
    if (width) {
      obj.labelWidth = width
    }
    return Object.assign({}, obj, list)
  } else {
    throw new Error('param must array or object')
  }
}

export const isWeb = (() => {
  const { platform } = weex.config.env
  return typeof (window) === 'object' && platform.toLowerCase() === 'web'
})()

export const isIOS = (() => {
  const platform = weex.config.env.platform
  return platform.toLowerCase() === 'ios'
})()

// 不是真实的app环境
export const isNotProductEnv = (() => {
  const EventCommon = weex.requireModule('eventCommon')
  return !(EventCommon && typeof EventCommon.jsLogOut === 'function')
})()

export const isIPhoneX = (() => {
  const deviceHeight = weex.config.env.deviceHeight
  if (isWeb) {
    return typeof window !== 'undefined' && window.screen && window.screen.width && window.screen.height && (parseInt(window.screen.width, 10) === 375) && (parseInt(window.screen.height, 10) === 812)
  }
  return isIOS && deviceHeight === 2436
})()

export const screenHeight = (() => {
  const { env } = weex.config
  return env.deviceHeight / env.deviceWidth * 750
})()

export const pageTransitionAnimationStyle = (animationType) => {
  const deviceHeight = weex.config.env.deviceHeight
  const deviceWidth = weex.config.env.deviceWidth
  if (animationType === 'push') {
    return {
      left: '750px',
      top: '0px',
      height: (deviceHeight / deviceWidth * 750) + 'px'
    }
  } else if (animationType === 'model') {
    return {
      top: (deviceHeight / deviceWidth * 750) + 'px',
      left: '0px',
      height: (deviceHeight / deviceWidth * 750) + 'px'
    }
  }
  return {}
}

export const pageTransitionAnimation = (ref, transform, status, callback) => {
  const animation = weex.requireModule('animation')
  animation.transition(ref, {
    styles: {
      transform: transform
    },
    duration: status ? 250 : 300, // ms
    timingFunction: status ? 'ease-in' : 'ease-out',
    delay: 0 // ms
  }, function () {
    callback && callback()
  })
}

export function debounce(fn, delay) {
  // 定时器，用来 setTimeout
  let timer

  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function () {
    // 保存函数调用时的上下文和参数，传递给 fn
    const context = this
    const args = arguments

    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer)

    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

export function throttle(fun, delay, time, last = false) {
  let timeout
  let startTime = new Date()

  return function () {
    const context = this
    const args = arguments
    let curTime = new Date()
    clearTimeout(timeout)
    // 如果达到了规定的触发时间间隔，触发 handler
    if (curTime - startTime >= time) {
      fun.apply(context, args)
      startTime = curTime
      // 没达到触发间隔，重新设定定时器
    } else {
      if (last) {
        timeout = setTimeout(fun.bind(context), delay)
      }
    }
  }
}
