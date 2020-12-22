import Store from '../common'
import { http, formatDate } from '../common/utils'
import { InterviewListKind, DISC_ASSOCIATE_TYPE, DISC_ORDER_STATUS, Dist_List_Get } from '@/config'

export default {
  start() {
    return Store.extend({
      listPlugin: ['hideAssignTool'],
      state: {
        listMethod: 'post',
        listUrl: '/bpmsx/order/appoint/v1/roblist',
        pageSize: 11,
        robDocUrl: '/bpmsx/order/handle/v1/robOrder',
        timeConflitUlr: '/bpmsx/order/appoint/v1/getConflictAppoints',
        pagingMode: 'single',
        dict: {
          InterviewListKind: InterviewListKind,
          relateFlags: Dist_List_Get(DISC_ASSOCIATE_TYPE).concat({
            key: 'MAIN',
            name: '主订单'
          }),
          applyStatusDict: Dist_List_Get(DISC_ORDER_STATUS)
        },
        dictMappers: {
          nodeId: {
            dict: 'InterviewListKind',
            map: (item, kind) => item.nodeName = kind.name
          },
          appointTime: {
            dict: 'date',
            map: (item) => {
              let appointTime = typeof item.appointTime === 'string' ? item.appointTime.replace(/-/g, '/') : item.appointTime
              item.appointTimeF = formatDate(appointTime, 'YYYY-MM-DD hh:mm')
            }
          },
          relateType: {
            dict: 'relateFlags',
            key: 'key',
            map: (item, flag) => item.relateFlagF = flag.name
          },
          applyStatus: {
            dict: 'applyStatusDict',
            key: 'key',
            map: (item, flag) => item.applyStatusF = flag.name
          }
        },
        columns: [
          {
            title: '序号',
            width: 1.5,
            key: 'num'
          },
          {
            title: '客户姓名',
            width: 2,
            key: 'sellerName'
          },
          {
            title: '渠道经理',
            width: 2,
            key: 'salesUserName'
          },
          {
            title: '产品名称',
            width: 3,
            key: 'productName'
          },
          {
            title: '预约节点',
            width: 2,
            key: 'matterName',
            filterKey: 'appointMatterKey',
            filterList: 'InterviewListKind'
          },
          {
            title: '预约时间',
            width: 3,
            key: 'appointTimeF'
          },
          {
            title: '订单状态',
            width: 2,
            key: 'applyStatusF',
            filterKey: 'applyStatus',
            filterList: 'orderStatus'
          },
          {
            title: '关联标签',
            width: 2,
            key: 'relateFlagF'
          },
          {
            title: '操作',
            width: 4,
            isBtns: true,
            btns: [{
              'title': '抢单',
              'show': item => !item.isShowAssign, // 当只有一个抢单按钮时单独设置，因为样式会乱掉
              type: 'primary'
            },
            {
              'title': '抢单',
              'show': item => item.isShowAssign, // 当有有两个按钮时单独设置，因为样式会乱掉
              type: 'primary'
            },
            {
              'title': '派单',
              'show': item => item.isShowAssign,
              type: 'default'
            }
            ]
          }
        ]
      },

      actions: {
        /**
         * 根据用户角色确定是否隐藏派单工具栏
         */
        hideAssignTool({ rootGetters }, items) {
          let newItems = []
          for (let item of items) {
            // 计算预约时间还有多久，如果小于60分钟则显示加急图标.
            let appointTime = item.appointTime
            if (typeof appointTime === 'string') {
              appointTime = appointTime.replace(/-/g, '/')
            }
            let appointTimeValue = new Date(appointTime).valueOf()
            let currentTime = new Date().valueOf()

            let timeSpan = (appointTimeValue - currentTime) / 1000 / 60 // 得到分钟数
            let showTagp1 = false
            if ((item.productId === 'TFB_YSL_NJY_ISR' || item.productId === 'TFB_NSL_NJY_ISR') && item.thirdpartyName && item.thirdpartyName === 'WZB') {
              showTagp1 = true
            }
            newItems.push({
              ...item,
              isShowAssign: rootGetters.isYYZG,
              importDoc: timeSpan < 60,
              showTagp1: showTagp1
            })
          }
          // commit('dataList', newItems)
          return newItems
        },

        /**
         * 根据条件加载指定页的数据
         * @param {*} params 查询参数，包含 pageNumber 和过滤条件
         */
        loadPageData(store, params = {}) {
          const { dispatch, rootGetters, commit } = store
          // 更新页码
          commit('pageNumber', params.pageNumber || 1)

          // 设置查询时间段
          params.appointTimeSearchBegin = params.appointTimeSearchBegin || ''
          let appointTimeSearchBegin = params.appointTimeSearchBegin || ''
          let appointTimeSearchEnd = ''

          if (params.appointTimeSearchBegin) {
            appointTimeSearchEnd = appointTimeSearchBegin + ' 23:59:59'
            appointTimeSearchBegin = appointTimeSearchBegin + ' 00:00:00'
          }

          // 生成查询参数
          const requestData = {
            companyCode: rootGetters.companyCode,
            queryKeyWord: params.queryKeyWord || '',
            productId: params.productId || '',
            orderBy: params.orderBy || '',
            orderType: params.orderType,
            applyStatus: params.applyStatus ? [params.applyStatus] : [],
            appointMatterKey: params.appointMatterKey || '',
            appointTimeSearchBegin,
            appointTimeSearchEnd
          }
          return dispatch('loadPage', requestData).then(() => {
            // 如果不是经理岗，把所有数据的派单隐藏起来
            // dispatch('hideAssignTool')
            return true
          })
        },
        // 检查超过50个文档提示
        checkRobDocWarming(store, order) {
          const state = store.state
          order = order || state.currentItem
          return http.post(state.robDocUrl, {
            applyNo: order.applyNo,
            isCheck: true
          })
        },
        removeDisplay(store, applyNo) {
          // 避免 prettier 的格式效果异常
          const state = store.state
          const commit = store.commit
          // 删除已经被抢的单据
          let upatedList = Array.prototype.filter.call(state.dataList, item => item.applyNo !== applyNo)
          upatedList = Array.prototype.map.call(upatedList, (item, index) => {
            item.num = index + 1
            return item
          }) // 更新序号
          commit('dataList', upatedList)
        },
        commitRobDoc(store, order) {
          // 避免 prettier 的格式效果异常
          const state = store.state
          const dispatch = store.dispatch
          order = order || state.currentItem
          return http.post(state.robDocUrl, {
            applyNo: order.applyNo,
            isCheck: false
          }).then((res) => {
            dispatch('removeDisplay', order.applyNo)
            return true
          })
        },
        checkTimeConflit(store, { order, handleUserId }) {
          const state = store.state
          let appointTime = typeof order.appointTime === 'number' ? formatDate(order.appointTime, 'YYYY-MM-DD hh:mm') : order.appointTime
          return http.post(state.timeConflitUlr, {
            handleUserId,
            applyNo: order.applyNo,
            matterKey: order.matterKey,
            matterName: order.matterName,
            appointTime: appointTime,
            appointAddress: order.appointAddress,
            remark: order.remark || ''
          }).then((res) => {
            return res
          }, err => {
            console.error(err)
          })
        }
      }
    })
  }
}
