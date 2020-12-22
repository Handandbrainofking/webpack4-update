<template>
  <d-layout kind="column"
    text-align="initial"
    vertical-align="initial">
    <d-table
      :enable-load-more="false"
      :head-list="headList"
      :body-list="bodyList"
      :no-data="noData"
      :cell-key="idKey"
      :show-tag="showTag"
      :body-height="100"
      :swipe-btn="swipeBtn"
      :filterParams="params"
      @search="onTableFilter"
      @clickSwipeBtn="actionClick"
      @clickHead="doClickHeadTitle"
      @clickCell="doClickListItem"
      @clickCellBtn="btnClick"
      @loadMore="loadMore"
      @loadFresh="refreshPage"></d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
    <release-order :data-item="chooseItem"
      v-model="releaseOrder.show"
      @orderReleaseSuccess="orderReleaseSuccess"
      v-if="releaseOrder.show"></release-order>
    <reserve-information :data-item="chooseItem"
      v-model="reserveInformation.show"
      @orderBookSuccess="orderBookSuccess"
      v-if="reserveInformation.show"></reserve-information>
  </d-layout>
</template>

<script>
import WxcDialog from '../../../components/dialog/dialog.vue'
import ReleaseOrder from '../../../components/dialog/release-order.vue'
import ReserveInformation from '../../../components/dialog/reserve-information.vue'
import { TrackOrderView } from '../../../router/defined'
import PageLoaderMixins from '../../../mixins/page'
import { native_eventStatistic } from '@/utils/deal_native'
import { DISC_ASSOCIATE_TYPE, Dist_List_Get } from '@/config'

