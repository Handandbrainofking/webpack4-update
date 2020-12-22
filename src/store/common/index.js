import {ensure, assert, http} from './utils'
import {getDefaultStates} from './state'
import actions from './actions'
import mutations from './mutations'

function extend(store) {
  // 确认各栏位不能为空。
  store = store || {state: {}, actions: {}, mutations: {}}
  // 非空判断
  store.state = ensure(store.state, {})
  store.mutations = ensure(store.mutations, {})
  store.actions = ensure(store.actions, {})
  store.getters = ensure(store.getters, {})

  // 默认值设置
  store.state = {...getDefaultStates(), ...store.state}
  store.mutations = {...mutations, ...store.mutations}
  store.actions = {...actions, ...store.actions}

  // 列表显示插件
  if (store.listPlugin && store.listPlugin.length) {
    store.state.listPlugin = store.state.listPlugin.concat(store.listPlugin)
  }

  store.namespaced = true

  return store
}

export default {extend: extend}
