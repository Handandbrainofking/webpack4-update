<template>
  <div class="column">
    <back-head :back-title="assignTitle" :beforeBack="goBack"></back-head>
    <div class="search-bar">
      <pick-view class="search-picker" place-holder="组员" :searchList="companyUsers" width="400" height="60" v-model="userId"
        @doChoosePick="pickUserId"></pick-view>
      <d-search-input width="400" v-model="queryKeyword" @search="doSearch" placeholder="请输入组内人员姓名"></d-search-input>
    </div>
    <div>
      <d-table :enable-load-more="false" :height="1313" :head-list="headList" :filterParams="params" :body-list="assignList" :no-data="isListEmpty"
        :show-tag="showTag" :selected="isSelected" cell-key="taskId" @clickCellBtn="btnActionClick" @clickHead="clickHeadTitle"
        @clickCell="buiClickCell" @loadFresh="refreshPage" @search="doSearch">
      </d-table>
      <d-paging v-if="pageCount" :currPage="pageNumber" :totalPage="pageCount" :totalNum="total" :pageSize="pageSize"
        @doSkipPage="loadPage" @change="changePage"></d-paging>
      <order-info v-if="showOrderInfo" :data-item="dataItem" @closeOrderInfo="closeOrderInfo"></order-info>
    </div>
  </div>
</template>

