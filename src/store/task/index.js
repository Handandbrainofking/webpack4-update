/**
 * function: index
 * author  : wq
 * update  : 2018/11/23 15:25
 */
import Vuex from 'vuex'
import RequestApi from '@/api/index'
import HomeIndex from '../index'
import StoreNextMatter from './modules/nextMatter'
import Dialog from '@/utils/dialog'

Vue.use(Vuex)

const storeModules = [StoreNextMatter]
const store = {
  modules: {},
  state: {
    orderTraceList: [],
    orderInfo: {},
    hasFirstApproval: false,
    customers: [] // 用于辅助展示客户列表
  },
  mutations: {
    setOrderTraceList(state, data) {
      state.orderTraceList = data
    },
    setOrderInfo(state, data) {
      const orderInfo = state.orderInfo
      state.orderInfo = Object.assign({}, orderInfo, data)
    },
    clearOrderInfo(state, data) {
      state.orderInfo = {}
    },
    setFirstApproval(state, data) {
      state.hasFirstApproval = data
    },
    setCustomer(state, customer) {
      if (!customer.customerNo) return // 如果没有客户编号的直接跳过，新增的时候会有脏数据进来。
      let index = state.customers.findIndex(item => item.customerNo === customer.customerNo)
      if (index !== -1) {
        const item = {...state.customers[index], ...customer}
        // item.name = customer.name
        state.customers.splice(index, 1, item)
      } else {
        state.customers.push(customer)
      }
    },
    removeCustomer(state, customerNo) {
      let index = state.customers.findIndex(item => item.customerNo === customerNo)
      if (index !== -1) {
        state.customers.splice(index, 1)
      }
    }
  },
  actions: {
    // 获取事项状态跟踪列表
    requestOrderTraceList({
      commit
    }, applyNo) {
      return new Promise((resolve, reject) => {
        RequestApi.order_approve_status({
          method: 'GET',
          data: {
            applyNo
          },
          success: data => {
            commit('setOrderTraceList', (data && data.matterList) || [])
            resolve(data)
          }
        })
      })
    },
    // 强制设置订单的模块信息 -- 一般用于订单变化，例如保存数据后的刷新，或者强制刷新等
    forceRequestOrderInfo({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.order_info({
          data: opts,
          success: data => {
            commit('setOrderInfo', data || {})
            resolve(data)
          }
        })
      })
    },
    // 获取订单信息 -- 对于基本的获取订单信息，一般用缓存数据，只有缓存没有数据的时候才进行请求，并且只请求没有的模块
    requestOrderInfo({
      commit,
      state
    }, opts) {
      return new Promise((resolve, reject) => {
        const orderInfo = state.orderInfo || {}
        const relationKey = opts.relationKey.split(',') || []
        const requestRelationKey = []
        const returnData = {}
        relationKey.forEach(item => {
          if (!orderInfo[item]) {
            requestRelationKey.push(item)
          } else {
            returnData[item] = orderInfo[item]
          }
        })
        if (requestRelationKey.length > 0) {
          RequestApi.order_info({
            data: Object.assign({}, opts, {
              relationKey: requestRelationKey.join(',')
            }),
            success: data => {
              // if (data.applyOrder) {
              //   data = Object.assign({}, data, {
              //     applyOrder: Object.assign({}, data.applyOrder, {thirdpartyName: 'ZYB'}),
              //     hitRuleList: [{id: 1, applyNo: 'SHS0420190221001', 'ruleName': '【法讼全文】 法讼裁判文书----未找到诉讼地位', ruleType: '', promptMessage: '', hitMessage: '关键字：在面向对象程序设计中，模拟对象是以可控的方式模拟真实对象行为的假的对象。程序员通常创造模拟对象来测试其他对象的行为，很类似汽车设计者使用碰撞测试假人来模拟车辆碰撞中人的动态行为 ', createTime: 1553050432928, createUserId: '', updateTime: '', updateUserId: ''},
              //       {id: 1, applyNo: 'SHS0420190221001', 'ruleName': '【法讼全文】 法讼裁判文书----未找到诉讼地位', ruleType: '', promptMessage: '', hitMessage: '关键字：在面向对象程序设计中，模拟对象是以可控的方式模拟真实对象行为的假的对象。程序员通常创造模拟对象来测试其他对象的行为，很类似汽车设计者使用碰撞测试假人来模拟车辆碰撞中人的动态行为 ', createTime: 1553050432928, createUserId: '', updateTime: '', updateUserId: ''}]
              //   })
              // }
              commit('setOrderInfo', data || {})
              resolve(Object.assign({}, returnData, data || {}))
            }
          })
        } else {
          resolve(orderInfo)
        }
      })
    },
    // 保存订单信息
    saveOrderInfo({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.order_info_save({
          data: opts,
          success: data => {
            resolve(data)
          },
          error: (msg, code, obj) => {
            reject({
              msg,
              code,
              obj
            })
          }
        })
      })
    },
    // 提交订单信息
    submitOrderInfo({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.order_info_submit({
          data: opts,
          success: (data) => {
            resolve(data)
          },
          error: (msg, code, obj) => {
            if(code && msg){
              Dialog.toast('' + msg)
            }
            resolve('error')
          }
        })
      })
    },
    // 删除恢复事项
    changeNodeInfo({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.node_state_change({
          data: opts,
          success: (data) => {
            resolve(data)
          }
        })
      })
    },
    // 人工审核通过
    manCheckAgree({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.man_check_agree({
          data: opts,
          success: (data, msg, code) => {
            if (code !== '200' && msg) {
              Dialog.toast('' + msg)
              resolve(false)
            }
            resolve(true)
          }
        })
      })
    },
    // 杭州银行搭配提放保查询
    getQueryDockingResult({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.get_query_docking_result({
          data: opts,
          success: (data, msg, code) => {
            resolve(data)
          }
        })
      })
    },
    // 处理征信查询
    getCreditChannel({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.credit_channel_list({
          data: opts,
          success: (data) => {
            resolve(data)
          }
        })
      })
    },
    // 发起初审
    firstApproval({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.first_approval({
          data: opts,
          success: (data) => {
            // setTimeout(() => {
            //   const data = ''
            commit('setFirstApproval', true)
            resolve(data)
            // }, 3000)
          },
          error(msg, code, data) {
            Dialog.toast(msg)
            reject(msg)
          }
        })
      })
    },
    // 更新初审状态
    updateFirstApproval({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.updateFirstApproval({
          data: opts
        })
      })
    },
    // 请求合作机构
    getOrgList({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.org_list({
          data: opts,
          success: (data) => {
            resolve(data)
          }
        })
      })
    },
    // 请求产品期限
    getProductLimit({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.product_limit_list({
          data: opts,
          success: (data) => {
            resolve(data)
          }
        })
      })
    },
    // 请求资料上传信息
    getDataUploadList({
      commit
    }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.task_data_list({
          data: opts,
          success: (data) => {
            resolve(data)
          }
        })
      })
    }
  },
  getters: {
    orderInfo(state) {
      return state.orderInfo || {}
    },
    applyOrder(state) {
      const orderInfo = state.orderInfo || {}
      return orderInfo.applyOrder || {}
    },
    customerRelList(state) {
      const orderInfo = state.orderInfo || {}
      return orderInfo.customerRelList || []
    },
    applyOrderExtend(state) {
      const orderInfo = state.orderInfo || {}
      return orderInfo.applyOrderExtend || {}
    },
    hitRuleList(state) {
      const orderInfo = state.orderInfo || {}
      return orderInfo.hitRuleList || {}
    },
    isWeBank(state) {
      const orderInfo = state.orderInfo || {}
      const applyOrder = orderInfo.applyOrder || {}
      return applyOrder.thirdpartyName === 'WZB'
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
    const storeRootIndex = HomeIndex.start()
    store.modules = Object.assign({}, storeRootIndex.modules, store.modules)
    store.state = Object.assign({}, storeRootIndex.state, store.state)
    store.mutations = Object.assign({}, storeRootIndex.mutations, store.mutations)
    store.actions = Object.assign({}, storeRootIndex.actions, store.actions)
    store.getters = Object.assign({}, storeRootIndex.getters, store.getters)
    return store
  }
}
export default dealStore
