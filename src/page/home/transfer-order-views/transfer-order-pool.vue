<template>
  <div class="column">
    <d-search>
      <d-search-input
        v-model="params.queryKeyWord"
        @search="doSearch"
        placeholder="订单编号/客户姓名/渠道经理"
      ></d-search-input>
    </d-search>
    <d-table
      :load_more="load_more"      
      :enable-load-more="false"
      :head-list="headList"
      :body-list="bodyList"
      :no-data="noData"
      :show-tag="true"
      :body-height="100"
      cell-key="taskId"
      :filterParams="params"
      @search="doSearch"
      @clickHead="doClickHeadTitle"
      @clickCell="doClickCell"
      @clickCellBtn="doClickCellBtn"
      @loadMore="loadMore"
      @loadFresh="refreshPage"
    ></d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
    <collect-order-dialog
      :applyNo="collectOrderItem.applyNo"
      :matterKey="collectOrderItem.matterKey"
      :show="showCollectOrderDialog"
      v-if="showCollectOrderDialog"
      @commit="doCollectOrder"
      @cancel="cancelCollectOrder"
    ></collect-order-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PageLoaderMixins from '@/mixins/page'
import { InterviewListKind } from '@/config'
import { TrackOrderView } from '@/router/defined'
import CollectOrderDialog from '@/page/home/transfer-order-views/collect-order-dialog.vue'
import { native_eventStatistic } from '@/utils/deal_native'

const matterList = InterviewListKind

export default {
  statistics: 'transfer-order-pool|首页-转单池',
  components: { CollectOrderDialog },
  mixins: [PageLoaderMixins],
  props: {
    applyNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      requestListKey: 'home_transfer_order',
      headList: [
        {
          title: '序号',
          width: 1,
          key: 'num'
        },
        {
          title: '客户姓名',
          width: 2,
          key: 'sellerName'
        },
        {
          title: '渠道经理',
          width: 2,
          key: 'salesUserName'
        },
        {
          title: '产品名称',
          width: 3,
          key: 'productName',
          filterKey:'productId',
          filterList: () => this.padProducts
        },
        {
          title: '转单人',
          width: 2,
          key: 'appointUserName'
        },
        {
          title: '转单事项',
          width: 3,
          key: 'matterName',
          filterKey:'matterKey',
          filterList: 'InterviewListKind'
        },
        {
          title: '预约时间',
          width: 3,
          key: item => {
            return item['appointTime'].slice(0, 16)
          }
        },
        {
          title: '预约地点',
          width: 3,
          key: 'appointAddress'
        },
        {
          title: '操作',
          width: 2,
          isBtns: true,
          btns: [
            {
              title: '收单',
              type:'default'
            }
          ]
        }
      ],
      bodyList: [],
      params: {
        queryKeyWord: '',
        matterKey: matterList[0].key,
        productId: '',
        orderBy: 'appointTime',
        orderType: 'desc'
      },
      total: 0,
      isLoaded: false,
      matterList: matterList,
      showCollectOrderDialog: false,
      collectOrderItem: {}
    }
  },
  computed: {
    ...mapState(['padProducts'])
  },
  created() {
    this.params = Object.assign({}, this.params, this.$store.state.search.searchParams)
    this.$store.commit('clearSearchParams')
    if (this.applyNo) {
      this.params.queryKeyword = this.applyNo
    }
    this.loadPadProducts()
    this.broadcastDataUpdate()
  },
  mounted() {
    this.backToLastPageLikeBeforeInPageSize()
  },
  onDataLoaded(data) {
    if (!this.isLoaded) {
      // 提交页面加载性能统计
      this.commitStastics()
    }
    this.isLoaded = true
  },
  watch: {
    total: function(val, oldVal) {
      this.$emit('changeTotalNumber', val)
    }
  },
  methods: {
    ...mapActions(['loadPadProducts']),
    broadcastDataUpdate() {
      const reset = (this.reset = this.resetMethod.bind(this))
      const $eventHub = this.$eventHub
      $eventHub.$on('BroadcastChangedOrganization', reset)
      $eventHub.$on('BroadcastTransferOrderSuccess', reset)
      $eventHub.$on('BroadcastCollectOrderSuccess', reset)
    },
    resetMethod() {
      this.requestList(this.currentPage = 1)
    },
    backToLastPageLikeBeforeInPageSize() {
      // 处理pageSize
      const pageSize = this.params.pageSize
      const perNum = this.perNum
      this.perNum = pageSize || perNum
      const currentPage = this.currentPage = this.params.currentPage || 1
      this.requestList(currentPage)
    },
    doSearch() {
      this.requestList(this.currentPage = 1)
      native_eventStatistic('searchTransferOrderPool', '转单池-搜索（transfer-order-pool.vue）')
    },
    doClickHeadTitle(titleIndex) {
      if (titleIndex === 6) {
        this.params.orderType = this.params.orderType === 'asc' ? 'desc' : 'asc'
        this.requestList(this.currentPage = 1)
      }
    },
    doClickCell(index, item) {
      this.jump(
        TrackOrderView,
        false,
        true,
        {
          applyNo: item.applyNo,
          productId: item.productId,
          sellerName: item.sellerName,
          productName: item.productName,
          matterKey: item.matterKey,
          matterName: item.matterName,
          grabOrderShow: true,
          collectOrderButtonShow: true
        },
        {
          type: 2,
          searchParams: encodeURIComponent(JSON.stringify(Object.assign({}, this.params, {pageSize: this.perNum, currentPage: this.currentPage})))
        }
      )
    },
    doClickCellBtn(index, item) {
      this.collectOrderItem.applyNo = item.applyNo
      this.collectOrderItem.matterKey = item.matterKey
      this.showCollectOrderDialog = true
    },
    doCollectOrder() {
      native_eventStatistic('transferOrderPoolCollectOrder', '转单池-收单transfer-order-pool.vue')
      this.requestApi.collect_order_matter({
        data: {
          applyNo: this.collectOrderItem.applyNo,
          matterKey: this.collectOrderItem.matterKey
        },
        success: data => {
          this.$eventHub.$emit('BroadcastCollectOrderSuccess')
          this.showCollectOrderDialog = false
        }
      })
    },
    cancelCollectOrder() {
      this.showCollectOrderDialog = false
    },
    changePage(data) {
      let action = data.action
      if(action === 'first') {
        native_eventStatistic('transferOrderPoolPageFirst', '转单池-首页transfer-order-pool.vue')
      } else if(action === 'prev') {
        native_eventStatistic('transferOrderPoolPagePrev', '转单池-上一页transfer-order-pool.vue')
      } else {
        native_eventStatistic('transferOrderPoolPageNext', '转单池-下一页transfer-order-pool.vue')
      }
    }
  }
}
</script>
<!-- // TODO 对于布局样式， 建议采用组件 d-layout 保证样式的重复引用，减少样式的引入 -->
<style lang="scss" scoped>
.column {
  flex-direction: column;
  flex: 1;
}
</style>
