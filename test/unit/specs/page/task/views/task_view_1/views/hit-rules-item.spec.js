/**
 * 命中规则列表
 */
import { shallowMount } from '@vue/test-utils'
import Component from '@test/utils/Component'
import TaskHitRulesItem from '@/page/task/views/task_view_1/views/hit-rules-item.vue'

describe('HitRulesItem 命中规则测试', () => {
  let vm = null
  let comp = null

  beforeEach(() => {
    comp = new Component(shallowMount(TaskHitRulesItem))
    vm = comp.vm
  })

  it('默认属性 测试', async () => {
    expect(vm.item).toEqual({})
    expect(vm.index).toBe(0)
  })

  it('属性 测试', async () => {
    comp.props = ({
      item: {
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
      index: 1
    })
    expect(vm.item).toEqual({
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
    })
    expect(vm.index).toBe(1)
    expect(comp.$el('.num').$el('.text').text).toBe('1')
    expect(comp.$el('.rule-name').$el('.text').text).toBe('【法讼全文】 法讼裁判文书----未找到诉讼地位')
    expect(comp.$el('.rule-message').$el('.text').text).toBe('关键字：在面向对象程序设计中，模拟对象是以可控的方式模拟真实对象行为的假的对象。程序员通常创造模拟对象来测试其他对象的行为，很类似汽车设计者使用碰撞测试假人来模拟车辆碰撞中人的动态行为')
    expect(comp.$el('.create-time').$el('.text').text).toBe('2019-03-20 10:53:52')
  })
})
