import { shallowMount } from '@vue/test-utils'
import MessageListTitle from '@/page/message/msg-list-cps/title.vue'

/**
 * 1. 测试HTTP参数、方法是否满足
 * 2. 测试数据返回时状态的更新
 * 3. 刷新时状态更新是否正常
 */
describe('MessageListTitle 消息列表标题测试', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(MessageListTitle)
  })

  it('HTTP参数是否正确', async () => {
    const $title = wrapper.find('.title')
    expect($title.classes()).toContain('title')
    expect($title.text()).toBe('消息列表')
  })
})
