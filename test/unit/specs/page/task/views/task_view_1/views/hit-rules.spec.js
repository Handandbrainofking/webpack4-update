/**
 * 命中规则
 */
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Component from '@test/utils/Component'
import TaskHitRules from '@/page/task/views/task_view_1/views/hit-rules.vue'
import TaskStoreExp from '@/store/task/index'
import OrderModuleInfo from '@mock/http/bpmsx_order_info_v1_getOrderModuleInfo'

const localVue = createLocalVue()
localVue.use(Vuex)
const store = new Vuex.Store(TaskStoreExp.start())

describe('HitRules 命中规则测试', () => {
  let vm = null
  let comp = null

  beforeAll(async () => {
    const moduleInfo = OrderModuleInfo({
      relationKey: 'customerRelList,applyOrder,isrMixed,feeSummary,oriLoan,applyOrderExtend,newLoan,accountList,dealInfo,orderMatterRecordList,houseList,hitRuleList'
    }, {
      thirdpartyName: 'WZB',
      productId: 'TFB_NSL_NJY_ISR'
    })
    await store.commit('setOrderInfo', moduleInfo)
  })

  beforeEach(async () => {
    comp = new Component(await shallowMount(TaskHitRules, {
      store,
      localVue
    }))
    vm = comp.vm
  })

  it('属性 测试', async () => {
    await nextTick()
    expect(vm.hitRuleList).toEqual([
      {
        id: 1,
        applyNo: 'SHS0420190221001',
        'ruleName': '【法讼全文】 法讼裁判文书----未找到诉讼地位',
        ruleType: '',
        promptMessage: '',
        hitMessage: '关键字：在面向对象程序设计中，模拟对象是以可控的方式模拟真实对象行为的假的对象。程序员通常创造模拟对象来测试其他对象的行为，很类似汽车设计者使用碰撞测试假人来模拟车辆碰撞中人的动态行为 ',
        createTime: 1553050432928,
        createUserId: '',
        updateTime: '',
        updateUserId: ''
      },
      {
        id: 2,
        applyNo: 'SHS0420190221001',
        'ruleName': '【法讼全文】 法讼裁判文书----未找到诉讼地位',
        ruleType: '',
        promptMessage: '',
        hitMessage: '关键字：在面向对象程序设计中，模拟对象是以可控的方式模拟真实对象行为的假的对象。程序员通常创造模拟对象来测试其他对象的行为，很类似汽车设计者使用碰撞测试假人来模拟车辆碰撞中人的动态行为 ',
        createTime: 1553050432928,
        createUserId: '',
        updateTime: '',
        updateUserId: ''
      }
    ])
    expect(vm.hasFirstApproval).toBe(false)
    expect(vm.bodyList).toEqual([])
    expect(vm.noData).toBe(true)
    expect(vm.emptyText).toBe('暂无数据')
    expect(vm.emptyIcon).toBe('/image/icon-nodata.png')
    await store.commit('setFirstApproval', true)
    expect(vm.hasFirstApproval).toBe(true)
    expect(vm.bodyList).toEqual([
      {
        id: 1,
        applyNo: 'SHS0420190221001',
        'ruleName': '【法讼全文】 法讼裁判文书----未找到诉讼地位',
        ruleType: '',
        promptMessage: '',
        hitMessage: '关键字：在面向对象程序设计中，模拟对象是以可控的方式模拟真实对象行为的假的对象。程序员通常创造模拟对象来测试其他对象的行为，很类似汽车设计者使用碰撞测试假人来模拟车辆碰撞中人的动态行为 ',
        createTime: 1553050432928,
        createUserId: '',
        updateTime: '',
        updateUserId: '',
        num: 1
      },
      {
        id: 2,
        applyNo: 'SHS0420190221001',
        'ruleName': '【法讼全文】 法讼裁判文书----未找到诉讼地位',
        ruleType: '',
        promptMessage: '',
        hitMessage: '关键字：在面向对象程序设计中，模拟对象是以可控的方式模拟真实对象行为的假的对象。程序员通常创造模拟对象来测试其他对象的行为，很类似汽车设计者使用碰撞测试假人来模拟车辆碰撞中人的动态行为 ',
        createTime: 1553050432928,
        createUserId: '',
        updateTime: '',
        updateUserId: '',
        num: 2
      }
    ])
    expect(vm.noData).toBe(false)
    expect(vm.emptyText).toBe('该订单暂无命中规则')
    expect(vm.emptyIcon).toBe('/image/icon-no-hit-rules.png')
  })
})
