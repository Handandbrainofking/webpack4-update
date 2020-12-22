<!--
  function: taskBaseView
  author  : wq
  update  : 2018/11/30 15:41
-->
<template>
  <task-base-view
     ref="task-base-view"
     :show-children="showChildren"
     :info="info"
     :apply-no="applyNo"
     :matter-key="matterKey"
     :product-code="productCode"
     :show-footer-btn="showBtns"
     :bottom-btns="getBottomBtns"
     :is-title-array-config="isTitleArrayConfig"
     @input="changeValue"
     @clickEnclosure="clickEnclosure"
     @clickBottomBtn="clickBottomBtn"
     @chooseGroundBank="doChooseGroundBank"
     @chooseOrgBank="doChooseOrg"
     @analysisImage="doAnalysisImage"
  ></task-base-view>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'
import MixinTaskSave from '@/page/task/mixins/mixinTaskSave'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: 'extendTaskBaseView',
  components: {
    TaskBaseView
  },
  mixins: [MixinTaskViewIndex, MixinTaskSave],
  data() {
    return {
      productType: 0,
      showChildren: true,
      isTitleArrayConfig: false,
      bottomBtns: undefined,
      refChild: null
    }
  },
  computed: {
    ...mapGetters({
      dataItem: 'orderInfo',
      applyOrder: 'applyOrder',
      userInfo: 'userInfo'
    }),
    getBottomBtns() {
      const userInfo = this.userInfo
      const applyOrder = this.applyOrder
      return  this.bottomBtns || ['保存', '提交']
    }
  },
  beforeSave(isCommit, data){
    if(typeof this.validateSave === 'function'){
      return this.validateSave(isCommit, data)
    }
    return data
  },
  methods: {
    clickBottomBtn(index, item, e) {
      let nativeId = ''
      let nativeName = ''
      switch (this.matterKey) {
        case 'Interview':
          nativeId = 'Interview'
          nativeName = '面签（task_interview.vue）'
          break
           //微众银行先屏蔽掉
        case 'DownHouseSurvey':
          nativeId = 'DownHouseSurvey'
          nativeName = '下户（task_down_house_suvey.vue）'
          break
        case 'ApplyLoan':
          nativeId = 'ApplyLoan'
          nativeName = '申请贷款（task4）'
          break
        case 'PreRandom':
          nativeId = 'PreRandom'
          nativeName = '预约赎楼（task5）'
          break
        case 'AgreeLoanMark':
          nativeId = 'AgreeLoanMark'
          nativeName = '核实同贷（task6）'
          break
        case 'RandomMark':
          nativeId = 'RandomMark'
          nativeName = '赎楼登记-'
          break
        case 'GetCancelMaterial':
          nativeId = 'GetCancelMaterial'
          nativeName = '取注销材料-'
          break
        case 'CancleMortgage':
          nativeId = 'CancleMortgage'
          nativeName = '注销抵押-'
          break
        case 'TransferIn':
          nativeId = 'TransferIn'
          nativeName = '过户递件-'
          break
        case 'TransferOut':
          nativeId = 'TransferOut'
          nativeName = '过户出件-'
          break
        case 'MortgagePass':
          nativeId = 'MortgagePass'
          nativeName = '抵押递件-'
          break
        case 'MortgageOut':
          nativeId = 'MortgageOut'
          nativeName = '抵押出件-'
          break
        case 'paymentArrival':
          nativeId = 'paymentArrival'
          nativeName = '确认回款资金到账-'
          break
        case 'ApplyLoan_atone':
          nativeId = 'ApplyLoan_atone'
          nativeName = '申请贷款(赎楼贷款:-'
          break
        case 'AgreeLoanMark_atone':
          nativeId = 'AgreeLoanMark_a'
          nativeName = '核实同贷(赎楼贷款)-'
      }
      switch (item) {
        case '终止':
          native_eventStatistic(nativeId + 'End', nativeName + '终止')
          break
        case '保存':
          native_eventStatistic(nativeId + 'Save', nativeName + '保存')
          break
        case '提交':
          native_eventStatistic(nativeId + 'Submit', nativeName + '提交')
          break
        case '驳回':
          native_eventStatistic(nativeId + 'Submit', nativeName + '驳回')
          break
        default:
          break
      }
      this.doClickBtn(index, item, e)
    },
    afterCreated() {
      this.productType = this.getProductType(this.productCode)
      this.requestOrderInfo(this.applyNo)
        .then(data => {
          this.initData()
          this.initOtherData()
        })
    },
    initOtherData(data) {
    },
    clickEnclosure() {}
  }
}
</script>