export default {
  name: 'person-track-doc-detail',
  statistics: 'person-track-doc-detail|首页-跟单池-明细',
  components: {
    WxcDialog,
    ReleaseOrder,
    ReserveInformation
  },
  mixins: [PageLoaderMixins],
  props: {
    applyNoAhead: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => ({
        productId: '',
        queryKeyword: '',
        applyStatus: ['']
      })
    },
    products: {
      type: Array
    }
  },
  data() {
    return {
      showTag: true,
      requestListKey: 'home_track_list_detail',
      idKey: 'applyNo',
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
          title: '产品名称',
          width: 3,
          key: 'productName',
          filterKey:'productId',
          filterList: () => this.products
        },
        {
          title: '合作机构',
          width: 1.8,
          key: 'partnerInsuranceName'
        },
        {
          title: '预计用款时间',
          width: 3,
          key:'preUseAmountDate',
          formatter:'date:YYYY-MM-DD'
        },
        {
          title: '订单状态',
          width: 2,
          key:'applyStatus',
          formatter: 'dict:orderStatus',
          filterKey:'applyStatus',
          filterList:'orderStatus'
        },
        {
          title: '关联标签',
          width: 2,
          key: item => {
            let list = Dist_List_Get(DISC_ASSOCIATE_TYPE).concat({ key: 'MAIN', name: '主订单' })
            for (let i in list) {
              if (list[i].key === item.relateType) {
                return list[i].name
              }
            }
          }
        },
        {
          title: '抢单时间',
          width: 3,
          key:'robTime',
          formatter:'date:YYYY-MM-DD'
        },
        {
          title: '操作',
          width: 3,
          isBtns: true,
          btns: [
            {
              title: '释放',
              type:'default',
              style:{
                marginRight:'40px'
              }
            },
            {
              title: '预约',
              type:'primary'
            }
          ]
        }
      ],
      bodyList: [],
      total: 0,
      currentPage: 1,
      chooseItem: {},
      releaseOrder : {
        show: false
      },
      reserveInformation: {
        show: false
      },
      isLoaded: false,
      swipeBtn: [
        {
          ico(item){
            return !item.top && 'icon-set-top'
          },
          title: function (item) {
            return item.top ? '取消置顶' : '置顶'
          },
          style: {
            backgroundColor: '#54A0FF',
          }
        }
      ]
    }
  },
  beforeMount() {
    this.$eventHub.$on('BroadcastChangedOrganization', this.resetRequest)
    this.$eventHub.$on('BroadcastRobOrder', this.resetRequest) // 抢单广播
  },
  onDataLoaded(data) {
    if (!this.isLoaded) {
      this.clearParams()
      // 提交页面加载性能统计
      this.commitStastics()
    }
    this.isLoaded = true
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
    this.$eventHub.$off('BroadcastChangedOrganization', this.resetRequest)
    this.$eventHub.$off('BroadcastRobOrder', this.resetRequest)
  },
  watch: {
    total: function(val, oldVal) {
      this.$emit('changeTotalNumber', val)
    }
  },
  methods: {
    resetRequest() {
      this.currentPage = 1
      this.requestList(this.currentPage)
    },
    doClickListItem(index, item) {
      native_eventStatistic('trackOrder', '订单详情（personTrackDocDetail.vue）')
      this.jump(//TODO:lcl 可以参考一下 vue-router 的写法，这里面写得有点复杂
        TrackOrderView,
        false,
        true,
        {
          applyNo: item.applyNo,
          matter: item.matterKey,
          productId: item.productId,
          sellerName: item.sellerName,
          productName: item.productName,
          from: 'track'
        },
        {
          type: 1,
          searchParams: encodeURIComponent(JSON.stringify(this.params)),
          pageSize: this.perNum,
          currentPage: this.currentPage
        }
      )
    },
    onTableFilter(params){
      if(params.key === 'applyStatus'){
        if (params.value) {
          this.params.applyStatus = [params.value]
        } else {
          this.params.applyStatus = []
        }
      }

      this.doSearch()
    },
    // 搜索
    doSearch() {
      // 设置参数中的分面大小

      
      let perNum = this.perNum
      if (!this.isLoaded) {
        const pageSize = this.getPageParams('pageSize', true)
        this.perNum = pageSize || perNum
        this.currentPage = this.getPageParams('currentPage', true) || 1
      } else {
        this.currentPage = 1
      }
      this.requestList(this.currentPage)
      // this.perNum = pageSize // 重置分页大小
    },
    btnClick(idx, item, btn) {
      this.chooseItem = item
      switch (btn.title) {
        case '释放':
          native_eventStatistic('orderRelease', '跟单池释放（personTrackDocDetail.vue）')
          this.releaseOrder.show = true
          break
        case '预约':
          native_eventStatistic('orderBook', '跟单池预约（personTrackDocDetail.vue）')
          this.reserveInformation.show = true
          break
      }
    },
    orderBookSuccess() {
      // 预约
      this.currentPage = 1
      this.requestList(this.currentPage)
    },
    orderReleaseSuccess() {
      // 释放成功
      this.currentPage = 1
      this.requestList(this.currentPage)
    },
    doClickHeadTitle(index) {
      if (index === 4) {
        this.params.orderBy = 'preUseAmountDate'
        this.params.orderType = this.params.orderType === 'asc' ? 'desc' : 'asc'
        this.currentPage = 1
        this.requestList(this.currentPage)
      } else if (index === 7) {
        this.params.orderBy = 'robTime'
        this.params.orderType = this.params.orderType === 'asc' ? 'desc' : 'asc'
        this.currentPage = 1
        this.requestList(this.currentPage)
      }
    },
    changePage(data) {
      let action = data.action
      if(action === 'first') {
        native_eventStatistic('trackDetailPageFirst', '跟单池明细-首页（person-track-doc.vue）')
      } else if(action === 'prev') {
        native_eventStatistic('trackDetailPagePrev', '跟单池明细上一页（person-track-doc.vue）')
      } else {
        native_eventStatistic('trackDetailPageNext', '跟单池明细下一页（person-track-doc.vue）')
      }
    },
    actionClick(index, item) {
      if(item.top) {
        native_eventStatistic('trackDetailCancelTop', '跟单池-明细-取消置顶')
      }else {
        native_eventStatistic('trackDetailTop', '跟单池-明细-置顶')
      }
      this.requestApi.home_track_set_top({
        data: {
          applyNo: item.applyNo,
          isTop: !item.top
        },
        success: data => {
          this.requestList(this.currentPage = 1)
        }
      })
    }
  }
}
</script>