<script>
import OrderInfo from '@/components/dialog/order-info.vue'
import { InterviewListKind } from '@/config/index'
import PickView from '@/components/dropdown/pick'
import FormInput from '@/components/form/views/formInput.vue'
import DatetimePicker from '@/components/dropdown/pickdate'
import loginApi from '@/utils/login'
import BackHead from '@/components/back/head.vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { native_eventStatistic } from '@/utils/deal_native'
export default {
  name: 'assign-todo-doc',
  components: {
    PickView,
    BackHead,
    FormInput,
    DatetimePicker,
    OrderInfo
  },
  props: {
    applyNo: {
      type: String,
      default: ''
    },
    matterKey: {
      type: String,
      default: ''
    },
    assignTitle: {
      type: String,
      default: '指派人员'
    },
    transferUserId: {
      type: String,
      default: ''
    },
    assignName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userId: '',
      _matterKey: '',
      params: {
        matterKey: ''
      },
      allUserIds: [],
      assignList: [],
      headList: [
        { title: '序号', width: 1, key: 'num' },
        { title: '当前办理人', width: 2, key: 'assigneeName' },
        { title: '客户姓名', width: 2, key: 'sellerName' },
        { title: '产品名称', width: 3, key: 'productName' },
        {
          title: '待办任务',
          width: 3,
          key: 'matterName',
          filterKey:'matterKey',
          filterList:'InterviewListKind'
        },
        { title: '预约时间', width: 3, key: 'appointTimeF' },
        { title: '预约地点', width: 3, key: 'appointAddress' },
        {
          title: '操作',
          width: 3,
          isBtns: true,
          btns: [
            {
              title: '指派',
              show: item => item.showP,
              style: {
                fontSize: '30px',
                backgroundColor: '#02B3B4',
                borderRadius: '4px',
                color: '#ffffff',
                marginLeft: '20px'
              }
            }
          ]
        }
      ],
      rawUserData: [],
      taskLists: InterviewListKind,
      listOrder: { orderBy: 'appointTime', orderType: 'asc' },
      showOrderInfo: false,
      showTag: true,
      dataItem: [],
      queryKeyword: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('assign', ['dataList', 'isNoMore', 'currentItem', 'pageSize', 'pageNumber', 'pageCount', 'total']),
    ...mapState('assign', {
      isListEmpty: state => state.isEmpty
    }),
    companyUsers() {
      let result = Array.prototype.map.call(this.rawUserData, u => {
        return { name: u.fullname, key: u.userId }
      })
      return result
    }
  },
  beforeMount() {
    this.params.matterKey = this.matterKey
    this.loadUsers()
  },
  destroyed() {
    this.clear()
  },
  methods: {
    ...mapActions(['loadCompanyUsers', 'geOperateUserList']),
    ...mapActions('assign', ['loadNextAssignListPage', 'refreshAssignList', 'clear', 'checkTimeConflit']),
    goBack() {
      this.$emit('cancel')
    },
    isSelected(item) {
      return item.assigneeId === this.transferUserId
    },
    loadPage(pageNumber) {
      pageNumber = pageNumber || 1
      let userIds = []
      if (!this.userId) {
        userIds = this.allUserIds
      } else {
        userIds.push(this.userId)
      }
      let matterKey
      if (this.params.matterKey) {
        matterKey = this.params.matterKey
      }
      const slef = this
      this.loadNextAssignListPage({
        matterKey,
        userIds,
        queryKeyword: this.queryKeyword,
        listOrder: this.listOrder,
        pageNumber: pageNumber
      }).then(res => {
        this.getBodyList(this.dataList)
      })
    },
    refreshPage(resolve, reject) {
      const self = this
      let that = this
      let matterKey
      let userIds = []
      if (!this.userId) {
        userIds = this.allUserIds
      } else {
        userIds.push(this.userId)
      }
      if (this.params.matterKey) {
        matterKey = this.params.matterKey
      }
      this.refreshAssignList({
        matterKey,
        userIds,
        queryKeyword: this.queryKeyword,
        listOrder: this.listOrder
      }).then(res => {
        if (typeof resolve === 'function' && typeof reject === 'function') {
          res.success ? resolve(self.isNoMore) : reject(res.msg)
        }
        that.getBodyList(that.dataList)
      })
    },
    getBodyList(list) {
      Array.prototype.map.call(list || [], (item, index) => {
        const userInfo = loginApi.getLoginData()
        if (this.transferUserId && item.assigneeId === this.transferUserId) {
          item.showP = false
        } else {
          item.showP = true
        }
      })
      this.assignList = list
      // TODO ESLint 注释// 后面加空格
      //用完初始化的用户数处理数据回显则清理
      this.initUserIds = []
    },
    loadUsers() {
      this.geOperateUserList({ matterKey: this.params.matterKey, applyNo: this.applyNo }).then(data => {
        //更新公司员工信息
        const userInfo = loginApi.getLoginData()
        let templateList = []
        data.forEach((item, index) => {
          if (this.assignName === 'assign' && userInfo.id === item.userId) {
          } else {
            this.allUserIds.push(item.userId)
            templateList.push(item)
          }
        })
        this.rawUserData = templateList
        this.refreshPage()
      })
    },
    // 搜索
    doSearch() {
      this.refreshPage()
    },
    pickUserId(id, name) {
      let item = {
        assigneeId: id,
        assigneeName: name
      }
      this.btnActionClick('', item)
    },
    btnActionClick(index, item) {
      this.$emit('btnActionClick', item)
      this.$emit('cancel')
    },
    buiClickCell(index, item) {
      this.dataItem = [{ name: '客户姓名', value: item.sellerName }, { name: '产品名称', value: item.productName }, { name: '当前办理人', value: item.assigneeName }, { name: '待办任务', value: item.matterName }, { name: '预约时间', value: item.appointTimeF }, { name: '预约地点', value: item.appointAddress }]
      this.showOrderInfo = true
    },
    clearView() {
      this.clear()
    },
    // 点击表头
    clickHeadTitle(idx) {
      if (idx === 5) {
        //预约时间
        this.listOrder.orderType = this.listOrder.orderType != 'asc' ? 'asc' : 'desc'
        this.refreshPage()
      }
    },
    closeOrderInfo() {
      this.showOrderInfo = false
    },
    changePage(data) {
      let action = data.action
      if (this.assignName === 'release') {
        if (action === 'first') {
          // TODO native_eventStatistic 没有引入
          native_eventStatistic('releaseUserPageFirst', '释放接受人员-首页（assign-doc.vue）')
        } else if (action === 'prev') {
          native_eventStatistic('releaseUserPagePrev', '释放接受人员-上一页（assign-doc.vue）')
        } else {
          native_eventStatistic('releaseUserPageNext', '释放接受人员-下一页（assign-doc.vue）')
        }
      } else if (this.assignName === 'assign') {
        if (action === 'first') {
          native_eventStatistic('orderUserPageFirst', '派单指派人员-首页（assign-user-doc.vue）')
        } else if (action === 'prev') {
          native_eventStatistic('orderUserPagePrev', '派单指派人-上一页（assign-user-doc.vue）')
        } else {
          native_eventStatistic('orderUserPageNext', '派单指派人-下一页（assign-user-doc.vue）')
        }
      } else {
        if (action === 'first') {
          native_eventStatistic('transferUserPageFirst', '转单转入人员-首页（assign-doc.vue）')
        } else if (action === 'prev') {
          native_eventStatistic('transferUserPagePrev', '转单转入人员-上一页（assign-doc.vue）')
        } else {
          native_eventStatistic('transferUserPageNext', '转单转入人员-下一页（assign-doc.vue）')
        }
      }
    }
  },
  watch: {
    matterKey(val) {
      this.params.matterKey = val
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../css/common';

.column {
  flex-direction: column;
  flex: 1;
  padding: 0px 40px 40px 0;
}

.header {
  height: 100px;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
}
.search-bar {
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 2240px;
  height: 75px;
  padding-right: 80px;
}

.search-picker {
  @include setBorder($color_weak, 2px, solid);
  border-radius: 4px 0 0 4px;
  width: 400px;
  height: 60px;
}
.out-group {
  font-size: 34px;
  text-align: center;
  opacity: 0.6;
}
</style>
