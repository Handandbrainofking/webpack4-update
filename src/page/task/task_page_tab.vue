<!--办理事项 的tab页面-->
<template>
  <d-layout kind="column" class="task-tab-box" vertical-align="initial" text-align="initial">
    <back-head :beforeBack="doSave"></back-head>
    <DTab
       :tabInitIndex="tabInitIndex"
       mode="text"
       wrap-bg-color="#fff"
       :page-width="tabPageWidth"
       :tab-styles="{headWrapStyle: {overflowY: 'visible'}}"
       :page-height="1480"
       :filter-change-tab="true"
       @beforeChangePage="beforeChangePage">
      <task-tab-item
         :slot="`tab-title-${index}`" slot-scope="titleItem"
         v-bind="titleItem"
         :key="`task-tab-title-${index}`" v-for="(item, index) in tabTitles"></task-tab-item>
      <DTabPage
         class="tab-set-page"
         :title="item.title"
         :key="`task-tab-page-${index}`" v-for="(item, index) in tabTitles">
        <component
           v-if="showView"
           :ref="`task-main-tab-${index}`"
           :is="item.component"
           :matter-key="item.tabKey"
           :trace-item="getTraceList(item.tabKey)"
           :show-btns="judgeMatterStatus(item.tabKey)"
           @upDateTaskId="upDateTaskId"
        ></component>
      </DTabPage>
    </DTab>
  </d-layout>
</template>

<script>
import TaskTabItem from '@/page/task/components/common/taskTabItem.vue'
import BackHead from '@/components/back/head.vue'
import TablePageInterview from './views/task_view_1/task_interview.vue' // 面签页
import tablePageNotarization from './views/task_view_2/task_notarization.vue' // 委托公证页
import TablePageRequirements from './task_requirements.vue' // 要件托管
import TaskApplyLoan from './views/task_view_4/task4-apply-loan.vue' // 申请贷款
import TaskApplyLoanRansom from './views/task_view_4/task4-apply-loan-ransom.vue' // 申请贷款（赎楼贷款）
import TaskCheckRedemption from './views/task_view_5/task5-check-redemption.vue' // 预约赎楼
import TaskLoanRegister from './views/task_view_6/task6-load-register.vue' // 核实同贷
import TaskLoanRegisterRansom from './views/task_view_6/task6-load-register-ransom.vue' // 核实同贷（赎楼贷款）
import TablePageAccountTest from './task_accounttest.vue' // 账户测试
import TablePageCheckFile from './task_checkfile.vue' // 查档
import TaskRedemptionRegister from './views/task_redemption_register.vue' // 赎楼登记
import TaskLogoutInfo from './views/task_logout_info.vue' // 取注销材料
import TaskLogoutMortgage from './views/task_logout_mortgage.vue' // 注销抵押
import TaskTransferIn from './views/task_transfer_in.vue' // 过户递件
import TaskTransferOut from './views/task_transfer_out.vue' // 过户出件
import TaskMortgageIn from './views/task_mortgage_in.vue' // 抵押递件
import TaskMortgageOut from './views/task_mortgage_out.vue' // 抵押出件
import TaskFundAmount from './task_fund_amount.vue' // 确认回款资金到账
import TaskDownHouseSurvey from './task_down_house_survey.vue' // 下户
import { InterviewListKind, ProductKindList } from '@/config'
import { DEFINE_HIDDEN_KEYBORAD, native_common_events } from '@/utils/deal_native'
import Dialog from '@/utils/dialog'

const AllViewList = {
  Interview: TablePageInterview,
  Notarization: tablePageNotarization,
  TrustAccount: TablePageRequirements,
  ApplyLoan: TaskApplyLoan,
  PreRandom: TaskCheckRedemption,
  AgreeLoanMark: TaskLoanRegister,
  AccountTest: TablePageAccountTest,
  QueryArchive: TablePageCheckFile,
  RandomMark: TaskRedemptionRegister,
  GetCancelMaterial: TaskLogoutInfo,
  CancleMortgage: TaskLogoutMortgage,
  TransferIn: TaskTransferIn,
  TransferOut: TaskTransferOut,
  MortgagePass: TaskMortgageIn,
  MortgageOut: TaskMortgageOut,
  paymentArrival: TaskFundAmount,
  ApplyLoan_atone: TaskApplyLoanRansom,
  AgreeLoanMark_atone: TaskLoanRegisterRansom,
   //微众银行先屏蔽掉
  DownHouseSurvey: TaskDownHouseSurvey
}

