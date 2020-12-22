<!--同贷信息登记-->
<template>
  <task-base-view
     ref="task-base-view"
     :show-children="showChildren"
     :info="info"
     :apply-no="applyNo"
     :matter-key="matterKey"
     :product-code="productCode"
     :show-footer-btn="showBtns"
     :bottom-btns="bottomBtns"
     :is-title-array-config="isTitleArrayConfig"
     :confirm-submit="confirmSubmit"
     @input="changeValue"
     @clickEnclosure="clickEnclosure"
     @clickBottomBtn="clickBottomBtn"
     @chooseGroundBank="doChooseGroundBank"
     @chooseOrgBank="doChooseOrg"
     @analysisImage="doAnalysisImage"
     @cancelConfirm="cancelConfirm"
     @clickConfirm="clickConfirm">
    <div
       slot-scope="cardItem"
       style="width: 2406px;"
       slot="slot-card-item">
      <d-add-list
         :list="filterList"
         :height="280"
         title="回款卡"
         :can-edit-server="false">
        <task-loan-form-card
           slot-scope="cardItem"
           :ref="`valid-card-item-${cardItem.listItem.idx}`"
           :data-item="cardItem.listItem"
           @changeValue="innerChangeValue"></task-loan-form-card>
      </d-add-list>
    </div>
  </task-base-view>
</template>
<script>
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import { AgreeLoanMarkItem } from '@/page/task/config'
import { IncomeCardType } from '@/config/index'
import TaskLoanFormCard from './form-card.vue'
import Dialog from '@/utils/dialog'
import { mapGetters } from 'vuex'

