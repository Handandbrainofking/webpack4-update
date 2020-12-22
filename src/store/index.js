import Vuex from 'vuex'
import rob from './modules/RobDoc'
import assign from './modules/Assign'
import transfer from './modules/Transfer'
import calendar from './modules/Calendar'
import SpecialApprove from './modules/SpecialApprove'
import approveOrders from './modules/ApproveOrders'
import order from './modules/Order'
import taskfund from './modules/TaskFund'
import search from './modules/search'
import {
  http,
  formatDate
} from './common/utils'
import login from '@/utils/login'
import {
  InterviewListKind,
  TimeList,
  ProductKindList,
  DetailList,
  Dist_List_Get,
  ConfirmType,
  HouseKeptType,
  LendMotiveType,
  SellHouseType,
  ApprovalStatus
} from '@/config'

Vue.use(Vuex)

const storeModules = {
  rob,
  assign,
  transfer,
  calendar,
  order,
  taskfund,
  search,
  SpecialApprove,
  approveOrders
}
const store = {
  modules: {},
  state: {
    loginData: {},
    dict: {
      ...Dist_List_Get(),
      InterviewListKind,
      TimeList,
      ProductKindList,
      DetailList,
      ConfirmType,
      HouseKeptType,
      LendMotiveType,
      SellHouseType,
      ApprovalStatus,
      date: []
    },
    padProducts: [],
    companyUsers: []
  },
  getters: {
    isYYZG(state) { // 是否为运营主管
      let managerRoles = ['YYZG']
      let loginData = state.loginData && state.loginData.companyCode ? state.loginData : login.getLoginData() // WEB的情况下，页面刷新state.loginData会为空数据 .
      for (let role of loginData.roleList) {
        if (managerRoles.indexOf(role.alias) !== -1) {
          return true
        }
      }
      return false
    },
    isZJL(state) {
      let loginData = state.loginData && state.loginData.companyCode ? state.loginData : login.getLoginData() // WEB的情况下，页面刷新state.loginData会为空数据 .
      return !!loginData.roleList.find(role => /^F?ZJL$/i.test(role.alias)) // FZJL, ZJL
    },
    isYYFZR(state) {
      let loginData = state.loginData && state.loginData.companyCode ? state.loginData : login.getLoginData() // WEB的情况下，页面刷新state.loginData会为空数据 .
      return !!loginData.roleList.find(role => /^YYFZR$/i.test(role.alias)) // YYFZR
    },
    isWQG(state) {
      let loginData = state.loginData && state.loginData.companyCode ? state.loginData : login.getLoginData() // WEB的情况下，页面刷新state.loginData会为空数据 .
      return !!loginData.roleList.find(role => /^(WQG[1,3]?|MQG.{0,})$/i.test(role.alias)) // WQG , WQG1, WQG2, WQG3, MQG
    },
    userInfo(state) {
      // WEB的情况下，页面刷新state.loginData会为空数据 .
      return state.loginData && state.loginData.companyCode ? state.loginData : login.getLoginData()
    },
    companyCode(state) {
      let loginData = state.loginData && state.loginData.companyCode ? state.loginData : login.getLoginData() // WEB的情况下，页面刷新state.loginData会为空数据 .
      return loginData.companyCode
    }
  },
  mutations: {
    setCompanyUsers(state, data) {
      state.companyUsers = data
    },
    setLoginData(state, data) {
      state.loginData = data
    },
    setPadProducts(state, data) {
      state.padProducts = data
    }
  },
  actions: {
    /**
     *获取分公司用户列表
     *   */
    loadCompanyUsers({
      state,
      commit,
      getters
    }, rolesArray) {
      return http.post('/bpmsx/sys/user/v1/getUserInfo', {
        pageNumber: 0,
        pageSize: 200,
        rolesArray: rolesArray,
        companyCode: getters.companyCode
      }).then(data => {
        if (data.list) {
          return data.list
        }
      })
    },
    /**
     * 根据事项关联的角色权限 取得用户列表 ，其中转单是可以包含运营主管的，所以这里需要特殊加一下是否包含运营主管(includeYYZG)
     */
    getMatterUsers({
      dispatch
    }, {
      matterKey,
      includeYYZG
    }) {
      let roles = []
      switch (matterKey) {
        case 'Notarization': // 办理公证
          roles = ['WQG1', 'MQG']
          break
        case 'TrustAccount': // 要件托管
        case 'ApplyLoan': // 申请贷款
        case 'PreRandom': // 预约赎楼
        case 'GetCancelMaterial': // 领取注销资料
          roles = ['WQG1']
          break
        case 'AgreeLoanMark': // 同贷信息登记
          roles = ['ZCGD', 'WQG1']
          break
        case 'AccountTest': // 账户测试
          roles = ['WQG1', 'NQG(ZJ)']
          break
        case 'QueryArchive': // 查档
          roles = ['WQG2', 'NQG(JH)']
          break
        case 'RandomMark': // 赎楼登记
          roles = ['WQG1', 'NQG(ZJ)']
          break
        case 'Interview': // 面签
          roles = ['MQG', 'mqg(zz)']
          break
        case 'CancleMortgage': // 注销抵押
        case 'TransferIn': // 过户递件
        case 'TransferOut': // 过户出件
        case 'MortgagePass': // 抵押递件
        case 'MortgageOut': // 抵押出件
          roles = ['WQG2']
          break
      }
      if (includeYYZG) {
        roles.push('YYZG')
      }
      return dispatch('loadCompanyUsers', roles.join(','))
    },
    /**
     * 获取订单操作 用户列表
     **/
    geOperateUserList(store, {
      applyNo,
      matterKey
    }) {
      return http.post('/bpmsx/order/handle/v1/geOperateUserList', {
        applyNo: applyNo,
        matterKey: matterKey
      }).then(data => {
        if (data) {
          return data
        }
      })
    },
    /**
     * 获取审批历史
     * */
    getHistoryApproval(store, applyNo) {
      return http.get('/bpmsx/order/matter/v1/checkOpinionList/get', {
        applyNo: applyNo
      })
    },
    /**
     * 获取 PAD 下面的产品列表
     */
    loadPadProducts(store) {
      if (store.state.padProducts.length > 0) {
        return Promise.resolve(store.state.padProducts)
      }

      return http.post('/bpmsx/product/v1/listPublic', {
        pageNumber: 1,
        pageSize: 999,
        ignoreKey: 'PAD_IGNORE_PRODUCT'
      }).then(data => {
        if (data.list) {
          let result = Array.prototype.map.call(data.list || [], (product, index) => {
            return {
              sort: index + 1,
              key: product.productId,
              name: product.productName
            }
          })

          store.commit('setPadProducts', result)
          return result
        }
      })
    },
    formatDate(store, {
      val,
      format
    }) {
      return formatDate(val, format)
    }
  }
}

const dealStore = {
  start() {
    Object.keys(storeModules).forEach(key => {
      if (typeof storeModules[key].start === 'function') {
        store.modules[key] = storeModules[key].start()
      } else {
        store.modules[key] = storeModules[key]
      }
    })
    return store
  }
}
export default dealStore