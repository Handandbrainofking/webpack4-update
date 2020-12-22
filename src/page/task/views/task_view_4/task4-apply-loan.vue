<!--申请贷款-->
<script>
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { ApplyLoanItem } from '@/page/task/config'
import Dialog from '@/utils/dialog'
import { mapGetters } from 'vuex'

export default {
  extends: ExtendTaskBaseView,
  statistics: 'task4ApplyLoan|跟单详情-申请贷款',
  data() {
    return {
      isTitleArrayConfig: true,
      info: ApplyLoanItem,
      bottomBtns: ['保存','提交'],
      requestParams: ['applyOrder', 'customerRelList', 'newLoan', 'dealInfo', 'accountList', 'supervisionList', 'feeSummary', 'orderMatterRecordList'],
      capitalCode: '',
      showChildren: false
    }
  },
  created() {},
  computed: {
    ...mapGetters(['userInfo', 'applyOrder']),
    borrowerTypeValue() {
      const info = this.dealInfoCompatibleArray()
      const borrowerTypeItem = this.findItemByNameBlock(info, 'borrowerType')
      return borrowerTypeItem.value
    },
    accumulationFundExist() {
      const info = this.dealInfoCompatibleArray()
      const isHaveFundLoanItem = this.findItemByNameBlock(info, 'isHaveFundLoan')
      const productType = this.productType
      return (!isHaveFundLoanItem.productType || (isHaveFundLoanItem.productType & productType)) && isHaveFundLoanItem.value === 'Y'
    },
    loanTotalMount() {
      let accumulationFund = 0
      const info = this.dealInfoCompatibleArray()
      const accumulationFundExist = this.accumulationFundExist
      if (accumulationFundExist) {
        const providentFundLoanAmountItem = this.findItemByNameBlock(info, 'providentFundLoanAmount')
        accumulationFund = providentFundLoanAmountItem.value || 0
      }
      const businessSumItem = this.findItemByNameBlock(info, 'businessSum')
      return (Number(accumulationFund) + Number(businessSumItem.value)).toFixed(2)
    }
  },
  watch: {
    borrowerTypeValue(value, oldValue) {
      if (value !== oldValue) {
        let info = this.dealInfoCompatibleArray()
        const sellerNameItem = this.findItemByNameBlock(info, 'sellerName')
        info = this.info[sellerNameItem.blockIndex].children
        if (value === 'PERSONAL') {
          this.$set(info, sellerNameItem.sortIndex, Object.assign({}, sellerNameItem, { type: 'pick', 
          value: sellerNameItem.value || '' }))
        }
        else {
          this.$set(info, sellerNameItem.sortIndex, Object.assign({}, sellerNameItem, { type: 'input' }))
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
    }
  },
  methods: {
    initOtherData() {
      const productType = this.productType
      const info = this.dealInfoCompatibleArray()
      const dataItem = this.dataItem || {}
      // 处理落地行
      if (!(productType & this.getCashProductCode())) {
        this.capitalCode = (this.applyOrder || {}).partnerBankId || ''
      }    
      // 处理转单控制释放
      const userInfo = this.userInfo
      const applyOrder = this.applyOrder
      this.bottomBtns = ['保存', '提交'];
      // 处理贷款期限/利率
      const loanTermsItem = this.findItemByNameBlock(info, 'loanTerms')
      const newLoanRateItem = this.findItemByNameBlock(info, 'newLoanRate')
      loanTermsItem.required = newLoanRateItem.required = productType & 32798
      // 处理新贷款借款人
      const borrowerTypeItem = this.findItemByNameBlock(info, 'borrowerType')
      const sellerNameItem = this.findItemByNameBlock(info, 'sellerName')
      this.dealOrgList(dataItem, sellerNameItem.value, sellerNameItem, borrowerTypeItem.value)
      // 处理新贷款机构，将对应的编号换成名称
      const newLoanBankCodeItem = this.findItemByNameBlock(info, ['newLoanBankCode', 'newLoanBankName'])
      this.initOrgList(newLoanBankCodeItem.sortIndex, newLoanBankCodeItem)
      // 处理循环授信贷款
      const revolveCreditLoanItem = this.findItemByNameBlock(info, 'revolvingCreditFlag')
      this.doChangeRevolyeCreditLoan(revolveCreditLoanItem.sortIndex, revolveCreditLoanItem.value, revolveCreditLoanItem, revolveCreditLoanItem.blockIndex)
      // 处理住房公积金
      const isHaveFundLoanItem = this.findItemByNameBlock(info, 'isHaveFundLoan')
      this.doChangeAccumulationFund(isHaveFundLoanItem.sortIndex, isHaveFundLoanItem.value, isHaveFundLoanItem, isHaveFundLoanItem.blockIndex)
      // 处理资金监管
      const hasFundSupervisionItem = this.findItemByNameBlock(info, 'hasFundSupervision')
      this.doChangeRegulatory(hasFundSupervisionItem.sortIndex, hasFundSupervisionItem.value, hasFundSupervisionItem, hasFundSupervisionItem.blockIndex)
      // 处理监管卡
      this.changeSaleKind()
      // 处理贷款合计
      const totalMoneyItem = this.findItemByNameBlock(info, 'totalMoney')
      this.$set(this.info[totalMoneyItem.blockIndex].children, totalMoneyItem.sortIndex, Object.assign({}, totalMoneyItem, { value: this.loanTotalMount }))
      this.showChildren = true
    },
    // 修改数据
    changeValue(key, blockIndex, idx, item, value, name) {
      const _value = item.value
      const info = this.info[blockIndex].children
      if (String(_value) !== value) {
        this.valueChanged = true
        if (key === 'isHaveFundLoan') {
          this.doChangeAccumulationFund(idx, value, item, blockIndex)
        } else if (key === 'hasFundSupervision') {
          this.doChangeRegulatory(idx, value, item, blockIndex)
        } else if(key === 'revolvingCreditFlag') {
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
    // 选择公积金
    doChangeAccumulationFund(idx, value, item, blockIndex) {
      const info = this.info[blockIndex].children
      info[idx + 1].hidden = info[idx + 2].hidden = info[idx + 3].hidden = value !== 'Y'
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
    // 处理监管回款卡
    changeSaleKind() {
      const dataItem = this.dataItem || {}
      const cardList = dataItem.accountList || []
      const info = this.dealInfoCompatibleArray()
      const nameItem = this.findItemByNameBlock(info, 'name', 'accountList')
      const numberItem = this.findItemByNameBlock(info, 'number', 'accountList')
      const openBankNoItem = this.findItemByNameBlock(info, ['openBankNo', 'openBank'], 'accountList')
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
    // 对识别的图像进行上传
    uploadCameraImage(data) {
      this.uploadViewCameraImage(data)
    },
    // 处理提交保存验证
    doValidate(bool) {
      const info = this.dealInfoCompatibleArray()
      let bizLoanQuota = this.findItemByNameBlock(info, 'bizLoanAmount')
      let applyWithdrawAmount = this.findItemByNameBlock(info, 'applyWithdrawAmount')
      if(parseFloat(bizLoanQuota.value) < parseFloat(applyWithdrawAmount.value) && bool) {
        Dialog.toast('申请提款金额大于商业贷款金额，不可提交保存')
        return false
      }
      let resultInfo = this.validBaseData(bool)
      if (resultInfo === false) {
        return false
      }
      else if (resultInfo === true) {
        return true
      }
      else if (typeof resultInfo === 'object') {
        if (resultInfo.accountList) {
          let accountList = resultInfo.accountList
          if (Array.isArray(accountList)) {
            accountList = accountList[0]
          }
          const type = accountList.type = 'JGHKK'
          const dataItem = this.dataItem || {}
          const cardList = dataItem.accountList || []
          for (let i in cardList) {
            if (cardList[i].type === type) {
              // 处理id
              accountList['id'] = cardList[i].id
              break
            }
          }
        }
        return this.dealSaveDataObjectToArray(resultInfo)
      }
      return true
    }
  }
}
</script>
