import Store from '../common'
import {InterviewListKind, TimeList, ProductKindList} from '@/config'
import {http} from '../common/utils'
import {formatDate} from '@/store/common/utils'

export default Store.extend({
  state: {
    listMethod: 'post',
    pagingMode: 'single',
    pageSize: 14,
    showAssignPopup: false,
    showAssignForm: false,
    showAssignList: false,
    //  listUrl: '/bpmsx/order/matter/v1/getWaitingTaskList',
    listUrl: '/bpmsx/order/matter/v1/getGroupMemberWaitingTaskList',
    orderInfoUrl: '/bpmsx/matter/pad/getOrderInfo',
    dict: {
      InterviewListKind: InterviewListKind
    },
    dictMappers: {
      nodeId: {dict: 'InterviewListKind', map: (i, kind) => i.nodeName = kind.name},
      appointTime: {dict: 'date',
        map: (item) => {
          if (typeof item.appointTime === 'number') {
            item.appointTimeF = item.appointTime ? formatDate(item.appointTime, 'YYYY-MM-DD hh:mm') : ''
          } else {
            item.appointTimeF = item.appointTime
          }
        }
      }
    }
  },
  mutations: {
    showAssignPopup(state, val) {
      state.showAssignPopup = val
      state.showAssignForm = val
      state.showAssignList = false
    },
    showAssignList(state, val) {
      state.showAssignPopup = val
      state.showAssignForm = !val
      state.showAssignList = val
    }
  },
  created() {
    this.refreshAssignList()
  },
  actions: {
    /**
     * 根据条件加载指定页的数据
     * @param {*} params 查询参数，包含 pageNumber 和过滤条件
     */
    refreshAssignList({dispatch, commit, rootGetters}, params = {}) {
      commit('pageNumber', params.pageNumber || 1)
      let {matterKey, userIds, queryKeyword, appointSearchTime, listOrder} = params
      var orderBy = listOrder.orderBy
      var orderType = listOrder.orderType
      appointSearchTime = appointSearchTime || ''
      return dispatch('loadPage', {companyCode: rootGetters.companyCode, type: 0, matterKey, userIds, queryKeyword, appointSearchTime, orderType, orderBy})
    },
    loadNextAssignListPage({state, commit, dispatch, rootState, rootGetters}, params = {}) {
      commit('pageNumber', params.pageNumber || 1)
      let {matterKey, userIds, queryKeyword, appointSearchTime, listOrder} = params
      var orderBy = listOrder.orderBy
      var orderType = listOrder.orderType
      appointSearchTime = appointSearchTime || ''
      return dispatch('loadPage', {companyCode: rootGetters.companyCode, type: 0, matterKey, userIds, queryKeyword, appointSearchTime, orderType, orderBy})
    },
    assignOrder({state, rootState}, data) {
      let params = {
        applyNo: data.applyNo,
        matterKey: data.matterKey,
        matterName: data.matterName,
        appointTime: data.appointTime,
        appointAddress: data.appointAddress,
        appointAreaName: data.appointAreaName,
        appointUserId: data.appointUserId,
        appointUserName: data.appointUserName,
        remark: data.remark || ''
      }
      return http.post('/bpmsx/order/handle/v1/assignOrder', params)
    },
    clear({commit}) {
      commit('clearListData')
      commit('clearFormData')
    }
  }
})
