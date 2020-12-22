<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
    <d-search>
      <d-search-input v-model="params.queryKeyword" @search="doSearch" placeholder="客户姓名/要件号码"></d-search-input>
    </d-search>
    <d-table :body-height="100" :enable-load-more="false" :head-list="headList" :body-list="bodyList" :no-data="noData"
      :cell-key="rowKey" @loadFresh="refreshPage"></d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
  </d-layout>
</template>

<script>
import PageLoaderMixins from '@/mixins/page'
import { IMPORT_DOC_EVENT_STATUS,IMPORT_DOC_TYPE, Dist_List_Get } from '@/config/index'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: 'borrow-list',
  statistics: 'borrowList|要件管理-外借记录',
  mixins: [PageLoaderMixins],
  created() {
    this.statusList = Dist_List_Get(IMPORT_DOC_EVENT_STATUS)
  },
  beforeMount() {
    this.requestList(this.currentPage = 1)
    this.$eventHub.$on('BroadcastChangedOrganization', this.doSearch)
  },
  data() {
    return {
      requestListKey: 'important_doc_borrow_list',
      rowKey: 'taskId',
      headList: [
        { title: '要件编号', width: 3, key: 'essentialId' },
        { title: '要件名称', width: 2, key: 'accountType' },
        { title: '要件所属人', width: 3, key: 'essentialOwnerName' },
        { title: '要件号码', width: 3, key: 'accountNo' },
        {
          title: '状态',
          width: 2,
          color: item => {
            return this.formatStatusColor(item['status'])
          },
          key: item => {
            return this.formatStatus(item['status'])
          },
          // filter: {
          //   items: () => Dist_List_Get(IMPORT_DOC_EVENT_STATUS),
          //   input: val => {
          //     this.params.stockStatus = val
          //     this.doSearch()
          //   },
          //   value: () => this.params.stockStatus || ''
          // }
        },
        {
          title: '发起时间',
          width: 3,
          key: item => {
            return this.formatDate(item['applyTime'], 'YYYY-MM-DD hh:mm')
          }
        }
      ],
      perNum: 12,
      bodyList: [],
      searchValue: '',
      params: {},
      statusList: []
    }
  },
  onDataLoaded(data) {
    // 提交页面加载性能统计
    this.commitStastics()
  },
  methods: {
    formatStatus(status) {
      for (let i in this.statusList) {
        if (this.statusList[i].key === status) {
          return this.statusList[i].name
        }
      }
    },
    formatStatusColor(status) {
      for (let i in this.statusList) {
        if (this.statusList[i].key === status) {
          return status === 'eventConfirm' || status === 'eventCheck' ? '#02B3B4' : '#030606'
        }
      }
    },
    doSearch() {
      this.requestList(this.currentPage = 1)
    },
    changePage(data) {
      let action = data.action
      if(action === 'first') {
        native_eventStatistic('borrowListPageFirst', '要件管理-外借记录-首页（borrow-list.vue）')
      } else if(action === 'prev') {
        native_eventStatistic('borrowListPagePrev', '要件管理-外借记录-上一页（borrow-list.vue）')
      } else {
        native_eventStatistic('borrowListPageNext', '要件管理-外借记录-下一页（borrow-list.vue）')
      }
    }
  }
}
</script>
