import { http, formatDate } from '../common/utils'

export default {
  state: {
    platRecePathList: [
      {
        key: 'companyReturn',
        name: '公司协助归还'
      },
      {
        key: 'custReturn',
        name: '客户直接归还'
      }
    ],
    fromtipType: [
      {
        key: 'suanTouSuanWei',
        name: '算头算尾'
      },
      {
        key: 'suanTouBuSuanWei',
        name: '算头不算尾'
      }
    ],
    FundBackType: [
      {
        key: 'WX',
        name: '微信'
      },
      {
        key: 'COUNTER',
        name: '柜台'
      },
      {
        key: 'CASH',
        name: '现金'
      }
    ],
    platArrivalList: [
      {
        key: 'Y',
        name: '是'
      },
      {
        key: 'N',
        name: '否'
      }
    ],
    operBtns: [
      {
        title: '删除',
        style: {
          backgroundColor: '#EE5253 '
        }
      }
    ],
    dialogHead: [
      {
        name: '账号',
        key: 'accountNo'
      },
      {
        name: '户名',
        key: 'accountName'
      },
      {
        name: '开户行',
        key: 'openBankName'
      }
    ]
  },
  mutations: {},
  actions: {
    getFundDefault({ dispatch }, applyNo) {
      return http.get(`/bpmsx/fundModule/v1/getBackToAccountDefaultValue`, { applyNo })
    },
    compareFundDefaultValue(store, applyNo) {
      let promiseApply = store.dispatch('getOrderInfo', applyNo)
      let promiseDefault = store.dispatch('getFundDefault', applyNo)
      Promise.all([promiseApply, promiseDefault]).then(([dataApply, dataDefault]) => {

      })
    },
    getOrderInfo({ dispatch, rootState, rootGetters }, applyNo) {
      let params = { applyNo, relationKey: 'feeSummary,fundModule' }
      return http.post('/bpmsx/order/info/v1/getOrderModuleInfo', params)
    },
    getFactPaySource({ dispatch }, applyNo) {
      let params = { applyNo, type: 'expireAdvance' }
      return http.post('/bpmsx/fundModule/v1/fdAdvance/query', params)
    },
    getCompanyList({ dispatch }, { applyNo, partnerCode }) {
      let params = { applyNo, partnerCode, businessType: 'custToCompany', payType: 'enter' }
      return http.post(`/bpmsx/fundModule/v1/companyAccount/list`, params)
    },
    getFundbackData({ dispatch }, applyNo) {
      return http.post(`/bpmsx/fundModule/v1/backToAccount/list`, { applyNo })
    }
    ,
    clear({ commit }) {

    }
  },
  namespaced: true
}