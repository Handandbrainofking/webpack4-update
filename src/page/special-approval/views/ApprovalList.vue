<template>
  <div class="approval-list" v-if="isShow">
    <d-search>
      <d-search-input width="600" v-model="params.queryKeyword" @search="doSearch" :placeholder="searchTip"></d-search-input>
    </d-search>
    <d-table :enable-load-more="false" :height="1284" :body-height="100" :head-list="columns" :body-list="ordersList"
      :no-data="isDataEmpty" :filterParams="params" cell-key="procInstId" @search="doSearch" @sort="sort" @loadFresh="refreshPage"
      @clickCellBtn="doClickCellBtn" @clickCell="doClickCellBtn">
    </d-table>
    <d-paging v-if="pageCount" :currPage="pageNumber" :totalPage="pageCount" :totalNum="total" :pageSize="pageSize"
      @doSkipPage="loadPage"></d-paging>
    <OrgApprovalDetail v-model="approvalShow" :applyNo="approvalApplyNo" :supplement="supplement"></OrgApprovalDetail>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import OrgApprovalDetail from '@/page/special-approval/views/OrgApprovalDetail.vue' 
export default {
  name: 'approval-list',
  inject: ['registerEvent'],
  props: {
    type: {
      type: String,
      default: 'user' // user / org
    }
  },
  components: {
    OrgApprovalDetail
  },
  data() {
    const self = this
    return {
      searchTip: self.isUserApproval ? '输入订单编号进行搜索' : '输入订单编号/发起人进行搜索',
      params: {
        queryKeyword: '',
        applyStatus: '',
        approveStatus: '',
        orderBy: 'createTime',
        orderType: 'desc'
      },
      columns: [
        { title: '异常类型', width: 2, key: 'flowName' },
        { title: '订单编号', width: 3, key: 'applyNo' },
        { title: '发起人', width: 2, key: 'createUserName', hide: () => !self.isUserApproval },
        { title: '发起时间', width: 3, key: 'createTime', sortable: true, _sort: 'desc', formatter: 'date:YYYY-MM-DD hh:mm' },
        { title: '审批进度', width: 3, key: 'approveStatus', formatter: 'dict:approveStatus', filterKey: 'approveStatus', filterList: 'approveStatus', show: () => !self.isUserApproval },
        { title: '审批进度', width: 3, key: 'approveStatus', formatter: 'dict:approveStatus', show: () => self.isUserApproval },
        { title: '订单状态', width: 2, key: 'applyStatus', formatter: 'dict:orderStatus', filterKey: 'applyStatus', filterList: 'orderStatus' },
        {
          title: '操作',
          width: 2,
          isBtns: true,
          btns: [
            {
              title: '补充说明',
              show: item => item.approveStatus === 'back' && item.createUserId === self.userInfo.id,
              type: 'default'
            }
          ]
        }
      ],
      ordersList: [],
      approvalShow: false,
      approvalApplyNo: '',
      supplement: false,
      isShow: false, // 是否显示
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('SpecialApprove', ['dataList', 'isNoMore', 'currentItem', 'pageSize', 'pageNumber', 'pageCount', 'total']),
    ...mapState('SpecialApprove', {
      isDataEmpty: state => state.isEmpty
    }),
    isUserApproval() {
      return this.type === 'user'
    },
    
  },
  mounted() {
    this.$nextTick(() => {
      this.$eventHub.$on('BroadcastChangedOrganization', this.doSearch)
      this.registerEvent('created', this.doSearch)
      this.registerEvent('show', this.onShow)
      if (this.type === 'user') {
        this.registerEvent('inited', this.doSearch)
      }
    })
  },
  methods: {
    ...mapActions('SpecialApprove', ['refreshList', 'loadNextPage', 'clear']),
    ...mapMutations('SpecialApprove', ['setUserTotal']),
    onShow(type) {
      this.isShow = type === this.type
      this.ordersList = []
      if (this.isShow) {
        this.doSearch()
      }
    },
    sort(item) {
      // 排序
      this.params.orderType = item.sort
      this.doSearch()
    },
    loadPage(pageNumber) {
      pageNumber = pageNumber || 1
      const createUserId = this.isUserApproval ? this.userInfo.id : ''
      this.params.approveStatus = this.isUserApproval ? 'back' : this.params.approveStatus // 我的待办只显示驳回类型
      return this.refreshList({ pageNumber, ...this.params, createUserId }).then(res => {
        this.ordersList = res.data
        if (this.isUserApproval) this.setUserTotal(this.total) // 设置 tab 页面上的计数
        return res
      })
    },
    doSearch() {
      this.loadPage(1)
    },
    refreshPage(resolve, reject) {
      this.loadPage(this.pageNumber).then(res => {
        if (typeof resolve === 'function' && typeof reject === 'function') {
          res.success ? resolve(this.isNoMore) : reject(res.msg)
        }
      })
    },
    addSpecification(item) {
      if (item.approveStatus === 'back' && item.createUserId === this.userInfo.id) {
        this.supplement = true
      } else if (item.approveStatus !== 'back') {
        this.supplement = false
      }
      this.approvalApplyNo = item.applyNo
      this.approvalShow = true
      // 跳转至补充说明页面
    },
    doClickCellBtn(index, item) {
      this.addSpecification(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.approval-list {
  flex: 1;
}
</style>
