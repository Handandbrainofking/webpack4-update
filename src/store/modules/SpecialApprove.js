/**
 * 我的持批待办列表&明细
 * by liangcalun
 */
import Store from '../common'
import { http } from '../common/utils'

export default Store.extend({
  namespaced: true,
  state: {
    listMethod: 'post',
    pagingMode: 'single',
    pageSize: 11,
    listUrl: '/bpmsx/bpm/flow/riskspecial/v1/getRiskSpecialFlowList',
    createUrl: '/bpmsx/bpm/flow/v1/start',
    userTotal: 0
  },
  mutations: {
    setUserTotal(state, total) {
      state.userTotal = total
    }
  },
  actions: {
    refreshList({ dispatch, commit, rootGetters }, params = {}) {
      commit('pageNumber', params.pageNumber || 1)
      const { queryKeyword, applyStatus, approveStatus, orderBy, orderType, createUserId } = params
      return dispatch('loadPage', {
        companyCode: rootGetters.companyCode,
        queryKeyword,
        applyStatus,
        approveStatus,
        orderType,
        orderBy,
        createUserId
      })
    },
    saveCreate(store, data) {
      data.companyCode = store.rootGetters.companyCode
      return http.post(store.state.createUrl, data)
    },
    clear({ commit }) {
      commit('clearListData')
      commit('clearFormData')
    }
  }
})