export default {
  statistics: 'loadRegister|跟单详情-核实同贷',
  extends: ExtendTaskBaseView,
  components: {
    TaskBaseView,
    TaskLoanFormCard
  },
  mixins: [MixinTaskIndex],
  data() {
    return {
      isTitleArrayConfig: true,
      queryDockingResult: 2,
      info: AgreeLoanMarkItem,
      bottomBtns: ['保存','提交'],
      requestParams: ['applyOrder', 'customerRelList', 'newLoan', 'dealInfo', 'accountList', 'supervisionList', 'feeSummary', 'orderMatterRecordList'],
      capitalCode: '',
      isWeBank: false,
      showChildren: false,
      confirmSubmit: {
        show: false,
        title: '确认提交',
        content: '银行终审不需要提放保，请终止该提放保订单'
      },
      isConfirmed: false
    }
  },
  created(){},
  computed: {
    ...mapGetters(['userInfo', 'applyOrder']),
    borrowerTypeValue() {
      const info = this.dealInfoCompatibleArray()
      const borrowerTypeItem = this.findItemByNameBlock(info, 'borrowerType')
      return borrowerTypeItem.value
    },
    agreeLoanSourceValue(){
      const info = this.dealInfoCompatibleArray()
      const agreeLoanSourceItem = this.findItemByNameBlock(info, 'agreeLoanSource')
      return agreeLoanSourceItem.value
    },
    loanTotalMount() {
      let accumulationFund = 0
      const info = this.dealInfoCompatibleArray()
      const providentFundLoanAmountItem = this.findItemByNameBlock(info, 'providentFundLoanAmount')
      accumulationFund = providentFundLoanAmountItem.value || 0
      const businessSumItem = this.findItemByNameBlock(info, 'bizLoanAmount')
      return (Number(accumulationFund) + Number(businessSumItem.value)).toFixed(2)
    },
    filterList() {
      const info = this.dealInfoCompatibleArray()
      const productType = this.productType
      const refundSourceItem = this.findItemByNameBlock(info, 'refundSource')
      if (!refundSourceItem.productType || (productType & refundSourceItem.productType)) {
        return this.dealIncomeCard(refundSourceItem.sortIndex, refundSourceItem.value, refundSourceItem, refundSourceItem.blockIndex)
      }
      else {
        return []
      }
    }
  },
  watch: {
    borrowerTypeValue(value, oldValue) {
      if (value !== oldValue) {
        let info = this.dealInfoCompatibleArray()
        const sellerNameItem = this.findItemByNameBlock(info, 'sellerName')
        info = this.info[sellerNameItem.blockIndex].children
        if (value === 'PERSONAL') {
          this.$set(info, sellerNameItem.sortIndex, Object.assign({}, sellerNameItem, { type: 'pick' }))
        }
        else {
          this.$set(info, sellerNameItem.sortIndex, Object.assign({}, sellerNameItem, { type: 'input' }))
        }
      }
    },
    agreeLoanSourceValue(value, oldValue) {
      if (value !== oldValue) {
      		let info = this.dealInfoCompatibleArray()
      		const agreeLoanOtherRemarkItem = this.findItemByNameBlock(info, 'agreeLoanOtherRemark')
      		//若选择【其他】，则跳出输入框，必填，支持录入
      		if(value === 'Other'){
      			agreeLoanOtherRemarkItem.hidden = false;
      		}else{
      			agreeLoanOtherRemarkItem.hidden = true;
      			agreeLoanOtherRemarkItem.value='';
      		}
      		//若选择【电话核实】，则“新贷款机构联系人”及“新贷款机构联系方式”为必填项；
     		if(value === 'TelephoneVerification'){
     			this.findItemByNameBlock(info, 'newBankPhone').required = true;
     			this.findItemByNameBlock(info, 'newBankUser').required = true;
     		}else{
     			this.findItemByNameBlock(info, 'newBankPhone').required = false;
     			this.findItemByNameBlock(info, 'newBankUser').required = false;
     		}
      }
    },
    loanTotalMount(value, oldValue) {
      if (value !== oldValue) {
        let info = this.dealInfoCompatibleArray()
        const totalMoneyItem = this.findItemByNameBlock(info, 'totalMoney')
        info = this.info[totalMoneyItem.blockIndex].children
        this.$set(info, totalMoneyItem.sortIndex, Object.assign({}, totalMoneyItem, { value }))
      }
    },
  },
  methods: {
    initOtherData() {
      const productType = this.productType
      const productCode = this.productCode
      const info = this.dealInfoCompatibleArray()
      const dataItem = this.dataItem || {}
      // 处理落地行
      if (!(productType & this.getCashProductCode())) {
        this.capitalCode = (this.applyOrder || {}).partnerBankId || ''
      }
      // 处理转单控制释放
      const userInfo = this.userInfo
      const applyOrder = this.applyOrder
      this.bottomBtns = ['保存', '提交']
      // 处理借款合同编号
      let borrowContRequired = (applyOrder.partnerBankId === 'BIZHZYHJT' || applyOrder.partnerBankId === 'BIZHZYHYC' ||applyOrder.partnerBankId === 'BIZHZYHHZYH') && applyOrder.partnerInsuranceId === 'BIZBXGSTP'
      if(borrowContRequired) {
        const borrowContNoItem = this.findItemByNameBlock(info, 'borrowContNo')
        borrowContNoItem.required = true
      }
      // 处理贷款期限/利率
      const loanTermsItem = this.findItemByNameBlock(info, 'loanTerms')
      const newLoanRateItem = this.findItemByNameBlock(info, 'newLoanRate')
      loanTermsItem.required = newLoanRateItem.required = productType & 32798
      // 处理监管卡
      if (productCode === 'TFB_NSL_NJY_ISR') {
        const hasFundSupervisionItem = this.findItemByNameBlock(info, 'hasFundSupervision')
        const fundSupervisionInfo = this.info[hasFundSupervisionItem.blockIndex].children
        const nameItem = this.findItemByNameBlock(fundSupervisionInfo, 'name')
        const idx = nameItem.sortIndex
        fundSupervisionInfo[idx].required = fundSupervisionInfo[idx + 1].required = fundSupervisionInfo[idx + 2].required = false
      }
       // 处理循环授信贷款
      const revolveCreditLoanItem = this.findItemByNameBlock(info, 'revolvingCreditFlag')
      this.doChangeRevolyeCreditLoan(revolveCreditLoanItem.sortIndex, revolveCreditLoanItem.value, revolveCreditLoanItem, revolveCreditLoanItem.blockIndex)
      // 处理新贷款借款人
      const borrowerTypeItem = this.findItemByNameBlock(info, 'borrowerType')
      const sellerNameItem = this.findItemByNameBlock(info, 'sellerName')
      this.dealOrgList(dataItem, sellerNameItem.value, sellerNameItem, borrowerTypeItem.value)
      // 处理新贷款机构，将对应的编号换成名称
      const newLoanBankCodeItem = this.findItemByNameBlock(info, ['newLoanBankCode', 'newLoanBankName'])
      this.initOrgList(newLoanBankCodeItem.sortIndex, newLoanBankCodeItem)
      // 处理资金监管
      const hasFundSupervisionItem = this.findItemByNameBlock(info, 'hasFundSupervision')
      this.doChangeRegulatory(hasFundSupervisionItem.sortIndex, hasFundSupervisionItem.value, hasFundSupervisionItem, hasFundSupervisionItem.blockIndex)
      // 处理监管卡
      this.changeSaleKind()
      // 处理周转卡
      const zzNameItem = this.findItemByNameBlock(this.info[5].children, 'name')
      if (!zzNameItem.productType || (productType & zzNameItem.productType)) {
        this.dealWeekCard(zzNameItem.sortIndex, zzNameItem.value, zzNameItem, zzNameItem.blockIndex)
      }
      // 处理贷款合计
      const totalMoneyItem = this.findItemByNameBlock(info, 'totalMoney')
      this.$set(this.info[totalMoneyItem.blockIndex].children, totalMoneyItem.sortIndex, Object.assign({}, totalMoneyItem, { value: this.loanTotalMount }))
      this.showChildren = true;

      //同贷来源
      const agreeLoanSourceItem = this.findItemByNameBlock(info, 'agreeLoanSource')
      //处理杭州银行是否选择提放保
      if(applyOrder.thirdpartyName && applyOrder.thirdpartyName === 'HZB' || applyOrder.thirdpartyName === 'BIZHZYHHZYH' || applyOrder.thirdpartyName ==='WZB') {
        const queryDockingResultItem = this.findItemByNameBlock(info, 'queryDockingResult')
        this.isWeBank = applyOrder.thirdpartyName ==='WZB'? true : false
        this.setqueryDockingResult(queryDockingResultItem.sortIndex, queryDockingResultItem.value, queryDockingResultItem, queryDockingResultItem.blockIndex)
      }

    },
    // 修改数据
    changeValue(key, blockIndex, idx, item, value, name) {
      const _value = item.value
      const info = this.info[blockIndex].children
      if (String(_value) !== value) {
        this.valueChanged = true
        if (key === 'hasFundSupervision') {
          this.doChangeRegulatory(idx, value, item, blockIndex)
        }else if(key === 'revolvingCreditFlag') {
          this.doChangeRevolyeCreditLoan(idx, value, item, blockIndex)
        }
        if (Array.isArray(key) && key.length === 2) {
          this.$set(info, idx, Object.assign({}, item, { values: [value, name], value, changed: true }))
        } else {
          this.$set(info, idx, Object.assign({}, item, { value, changed: true }))
        }
      }
    },
    // 点击附件，打开选择等
    clickEnclosure(key, blockIndex, idx, item, event) {
      if (this.compareObj(key, ['newLoanBankCode', 'newLoanBankName'])) {
        this.openLoanBankDialog(key, idx, item, blockIndex)
      }
      else if (this.compareObj(key, ['openBankNo', 'openBank'])) {
        this.doOpenChooseOrg(key, idx, item, blockIndex)
      }
      else if (key === 'number') {
        this.openCamera(key, idx, item, blockIndex)
      }
    },
    // 选择循环授信贷款
    doChangeRevolyeCreditLoan(idx, value, item, blockIndex) {
      const info = this.info[blockIndex].children
      info[idx + 1].hidden = value !== '1'
    },
    // 选择资金监管
    doChangeRegulatory(idx, value, item, blockIndex) {
      const info = this.info[blockIndex].children
      info[idx + 1].hidden = info[idx + 2].hidden = info[idx + 3].hidden = info[idx + 4].hidden = value !== 'Y'
    },
    // 处理杭州/微众银行提放保
    setqueryDockingResult(idx, value, item, blockIndex) {
      const info = this.info[blockIndex].children
      if(this.isWeBank) {
        info[idx-7].readonly = info[idx-6].readonly = info[idx-3].readonly = true
      } else {
        info[idx-7].readonly = info[idx-6].readonly = info[idx-3].readonly = info[idx-4].readonly = true
        info[idx].hidden = false
      }
      this.$store.dispatch('getQueryDockingResult', {applyNo: this.applyNo, busType: 'FINAL_APPROVE_RESULT'})
       .then(data =>{
          if( !data || data.length == 0) {
            this.queryDockingResult = 0
          }
          else {
            let result = data[0] && data[0].result
            if(result === 'Y') {
              this.queryDockingResult = 1
            }
            if(result === 'N') {
              this.queryDockingResult = -1
            }
            let advanceLoan = data[0] && data[0].data && JSON.parse(data[0].data).advanceLoan
            if(!this.isWeBank && advanceLoan === '0' && result === 'Y') {
              //“搭配提放保”
              this.$set(info, idx, Object.assign({}, item, { index: 0 }))
            } else if(!this.isWeBank && advanceLoan !== '0' && result === 'Y') {
              //“未搭配提放保”
              this.$set(info, idx, Object.assign({}, item, { index: 2 }))
            }
          }
       })
    },
    // 处理监管款卡
    changeSaleKind() {
      const dataItem = this.dataItem || {}
      const cardList = dataItem.accountList || []
      const info = this.dealInfoCompatibleArray()
      const hasFundSupervisionItem = this.findItemByNameBlock(info, 'hasFundSupervision')
      const fundSupervisionInfo = this.info[hasFundSupervisionItem.blockIndex].children
      const nameItem = this.findItemByNameBlock(fundSupervisionInfo, 'name', 'accountList')
      const numberItem = this.findItemByNameBlock(fundSupervisionInfo, 'number', 'accountList')
      const openBankNoItem = this.findItemByNameBlock(fundSupervisionInfo, ['openBankNo', 'openBank'], 'accountList')
      const type = 'JGHKK'
      for (let i in cardList) {
        if (cardList[i].type === type) {
          // 处理数值
          const tmp = cardList[i] || {}
          nameItem.value = tmp['name']
          numberItem.value = tmp['number']
          openBankNoItem.value = tmp['openBank']
          openBankNoItem.values = [tmp['openBankNo'], tmp['openBank']]
          break
        }
      }
    },
    // 处理回款卡
    dealIncomeCard(idx, value, item, blockIndex) {
      const dataItem = this.dataItem || {}
      const cardList = dataItem.accountList || []
      const list = []
      const obj = {}
      IncomeCardType.forEach(item => {
        obj[item.key] = true
      })
      for (let i in cardList) {
        if (obj[cardList[i].type]) {
          // 处理数值
          list.push(Object.assign({}, cardList[i]))
        }
      }
      return list
    },
    cancelConfirm() {
      this.confirmSubmit.show = false
    },
    clickConfirm() {
      this.confirmSubmit.show = false
      this.isConfirmed = true
    },
    // 处理周转卡
    dealWeekCard(idx, value, item, blockIndex) {
      const dataItem = this.dataItem || {}
      const cardList = dataItem.accountList || []
      const info = this.info[blockIndex].children
      const nameItem = this.findItemByNameBlock(info, 'name', 'accountList')
      const numberItem = this.findItemByNameBlock(info, 'number', 'accountList')
      const openBankNoItem = this.findItemByNameBlock(info, ['openBankNo', 'openBank'], 'accountList')
      const type = 'XDKSKK'
      for (let i in cardList) {
        if (cardList[i].type === type) {
          // 处理数值
          const tmp = cardList[i] || {}
          nameItem.value = tmp['name']
          numberItem.value = tmp['number']
          openBankNoItem.value = tmp['openBank']
          openBankNoItem.values = [tmp['openBankNo'], tmp['openBank']]
          break
        }
      }
    },
    // 对识别的图像进行上传
    uploadCameraImage(data) {
      this.uploadViewCameraImage(data)
      this.uploadChildrenCameraImage(data)
    },
    // 处理提交保存验证
    doValidate(bool) {
      const info = this.dealInfoCompatibleArray()
      let bizLoanQuota = this.findItemByNameBlock(info, 'bizLoanAmount')
      let applyWithdrawAmount = this.findItemByNameBlock(info, 'applyWithdrawAmount')
      let tfbConfirmSubmit = this.findItemByNameBlock(info, 'queryDockingResult')
      if(bool && !this.isConfirmed && tfbConfirmSubmit.index === 2) {
        this.confirmSubmit.show = true
        return false
      }
      if(parseFloat(bizLoanQuota.value) < parseFloat(applyWithdrawAmount.value) && bool){
        Dialog.toast('申请提款金额大于商业贷款金额，不可提交')
        return false
      }
      if(bool && this.queryDockingResult === 0) {
        Dialog.toast('银行未返回终审结果，不可提交')
        return false
      }
      if(bool && this.queryDockingResult === -1) {
        Dialog.toast('银行终审拒绝，请终止订单')
        return false
      }
      let resultInfo = this.validBaseData(bool)
      if (resultInfo === false) {
        return false
      }
      else {
        const childrenValidate = this.validateChildren(bool)
        if (childrenValidate === false) {
          return false
        }
        let existChild = true
        if (childrenValidate === true) {
          existChild = false
        }
        if (resultInfo === true) {
          return childrenValidate
        }
        else if (typeof resultInfo === 'object') {
          if (resultInfo.accountList) {
            let accountList = resultInfo.accountList
            const dataItem = this.dataItem || {}
            const cardList = dataItem.accountList || []
            const info = this.dealInfoCompatibleArray()
            const hasFundSupervision = this.findItemByNameBlock(info, 'hasFundSupervision')
            let type
            // 资金监管没有影响，则这个卡时监管卡， 否则是周转卡
            if (!hasFundSupervision.hidden) {
              type = 'JGHKK'
            }
            else {
              type = 'XDKSKK'
            }
            if (Array.isArray(accountList)) {
              accountList = accountList[0]
            }
            accountList.type = type
            for (let i in cardList) {
              if (cardList[i].type === type) {
                // 处理id
                accountList['id'] = cardList[i].id
                break
              }
            }
          }
          if (!existChild) {
            return this.dealSaveDataObjectToArray(resultInfo)
          }
          else {
            return this.deepAssignObject(this.dealSaveDataObjectToArray(resultInfo), childrenValidate)
          }
        }
        return childrenValidate
      }
    },
    resetInfo() {
      this.resetViewBaseInfo()
      this.resetChildrenInfo()
    }
  }
}
</script>
