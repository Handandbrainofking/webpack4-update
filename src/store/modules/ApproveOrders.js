/**
 * 可发起风险特批订单查询
 * by liangcalun
 */
import Store from '../common'

export default Store.extend({
  namespaced: true,
  state: {
    listMethod: 'post',
    pagingMode: 'single',
    pageSize: 12,
    listUrl: '/bpmsx/bpm/flow/riskspecial/v1/getCanRiskSpecialOrderList'
  },
  actions: {
    refreshList({dispatch, commit, rootGetters}, params = {}) {
      commit('pageNumber', params.pageNumber || 1)
      const {sellerName, applyNo, salesUserName, applyStatus, queryKeyword} = params
      return dispatch('loadPage', {
        companyCode: rootGetters.companyCode,
        applyNo,
        sellerName,
        salesUserName,
        applyStatus,
        queryKeyword})
    },
    clear({commit}) {
      commit('clearListData')
      commit('clearFormData')
    }
  }
})
