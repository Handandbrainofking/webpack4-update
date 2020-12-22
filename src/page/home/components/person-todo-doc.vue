<template>
  <d-layout
     kind="column"
     text-align="initial"
     vertical-align="initial">
    <d-search>
      <d-search-tags
         tags="今日|1,全部|0"
         v-model="selectedTag"
         @search="doSearch"
         @change="onTagChanged"
         slot="before"></d-search-tags>
      <d-search-input
         v-model="params.queryKeyword"
         @search="doSearch"
         placeholder="订单编号/客户姓名/渠道经理"></d-search-input>
    </d-search>
    <d-table
       :enable-load-more="false"
       :head-list="headList"
       :body-list="bodyList"
       :no-data="noData"
       :cell-key="rowKey"
       :swipe-btn="swipeBtn"
       :show-tag="true"
       :body-height="100"
       :filterParams = "params"
       @search="doSearch"
       @clickHead="clickHeadTitle"
       @clickSwipeBtn="actionClick"
       @clickCell="clickListItem"
       @clickCellBtn="clickBtn"
       @loadMore="loadMore"
       @loadFresh="refreshPage"></d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
    <transfer-dialog
       @commit="commitTransfer"
       :matter-editable="false"
       ref="transferModal"></transfer-dialog>
  </d-layout>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import TransferDialog from '@/components/dialog/transfer-order'
import loginApi from '@/utils/login'
import { TestTaskInterview } from '@/router/defined'
import { InterviewListKind } from '@/config'
import PageLoaderMixins from '@/mixins/page'
import { native_eventStatistic } from '@/utils/deal_native'

