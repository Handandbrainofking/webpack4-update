import { shallowMount } from '@vue/test-utils'
import MessageListItem from '@/page/message/msg-list-cps/list-item'

/**
 * 1. 测试HTTP参数、方法是否满足
 * 2. 测试数据返回时状态的更新
 * 3. 刷新时状态更新是否正常
 */
describe('MessageList listItem 消息列表内容测试', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(MessageListItem, {
      propsData: {
        item: {
          applyNo: 'FZS0120190301001',
          deleteFlag: '0',
          hasRead: '1',
          id: '10000028640499',
          mode: 'PAD',
          msgTitle: '业务系统功能更新',
          msgContent: 'http://10.11.0.163:8080/x5/system/notice/noticeDetail?id=20000046825269',
          sendTime: 1541007114000,
          tplKey: '1'
        },
        index: 0
      }
    })
  })

  it('MessageList listHead 设置属性 测试', async () => {
    const props = wrapper.props()
    expect(props.index).toBe(0)
    expect(props.item).toEqual({
      applyNo: 'FZS0120190301001',
      deleteFlag: '0',
      hasRead: '1',
      id: '10000028640499',
      mode: 'PAD',
      msgTitle: '业务系统功能更新',
      msgContent: 'http://10.11.0.163:8080/x5/system/notice/noticeDetail?id=20000046825269',
      sendTime: 1541007114000,
      tplKey: '1'
    })
    expect(wrapper.vm.checkedVisible).toBe('hidden')
    expect(wrapper.vm.readImg).toBe('/image/read.png') // TODO:LCL(0327) readImg computed 属性应该单独一个用例测试
    expect(wrapper.vm.checkHasRead).toBe('read-text') // TODO:LCL(0327) checkHasRead computed 属性应该单独一个用例测试
    expect(wrapper.find('.title-text').classes()).toContain('read-text')
    expect(wrapper.find('.title-text').text()).toBe('业务系统功能更新')
    expect(wrapper.find('.cell-text').text()).toBe('2018-11-01 01:31')
  })

  it('MessageList listItem 事件 clickItem 测试', async () => {
    wrapper.vm.clickItem()
    expect(wrapper.emitted().clickItem).toBeTruthy()
    expect(wrapper.emitted().clickItem[0]).toEqual([{ // TODO:LCL(0327) 把ITEM抽出来通过一个工厂生成
      applyNo: 'FZS0120190301001',
      deleteFlag: '0',
      hasRead: '1',
      id: '10000028640499',
      mode: 'PAD',
      msgTitle: '业务系统功能更新',
      msgContent: 'http://10.11.0.163:8080/x5/system/notice/noticeDetail?id=20000046825269',
      sendTime: 1541007114000,
      tplKey: '1'
    }])
  })

  it('MessageList listItem 事件 changeCheck 测试', async () => {
    wrapper.vm.selectItem()
    expect(wrapper.emitted().changeCheck).toBeTruthy()
    expect(wrapper.emitted().changeCheck[0]).toEqual([0])
  })
})
