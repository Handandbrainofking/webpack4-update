<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
    <d-table :body-height="100" :enable-load-more="false" :head-list="headList" :body-list="bodyList" :no-data="noData"
      :cell-key="rowKey" @clickHead="doClickHeadTitle" @clickCellBtn="doClickBtn" @clickCell="doClickListItem"
      @loadMore="loadMore" @loadFresh="refreshPage"></d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
    <assign-view ref="assignView" :show.sync="isShowAssignView"></assign-view>
    <task-order-info v-model="showOrderInfo" :orderId="applyNo"></task-order-info>
  </d-layout>
</template>

<script>
import AssignView from '@/page/home/views/assign-view'
import PageLoaderMixins from '@/mixins/page'
import TaskOrderInfo from '@/page/task/components/common/order-info.vue'
import { mapGetters, mapActions, mapState } from 'vuex'
import { native_eventStatistic } from '@/utils/deal_native'
import { Dist_List_Get, DISC_ORDER_STATUS } from '@/config/index'

export default {
  name: '',
  statistics: 'undoOrderListDetail|订单管理-未完成业务-明细',
  mixins: [PageLoaderMixins],
  components: {
    AssignView,
    TaskOrderInfo
  },
  props: {
    searchList: {
      type: Array
    },
    params: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['isYYZG']), // 是否运营主管
    ...mapState(['padProducts'])
  },
  created() {
    this.statusList = Dist_List_Get(DISC_ORDER_STATUS)
  },
  mounted() {
    this.loadPadProducts().then(()=>{
      //  提交到百度统计
      this.commitStastics()
    })
    this.$eventHub.$on('BroadcastChangedOrganization', this.doSearch)
  },
  data() {
    return {
      requestListKey: 'order_management_list',
      rowKey: 'taskId',
      applyNo: '',
      showOrderInfo: false,
      perNum: 12,
      headList: [
        { title: '订单编号', width: 3, key: 'applyNo' },
        {
          title: '产品名称',
          width: 3,
          key: 'productName',
          filter: {
            items: () => this.padProducts,
            input: val => {
              this.params.productId = val
              this.doSearch()
            },
            value: () => this.params.productId || ''
          }
        },
        { title: '客户姓名', width: 2, key: 'sellerName' },
        { title: '运营跟单人', width: 3, key: 'robUserName' },
        { title: '合作机构', width: 3, key: 'partnerInsuranceName' },
        {
          title: '状态',
          width: 2,
          key: 'applyStatus',
          filter: {
            items: () => Dist_List_Get(DISC_ORDER_STATUS),
            input: val => {
              if (val) {
                this.params.applyStatus = [val]
              } else {
                this.params.applyStatus = []
              }
              this.doSearch()
            },
            value: () => {
              return this.params.applyStatus[0] || ''
            }
          }
        },
        { title: '创建时间', width: 3, key: 'createTimeF' },
        {
          title: '操作',
          width: 2,
          isBtns: true,
          show: () => this.isYYZG,
          btns: [
            {
              title: '派单',
              type: 'default'
            }
          ]
        }
      ],
      bodyList: [],
      total: 0,
      assignOrder: {},
      isShowAssignView: false,
      statusList: []
    }
  },
  watch: {
    total: function(val, oldVal) {
      this.$emit('changeTotalNumber', val)
    }
  },
  methods: {
    ...mapActions(['loadPadProducts']),
    doSearch() {
      this.requestList(this.currentPage = 1)
    },
    // 处理返回的列表数据
    formatListData(items) {
      return items.map(item => {
        if (typeof item.createTime === 'string') {
          item.createTime = item.createTime.replace(/-/g, '/') // 部分浏览器不支持 2018-01-01 的格式，但都支持 2018/01/01的格式
        }
        item.createTimeF = this.formatDate(item.createTime)
        item.applyStatus = this.getNamebyKey(this.statusList, item.applyStatus)
        return item
      })
    },
    getNamebyKey(list, key) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].key === key) {
          return list[i].name
        }
      }
    },
    doClickBtn(index, item, btn, bIdx) {
      if (bIdx === 0) {
        // 派单
        native_eventStatistic('undoOrderListAssign', '订单管理未完成业务派单（undoOrderList.vue）')
        this.assignOrder = item
        this.$refs.assignView.initView(item.applyNo, item.matterKey, item.matterName)
        this.isShowAssignView = true
      }
    },
    doClickListItem(index, item) {
      native_eventStatistic('undoOrderListBasicInfo', '未完成业务基本信息（undoOrderList.vue）')
      this.applyNo = item.applyNo
      this.showOrderInfo = true
    },
    doClickHeadTitle(index) {
      if (index === 6) {
        this.params.orderType = this.params.orderType === 'asc' ? 'desc' : 'asc'
        this.requestList(this.currentPage = 1)
      }
    },
    changePage(data) {
      let action = data.action
      if(action === 'first') {
        native_eventStatistic('undoOrderListDetailPageFirst', '未完成明细-首页undoOrderListDetail.v')        
      } else if(action === 'prev') {
        native_eventStatistic('undoOrderListDetailPagePrev', '未完成明细-上一页undoOrderListDetail.v')     
      } else {
        native_eventStatistic('undoOrderListDetailPageNext', '未完成明细-下一页undoOrderListDetail.v')     
      }
    }
  }
}
</script>
