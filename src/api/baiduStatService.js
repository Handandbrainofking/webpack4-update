// const native = weex.requireModule('WXEventModule')
import {
  native_module_events,
  HTTP_STAT,
  RENDER_STAT
} from '@/utils/deal_native'

export function pushRenderEvent(key, name, mount = 0, http = 0, sum = 0) {
  if (!key || !name) return
  if (WXEnvironment.platform === 'Web') {
    console.log(`baidu stat render event key:${key} name:${name} mount:${mount} http:${http} sum:${sum}`)
  } else {
    native_module_events(RENDER_STAT, key, name, mount, http, sum)
  }
}

export function pushHttpEvent(key, name, count = 1, duration = 0) {
  if (!key || !name) return
  if (WXEnvironment.platform === 'Web') {
    console.log(`baidu stat http event key:${key} name:${name} count:${count} duration:${duration}`)
  } else {
    native_module_events(HTTP_STAT, key, name, count, duration)
  }
}