export default {
  components: {
    TaskTabItem,
    BackHead,
    TablePageInterview,
    tablePageNotarization,
    TablePageRequirements,
    TaskApplyLoan,
    TaskApplyLoanRansom,
    TaskCheckRedemption,
    TaskLoanRegister,
    TaskLoanRegisterRansom,
    TablePageAccountTest,
    TablePageCheckFile,
    TaskRedemptionRegister,
    TaskLogoutInfo,
    TaskLogoutMortgage,
    TaskTransferIn,
    TaskTransferOut,
    TaskMortgageIn,
    TaskMortgageOut,
    TaskFundAmount,
    TaskDownHouseSurvey
  },
  data() {
    return {
      tabTitles: [],
      tabPageWidth: 2524,
      tabInitIndex: 0,
      // 当前置请求处理完成后在进行
      showView: false,
      currentIndex: 0
    }
  },
  computed: {
    matterRecordList() {
      return this.$store.state.orderInfo.orderMatterRecordList || []
    },
    traceList() {
      return this.$store.state.orderTraceList || []
    },
    combineTraceList() {
      const traceList = this.traceList
      const matterRecordList = this.matterRecordList
      return traceList.map(item => {
        const matterRecordItem = matterRecordList.filter(itm => itm.id === item.id)[0] || {}
        item.nodeRemark = matterRecordItem.nodeRemark
        return item
      })
    }
  },
  created() {
    this.initData()
    this.initRequest()
  },

  methods: {
    // 初始化页面数据
    initData() {
      const getPageParams = this.getPageParams
      const productType = getPageParams('productType', true) || 1
      const nodesType = getPageParams('nodesType', true) || 1
      const tabTitles = []
      let tmpItem
      ProductKindList[productType].nodes.forEach((item, index) => {
        tmpItem = InterviewListKind[item]
        tabTitles.push({
          title: tmpItem.name,
          component: AllViewList[tmpItem.key],
          tabKey: tmpItem.key
        })
        if (nodesType === tmpItem.key) {
          this.currentIndex = this.tabInitIndex = index
        }
      })
      this.tabTitles = tabTitles
    },
    // 初始化请求
    initRequest() {
      const getPageParams = this.getPageParams
      const applyNo = this.applyNo = getPageParams('applyNo', true)
      return Promise.all([this.requestOrderTraceList(applyNo), this.requestMatterRecordList(applyNo)]).then(() => {
        this.showView = true
      })
    },
    // 请求事项状态跟踪列表
    requestOrderTraceList(applyNo) {
      return this.$store.dispatch('requestOrderTraceList', applyNo)
    },
    // 请求getOrderModuleInfo orderMatterRecordList
    requestMatterRecordList(applyNo) {
      return this.$store.dispatch('forceRequestOrderInfo', {
        applyNo,
        relationKey: 'orderMatterRecordList'
      })
    },
    // 判断跟踪节点对应的是否是该节点
    judgeNodeFromTraceItem(item, nodeType) {
      return item.matterKey === nodeType && item.isHandled === '0' && item.deleteFlag === '0'
    },

    // 获取事项对应的跟踪节点
    getTraceList(key) {
      const list = this.combineTraceList || []
      const obj = {}
      if (key === 'Interview') {
        obj.NotarizationTaskId = (list.filter(item => this.judgeNodeFromTraceItem(item, 'Notarization'))[0] || {}).relateId
        obj.ApplyLoadTaskId = (list.filter(item => this.judgeNodeFromTraceItem(item, 'ApplyLoan'))[0] || {}).relateId
      } else if (key === 'RandomMark') {
        obj.CancleMortgageTaskId = (list.filter(item => this.judgeNodeFromTraceItem(item, 'CancleMortgage'))[0] || {}).relateId
      }
      return Object.assign({}, list.filter(item => this.judgeNodeFromTraceItem(item, key) && item.isHaveHandleRight === '1')[0] || {}, obj)
    },
    // 判断当前事项是否已经提交，是否可以修改
    judgeMatterStatus(key) {
      const list = this.combineTraceList || []
      return list.filter(item => this.judgeNodeFromTraceItem(item, key) && item.isHaveHandleRight === '1').length > 0
    },
    // 更新事项
    upDateTaskId() {
      this.requestOrderTraceList(this.applyNo)
    },
    // 保存页面操作
    doSave(func) {
      // 切换Tab按钮
      try {
        // 如果有保存方法，则表示需要保存后返回，则调用保存方法，否则直接返回
        let $ref = this.$refs['task-main-tab-' + this.currentIndex]
        if (Array.isArray($ref)) {
          $ref = $ref[0]
        }

        if($ref.commitStastics && $ref.isEnableStatistics){
          $ref.commitStastics()
        }

        if (typeof $ref.doSave === 'function') {
          $ref.doSave((bool, msg) => {
            if (bool === false) {
              Dialog.confirm({
                message: !msg ? '您当前修改的数据还没有保存，是否继续?' : `当前数据保存失败: ${msg}. 是否继续?`
              }, (value) => {
                if (value === '确定') {
                  typeof func === 'function' && func()
                }
              })
            } else {
              typeof func === 'function' && func()
            }
          }, true, true)
        }
        else {
          typeof func === 'function' && func()
        }
      } catch (e) {
        Dialog.confirm({
          message: '您当前修改的数据还没有保存，是否继续？'
        }, (value) => {
          if (value === '确定') {
            typeof func === 'function' && func()
          }
        })
        throw new Error('保存失败')
      }
    },
    // 切换Tab按钮 拦截， 处理相关事件
    beforeChangePage(e, func) {
      const index = e.page
      if (index !== this.currentIndex) {
        this.doSave(() => {
          this.currentIndex = index
          typeof func === 'function' && func()
        })
        native_common_events(DEFINE_HIDDEN_KEYBORAD)
      } else {
        typeof func === 'function' && func()
      }
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .task-tab-box {
    @include setWindowWH();
    @include setPaddingH($normal_gap_column);
  }

  .tab-set-page {
    @include setPaddingH(40px);
  }
</style>
