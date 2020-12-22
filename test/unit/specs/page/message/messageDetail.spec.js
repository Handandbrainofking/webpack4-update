import { shallowMount } from '@vue/test-utils'
import Component from '@test/utils/Component'
import MessageDetail from '@/page/message/message-detail.vue'
import { pageParams } from '@/mixins/pageParams'

/**
 * 1. 测试HTTP参数、方法是否满足
 * 2. 测试数据返回时状态的更新
 * 3. 刷新时状态更新是否正常
 */
describe('MessageDetail 列表接口测试', () => {
  let comp = null
  const requestMessage = jest.fn()

  beforeAll(async () => {
    await pageParams.setSyncParamItem({
      id: '90000000846642',
      msgContent: '',
      sendTime: '1552468816000',
      applyNo: '90000000845627',
      messageKey: 'BU_SYS_NOTICE_push_ts_msg',
      tplKey: 'BU_SYS_NOTICE_push_ts_msg',
      msgTitle: '业务系统功能更新（20190313）'
    })
  })

  beforeEach(() => {
    comp = new Component(shallowMount(MessageDetail, {
      methods: {
        requestMessage: requestMessage
      }
    }))
  })

  it('对数据进行展示', async () => {
    expect(comp.vm.msgDetail).toEqual({
      id: '90000000846642',
      msgContent: '',
      sendTime: '1552468816000',
      applyNo: '90000000845627',
      messageKey: 'BU_SYS_NOTICE_push_ts_msg',
      tplKey: 'BU_SYS_NOTICE_push_ts_msg',
      msgTitle: '业务系统功能更新（20190313）'
    })
    expect(comp.vm.isArticle).toBe(true)
    expect(comp.vm.msgTitle).toBe('业务系统功能更新（20190313）')
    expect(comp.vm.msgTime).toBe('2019-03-13 17:20')
    expect(comp.wrapper.find('.detail-click').exists()).toBe(false)
    // 执行requestMessage
    expect(requestMessage).toBeCalled()
    expect(requestMessage).toBeCalledWith('90000000846642')
  })

  it('对普通公告数据进行展示', async () => {
    await pageParams.setSyncParamItem({ // TODO:LCL(0327) 通过工厂生成该对象
      id: '90000000846642',
      msgContent: '业务系统功能更新（20190313）',
      sendTime: '1552468816000',
      applyNo: '90000000845627',
      messageKey: 'BU_SYS_NOTICE_push_ts_msg',
      tplKey: '1',
      msgTitle: '业务系统功能更新（20190313）'
    })
    const msgContentClick = jest.fn()
    const comp = new Component(shallowMount(MessageDetail, {
      methods: {
        msgContentClick
      },
      attachToDocument: true
    }))
    expect(comp.vm.msgDetail).toEqual({
      id: '90000000846642',
      msgContent: '业务系统功能更新（20190313）',
      sendTime: '1552468816000',
      applyNo: '90000000845627',
      messageKey: 'BU_SYS_NOTICE_push_ts_msg',
      tplKey: '1',
      msgTitle: '业务系统功能更新（20190313）'
    })
    expect(comp.vm.isArticle).toBe(false)
    expect(comp.vm.msgTitle).toBe('消息内容')
    expect(comp.vm.msgTime).toBe('2019-03-13 17:20')
    expect(comp.wrapper.find('.detail-click').exists()).toBe(true)
    comp.wrapper.find('.detail-click').trigger('click')
    expect(msgContentClick).toBeCalled()
  })
})
