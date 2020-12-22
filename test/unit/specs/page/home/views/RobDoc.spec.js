import { shallowMount } from '@vue/test-utils'
import Component from '@test/utils/Component'
import RobDocComponent from '@/page/home/views/rob-doc.vue'
import userInfo from '@mock/http/userinfo'
import mockApi from '@/api/mock'

/**
 * 1. 测试HTTP参数、方法是否满足
 * 2. 测试数据返回时状态的更新
 * 3. 刷新时状态更新是否正常
 */
describe('#run RobDoc 列表接口测试', () => {
  let comp = null
  const $store = window.$store
  const roblistData = 'bpmsx_order_appoint_v1_roblist'
  const urlRoblist = '/bpmsx/order/appoint/v1/roblist'
  const productParams = {
    'pageNumber': 1,
    'pageSize': 999,
    'ignoreKey': 'PAD_IGNORE_PRODUCT'
  }

  const robListParams = {
    'pageNumber': 1,
    'pageSize': 11,
    'beforeSend': 1,
    'companyCode': '755121',
    'queryKeyWord': '',
    'productId': '',
    'orderBy': 'appointTime',
    'orderType': 'desc',
    'applyStatus': [],
    'appointMatterKey': '',
    'appointTimeSearchBegin': '',
    'appointTimeSearchEnd': ''
  }

  beforeAll(async () => {    
    await $store.commit('setLoginData', userInfo)
  })

  beforeEach(() => {    
    mockSuccess('post', '/bpmsx/product/v1/listPublic', productParams, 'bpmsx_product_v1_listPublic')
    mockSuccess('post', urlRoblist, robListParams, roblistData)
    comp = new Component(shallowMount(RobDocComponent))
  })

  it('HTTP参数是否正确', async () => {
    await delay(1000)

    expect(comp.vm.dataList.length).toBe(11)
    expect(comp.vm.total).toBe(52)
    expect(comp.vm.pageNumber).toBe(1)
    expect(comp.vm.pageCount).toBe(5)
    expect(comp.vm.pageSize).toBe(11)
  })

  it('根据产品名称进行过滤', async () => {
    const columns = comp.vm.columns
    const productCol = columns.find(col => col.key === 'productName')
    await nextTick()
    mockSuccess('post', urlRoblist, {...robListParams, productId: 'SLY_YSL_YJY_CSH'}, roblistData)
    productCol.filter.input('SLY_YSL_YJY_CSH')
    await nextTick()
    expect(comp.vm.total).toBe(52)
  })

  it('根据预约节点进行过滤', async () => {
    const columns = comp.vm.columns
    const matterCol = columns.find(x => x.key === 'matterName')
    await nextTick()
    mockSuccess('post', urlRoblist, {...robListParams, appointMatterKey: 'Interview'}, roblistData)
    matterCol.filter.input('Interview')
    await nextTick()
    expect(comp.vm.total).toBe(52)
  })

  it('根据订单状态进行过滤', async () => {
    const columns = comp.vm.columns
    let applyStatusCol = columns.find(x => x.key === 'applyStatusF')
    await nextTick()
    mockSuccess('post', urlRoblist, {...robListParams, applyStatus: ['approvalresult']}, roblistData)
    applyStatusCol.filter.input('approvalresult')
    expect(comp.vm.total).toBe(52)
  })

  it('根据预约时间进行过滤', async () => {
    await nextTick()
    mockSuccess('post', urlRoblist,
      {...robListParams,
        appointTimeSearchBegin: '2019-02-14 00:00:00',
        appointTimeSearchEnd: '2019-02-14 23:59:59'}, roblistData)

    comp.vm.params.appointTimeSearchBegin = '2019-02-14'
    await comp.vm.doSearch()
    expect(comp.vm.total).toBe(52)
  })

  it('根据查询字符串进行过滤', async () => {
    // await delay(1000)
    await nextTick()
    mockSuccess('post', urlRoblist, {...robListParams, queryKeyWord: 'abc'}, roblistData)
    comp.vm.params.queryKeyWord = 'abc'
    await comp.vm.doSearch()
    expect(comp.vm.total).toBe(52)
  })

  it('翻页后的状态验证', async () => {
    const pageNumber = 2
    const robListParamsPage2 = {...robListParams, pageNumber}
    mockSuccess('post', urlRoblist, robListParamsPage2, roblistData)
    await comp.vm.loadPageData({...comp.vm.params, pageNumber})
    // 这里要求 pagingMode 是 single, 每次翻页后都是 10 条
    expect(comp.vm.dataList.length).toBe(11)
    expect(comp.vm.pageNumber).toBe(2)
    // 第二页的数据下标从 11 开始
    expect(comp.vm.dataList[0].num).toBe(12)
  })
})
