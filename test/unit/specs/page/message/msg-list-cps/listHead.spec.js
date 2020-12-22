import { shallowMount } from '@vue/test-utils'
import MessageListHead from '@/page/message/msg-list-cps/list-head'

/**
 * 1. 测试HTTP参数、方法是否满足
 * 2. 测试数据返回时状态的更新
 * 3. 刷新时状态更新是否正常
 */
describe('MessageList listHead 消息列表头部测试', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(MessageListHead, {
      attachToDocument: true
    })
  })

  it('MessageList listHead 默认属性 测试', async () => {
    await nextTick()
    const props = wrapper.props()
    expect(props.checked).toBe(false)
    expect(props.title).toBe('主题')
    expect(props.time).toBe('发送时间')
    expect(wrapper.vm.checkedVisible).toBe('hidden')
    expect(wrapper.find('.title').text()).toBe('主题')
    expect(wrapper.find('.time').text()).toBe('发送时间')
  })

  it('MessageList listHead 设置属性 测试', async () => {
    wrapper.setProps({
      checked: true,
      title: '测试主题',
      time: '测试时间'
    })
    const props = wrapper.props()
    expect(props.checked).toBe(true)
    expect(props.title).toBe('测试主题')
    expect(props.time).toBe('测试时间')
    expect(wrapper.vm.checkedVisible).toBe('visible')
    expect(wrapper.find('.title').text()).toBe('测试主题')
    expect(wrapper.find('.time').text()).toBe('测试时间')
  })

  it('MessageList listHead 事件 测试', async () => {
    const checkWrap = wrapper.find('.check-wrap')
    checkWrap.trigger('click')
    expect(wrapper.emitted().changeCheck).toBeTruthy()
  })
})
