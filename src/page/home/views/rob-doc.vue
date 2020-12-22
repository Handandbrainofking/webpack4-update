<template>
  <div class="column">
    <d-search>
      <text class="search-label">预约时间:</text>
      <d-search-date v-model="params.appointTimeSearchBegin"
        @search="doSearch"
        placeholder="预约时间"></d-search-date>
      <d-search-input v-model="params.queryKeyWord"
        @search="doSearch"
        placeholder="订单编号/客户姓名/渠道经理"></d-search-input>
    </d-search>
    <d-table
      :enable-load-more="false"
      :head-list="columns"
      :body-list="bodyList"
      :no-data="isRobDataEmpty"
      :body-height="100"
      :show-tag="showTag"
      cell-key="taskId"
      :filterParams="params"
      @search="doSearch"
      @clickHead="doClickHeadTitle"
      @clickCell="doClickListItem"
      @clickCellBtn="toolItemClick"
      @loadFresh="refreshPage"></d-table>
      <d-paging v-if="pageCount" :currPage="pageNumber" :totalPage="pageCount" :totalNum="total" :pageSize="pageSize" @doSkipPage="loadPage" @change="changePage"></d-paging>
    <RobConfirmDialog title="我要抢单"
      :applyNo="currentItem.applyNo"
      :matterKey="currentItem.matterKey"
      :show="showRobConfirmDialog"
      v-if="showRobConfirmDialog"
      @commit="doRobDoc"
      @cancel="cancelConfirm"></RobConfirmDialog>
    <!-- 抢单超过50条报警窗口 -->
    <confirm-dlg :title="robWarmingTitle"
      content="是否继续抢单？"
      :show="showRobWarmingConfirmDialog"
      v-show="showRobWarmingConfirmDialog"
      @wxcDialogConfirmBtnClicked="doRobDoc"
      @wxcDialogCancelBtnClicked="cancelConfirm"></confirm-dlg>
    <ConflitTipDialog v-if="showConflitialog"
      :orderInfo="currentItem"
      :conflitOrders="conflitOrders"
      @commit="closeConflit(true)"
      @cancel="closeConflit(false)"></ConflitTipDialog>
    <assign-view ref="assignView"
      :applyNo="currentItem.applyNo"
      :show.sync="isShowAssignView"></assign-view>
  </div>
