/**
 * function: 以赎楼登记页面
 * author  : wq
 * update  : 2019/3/5 9:45
 */
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Component from '@test/utils/Component'
import { mockSuccess } from '@test/utils/mock'
import jsonOrderInfo from '@mock/http/bpmsx_order_info_v1_getOrderModuleInfo'
import TaskStoreExp from '@/store/task/index'
import TaskRedemptionRegister from '@/page/task/views/task_redemption_register.vue'
import { pageParams } from '@/mixins/pageParams'
import userInfo from '@mock/http/userinfo'

const store = new Vuex.Store(TaskStoreExp.start())
const localVue = createLocalVue()
localVue.use(Vuex)

describe('mixinTaskSave  测试', () => {
  let comp = null
  let vm = null
  const requestOrderUrl = '/bpmsx/order/info/v1/getOrderModuleInfo'
  const requestOrderParams = {
    'applyNo': 'FZC0120190227015',
    'relationKey': 'applyOrder'
  }
  const mockOrderUrl = 'bpmsx_order_info_v1_getOrderModuleInfo'

  const matterRecordListUrl = 'bpmsx/order/matter/v1/getMatterList'
  const matterRecordListParams = {
    applyNo: 'FZC0120190227015'
  }
  const mockRecordListUrl = 'bpmsx_order_matter_v1_getMatterList'

  const saveTaskModuleUrl = '/bpmsx/order/handle/v1/saveTask'
  const saveTaskModuleParams = {data: {'orderMatterRecordList': [{'nodeRemark': '111111', 'id': '10000074712558'}]}}
  const mockSaveTaskModuleUrl = 'bpmsx_order_handle_v1_saveTask'

  const completeTaskUrl = '/bpmsx/order/handle/v1/completeTask'
  const completeTaskParams = {
    applyNo: 'FZC0120190227015',
    opinion: '111111',
    taskId: '10000074712557',
    operatorLocationX: 100.08,
    operatorLocationY: 38.58,
    operatorAddress: '广东深圳'
  }
  const mockcompleteTaskUrl = 'bpmsx_order_handle_v1_completeTask'

  function judgeNodeFromTraceItem(item, nodeType) {
    return item.matterKey === nodeType && item.isHandled === '0' && item.deleteFlag === '0'
  }

  beforeEach(async () => {
    await store.commit('setLoginData', userInfo)
    await pageParams.setSyncParamItem({
      productType: 'SLY_YSL_YJY_CSH',
      orderId: 'FZC0120190227015',
      applyNo: 'FZC0120190227015'
    })
    const traceList = mockSuccess('get', matterRecordListUrl, matterRecordListParams, mockRecordListUrl).matterList
    const matterRecordList = mockSuccess('post', requestOrderUrl, Object.assign({}, requestOrderParams, {relationKey: 'orderMatterRecordList'}), mockOrderUrl).orderMatterRecordList
    mockSuccess('post', requestOrderUrl, Object.assign({}, requestOrderParams, {relationKey: 'applyOrder,oriLoan,ransomFloor,orderMatterRecordList'}), mockOrderUrl)
    const list = traceList.map(item => {
      const matterRecordItem = matterRecordList.filter(itm => itm.id === item.id)[0] || {}
      item.nodeRemark = matterRecordItem.nodeRemark
      return item
    })
    const traceItem = list.filter(item => judgeNodeFromTraceItem(item, 'RandomMark') && item.isHaveHandleRight === '1')[0] || {}
    traceItem.CancleMortgageTaskId = (list.filter(item => judgeNodeFromTraceItem(item, 'CancleMortgage'))[0] || {}).relateId
    comp = new Component(shallowMount(TaskRedemptionRegister, {
      store,
      localVue,
      propsData: {
        matterKey: 'RandomMark',
        showBtns: list.filter(item => judgeNodeFromTraceItem(item, 'RandomMark') && item.isHaveHandleRight === '1').length > 0,
        traceItem: traceItem
      }
    }))
    vm = comp.vm
  })

  it('地点数据 测试', async () => {
    expect(vm.operatorLocationX).toBe(100.08)
    expect(vm.operatorLocationY).toBe(38.58)
    expect(vm.operatorAddress).toBe('广东深圳')
  })

  it('getBaseView 测试', async () => {
    const ve = vm.getBaseView()
    expect(ve._isVue).toBe(true)
  })

  it('requestOrderInfo 测试', async () => {
    const jsonData = jsonOrderInfo(requestOrderParams)
    jsonData.applyOrder = Object.assign({}, jsonData.applyOrder, {applyStatus: 1111})
    vm.$store.commit('setOrderInfo', jsonData)
    vm.requestOrderInfo('FZC0120190227015')
    expect(vm.$store.state.orderInfo.applyOrder.applyStatus).toBe(1111)
    vm.requestOrderInfo('FZC0120190227015', true)
    expect(vm.$store.state.orderInfo.applyOrder.applyStatus).toBe('applycheckinterviewed')
    expect(vm.$store.state.orderInfo.accountList).toBeUndefined()
  })

  /**
   * 1、保存数据
   * 2、存在nodeRemark更新traceItem的nodeRemark
   * 3、存在图像识别提交图片
   * 4、清空info的更改标签
   */
  it('saveRequest 测试', async () => {
    mockSuccess('post', saveTaskModuleUrl, saveTaskModuleParams, mockSaveTaskModuleUrl)
    const requestOrderInfo = jest.fn()
    // comp.wrapper.setMethods({
    //   requestOrderInfo
    // })
    const info = vm.dealInfoCompatibleArray()
    const nodeRemarkItem = vm.findItemByNameBlock(info, 'nodeRemark')
    vm.$set(nodeRemarkItem, 'value', '111111')
    vm.$set(nodeRemarkItem, 'changed', true)
    vm.valueChanged = true
    await new Promise(resolve => {
      vm.doSave(function () {
        requestOrderInfo()
        resolve()
      }, true, true)
    })
    expect(requestOrderInfo).toBeCalled()
  })

  /**
   * 1、提交数据
   * 2、存在更新taskId
   */
  it('submitOrderInfo 测试', async () => {
    mockSuccess('post', completeTaskUrl, completeTaskParams, mockcompleteTaskUrl)
    vm.traceItem.nodeRemark = '111111'
    const afterSubmitOrder = jest.fn()
    await vm.submitOrderInfo({
      applyNo: vm.applyNo,
      opinion: vm.getMarkInfo(),
      taskId: vm.traceItem.relateId,
      operatorLocationX: vm.operatorLocationX,
      operatorLocationY: vm.operatorLocationY,
      operatorAddress: vm.operatorAddress
    }, [], afterSubmitOrder)
    expect(afterSubmitOrder).toBeCalled()
  })

  it('doClickBtn 测试', async () => {
    const doStopBtn = jest.fn()
    const doSave = jest.fn()
    // const doReleaseSave = jest.fn()
    const doCommit = jest.fn()
    const doManCheckAgree = jest.fn()
    comp.wrapper.setMethods({
      doStopBtn,
      doSave,
      // doReleaseSave,
      doCommit,
      doManCheckAgree
    })
    vm.doClickBtn(0, '终止')
    expect(doStopBtn).toBeCalled()
    vm.doClickBtn(1, '保存')
    expect(doSave).toBeCalled()
    // vm.doClickBtn(2, '释放提交')
    // expect(doReleaseSave).toBeCalled()
    vm.doClickBtn(3, '提交')
    expect(doCommit).toBeCalled()
    vm.doClickBtn(4, '审核通过')
    expect(doManCheckAgree).toBeCalled()
  })

  it('doStopBtn 测试', async () => {
    const $ref = vm.getBaseView()
    const doStopTask = jest.fn()
    $ref.doStopTask = $ref.$options.methods.doStopTask = doStopTask
    vm.doStopBtn()
    expect(doStopTask).toBeCalled()
  })

  it('doSave 测试', async () => {
    // saveRequest 测试过
  })

  it('doBaseCommit 测试', async () => {
    // 在 doCommit 中测试
  })

  it('doCommit 测试', async () => {
    const afterSubmit = jest.fn()
    vm.traceItem.nodeRemark = '111111'
    mockSuccess('post', completeTaskUrl, completeTaskParams, mockcompleteTaskUrl)
    comp.wrapper.setMethods({
      doValidate() {
        return true
      }
    })
    await new Promise(resolve => {
      vm.doCommit(function () {
        afterSubmit()
        resolve()
      })
    })
    expect(afterSubmit).toBeCalled()
  })

  it('getMarkInfo 测试', async () => {
    // 数据是从traceItem中获取的 所以只测试traceItem
    vm.traceItem.nodeRemark = '111111'
    const mark = vm.getMarkInfo()
    expect(mark).toBe('111111')
  })

  it('clearSaveMark 测试', async () => {
    await comp.wrapper.setData({
      info: [{
        value: '111',
        changed: true
      }],
      valueChanged: true
    })
    expect(vm.valueChanged).toBe(true)
    vm.clearSaveMark()
    expect(vm.valueChanged).toBe(false)
    expect(vm.info).toEqual([{
      value: '111'
    }])
  })

  it('dealSubmitInfo 测试', async () => {
    // 在 doCommit 中测试
  })

  // it('doReleaseSave 测试', async () => {
  //   vm.traceItem.nodeRemark = '111111'
  //   mockSuccess('post', completeTaskUrl, completeTaskParams, mockcompleteTaskUrl)
  //   const $ref = vm.getBaseView()
  //   const doReleaseOrder = jest.fn()
  //   $ref.doReleaseOrder = $ref.$options.methods.doReleaseOrder = doReleaseOrder
  //   comp.wrapper.setMethods({
  //     doValidate() {
  //       return true
  //     }
  //   })
  //   await vm.doReleaseSave()
  //   expect(doReleaseOrder).toBeCalled()
  //   expect(doReleaseOrder).toBeCalledWith({
  //     applyNo: 'FZC0120190227015',
  //     productId: 'SLY_YSL_YJY_CSH',
  //     productName: '及时贷（交易赎楼）',
  //     'applyStatus': 'applycheckinterviewed',
  //     'applyTime': 1551260191000,
  //     'branchId': '591000',
  //     'buyerName': '江富华',
  //     'buyerPhone': '99999999',
  //     'channel': '',
  //     'cityNo': '',
  //     'followUpUserid': '',
  //     'followUpUsername': '',
  //     'groupApplyNo': '',
  //     'houseNo': '20190200065731',
  //     'id': '20000046615717',
  //     'manCheckFirst': 'N',
  //     'partnerBankId': '',
  //     'partnerBankName': '',
  //     'partnerInsuranceId': 'BHXT',
  //     'partnerInsuranceName': '渤海信托',
  //     'preliminaryResult': 'P',
  //     'relateApplyNo': '',
  //     'relateType': '',
  //     'robTime': 1552880200000,
  //     'robUserId': '10000023520703',
  //     'robUserName': '叶俊荣',
  //     'salesBranchId': '591111',
  //     'salesUserId': '10000027072652',
  //     'salesUserName': '赵红宇',
  //     'sellerCardNo': '440304198511089999',
  //     'sellerCardType': '',
  //     'sellerName': '吴富,张丽娜丽娜',
  //     'sellerPhone': '99999999',
  //     'serviceType': '',
  //     'thirdpartyName': '',
  //     'thirdpartyNo': ''
  //   })
  // })

  it('doManCheckAgree 测试', async () => {
    const checkAgreeUrl = '/bpmsx/order/interview/manCheckAgree'
    const checkAgreeParams = {applyNo: 'FZC0120190227015', operateType: 'agree'}
    const mockCheckAgreeUrl = 'bpmsx_order_interview_manCheckAgree'
    mockSuccess('post', checkAgreeUrl, checkAgreeParams, mockCheckAgreeUrl)
    const doManCheckAgreeResult = jest.fn()
    const testRequestOrderInfo = jest.fn()
    const requestOrderInfo = function () {
      return new Promise(resolve => {
        testRequestOrderInfo()
        resolve()
      })
    }
    comp.wrapper.setMethods({
      doManCheckAgreeResult,
      requestOrderInfo
    })
    await vm.doManCheckAgree()
    expect(doManCheckAgreeResult).toBeCalled()
    expect(testRequestOrderInfo).toBeCalled()
  })

  it('orderReleaseSuccess 测试', async () => {
  })
})
