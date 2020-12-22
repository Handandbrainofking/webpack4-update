<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
    <d-table :head-list="headList" :no-data="noData" :body-height="100" :fix-width="true" :fix-left-column="2"
      :body-list="bodyList" :enable-load-more="false" @loadFresh="refreshPage">
      <d-table-line-cell slot="DTableBody" slot-scope="bodyData" :list="bodyData.list" :style="bodyData.cellStyle"  :enable-load-more="false"
        :index="bodyData.index" :item="bodyData.item" :fix-width="bodyData.fixWidth" :body-height="bodyData.bodyHeight"></d-table-line-cell>
    </d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
  </d-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PageLoaderMixins from '@/mixins/page'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: 'undoOrderListSummary',
  statistics: 'undoOrderListSummary|订单管理-未完成业务-进度',
  mixins: [PageLoaderMixins],
  props: {
    params: {
      type: Object,
      default: () => ({
        productId: '',
        queryKeyword: ''
      })
    }
  },
  data() {
    return {
      requestListKey: 'order_summary_list',
      idKey: 'applyNo',
      headList: [
        {
          title: '姓名',
          width: 150
        },
        {
          title: '产品名称',
          width: 300,
          filter: {
            items: () => this.padProducts,
            input: val => {
              this.params.productId = val
              this.doSearch()
            },
            value: () => this.params.productId || ''
          }
        },
        {
          title: '面签',
          width: 300
        },
        {
          title: '报审',
          width: 300
        },
        {
          title: '托管',
          width: 300
        },
        {
          title: '预约赎楼',
          width: 300
        },
        {
          title: '核同贷',
          width: 300
        },
        {
          title: '审查/审批',
          width: 300
        },
        {
          title: '账户测试',
          width: 300
        },
        {
          title: '查档',
          width: 300
        },
        {
          title: '录入完成',
          width: 300
        },
        {
          title: '外传指令推送',
          width: 300
        },
        {
          title: '资料外传',
          width: 300
        },
        {
          title: '放款指令推送',
          width: 300
        },
        {
          title: '发送放款指令',
          width: 300
        },
        {
          title: '赎楼登记',
          width: 300
        },
        {
          title: '取注销资料',
          width: 300
        },
        {
          title: '过户递件',
          width: 300
        },
        {
          title: '抵押递件',
          width: 300
        },
        {
          title: '确认回款资金到账',
          width: 300
        }
      ],
      bodyList: [],
      currentPage: 1,
      perNum: 12
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
    this.reset = this.doSearch.bind(this)
    this.$eventHub.$on('BroadcastChangedOrganization', this.reset)
  },
  methods: {
    ...mapActions(['loadPadProducts']),
    formatListData(tData) {
      return tData.map(item => {
        const list = item.matterStatusList
        const obj = Object.assign({}, item, { matterStatusList: null })
        list.forEach(itm => {
          if (obj[itm.matterKey] && obj[itm.matterKey]['status'] === 'finished') {
            return true
          }
          obj[itm.matterKey] = {
            status: itm.status,
            handleUserName: itm.handleUserName
          }
        })
        return obj
      })
    },
    // 搜索
    doSearch() {
      this.requestList(this.currentPage = 1)
    },
    changePage(data) {
      let action = data.action
      if(action === 'first') {
        native_eventStatistic('undoOrderListSummaryPageFirst', '未完成进度-首页undoOrderListSummary.v')        
      } else if(action === 'prev') {
        native_eventStatistic('undoOrderListSummaryPagePrev', '未完成进度上一页undoOrderListSummary.v')     
      } else {
        native_eventStatistic('undoOrderListSummaryPageNext', '未完成进度下一页undoOrderListSummary.v')     
      }
    }
  }
}
</script>
