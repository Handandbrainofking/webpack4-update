/**
 * function: task_redemption_register.js
 * author  : wq
 * update  : 2019/3/5 9:45
 */
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Component from '@test/utils/Component'
import TaskRedemptionRegister from '@/page/task/views/task_redemption_register.vue'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { pageParams } from '@/mixins/pageParams'
import TaskStoreExp from '@/store/task/index'
import userInfo from '@mock/http/userinfo'

const localVue = createLocalVue()
localVue.use(Vuex)
const store = new Vuex.Store(TaskStoreExp.start())
describe('TaskRedemptionRegister 赎楼登记测试', () => {
  let wrapper = null
  let comp = null
  const GetMatterList = 'bpmsx/order/matter/v1/getMatterList'
  const GetMatterListParams = {
    applyNo: 'FZS0120190301001',
    companyCode: '591111'
  }

  function judgeNodeFromTraceItem(item, nodeType) {
    return item.matterKey === nodeType && item.isHandled === '0' && item.deleteFlag === '0'
  }

  beforeAll(() => {
    store.commit('setLoginData', userInfo)
    pageParams.setSyncParamItem({
      productType: 'SLY_YSL_YJY_CSH',
      nodesType: 'TrustAccount',
      orderId: 'FZC0120190227014',
      applyNo: 'FZC0120190227014'
    })
    mockSuccess('post', GetMatterList, GetMatterListParams, 'bpmsx_order_matter_v1_getMatterList')
  })

  beforeEach(() => {
    comp = new Component(shallowMount(TaskRedemptionRegister, {
      store,
      localVue
    }))
    wrapper = comp.wrapper
  })

  it('默认属性 测试', async () => {
    const props = comp.getProp()
    expect(props.traceItem).toEqual({})
    expect(props.matterKey).toBe('')
    expect(props.showBtns).toBe(false)
  })

  it('设置属性 测试', async () => {
    wrapper.setProps({
      traceItem: {},
      matterKey: 'RandomMark',
      showBtns: true
    })
    const props = comp.getProp()
    expect(props.traceItem).toEqual({})
    expect(props.matterKey).toBe('RandomMark')
    expect(props.showBtns).toBe(true)
    const TaskBaseViewWrapper = comp.$el(TaskBaseView)
    // 按钮存在
    expect(TaskBaseViewWrapper.getProp().showFooterBtn).toBe(true)
  })

  // 初始化数据测试
  it('初始化数据 测试', async () => {

  })
})