const searchList = InterviewListKind
export default {
  name: 'person-todo-doc',
  statistics: 'person-todo-doc|首页-待办池',
  components: {
    TransferDialog
  },
  mixins: [PageLoaderMixins],
  props: {
    applyNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedTag: 1,
      showTransferModal: false,
      requestListKey: 'home_custom_list',
      searchList: searchList,
      poductList: [],
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
          filterList:()=>this.padProducts
        },
        {
          title: '待办任务',
          width: 3,
          key: item => {
            const name = item['matterName']
            if (name === '同贷信息登记') {
              return '核实同贷'
            } else if (name === '办理抵押') {
              return '抵押递件'
            } else {
              return name
            }
          },
          filterKey: 'matterKey',
          filterList: 'InterviewListKind' // 对应的字典名称
        },
        {
          title: '预约时间',
          width: 3,
          key: 'appointTime',
          formatter:'date:YYYY-MM-DD hh:mm'
        },
        {
          title: '操作',
          width: 4,
          isBtns: true,
          btns: [
            {
              title: '转单',
              show: item => item.showTransferOrder,
              type:'default'
            }
          ]
        }
      ],
      rowKey: 'taskId',
      bodyList: [],
      total: 0,
      swipeBtn: [
        {
          ico(item){
            return item.urgentWeight <= 0 && 'icon-set-top'
          },
          title: function (item) {
            return item.urgentWeight > 0 ? '取消置顶' : '置顶'
          },
          style: {
            backgroundColor: '#54A0FF'
          }
        }
      ],
      params: {
        userId: loginApi.getLoginData()['id'],
        type: '1',
        matterKey: searchList[0].key,
        productId: '',
        queryKeyword: '',
        orderBy: 'appointTime',
        orderType: 'desc'
      },
      params_0: {},
      params_1: {},
      isLoaded: false,
      flag: 0
    }
  },
  computed: {
    ...mapGetters(['isYYZG']),
    ...mapState(['padProducts'])
  },
  created() {
    // 从store里面获取搜索条件
    const params = this.$store.state.search.searchParams
    this.clearSearchParams()
    // 判断当前的按钮类型
    const type = params.type || this.params.type
    // 初始化参数 -- 对于参数是对象需要注意一下，会存在对象的覆盖
    this.params_0 = {...this.params, ...this.params_0}
    this.params_1 = {...this.params, ...this.params_1}
    this.params = Object.assign(this[`params_${type}`], params)
    if (this.applyNo) {
      this.params.queryKeyword = this[`params_${type}`]['queryKeyword'] = this.applyNo
    }
    // 处理pageSize
    const pageSize = this.params.pageSize
    const perNum = this.perNum
    this.perNum = pageSize || perNum
    const currentPage = this.currentPage = this.params.currentPage || 1
    this.onTagChanged(this.selectedTag = type)
    this.loadPadProducts()   
    this.requestList(currentPage)
    const $eventHub = this.$eventHub
    $eventHub.$on('BroadcastChangedOrganization', this.resetMethod) // TODO:lcl 全局事件统一在 plugin 中进行管理，外部引入 $eventHub 用起来会比较麻烦，而且容易忘记做销毁导致内存泄漏
    $eventHub.$on('BroadcastTransferOrderSuccess', this.resetMethod)
    $eventHub.$on('BroadcastCollectOrderSuccess', this.resetMethod) 
    $eventHub.$on('BroadcastBookOrder', this.resetMethod) // 预约
    $eventHub.$on('BroadcastReleaseOrder', this.resetMethod) // 释放
  },
  watch: {
    // 当待办池总条数变化更新
    total: function (val, oldVal) {
      if (this.selectedTag === '0') {
        this.$emit('changeTotalNumber', val)
      }
    }
  },
  onDataLoaded(data) {
    if (!this.isLoaded) {
      // 提交页面加载性能统计
      this.commitStastics()
    }
    this.isLoaded = true
  },
  methods: {
    ...mapActions(['loadPadProducts']),
    resetMethod() {
      this.requestList(this.currentPage = 1)
    },
    // 切换今日、全部
    onTagChanged(tag) {
      this.params = this[`params_${tag}`]
      this.$set(this.params, 'type', tag)
    },
    // 处理返回的列表数据
    formatListData(datas) {
      return datas
        .filter(item => item.productId !== 'AJFW_NSL_YJY' || item.matterKey !== 'Interview')
        .map(item => {
          item.showTransferOrder = true
          return item
        })
    },

    // 置顶
    setTopCustomer(applyNo, matterKey) {
      this.requestApi.home_custom_set_top({
        data: {
          applyNo,
          matterKey
        },
        success: data => {
          this.requestList(this.currentPage = 1)
        }
      })
    },
    // 取消置顶
    cancelSetTopCustomer(applyNo, matterKey) {
      this.requestApi.home_custom_cancel_set_top({
        data: {
          applyNo,
          matterKey
        },
        success: () => {
          this.requestList(this.currentPage = 1)
        }
      })
    },

    assignDoc() {
      this.$router.push('/assign_doc')
    },

    clickListItem(index, item) {
      native_eventStatistic('personTodoTask', '个人待办-节点（person-todo-doc.vue）')
      const pageSize = this.perNum
      this.jump(
        TestTaskInterview,
        false,
        true,
        {productType: item.productId, nodesType: item.matterKey, orderId: item.applyNo, applyNo: item.applyNo},
        {
          searchParams: encodeURIComponent(JSON.stringify(Object.assign({}, this.params, {pageSize, currentPage: this.currentPage})))
        }
      )
    },
    // 搜索
    doSearch() {
      native_eventStatistic('searchPersonTodo', '待办池-搜索（person-todo-doc.vue）')
      this.requestList(this.currentPage = 1)
    },
    actionClick(index, item) {
      if (index !== 0 || item.urgentWeight > 0) {
        if (item.urgentWeight > 0) {
          native_eventStatistic('cancelSetTopCustomer', '个人待办-取消置顶（person-todo-doc.vue）')
          this.cancelSetTopCustomer(item.applyNo, item.matterKey)
        } else {
          native_eventStatistic('setTopCustomer', '个人待办-置顶（person-todo-doc.vue）')
          this.setTopCustomer(item.applyNo, item.matterKey)
        }
      }
    },
    clickBtn(index, item, btn) {
      switch (btn.title) {
        case '转单':
          native_eventStatistic('transferOrder', '个人待办-转单（person-todo-doc.vue）')
          this.transferOrder(item)
          break
        case '派单':
          native_eventStatistic('assignDoc', '个人待办-派单（person-todo-doc.vue）')
          this.assignDoc(item)
          break
      }
    },
    transferOrder(item) {
      this.showTransferModal = true
      this.$refs.transferModal.showModal(item)
    },
    commitTransfer(result) {
      if (result) {
        this.requestList(this.currentPage = 1)
      }
    },
    clickHeadTitle(index) {
      if (index === 5) {
        this.params.orderType = this.params.orderType === 'asc' ? 'desc' : 'asc'
        this.requestList(this.currentPage = 1)
      }
    },
    changePage(data) {
      //收集用户事件

      let action = data.action
      if(this.selectedTag === '0') {
        if(action === 'first') {
          native_eventStatistic('personAllPageFirst', '个人待办全部-首页（person-todo-doc.vue）')   
        } else if(action === 'prev') {
          native_eventStatistic('personAllPagePrev', '个人待办全部上一页（person-todo-doc.vue）')     
        } else {
          native_eventStatistic('personAllPageNext', '个人待办全部下一页（person-todo-doc.vue）')     
        }
      } 
      else {
        if(action === 'first') {
          native_eventStatistic('personTodayPageFirst', '个人待办今日-首页（person-todo-doc.vue）')        
        } else if(action === 'prev') {
          native_eventStatistic('personTodayPagePrev', '个人待办今日上一页（person-todo-doc.vue）')     
        } else {
          native_eventStatistic('personTodayPageNext', '个人待办今日下一页（person-todo-doc.vue）')     
        }
      }
    }
  },
  beforeDestroy() {
    const reset = this.reset
    const $eventHub = this.$eventHub
    $eventHub.$off('BroadcastChangedOrganization', reset)
    $eventHub.$off('BroadcastTransferOrderSuccess', reset)
    $eventHub.$off('BroadcastBookOrder', reset) // 预约
    $eventHub.$off('BroadcastReleaseOrder', reset)
  }
}
</script>
