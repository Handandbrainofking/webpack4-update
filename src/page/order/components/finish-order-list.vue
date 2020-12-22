<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
     <d-search>
      <d-search-input v-model="params.queryKeyword" @search="doSearch" placeholder="订单编号/客户姓名/跟单人"></d-search-input>
    </d-search>
    <d-table :body-height="100" :enable-load-more="false" :head-list="headList" :body-list="bodyList" :no-data="noData"
      :cell-key="rowKey" @clickHead="doClickHeadTitle" @clickCell="doClickListItem" @loadMore="loadMore" @loadFresh="refreshPage"></d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
    <task-order-info v-model="showOrderInfo" :orderId="applyNo"></task-order-info>
  </d-layout>
</template>

<script>
import PageLoaderMixins from '@/mixins/page'
import TaskOrderInfo from '@/page/task/components/common/order-info.vue'
import { mapActions, mapState } from 'vuex'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: '',
  statistics: 'finish-order-list|订单管理-已完成业务',
  mixins: [PageLoaderMixins],
  components: {
    TaskOrderInfo
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
        // { title: "运营跟单人", width: 3, key: "robUserName" },
        { title: '合作机构', width: 3, key: 'partnerInsuranceName' },
        { title: '创建时间', width: 3, key: 'createTimeF' },
        { title: '完结时间', width: 3, key: 'completeTimeF' }
      ],
      bodyList: [],
      total: 0,
      params: {
        isOver: true,
        orderBy: 'createTime',
        orderType: 'desc'
      }
    }
  },
  computed: {
    ...mapState(['padProducts'])
  },
  mounted() {
    this.loadPadProducts().then(()=>{
      //  提交到百度统计
      this.commitStastics()
    })
    this.doSearch()
    this.$eventHub.$on('BroadcastChangedOrganization', this.doSearch)
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
        if (typeof item.completeTime === 'string') {
          item.completeTime = item.completeTime.replace(/-/g, '/') // 部分浏览器不支持 2018-01-01 的格式，但都支持 2018/01/01的格式
        }
        item.createTimeF = this.formatDate(item.createTime)
        item.completeTimeF = this.formatDate(item.completeTime)
        return item
      })
    },
    doClickListItem(index, item) {
      native_eventStatistic('finishOrderListBasicInfo', '已完成业务基本信息（finishOrderList.vue）')
      this.applyNo = item.applyNo
      this.showOrderInfo = true
    },
    doClickHeadTitle(index) {
      if (index === 4) {
        this.params.orderBy = 'createTime'
        this.params.orderType = this.params.orderType === 'asc' ? 'desc' : 'asc'
        this.requestList(this.currentPage = 1)
      }
    },
    changePage(data) {
      let action = data.action
      if(action === 'first') {
        native_eventStatistic('finishOrderListPageFirst', '已完成订单首页（finish-order-list.vue）')
      } else if(action === 'prev') {
        native_eventStatistic('finishOrderListPagePrev', '已完成订单-上一页finish-order-list.vue')
      } else {
        native_eventStatistic('finishOrderListPageNext', '已完成订单-下一页finish-order-list.vue')
      }
    }
  }
}
</script>
