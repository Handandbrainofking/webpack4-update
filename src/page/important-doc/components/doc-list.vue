<template>
  <div class="borrow-list-wrap">
    <d-search>
      <div slot="before" class="line-end">
        <div v-if="finishFlag" class="batch-borrow" @click="batchFinish">
          <text class="batch-borrow-text">申请完结</text>
        </div>
        <div v-if="borrowFlag" class="batch-borrow" @click="batchBorrow">
          <text class="batch-borrow-text">申请外借</text>
        </div>
        <div v-if="!hasCheckFlag" class="batch-borrow" @click="applyBorrow">
          <text class="batch-borrow-text">批量外借</text>
        </div>
        <div v-if="!hasCheckFlag" class="batch-borrow" @click="applyFinish">
          <text class="batch-borrow-text">批量完结</text>
        </div>
        <div v-if="hasCheckFlag" class="cancel-borrow" @click="cancelBorrow">
          <text class="cancel-borrow-text">取消</text>
        </div>
      </div>
      <d-search-input v-model="params.queryKeyword" @search="doSearch" placeholder="客户姓名/要件号码"></d-search-input>
    </d-search>
    <d-table :enable-load-more="false" :head-list="headList" :body-list="bodyList" :no-data="noData"
      :cell-key="rowKey" :all-checked="allChecked" :has-check-all="hasCheckFlag" :has-check="hasCheckFlag" :body-height="100"
      @clickCheckAll="clickCheckAll" @clickCheck="clickCheck" @clickCell="doClickListItem" @clickCellBtn="doClickBtn"
      @loadMore="loadMore" @loadFresh="refreshPage"></d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
    <apply-finish v-if="showApplyFinish" :essential-ids="batchBorrowList" :body-list="infoList" @closeApplyFinish="closeApplyFinish"
      @doApplyFinish="doApplyFinish"></apply-finish>
    <apply-borrow v-if="showApplyBorrow" :has-apply-button="hasApplyButton" :essential-ids="batchBorrowList" :body-list="infoList"
      @closeApplyBorrow="closeApplyBorrow" @doApplyBorrow="doApplyBorrow"></apply-borrow>
  </div>
</template>

