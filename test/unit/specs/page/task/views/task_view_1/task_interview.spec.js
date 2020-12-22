/**
 * 面签测试
 */
import Vuex from 'vuex'
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import Component from '@test/utils/Component'
import TaskInterview from '@/page/task/views/task_view_1/task_interview.vue'
import { pageParams } from '@/mixins/pageParams'
import TaskStoreExp from '@/store/task/index'
import userInfo from '@mock/http/userinfo'

const localVue = createLocalVue()
localVue.use(Vuex)
const store = new Vuex.Store(TaskStoreExp.start())
describe('Interview 面签测试', () => {
  let wrapper = null
  let comp = null
  let vm = null
  let traceList = null
  let traceItem = null
  const matterRecordListUrl = 'bpmsx/order/matter/v1/getMatterList'
  const matterRecordListParams = {
    applyNo: 'FZC0120190227015'
  }
  const mockRecordListUrl = 'bpmsx_order_matter_v1_getMatterList'

  const requestOrderUrl = '/bpmsx/order/info/v1/getOrderModuleInfo'
  const requestOrderParams = {
    'applyNo': 'FZC0120190227015',
    'relationKey': 'applyOrder'
  }
  const mockOrderUrl = 'bpmsx_order_info_v1_getOrderModuleInfo'

  function judgeNodeFromTraceItem(item, nodeType) {
    return item.matterKey === nodeType && item.isHandled === '0' && item.deleteFlag === '0'
  }

  beforeAll(() => {
    store.commit('setLoginData', userInfo)
    pageParams.setSyncParamItem({
      productType: 'TFB_NSL_NJY_ISR',
      nodesType: 'DownHouseSurvey',
      orderId: 'FZC0120190227015',
      applyNo: 'FZC0120190227015'
    })
  })

  beforeEach(() => {
    traceList = mockSuccess('get', matterRecordListUrl, matterRecordListParams, mockRecordListUrl).matterList
    traceItem = traceList.filter(item => judgeNodeFromTraceItem(item, 'Interview') && item.isHaveHandleRight === '1')[0] || {}
    // comp = new Component(shallowMount(TaskInterview, {
    //   store,
    //   localVue,
    //   propsData: {
    //     matterKey: 'Interview',
    //     showBtns: traceList.filter(item => judgeNodeFromTraceItem(item, 'Interview') && item.isHaveHandleRight === '1').length > 0,
    //     traceItem: traceItem
    //   }
    // }))
    // wrapper = comp.wrapper
  })

  it('微众 提放保无赎楼 提交 手机号修改 按钮重新回到 初审', async () => {
    const requestParams = Object.assign({}, requestOrderParams, {
      relationKey: 'customerRelList,applyOrder,isrMixed,feeSummary,oriLoan,applyOrderExtend,newLoan,accountList,dealInfo,orderMatterRecordList,houseList,hitRuleList',
      mockParams: {
        thirdpartyName: 'WZB',
        productId: 'TFB_NSL_NJY_ISR'
      }
    })
    mockSuccess('post', requestOrderUrl, requestParams, mockOrderUrl)
    mockSuccess('post', requestOrderUrl, Object.assign({}, requestParams, {relationKey: 'oriLoan,applyOrderExtend'}), mockOrderUrl)
    pageParams.setSyncParamItem({
      productType: 'TFB_NSL_NJY_ISR',
      nodesType: 'Interview',
      orderId: 'FZC0120190227015',
      applyNo: 'FZC0120190227015'
    })
    const comp = new Component(mount(Vue.extend({
      data() {
        return {
          showChildren: true
        }
      },
      extends: TaskInterview
    }), {
      store,
      localVue,
      propsData: {
        matterKey: 'Interview',
        showBtns: traceList.filter(item => judgeNodeFromTraceItem(item, 'Interview') && item.isHaveHandleRight === '1').length > 0,
        traceItem: traceItem
      }
    }))
    const vm = comp.vm
    await nextTick()
    expect(vm.footerBtn).toEqual(['终止', '保存', '初审'])
    const firstApprovalUrl = '/bpmsx/order/risk/v1/firstApproval'
    const firstApprovalParams = {
      applyNo: 'FZC0120190227015',
      currentNode: 'Interview'
    }
    const MockFirstApprovalUrl = 'bpmsx_order_risk_v1_firstApproval'

    mockSuccess('post', firstApprovalUrl, firstApprovalParams, MockFirstApprovalUrl)
    vm.doClickBtn(2, '初审')
    await nextTick()
    expect(vm.footerBtn).toEqual(['终止', '保存', '提交'])
    // 修改手机号
    const customer = vm.$refs['valid-tab-0'][0].$refs['valid-customer-1']
    const info = customer.dealInfoCompatibleArray()
    const phoneItem = customer.findItemByNameBlock(info, 'phone')
    customer.changeValue(phoneItem.key, phoneItem.sortIndex, phoneItem, '13512112111')
    await nextTick()
    expect(vm.footerBtn).toEqual(['终止', '保存', '初审'])
  })

  describe('底部按钮检测 测试', () => {
    it('微众 提放保无赎楼 展示 【终止, 保存, 初审】按钮 测试', async () => {
      const requestParams = Object.assign({}, requestOrderParams, {
        relationKey: 'customerRelList,applyOrder,isrMixed,feeSummary,oriLoan,applyOrderExtend,newLoan,accountList,dealInfo,orderMatterRecordList,houseList,hitRuleList',
        mockParams: {
          thirdpartyName: 'WZB',
          productId: 'TFB_NSL_NJY_ISR'
        }
      })
      mockSuccess('post', requestOrderUrl, requestParams, mockOrderUrl)
      pageParams.setSyncParamItem({
        productType: 'TFB_NSL_NJY_ISR',
        nodesType: 'Interview',
        orderId: 'FZC0120190227015',
        applyNo: 'FZC0120190227015'
      })
      comp = new Component(shallowMount(TaskInterview, {
        store,
        localVue,
        propsData: {
          matterKey: 'Interview',
          showBtns: traceList.filter(item => judgeNodeFromTraceItem(item, 'Interview') && item.isHaveHandleRight === '1').length > 0,
          traceItem: traceItem
        }
      }))
      await nextTick()
      vm = comp.vm
      expect(vm.footerBtn).toEqual(['终止', '保存', '初审'])
    })
    // 其他逻辑感觉有点问题，由处理这块的人写
    // TODO:LCL(0327) 是否已经告知
  })
})
