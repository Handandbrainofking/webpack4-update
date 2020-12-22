import { mount } from '@vue/test-utils'
import MessageList from '@/page/message/message-list'
import { SearchInput } from '@ddjf/ddpad'
import LoginApi from '@/utils/login'
import MsgListHead from '@/page/message/msg-list-cps/list-head.vue'
import MsgListItem from '@/page/message/msg-list-cps/list-item.vue'

/**
 * 1. 测试HTTP参数、方法是否满足
 * 2. 测试数据返回时状态的更新
 * 3. 刷新时状态更新是否正常
 */
describe('MessageList 列表 测试', () => {
  let wrapper = null
  // 设置用户信息
  const MessageListUrl = '/bpmsx/order/handle/v1/getMessages'
  const MessageListParam = {
    'pageNumber': 1,
    'pageSize': 11,
    'msgType': 'PAD',
    'phone': '131********',
    'companyCode': '591111'
  }
  const setMessageReadUrl = '/bpmsx/order/handle/v1/setMessageStatus'
  const setMessageReadParams = {
    'operateType': 'read',
    'messageList': ['10000028640499'],
    'companyCode': '591111'
  }
  beforeAll(async () => {
    const data = { // TODO:LCL(0327) mock 的 json 目录下已经内置了一个用户
      'accessToken': 'eyJhbGciOiJERVMiLCJ0eXAiOiJBV1QifQ.eyJleHAiOjE1NTIwOTMwMjIyNjUsImZyb21Vc2VyIjoiMTAwMDAwMjM1MjA3MDMiLCJpYXQiOjE1NTIwMDY2MjIyNjUsImlzcyI6ImF3dC1wcm9kdWNlciJ9.5Z-9Xccs71DqOB5reAjO4QOoPn_BxWbNCRdPj5T4_Y_q5h5g667E3-JJ4vv-C-07f8mD1vSS1h5nJmhHPTHbGaSvON4OliltNSEdW3pcVHdhfjJqxm7rLHfgPYFa7K2VQplRMK0OZ5nIWl8ykM_XsN978t2M4VX5ZyZoRz0x2xkBj7tBIzdcB0UdrIbOZRFiHFta_QCYjbXQq38GeuP3kQ',
      'account': 'yejunrong',
      'branchList': [{
        'cityName': '福州市',
        'cityNo': '350100',
        'code': '591111',
        'name': '福州市场一部',
        'provinceCode': '350000',
        'provinceName': '福建省',
        'userId': '10000023520703'
      }],
      'email': 'test@ddjf.com.cn',
      'fullname': '叶俊荣',
      'id': '10000023520703',
      'mobile': '131********',
      'roleList': [{'alias': 'WQG', 'name': '外勤岗', 'userId': '10000023520703'}, {
        'alias': 'QDJLG',
        'name': '渠道经理岗',
        'userId': '10000023520703'
      }, {'alias': 'QDJL', 'name': '渠道经理', 'userId': '10000023520703'}, {
        'alias': 'wqg3',
        'name': '外勤岗3',
        'userId': '10000023520703'
      }, {'alias': 'WQG2', 'name': '外勤岗2', 'userId': '10000023520703'}, {
        'alias': 'WQG1',
        'name': '外勤岗1',
        'userId': '10000023520703'
      }],
      'sex': 'M',
      'companyCode': '591111',
      'companyName': '福州市场一部',
      'cityNo': '350100',
      'cityName': '福州市',
      'provinceCode': '350000',
      'provinceName': '福建省'
    }
    await LoginApi.setLastLoginUserInfo(data)
    await LoginApi.setLoginData(data)
    await mockSuccess('post', MessageListUrl, MessageListParam, 'bpmsx_order_handle_v1_getMessages')
    await mockSuccess('post', setMessageReadUrl, setMessageReadParams, 'bpmsx_order_handle_v1_setMessageStatus')
  })

  beforeEach(() => {
    wrapper = mount(MessageList, {
      attachToDocument: true
    })
  })

  it('MessageList HTTP参数是否正确', async () => {
    expect(wrapper.vm.bodyList.length).toBe(11) // TODO:LCL(0327) 这些都是 PageLoaderMixins 要覆盖的测试，不应该在这进行验证
    expect(wrapper.vm.totalNum).toBe(16)
    expect(wrapper.vm.currentPage).toBe(1)
    expect(wrapper.vm.totalPage).toBe(2)
    expect(wrapper.vm.perNum).toBe(11)
  })

  it('MessageList 搜索测试', async () => {
    const requestMethod = jest.fn()
    wrapper.setMethods({
      requestList: requestMethod
    })
    const $searchInput = wrapper.find(SearchInput)
    $searchInput.vm.$emit('input', '测试')
    $searchInput.vm.$emit('search')
    expect(wrapper.vm.params.queryKeyword).toBe('测试')
    expect(requestMethod).toBeCalled()
    expect(requestMethod).toBeCalledWith(1)
  })

  it('MessageList 勾选 测试', async () => {
    expect(wrapper.vm.disabledBtn).toBe(true)
    const $MsgListItem = wrapper.findAll(MsgListItem)
    expect($MsgListItem.length).toBe(11)
    $MsgListItem.at(0).vm.$emit('changeCheck', 0)
    expect(wrapper.vm.bodyList[0].checked).toBe(true)
    expect(wrapper.vm.disabledBtn).toBe(false)
    for (let i = 0; i < $MsgListItem.length; i++) {
      const item = $MsgListItem.at(i)
      item.vm.$emit('changeCheck', item.vm.index)
    }
    expect(wrapper.vm.bodyList[0].checked).toBe(false)
    expect(wrapper.vm.allChecked).toBe(false)
    expect(wrapper.vm.bodyList.filter(item => item.checked).length).toBe(10)
    expect(wrapper.vm.checkedNum).toBe(10)
    $MsgListItem.at(0).vm.$emit('changeCheck', 0)
    expect(wrapper.vm.bodyList.filter(item => item.checked).length).toBe(11)
    expect(wrapper.vm.checkedNum).toBe(11)
    expect(wrapper.vm.allChecked).toBe(true)
  })

  it('MessageList 全部勾选 测试', async () => {
    const $MsgListHead = wrapper.find(MsgListHead)
    $MsgListHead.vm.$emit('changeCheck')
    expect(wrapper.vm.allChecked).toBe(true)
    expect(wrapper.vm.bodyList.filter(item => item.checked).length).toBe(11)
    expect(wrapper.vm.checkedNum).toBe(11)
    $MsgListHead.vm.$emit('changeCheck')
    expect(wrapper.vm.allChecked).toBe(false)
    expect(wrapper.vm.bodyList.filter(item => item.checked).length).toBe(0)
    expect(wrapper.vm.checkedNum).toBe(0)
  })

  it('MessageList 标为已读 测试', async () => {
    const $btnRead = wrapper.find('.btn-read')
    expect($btnRead.classes()).toContain('btn-read-disabled')
    const $MsgListItem = wrapper.findAll(MsgListItem)
    $MsgListItem.at(0).vm.$emit('changeCheck', 0)
    expect($btnRead.classes()).not.toContain('btn-read-disabled')
    $btnRead.trigger('click')
    expect(wrapper.vm.bodyList[0].hasRead).toBe('1')
    expect(wrapper.vm.bodyList[0].checked).toBe(false)
    // 同一个再次标为已经读取
    $MsgListItem.at(0).vm.$emit('changeCheck', 0)
    expect($btnRead.classes()).not.toContain('btn-read-disabled')
    $btnRead.trigger('click')
    expect(wrapper.vm.bodyList.filter(item => item.checked).filter(item => item.hasRead !== '1').length).toBe(0)
  })

  it('MessageList 删除 测试', async () => {
    wrapper.vm.bodyList = wrapper.vm.bodyList.map(item => Object.assign({}, item, {checked: false}))
    const $btnDelete = wrapper.find('.btn-delete')
    expect($btnDelete.classes()).toContain('btn-delete-disabled')
    const $MsgListItem = wrapper.findAll(MsgListItem)
    $MsgListItem.at(0).vm.$emit('changeCheck', 0)
    expect(wrapper.vm.bodyList[0].checked).toBe(true)
    expect($btnDelete.classes()).not.toContain('btn-delete-disabled')
  })

  it('MessageList 点击详情 测试', async () => {
    const clickItem = jest.fn()
    const _wrapper = await mount(MessageList, {
      attachToDocument: true,
      methods: {
        clickItem: clickItem
      }
    })
    const $MsgListItem = _wrapper.findAll(MsgListItem)
    $MsgListItem.at(0).find('.title-wrap').trigger('click')
    expect(clickItem).toBeCalled()
    expect(clickItem).toBeCalledWith({
      'applyNo': 'FZS0120190301001',
      'deleteFlag': '0',
      'id': '10000028640499',
      'mode': 'PAD',
      'msgContent': 'http://10.11.0.163:8080/x5/system/notice/noticeDetail?id=20000046825269',
      'sendTime': 1541007114000,
      'tplKey': '1',
      'showTagp1': false,
      'num': 1
    })
  })

  it('MessageList 返回保存页数 测试', async () => {
    await wrapper.vm.$store.commit('setSearchParams', Object.assign({}, wrapper.vm.params, {
      pageSize: 11,
      currentPage: 2
    }))// TODO:LCL 参考行业标准 Object.assign 并不是一个好的代码风格，更推荐用对象展开符 https://github.com/airbnb/javascript#objects--rest-spread
    const wrapper1 = await mount(MessageList)
    expect(wrapper1.vm.perNum).toBe(11)
    expect(wrapper1.vm.currentPage).toBe(2)
  })

  it('MessageList 广播更新 测试', async () => {
    const loadPageData = jest.fn()
    const wrapper = await mount(MessageList, {
      methods: {
        loadPageData: loadPageData
      }
    })
    wrapper.vm.$eventHub.$emit('BroadcastChangedOrganization')
    expect(loadPageData).toBeCalled()
  })
})
