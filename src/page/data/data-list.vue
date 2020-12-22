<template>
  <div :style="{visibility: isShow?'visible': 'hidden'}" class="data-list">
    <div>
      <div class="title-wrap">
        <text class="title">资料管理</text>
      </div>
      <d-search>
        <d-search-input v-model="params.queryKeyword" @search="doSearch" placeholder="订单编号/客户姓名/渠道经理"></d-search-input>
      </d-search>
    </div>
    <d-table    
       :enable-load-more="false"
       :head-list="headList"
       :body-list="bodyList"
       :no-data="noData"
       :cell-key="rowKey"
       :body-height="100" 
       @clickCell="doClickListItem"
       @loadMore="loadMore"
       @loadFresh="refreshPage"
    ></d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { DataDetail } from '../../router/defined'
import PageLoaderMixins from '../../mixins/page'
import { Dist_List_Get, DISC_ORDER_STATUS } from '@/config'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: 'data-list',
  statistics: 'data-list|资料管理',
  components: {

  },
  mixins: [PageLoaderMixins],
  data() {
    return {
      requestListKey: 'data_list',
      rowKey: 'applyNo',
      headList: [
        {
          title: '订单编号',
          width: 1,
          key: 'applyNo'
        },
        {
          title: '产品名称',
          width: 1,
          key: 'productName',
          filter: {
            items: () => this.padProducts,
            input: val => {
              this.params.productId = val
              this.requestList(this.currentPage = 1)
            },
            value: () => this.params.productId || ''
          }
        },
        {
          title: '客户姓名',
          width: 1,
          key: 'sellerName'
        },
        {
          title: '渠道经理',
          width: 1,
          key: 'salesUserName'
        },
        {
          title: '状态',
          width: 1,
          key: item => {
            var statusList = Dist_List_Get(DISC_ORDER_STATUS)
            for (var i = 0; i < statusList.length; i++) {
              if (statusList[i].key === item.applyStatus) {
                return statusList[i].name
              }
            }
          }
        }
      ],
      bodyList: [],
      isShow: false,
      perNum: 12,
      params: {
        queryKeyword: '',
        productId: ''
      },
      isLoaded: false
    }
  },
  computed: {
    ...mapState(['padProducts'])
  },
  created() {
    this.reset = this.resetMethod.bind(this)
    this.$eventHub.$on('BroadcastChangedOrganization', this.reset)
    // 设置搜索条件
    this.params = Object.assign({}, this.params, this.$store.state.search.searchParams)
    this.clearSearchParams()
    this.loadPadProducts()
    // 处理pageSize
    const pageSize = this.params.pageSize
    const perNum = this.perNum
    this.perNum = pageSize || perNum
    const currentPage = this.currentPage = this.params.currentPage || 1
    // setTimeout(() => {
      this.isShow = true
      this.requestList(currentPage)
    // }, 100)
  },
  onDataLoaded(data) {
    if (!this.isLoaded) {
      //  提交到百度统计
      this.commitStastics()
    }
    this.isLoaded = true
  },
  methods: {
    ...mapActions(['loadPadProducts']),
    resetMethod() {
      this.requestList(this.currentPage = 1)
    },
    doSearch() {
      this.requestList(this.currentPage = 1)
    },
    doClickListItem(index, item) {
      this.jump(
        DataDetail,
        false,
        true,
        {orderId: item.applyNo, name: encodeURIComponent(item.sellerName), productId: item.productId},
        {
          hash_url: encodeURIComponent(this.$route.path),
          searchParams: encodeURIComponent(JSON.stringify(Object.assign({}, this.params, { pageSize: this.perNum, currentPage: this.currentPage })))
        }
      )
    },
    changePage(data) {
      let action = data.action
      if(action === 'first') {
        native_eventStatistic('dataListPageFirst', '资料管理-首页（data-list.vue）')        
      } else if(action === 'prev') {
        native_eventStatistic('dataListPagePrev', '资料管理-上一页（data-list.vue）')     
      } else {
        native_eventStatistic('dataListPageNext', '资料管理-下一页（data-list.vue）')     
      }
    }
  },
  beforeDestroy() {
    this.$eventHub.$off('BroadcastChangedOrganization', this.reset)
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  .data-list {
    background-color: white;
  }
  .title-wrap {
    padding-top: $normal_gap_root_column;
    padding-bottom: $normal_gap_bottom;
    padding-left: $normal_gap_root_column;
    flex-direction: row;
    align-items: flex-end;
  }
  .title {
    font-size: $font_title;
    color: $color_nav;
  }
</style>