<script>
import ApplyBorrow from '@/page/important-doc/components/apply-borrow.vue'
import ApplyFinish from '@/page/important-doc/components/apply-finish.vue'
import PageLoaderMixins from '@/mixins/page'
import { IMPORT_DOC_TYPE, Dist_List_Get } from '@/config/index'
import dialog from '@/utils/dialog'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: 'borrow-list',
  statistics: 'docList|要件管理-要件列表',
  mixins: [PageLoaderMixins],
  components: {
    ApplyBorrow,
    ApplyFinish
  },
  data() {
    return {
      requestListKey: 'important_doc_list',
      headList: [
        { title: '要件编号', width: 3, key: 'essentialId' },
        { title: '要件名称', width: 2, key: 'accountType' },
        { title: '所属人', width: 2, key: 'essentialOwnerName' },
        {
          title: '要件状态',
          width: 2,
          key: item => {
            return this.formatStatus(item['stockStatus'])
          },
          filter: {
            items: () => Dist_List_Get(IMPORT_DOC_TYPE),
            input: val => {
              this.params.stockStatus = val
              this.doSearch()
            },
            value: () => this.params.stockStatus || ''
          }
        },
        { title: '要件号码', width: 3, key: 'accountNo' },
        { title: '关联业务', width: 3, key: 'applyNo' },
        {
          title: '操作',
          width: 3,
          isBtns: true,
          btns: [
            {
              title: '外借',
              show: item => item.showWj,
              type:'primary',
            },
            {
              title: '完结',
              show: item => item.showFinish,
              type:'default'
            }
          ]
        }
      ],
      temphead: {
        title: '操作',
        width: 3,
        isBtns: true,
        btns: [
          {
            title: '外借',
            show: item => item.showWj,
            type:'primary'
          },
          {
            title: '完结',
            show: item => item.showFinish,
            type:'default'
          }
        ]
      },
      bodyList: [],
      params: {},
      searchList: [
        {
          name: '全部',
          key: '',
          sort: 0
        },
        {
          name: '客户外借',
          key: 'customerBorrow',
          sort: 1
        },
        {
          name: '员工外借',
          key: 'employeeBorrow',
          sort: 2
        },
        {
          name: '托管完结',
          key: 'hostedOver',
          sort: 3
        },
        {
          name: '在库',
          key: 'inWarehouse',
          sort: 4
        }
      ],
      statusList: [], // 要件状态字典存储
      hasCheckFlag: false, // 是否有勾选标识
      borrowFlag: false, // 申请外借标识
      finishFlag: false, // 申请完结标识
      batchBorrowList: [],
      perNum: 12,
      showApplyBorrow: false,
      showApplyFinish: false,
      infoList: [],
      hasApplyButton: false
    }
  },
  computed: {
    allChecked() {
      const list = this.bodyList || []
      const len = list.length
      return len > 0 && list.filter(item => item.checked).length === len
    }
  },
  created() {
    this.statusList = Dist_List_Get(IMPORT_DOC_TYPE)
  },
  mounted() {
    this.requestList(this.currentPage = 1)
    this.$eventHub.$on('BroadcastChangedOrganization', this.doSearch)
  },
  onDataLoaded(data) {
    // 提交页面加载性能统计
    this.commitStastics()
  },
  methods: {
    // 过滤非在库的要件，不可外借
    formatListData(datas) {
      return datas.map(item => {
        if (item['stockStatus'] === 'inWarehouse' && item['applyStatus'] === 'N') {
          item.showWj = true
        } else {
          item.showWj = false
        }
        if (
          item['stockStatus'] !== 'hostedOver' &&
          item['stockStatus'] !== 'inWarehouse' &&
          item['applyStatus'] === 'N'
        ) {
          item.showFinish = true
        } else {
          item.showFinish = false
        }
        return item
      })
    },
    // 要件状态的字典转换
    formatStatus(status) {
      for (let i in this.statusList) {
        if (this.statusList[i].key === status) {
          return this.statusList[i].name
        }
      }
    },
    // 输入框关键词过滤要件
    doSearch() {
      // this.params.stockStatus = type
      // this.params.queryKeyword = search
      native_eventStatistic('searchDoc','要件-搜索要件');
      this.requestList(this.currentPage = 1)
    },
    // 点击外借按钮
    doClickBtn(index, item, btn, bIdx) {
      native_eventStatistic('clickBorrowDoc','要件-点击外借');
      let batchBorrowList = []
      batchBorrowList.push(item.essentialId)
      this.batchBorrowList = batchBorrowList
      this.getInfoList()
      if (bIdx === 0) {
        this.hasApplyButton = true
        this.showApplyBorrow = true
      } else {
        this.showApplyFinish = true
      }
    },
    // 点击弹出详情
    doClickListItem(index, item) {
      native_eventStatistic('clickDocInfo','要件-点击要件详情');
      let batchBorrowList = []
      batchBorrowList.push(item.essentialId)
      this.batchBorrowList = batchBorrowList
      this.getInfoList()
      this.hasApplyButton = false
      this.showApplyBorrow = true
    },
    // 单条选中按钮
    clickCheck(index, checked, item) {
      this.$set(this.bodyList, index, Object.assign({}, item, { checked }))
    },
    // 标题栏全选按钮
    clickCheckAll(bool) {
      native_eventStatistic('clickAllDoc','要件-全选要件');
      this.bodyList.forEach(item => {
        this.$set(item, 'checked', bool)
      })
    },
    cancelBorrow() {
      this.hasCheckFlag = false
      this.finishFlag = false
      this.borrowFlag = false
      for (let i in this.bodyList) {
        Vue.set(this.bodyList[i], 'checked', false)
      }
      this.headList.push(this.temphead)
    },
    applyBorrow() {
      this.hasCheckFlag = true
      this.borrowFlag = true
      Vue.delete(this.headList, 6)
    },
    applyFinish() {
      this.hasCheckFlag = true
      this.finishFlag = true
      Vue.delete(this.headList, 6)
    },
    batchBorrow() {
      let batchBorrowList = []
      for (let i in this.bodyList) {
        if (this.bodyList[i].checked === true && this.bodyList[i].stockStatus !== 'inWarehouse') {
          dialog.toast(this.bodyList[i].essentialId + '不在库，不可申请外借！')
          return false
        } else if (this.bodyList[i].checked === true && this.bodyList[i].applyStatus === 'Y') {
          dialog.toast(this.bodyList[i].essentialId + '已在外借申请中，不可申请外借！')
          return false
        }
        this.bodyList[i].checked === true && batchBorrowList.push(this.bodyList[i].essentialId)
      }
      if (!batchBorrowList.length) {
        dialog.toast('请选择要外借的要件！')
        return false
      }
      this.batchBorrowList = batchBorrowList
      this.getInfoList()
      this.hasApplyButton = true
      this.showApplyBorrow = true
    },
    batchFinish() {
      let batchBorrowList = []
      for (let i in this.bodyList) {
        if (this.bodyList[i].checked === true && this.bodyList[i].stockStatus === 'hostedOver') {
          dialog.toast(this.bodyList[i].essentialId + '已完结，不可申请完结！')
          return false
        } else if (this.bodyList[i].checked === true && this.bodyList[i].applyStatus === 'Y') {
          dialog.toast(this.bodyList[i].essentialId + '已在外借申请中，不可申请完结！')
          return false
        } else if (this.bodyList[i].checked === true && this.bodyList[i].stockStatus === 'inWarehouse') {
          dialog.toast(this.bodyList[i].essentialId + '在库中，不可申请完结！')
          return false
        }
        this.bodyList[i].checked === true && batchBorrowList.push(this.bodyList[i].essentialId)
      }
      if (!batchBorrowList.length) {
        dialog.toast('请选择要完结的要件！')
        return false
      }
      this.batchBorrowList = batchBorrowList
      this.getInfoList()
      this.showApplyFinish = true
    },
    closeApplyBorrow() {
      this.showApplyBorrow = false
    },
    closeApplyFinish() {
      this.showApplyFinish = false
    },
    getInfoList() {
      this.requestApi.important_doc_details({
        data: {
          essentialIds: this.batchBorrowList
        },
        success: data => {
          this.infoList = data || []
        }
      })
    },
    doApplyBorrow(data) {
      native_eventStatistic('docApplyBorrow','要件-外借要件');
      this.requestApi.apply_borrow({
        data,
        success: data => {
          dialog.toast('外借申请成功')
          this.showApplyBorrow = false
          this.requestList(this.currentPage = 1)
        }
      })
    },
    doApplyFinish(data) {
      native_eventStatistic('docApplyFinish','要件-完结要件');
      this.requestApi.apply_finish({
        data,
        success: data => {
          dialog.toast('外借完结成功')
          this.showApplyFinish = false
          this.requestList(this.currentPage = 1)
        }
      })
    },
    changePage(data) {
      let action = data.action
      if(action === 'first') {
        native_eventStatistic('docListPageFirst', '要件管理-要件列表-首页（doc-list.vue）')
      } else if(action === 'prev') {
        native_eventStatistic('docListPagePrev', '要件管理-要件列表-上一页（doc-list.vue）')
      } else {
        native_eventStatistic('docListPageNext', '要件管理-要件列表-下一页（doc-list.vue）')
      }
    }
  }
}
</script>

<style scoped>
.borrow-list-wrap {
  flex: 1;
}

.search-line {
  margin-left: 800px;
}

.line-end {
  flex-direction: row;
  background-color: #ffffff;
  align-items: center;
  justify-content: space-between;
  padding-right: 40px;
  padding-left: 20px;
  height: 100px;
}

.batch-borrow {
  width: 188px;
  height: 52px;
  border-width: 2px;
  border-color: #02b3b4;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
}

.batch-borrow-text {
  color: #02b3b4;
  font-size: 34px;
}

.cancel-borrow {
  width: 124px;
  height: 52px;
  border-width: 2px;
  border-color: #677475;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
}

.cancel-borrow-text {
  color: #677475;
  font-size: 34px;
}
</style>
