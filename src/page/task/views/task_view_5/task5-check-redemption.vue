<!--预约赎楼-->
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
     @input="changeValue"
     @clickEnclosure="clickEnclosure"
     @clickBottomBtn="clickBottomBtn"
     @chooseGroundBank="doChooseGroundBank"
     @chooseOrgBank="doChooseOrg"
     @analysisImage="doAnalysisImage">
    <d-add-list
       slot="slot-card-item"
       slot-scope="item"
       :list="filterList"
       :height="280"
       title="供楼卡"
       :can-edit-server="false">
      <task-loan-form-card
         slot-scope="cardItem"
         :width="2364"
         :ref="`valid-card-item-${cardItem.listItem.idx}`"
         :data-item="cardItem.listItem"
         @changeValue="innerChangeValue"></task-loan-form-card>
    </d-add-list>
  </task-base-view>
</template>
<script>
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import { PreRandomItem } from '@/page/task/config'
import TaskLoanFormCard from './supply_card.vue'

export default {
  statistics: 'checkRedemption|跟单详情-预约赎楼',
  extends: ExtendTaskBaseView,
  components: {
    TaskBaseView,
    TaskLoanFormCard
  },
  mixins: [MixinTaskIndex],
  data() {
    return {
      isTitleArrayConfig: true,
      info: PreRandomItem,
      bottomBtns: ['保存', '提交'],
      requestParams: ['applyOrder', 'customerRelList', 'oriLoan', 'orderMatterRecordList', 'accountList'],
      capitalCode: '',
      showChildren: false
    }
  },
  created() {},
  computed: {
    borrowerTypeValue() {
      const info = this.dealInfoCompatibleArray()
      const borrowerTypeItem = this.findItemByNameBlock(info, 'borrowerType')
      return borrowerTypeItem.value
    },
    accumulationFundExist() {
      const info = this.dealInfoCompatibleArray()
      const item = this.findItemByNameBlock(info, 'fundLoanFlag')
      return (!item.productType || (item.productType & this.productType)) && item.value === 'Y'
    },
    relativeFundExist() {
      const info = this.dealInfoCompatibleArray()
      const item = this.findItemByNameBlock(info, 'isRelationLoan')
      return (!item.productType || (item.productType & this.productType)) && item.value === 'Y'
    },
    loanTotalMount() {
      let accumulationFund = 0
      let relativeFund = 0
      const info = this.dealInfoCompatibleArray()
      const itemBalance = this.findItemByNameBlock(info, 'busiDeductPrincipalBalance')
      const accumulationFundExist = this.accumulationFundExist
      if (accumulationFundExist) {
        const item = this.findItemByNameBlock(info, 'fundDeductBalance')
        accumulationFund = item.value || 0
      }
      if (this.relativeFundExist) {
        const item = this.findItemByNameBlock(info, 'relationLoanBalance')
        relativeFund = item.value || 0
      }
      return (Number(accumulationFund) + Number(itemBalance.value || 0) + Number(relativeFund)).toFixed(2)
    },
    filterList() {
      const info = this.dealInfoCompatibleArray()
      const productType = this.productType
      const refundSourceItem = this.findItemByNameBlock(info, 'slotCardItem')
      if (!refundSourceItem.productType || (productType & refundSourceItem.productType)) {
        return this.changeSaleKind(refundSourceItem.sortIndex, refundSourceItem.value, refundSourceItem, refundSourceItem.blockIndex)
      }
      else {
        return []
      }
    }
  },
  watch: {
    loanTotalMount(value, oldValue) {
      if (value !== oldValue) {
        let info = this.dealInfoCompatibleArray()
        const totalMoneyItem = this.findItemByNameBlock(info, 'totalMoney')
        info = this.info[totalMoneyItem.blockIndex].children
        this.$set(info, totalMoneyItem.sortIndex, Object.assign({}, totalMoneyItem, {value}))
      }
    }
  },
  methods: {
    initOtherData() {
      const productType = this.productType
      const info = this.dealInfoCompatibleArray()
      const dataItem = this.dataItem || {}
      if (!(productType & this.getCashProductCode())) {
        this.capitalCode = (this.applyOrder || {}).partnerBankId || ''
      }
      // 处理转单控制释放
      const userInfo = this.userInfo
      const applyOrder = this.applyOrder
      this.bottomBtns = ['保存', '提交']
      // 处理原贷款借款人
      const borrowerTypeItem = this.findItemByNameBlock(info, 'borrowerType')
      const oriLoanPayeeItem = this.findItemByNameBlock(info, 'oriLoanPayee')
      if (oriLoanPayeeItem.index < 0 && oriLoanPayeeItem.value) {
        this.$set(this.info[0].children, oriLoanPayeeItem.sortIndex, Object.assign({}, oriLoanPayeeItem, {defaultValue: oriLoanPayeeItem.value}))
      }
      this.dealOrgList(dataItem, oriLoanPayeeItem.value, oriLoanPayeeItem, borrowerTypeItem.value)

      // 处理原贷款机构，将对应的编号换成名称
      const oriLoanBankCodeItem = this.findItemByNameBlock(info, ['oriLoanBankCode', 'oriLoanBankName'])
      this.initOrgList(oriLoanBankCodeItem.sortIndex, oriLoanBankCodeItem)
      // 处理住房公积金
      const fundLoanFlagItem = this.findItemByNameBlock(info, 'fundLoanFlag')
      this.doChooseLoadFund(fundLoanFlagItem.sortIndex, fundLoanFlagItem.value, fundLoanFlagItem, fundLoanFlagItem.blockIndex)
      // 处理二押
      const hasSecondMortgageItem = this.findItemByNameBlock(info, 'hasSecondMortgage')
      this.doChooseSecondMortgage(hasSecondMortgageItem.sortIndex, hasSecondMortgageItem.value, hasSecondMortgageItem, hasSecondMortgageItem.blockIndex)
      const isRelationLoanItem = this.findItemByNameBlock(info, 'isRelationLoan')
      this.doChooseLoadRelation(isRelationLoanItem.sortIndex, isRelationLoanItem.value, isRelationLoanItem, isRelationLoanItem.blockIndex)
      // 处理贷款合计
      const totalMoneyItem = this.findItemByNameBlock(info, 'totalMoney')
      this.$set(this.info[totalMoneyItem.blockIndex].children, totalMoneyItem.sortIndex, Object.assign({}, totalMoneyItem, {value: this.loanTotalMount}))
      this.showChildren = true
    },
    // 修改数据
    changeValue(key, blockIndex, idx, item, value, name) {
      const _value = item.value
      const info = this.info[blockIndex].children
      if (String(_value) !== value) {
        this.valueChanged = true
        if (key === 'hasSecondMortgage') {
          this.doChooseSecondMortgage(idx, value, item, blockIndex)
        } else if (key === 'fundLoanFlag') {
          this.doChooseLoadFund(idx, value, item, blockIndex)
        } else if (key === 'isRelationLoan') {
          this.doChooseLoadRelation(idx, value, item, blockIndex)
        }
        if (Array.isArray(key) && key.length === 2) {
          this.$set(info, idx, Object.assign({}, item, {values: [value, name], value, changed: true}))
        } else {
          this.$set(info, idx, Object.assign({}, item, {value, changed: true}))
        }
      }
    },
    // 点击附件，打开选择等
    clickEnclosure(key, blockIndex, idx, item, event) {
      if (this.compareObj(key, ['oriLoanBankCode', 'oriLoanBankName'])) {
        this.doOpenChooseOrg(key, idx, item, blockIndex)
      }
      else if (this.compareObj(key, ['openBankNo', 'openBank'])) {
        this.doOpenChooseOrg(key, idx, item, blockIndex)
      }
      else if (key === 'number') {
        this.openCamera(key, idx, item, blockIndex)
      }
    },
    // 选择 是否二押
    doChooseSecondMortgage(idx, value, item, blockIndex) {
      const info = this.info[blockIndex].children
      info[idx + 1].hidden = (value !== 'Y')
      if (value === 'N') {
        info[idx + 1].value = 0
        info[idx + 1].changed = true
      }
    },
    // 选择公积金贷款
    doChooseLoadFund(idx, value, item, blockIndex) {
      const info = this.info[blockIndex].children
      info[idx + 1].hidden = info[idx + 2].hidden = info[idx + 3].hidden = value !== 'Y'
    },
    // 选择关联贷款
    doChooseLoadRelation(idx, value, item, blockIndex) {
      const info = this.info[blockIndex].children
      info[idx + 1].hidden = value !== 'Y'
    },
    // 处理供楼卡
    changeSaleKind() {
      const dataItem = this.dataItem || {}
      const cardList = dataItem.accountList || []
      const type = 'GLK'
      const list = []
      for (let i in cardList) {
        if (cardList[i].type === type) {
          // 处理数值
          list.push(Object.assign({}, cardList[i]))
        }
      }
      return list
    },
    // 对识别的图像进行上传
    uploadCameraImage(data) {
      this.uploadViewCameraImage(data)
      this.uploadChildrenCameraImage(data)
    },
    // 处理提交保存验证
    doValidate(bool) {
      let resultInfo = this.validBaseData(bool)
      if (resultInfo === false) {
        return false
      } else {
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
            if (Array.isArray(accountList)) {
              accountList = accountList[0]
            }
            const type = accountList.type = 'GLK'
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
          if (!existChild) {
            return this.dealSaveDataObjectToArray(resultInfo)
          }
          else {
            return this.deepAssignObject(this.dealSaveDataObjectToArray(resultInfo), childrenValidate)
          }
        }
        return childrenValidate
      }
    }
  }
}
</script>
