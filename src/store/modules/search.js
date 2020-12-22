/**
 * function: 处理相关的搜索条件，存放搜索条件
 * author  : wq
 * update  : 2018/12/10 9:22
 */

export default {
  state: {
    searchParams: {}
  },
  mutations: {
    setSearchParams(state, data) {
      state.searchParams = data
    },
    setSearchParamsInner(state, data) {
      state.searchParams = Object.assign({}, state.searchParams, data)
    },
    clearSearchParams(state, data) {
      state.searchParams = {}
    }
  }
}