</template>
<script>
import { TrackOrderView } from '@/router/defined'
import RobConfirmDialog from '@/page/home/modals/rob-confirm-dialog'
import ConfirmDlg from '@/components/dialog/confirm.vue'
import ConflitTipDialog from '@/components/dialog/time-conflit'
import AssignView from '@/page/home/views/assign-view'
import utils from '@/utils/dialog'
import { Dist_List_Get, DISC_ORDER_STATUS, InterviewListKind } from '@/config/index'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { native_eventStatistic } from '@/utils/deal_native'
import mixin from '@/mixins/index'
export default {
  name: 'person-rob-doc',
  statistics: 'rob-doc|首页-抢单池',
  components: {
    ConflitTipDialog,
    ConfirmDlg,
    AssignView,
    RobConfirmDialog
  },
  props: {
    applyNoAhead: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showTag: true,
      conflitOrders: [],
      showConflitialog: false,
      showRobConfirmDialog: false,
      robDocConfirmContent: '',
      showRobWarmingConfirmDialog: false,
      robWarmingTitle: '您的在途业务量已达50条',
      isShowAssignView: false,
      applyNo: '',
      matterKey: '',
      params: {
        pageNumber : 1,
        appointTimeSearchBegin: '',
        queryKeyWord: '',
        productId: '',
        orderBy: 'appointTime',
        applyStatus: '',
        orderType: 'desc'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState(['padProducts']),
    ...mapState('rob', ['dataList', 'total', 'isNoMore', 'currentItem', 'pageSize', 'pageNumber', 'pageCount']),
    ...mapState('rob', {
      isRobDataEmpty:state => state.isEmpty, // 与 mixin 命名有冲突
      columns(state) {
        let columns = state.columns
        let productCol = columns.find(x => x.key === 'productName')
        productCol.filterKey = 'productId'
        productCol.filterList = () => this.padProducts        
        return columns
      }
    }),
    bodyList() {
      const dataList = this.dataList || []
      return dataList.map(item => {
        item.showSymbolSpecial = item.isSpecialApproved === '1'
        return item
      })
    }
  },
  watch: {
    isShowAssignView(val) {
      if (!val) {
        this.loadPageData(this.params)
      }
    },
    total: function(val, oldVal) {
      this.$emit('changeTotalNumber', val)
    }
  },
  created() {
    this.loadPadProducts()
    this.params = Object.assign({}, this.params, this.$store.state.search.searchParams)
    this.$store.commit('clearSearchParams')
    if (this.applyNoAhead) {
      this.params.queryKeyWord = this.applyNoAhead
    }
    this.$eventHub.$on('BroadcastChangedOrganization', this.loadFirstPage)
    this.$eventHub.$on('BroadcastReleaseOrder', this.loadPage) // 释放
  },
  mounted() {
    this.loadPage().then(() => {
      // 提交页面加载性能统计
      this.commitStastics()
    })
  },
  methods: {
    ...mapActions(['loadPadProducts']),
    ...mapActions('rob', [ 'loadPageData', 'clear', 'checkRobDocWarming', 'commitRobDoc', 'checkTimeConflit' ]),
    ...mapMutations('rob', { setCurrentItem: 'currentItem', updatePageSize: 'pageSize' }),
    loadFirstPage(){
      return this.loadPage(1)
    },
    loadPage(pageNumber) {
      this.params.pageNumber = pageNumber || this.params.pageNumber
      return this.loadPageData(this.params)
    },
    refreshPage(cb){
      this.loadPage().then(()=>{
        cb(this.isNoMore)
      })
    },
    // 进入详情页面
    doClickListItem(index, item) {
      native_eventStatistic('robDocDetail', '抢单池-详情（rob-doc.vue）')
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
          grabOrderShow: true
        },
        {
          type: 3,
          searchParams: encodeURIComponent(JSON.stringify(this.params)),
        }
      )
    },
    // 取消抢单
    cancelConfirm() {
      // 取消抢单与派单确定弹窗
      this.showRobConfirmDialog = this.showRobWarmingConfirmDialog = false
    },
    // 显示超出50个警告弹窗
    showRobDocWarming(status) {
      if (status.over) {
        this.robWarmingTitle = `您的在途业务量已达${status.warnLine || 50}条`
        this.showRobWarmingConfirmDialog = true // 超出显示警告窗
      } else {
        this.checkTimeConflit({ order: this.currentItem, handleUserId: this.userInfo.id }).then(this.showRobDocConflit) // 检查是否与其他项目冲突
      }
    },
    // 显示时间冲突弹窗
    showRobDocConflit(conflitItems) {
      if (conflitItems && conflitItems.length) {
        this.conflitOrders = conflitItems
        this.showConflitialog = true
      } else {
        this.showRobConfirmDialog = true
      }
    },
    closeConflit(result) {
      this.showConflitialog = false
      if (result) {
        this.showRobConfirmDialog = true
      }
    },
    // 显示抢单确认弹窗
    showRobDocConfirm(item) {
      this.setCurrentItem(item)
      this.robDocConfirmContent = `客户 ${this.currentItem.sellerName}  ${this.currentItem.productName}`
      // 检查是否已经超出50条待办
      this.checkRobDocWarming().then(this.showRobDocWarming)
    },
    // 执行抢单
    doRobDoc() {
      // 抢单
      this.showRobWarmingConfirmDialog = false
      var that = this
      this.commitRobDoc().then(result => {
        if (result) {
          utils.toast('抢单成功')
          that.$eventHub.$emit('BroadcastRobOrder') // 抢单广播
          that.loadPage()
        }
      })
      // 提交抢单请求
      this.showRobConfirmDialog = false
    },
    // 显示分配单据窗口
    doAssignDoc(item) {
      // 派单
      this.showAssignView = true
      this.assignOrder = item
      this.isShowAssignView = true
      this.$refs.assignView.initView(item.applyNo, item.matterKey, item.matterName)
    },
    toolItemClick(index, item, tool) {
      if (tool.title === '抢单') {
        native_eventStatistic('robDocConfirm', '抢单池-抢单（rob-doc.vue）')
        this.showRobDocConfirm(item)
      } else if (tool.title === '派单') {
        native_eventStatistic('robDocAssign', '抢单池-派单（rob-doc.vue）')
        this.doAssignDoc(item)
      }
    },
    doSearch() {
      native_eventStatistic('searchRobOrderPool', '抢单池-搜索（rob-doc.vue）')
      return this.loadPage(1)
    },
    doClickHeadTitle(index) {
      if (index === 5) {
        this.params.orderType = this.params.orderType === 'asc' ? 'desc' : 'asc'
        this.loadPage(1)
      }
    },
    changePage(data) {
      const action = data.action
      switch(data.action){
        case 'first':
          native_eventStatistic('robDocPageFirst', '跟单池-首页（rob-doc.vue）')
          break
        case 'prev':
          native_eventStatistic('robDocPagePrev', '跟单池-上一页（rob-doc.vue）')
          break
        default:
          native_eventStatistic('robDocPageNext', '跟单池-下一页（rob-doc.vue）')
      }
    }
  },
  beforeDestroy() {
    this.$eventHub.$off('BroadcastChangedOrganization', this.loadFirstPage)
    this.$eventHub.$off('BroadcastReleaseOrder', this.loadPage) // 释放
    this.clear()
  }
}
</script>

<style lang="scss" scoped>
.column {
  flex-direction: column;
  flex: 1;
}

.header {
  background-color: $color_white;
  height: 100px;
  justify-content: center;
  align-items: flex-end;
  padding-top: 20px;
  padding-bottom: 20px;
}

.search-label {
  padding-right: 35px;
  line-height: 56px;
  font-size:30px;
  color:rgba(33,54,61,1);
}
</style>
