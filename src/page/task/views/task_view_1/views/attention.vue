<!-- 面签事项 -->
<template>
  <div class="interview-attention-box">
    <task-base-view ref="task-base-view" :show-children="showChildren" :info="info" :apply-no="applyNo" :matter-key="matterKey"
      :product-code="productCode" :show-footer-btn="showBtns" :bottom-btns="[]" :has-upload="false"
      :is-title-array-config="false" @input="changeValue" @clickEnclosure="clickEnclosure" @clickBottomBtn="doClickBtn"
      @chooseGroundBank="doChooseGroundBank" @chooseOrgBank="doChooseOrg" @analysisImage="doAnalysisImage">
      <d-layout slot="head" class="interview-attention-head" text-align="center" :full-parent="false">
        <text class="head-title">产品名称 　{{ productName }}</text>
      </d-layout>
    </task-base-view>
    <task-choose-dialog v-if="dialogInfo" dialog-title='房产区域' :dialog-top="208" :body-list="dialogList" :head-list="headList"
      @doSureChooseDialog="doSureChooseDialog" @doCancelChooseDialog="doCancelChooseDialog"></task-choose-dialog>
  </div>
</template>
<script>
import Dialog from '@/utils/dialog'
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { AttentionItem } from '@/page/task/config'
import TaskChooseDialog from '../../../components/common/choose_dialog.vue'
import { ProductKindList, HouseKeptType, RANSOM_LOAN_TYPE, Dist_List_Get } from '@/config/index'
import { mapActions, mapGetters } from 'vuex'

export default {
  extends: ExtendTaskBaseView,
  components: {
    TaskBaseView,
    TaskChooseDialog
  },
  data() {
    return {
      info: AttentionItem,
      productName: '',
      dialogInfo: false,
      setHouseNo: '',
      salesUserlist: [],
      headList: [
        {
          name: '区域',
          key: 'name'
        },
        {
          name: '城市',
          key: 'cityName'
        }
      ],
      requestParams: ['customerRelList', 'applyOrder', 'isrMixed', 'feeSummary', 'oriLoan', 'applyOrderExtend', 'newLoan', 'landCertList']
    }
  },
  computed: {
    ...mapGetters(['isWeBank']),
    capitalCode() {
      const item = this.findItemByNameBlock(this.info, ['partnerBankId', 'partnerBankName']) || {}
      return item.value || ''
    },
    partnerInsuranceIdValue() {
      const info = this.info
      const item = this.findItemByNameBlock(info, ['partnerInsuranceId', 'partnerInsuranceName'])
      return item.value
    },
    oriLoanBankCodeValues() {
      const info = this.info
      const item = this.findItemByNameBlock(info, ['oriLoanBankCode', 'oriLoanBankName'])
      return item.values
    }
  },
  watch: {
    partnerInsuranceIdValue(value) {
      const info = this.info
      const partnersAccountItem = this.findItemByNameBlock(info, 'partnersAccount')
      const pIdx = partnersAccountItem.sortIndex
      if (value === 'XTA-ZG001') {
        this.$set(info, pIdx, Object.assign({}, partnersAccountItem, { required: true }))
        this.$set(info, pIdx + 1, Object.assign({}, info[pIdx + 1], { required: true }))
      } else {
        this.$set(info, pIdx, Object.assign({}, partnersAccountItem, { required: false }))
        this.$set(info, pIdx + 1, Object.assign({}, info[pIdx + 1], { required: false }))
      }
    },
    oriLoanBankCodeValues(value, oldValue) {
      if (!this.compareObj(value, oldValue)) {
        this.dealCertificateKeep(value)
      }
    }
  },
  methods: {
    ...mapActions(['loadCompanyUsers', 'getHistoryApproval']),
    // 处理产证保管在
    dealCertificateKeep(value) {
      const info = this.info
      const certificateKeepItem = this.findItemByNameBlock(info, 'certificateKeep')
      let list = HouseKeptType
      if (Array.isArray(value) && value.length === 2) {
        list = [...list, { key: '2', name: value[1] }]
      }
      this.$set(info, certificateKeepItem.sortIndex, Object.assign({}, certificateKeepItem, this.dealPickText(list, certificateKeepItem) || {}))
    },
    // 继续处理完字典的后续处理
    afterCreated() {
      const info = this.info
      const productCode = this.productCode
      this.productName = ProductKindList[productCode].name
      const productType = (this.productType = Math.pow(2, ProductKindList[productCode].index) || 2)
      if (productCode === 'DZYB_YSL_YJY_ISR') {
        const randomPayModeItem = this.findItemByNameBlock(info, 'randomPayMode')
        randomPayModeItem.disc = RANSOM_LOAN_TYPE
        randomPayModeItem.list = Dist_List_Get(RANSOM_LOAN_TYPE)
      }
      // 处理合作机构
      const partnerInsuranceIdItem = this.findItemByNameBlock(info, ['partnerInsuranceId', 'partnerInsuranceName'])
      if (this.isInsuranceProduct(productCode)) {
        partnerInsuranceIdItem.pickTitle = partnerInsuranceIdItem.label = '合作保险公司'
        partnerInsuranceIdItem.placeholder = '请选择合作保险公司'
        this.requestOrgList(productCode, 'insurance', partnerInsuranceIdItem.sortIndex)
      } else {
        partnerInsuranceIdItem.pickTitle = partnerInsuranceIdItem.label = '合作机构'
        partnerInsuranceIdItem.placeholder = '请选择合作机构'
        this.requestOrgList(productCode, 'captial', partnerInsuranceIdItem.sortIndex)
      }
      // 处理放款节点
      const tailReleaseNodeItem = this.findItemByNameBlock(info, 'tailReleaseNode')
      const productTermItem = this.findItemByNameBlock(info, 'productTerm')
      if (!tailReleaseNodeItem.productType || tailReleaseNodeItem.productType & productType || !productTermItem.productType || productTermItem.productType & productType) {
        this.requestProductLimit(productCode)
      }
      //
      const oriLoan = this.dataItem.oriLoan || {}
      const oriLoanBankCode = oriLoan.oriLoanBankCode
      const oriLoanBankName = oriLoan.oriLoanBankName
      if (oriLoanBankCode && oriLoanBankName) {
        this.dealCertificateKeep([oriLoanBankCode, oriLoanBankName])
      }

      this.initData()
      // this.dealCertificateKeep(value)
      this.initOtherData()
      this.initWeBankDisplay()
    },
    // 微众初始化
    initWeBankDisplay() {
      if(!this.isWeBank) return

      // 设置微众银行的只读字段
      this.setData('bizLoanAmount', 'readonly', this.isWeBank)

      // 显示合作银行
      this.setData(["partnerBankId","partnerBankName"], 'hidden', false)

      //WORKAROUND: 组件库没有办法响应 label 修改
      this.setData(["salesUserId","salesUserName"], 'hidden', true)
      this.setData(["salesUserId","salesUserName"], 'label', '跟进人员姓名')
      this.setData(["salesUserId","salesUserName"], 'placeholder', '请选择跟进人员姓名')
      this.setData(["salesUserId","salesUserName"], 'hidden', false)

      const salesUserItem = this.findItemByNameBlock(this.info, ['salesUserId', 'salesUserName'])
      this.getSalesUserList(salesUserItem)
    },
    // 处理其他数据的初始化
    initOtherData() {
      const info = this.info
      // 处理产证保管在
      const oriLoanBankCodeItem = this.findItemByNameBlock(info, ['oriLoanBankCode', 'oriLoanBankName'])
      const oriLoanBankCodeValues = oriLoanBankCodeItem.values
      if (Array.isArray(oriLoanBankCodeValues) && oriLoanBankCodeValues.length === 2) {
        oriLoanBankCodeItem.value = oriLoanBankCodeValues[1] || ''
      }
      // 处理日期
      const preUseAmountDateItem = this.findItemByNameBlock(info, 'preUseAmountDate')
      const preUseAmountDateValues = preUseAmountDateItem.value
      if (preUseAmountDateValues) {
        preUseAmountDateItem.value = this.formatDate(preUseAmountDateValues, 'YYYY-MM-DD')
      }
      // 处理新贷款机构
      const newLoanBankCodeItem = this.findItemByNameBlock(info, ['newLoanBankCode', 'newLoanBankName'])
      const newLoanBankCodeValues = newLoanBankCodeItem.values
      if (Array.isArray(newLoanBankCodeValues) && newLoanBankCodeValues.length === 2) {
        newLoanBankCodeItem.value = newLoanBankCodeValues[1] || ''
      }
      // 处理资金监管
      const hasFundSupervisionItem = this.findItemByNameBlock(info, 'hasFundSupervision')
      this.changeSupervised(hasFundSupervisionItem.value, hasFundSupervisionItem.sortIndex, hasFundSupervisionItem)
      // 尾款支付方式
      const tailPayModeItem = this.findItemByNameBlock(info, 'tailPayMode')
      this.changeAccountPayWay(tailPayModeItem.value, tailPayModeItem.sortIndex, tailPayModeItem)
      // 卖方收款账户类型
      if (this.productType & 10240) {
        const tailAccountTypeItem = this.findItemByNameBlock(info, 'tailAccountType')
        this.changeSaleKind(tailAccountTypeItem.value, tailAccountTypeItem.sortIndex, tailAccountTypeItem)
      } else if (this.productType & 20480) {
        const sellerAccountTypeItem = this.findItemByNameBlock(info, 'sellerAccountType')
        this.changeSaleKind(sellerAccountTypeItem.value, sellerAccountTypeItem.sortIndex, sellerAccountTypeItem)
      }
      // 处理渠道经理
      const orderItem = this.dataItem && this.dataItem.applyOrder
      if (orderItem && orderItem.thirdpartyName === 'ZYB' && orderItem.productId === 'TFB_NSL_NJY_ISR') {
        const salesUserItem = this.findItemByNameBlock(info, ['salesUserId', 'salesUserName'])
        this.getSalesUserList(salesUserItem)
      }
      // 处理售房原因
      const saleCauseItem = this.findItemByNameBlock(info, ['saleCause', 'otherSaleCause'])
      this.changeSaleReason(saleCauseItem.value, saleCauseItem.sortIndex, saleCauseItem)
      saleCauseItem.values[0] = saleCauseItem.value

      //处理 借款金额（及时贷现金类产品：费率登记后，借款金额只读）
      const borrowingAmountItem = this.findItemByNameBlock(info, 'borrowingAmount')
      //及时贷（交易赎楼）/及时贷（交易提放）/及时贷（非交易赎楼）/及时贷（非交易提放）
      if (orderItem.productId === 'SLY_YSL_YJY_CSH' || orderItem.productId === 'JSD_NSL_YJY_CSH' || orderItem.productId === 'SLY_YSL_NJY_CSH' || orderItem.productId === 'JSD_NSL_NJY_CSH') {
        this.getHistoryApproval(orderItem.applyNo).then(data => {
          data &&
            data.forEach(item => {
              if (item.taskKey === 'CostMark' && item.status === 'agree') {
                this.$set(this.info, borrowingAmountItem.sort, Object.assign({}, borrowingAmountItem, { type: 'text' }))
              }
            })
        })
      }

      // 当“预计商业贷款金额”为空的时候，把“实际商业贷款金额”的值赋值给“预计商业贷款金额”
      if(!this.getData('bizLoanAmount', 'value') && typeof this.dataItem.newLoan.businessSum === 'number'){
        this.setData('bizLoanAmount', 'value', this.dataItem.newLoan.businessSum)
      }

      // 初始化微众的显示
      this.setData('followerName', 'hidden', !this.isWeBank)
    },
    // 选择附件按钮
    clickEnclosure(key, idx, item, event) {
      // 点击客户姓名的照相
      if (this.compareObj(key, ['oriLoanBankCode', 'oriLoanBankName'])) {
        this.doOpenChooseOrg(key, idx, item)
      } else if (this.compareObj(key, ['newLoanBankCode', 'newLoanBankName'])) {
        this.openLoanBankDialog(key, idx, item)
      } else if (key === 'number') {
        this.openCamera(idx, item)
      } else if (this.compareObj(key, ['openBankNo', 'openBank'])) {
        this.doOpenChooseOrg(key, idx, item)
      } else if (this.compareObj(key, ['houseArea', 'houseAreaCode'])) {
        this.doOpenHouseArea(key, idx, item)
      } else if (this.compareObj(key, ['saleCause', 'otherSaleCause'])) {
        this.$set(this.info, idx, Object.assign({}, item, { values: [item.values[0], event] }))
      }
    },
    // 请求合作机构列表
    requestOrgList(productCode, queryFlag, index, insuranceCode) {
      const tdata = {
        productId: productCode,
        queryFlag
      }
      if (insuranceCode) {
        tdata.insuranceCode = insuranceCode
      }
      return this.$store.dispatch('getOrgList', tdata).then(data => {
        const idx = index
        const info = this.info
        const item = info[idx]
        const list = ((data || {}).list || []).map(item => ({
          key: item.code,
          name: item.name
        }))
        const tmp = this.dealPickText(list, item)
        if (tmp) {
          const value = tmp.value
          if (this.compareObj(item.key, ['partnerInsuranceId', 'partnerInsuranceName']) && this.productType & info[idx + 1].productType && tmp.index > -1) {
            this.changeCoBank(value, idx)
          }
        }
        this.$set(info, idx, Object.assign({}, info[idx], tmp || {}, { hidden: false }))
      })
    },
    // 请求产品期限
    requestProductLimit(productId) {
      this.$store.dispatch('getProductLimit', { productId }).then(data => {
        const info = this.info
        const productType = this.productType
        // 处理放款节点
        const tailReleaseNodeItem = this.findItemByNameBlock(info, 'tailReleaseNode')

        if ((tailReleaseNodeItem && tailReleaseNodeItem.value) || this.dataItem.applyOrder.thirdpartyName === 'ZYB') {
          tailReleaseNodeItem.list = ((data && data.loanNodeList) || []).map(item => ({
            key: item.loanNodeCode,
            name: item.loanNodeName
          }))
          tailReleaseNodeItem.index = this.getIndexByKeyFromArray(tailReleaseNodeItem.list, tailReleaseNodeItem.value)
          // 上海C02没有获取到业务申请时的落地银行,则赋值到nitValue中
          const tmp = tailReleaseNodeItem.list[tailReleaseNodeItem.index]
          if (tailReleaseNodeItem.values.length > 1 && !tmp && tailReleaseNodeItem.values[1]) {
            tailReleaseNodeItem.defaultValue = tailReleaseNodeItem.values[1]
          }
          // 中原订单 放款节点的逻辑处理= 自动审批通过的，放款节点默认有值，不可编辑，人工审核时，可编辑
          if (this.dataItem.applyOrder.thirdpartyName === 'ZYB') {
            if (this.dataItem.isrMixed.manCheckResult === 'Y' && (tailReleaseNodeItem.value || tailReleaseNodeItem.values.length > 0)) {
              tailReleaseNodeItem.type = 'text'
              tailReleaseNodeItem.value = tailReleaseNodeItem.defaultValue || tailReleaseNodeItem.values[1]
            }
          }
          this.$set(info, tailReleaseNodeItem.sortIndex, Object.assign({}, tailReleaseNodeItem, { hidden: false }))
        }

        // 处理产品期限
        const productTermItem = this.findItemByNameBlock(info, 'productTerm')
        const productTermType = productTermItem.productType
        if (!productTermType || productTermType & productType) {
          productTermItem.list = ((data && data.loanTermList) || []).map(item => ({
            key: item,
            name: item
          }))
          this.$set(info, productTermItem.sortIndex, Object.assign({}, productTermItem, { hidden: false }))
        }

        //处理房产区域
        const houseAreaItem = this.findItemByNameBlock(info, 'houseArea')
        this.$set(info, houseAreaItem.sortIndex, Object.assign({}, houseAreaItem, { hidden: false }))
      })
    },
    // 修改数据
    changeValue(key, idx, item, value, name) {
      const info = this.info
      const _value = info[idx].value
      if (_value !== value) {
        this.valueChanged = true
        if (this.compareObj(key, ['partnerInsuranceId', 'partnerInsuranceName'])) {
          if (this.productType & info[idx + 1].productType) {
            this.changeCoBank(value, idx, item)
          }
        } else if (key === 'hasFundSupervision') {
          this.changeSupervised(value, idx, item)
        } else if (this.compareObj(key, ['saleCause', 'otherSaleCause'])) {
          this.changeSaleReason(value, idx, item)
          item.values = [value]
          this.$set(info, idx, Object.assign({}, item, { value, changed: true }))
          return true
        } else if (key === 'tailPayMode') {
          this.changeAccountPayWay(value, idx, item)
        }
        if (Array.isArray(item.key) && item.key.length === 2) {
          this.$set(info, idx, Object.assign({}, item, { value, values: [value, name], changed: true }))
        } else {
          this.$set(info, idx, Object.assign({}, item, { value, changed: true }))
        }
      }
    },
    // 切换售房原因
    changeSaleReason(value, idx, item) {
      if (value === '0') {
        item.hasOtherInput = true
      } else {
        item.hasOtherInput = false
      }
      this.$set(this.info, idx, Object.assign({}, item, { hasOtherInput: value === '0' }))
    },
    // 切换资金监管
    changeSupervised(value, idx) {
      const info = this.info
      const productType = this.productType
      info[idx + 1].hidden = value !== 'N' || !(info[idx + 1].productType & productType)
      info[idx + 2].hidden = value !== 'Y' || !(info[idx + 2].productType & productType)
    },
    // 切换合作机构
    changeCoBank(value, idx) {
      this.requestOrgList(this.productCode, 'loan', idx + 1, value)
    },
    // 切换尾款支付方式
    changeAccountPayWay(value, idx, item) {
      const info = this.info
      const productType = this.productType
      const itemProductType = item.productType
      if (!itemProductType || (productType & itemProductType && value === 'noPay')) {
        item.hidden = true
        //隐藏后面5个字段
        var filterValue = '尾款收款账户类型,卖方收款账户类型,卡号,户名,开户行'
        for (var i = idx + 1; i < idx + 6; i++) {
          if (filterValue.indexOf(info[i].label) > -1) {
            info[i].hidden = true
          }
        }
      }
    },
    // 指定排序的比较函数
    compare(property) {
      return function(obj1, obj2) {
        var value1 = obj1[property]
        var value2 = obj2[property]
        return value1.localeCompare(value2) // 升序
      }
    },
    //获取渠道经理
    getSalesUserList(salesUserItem) {
      const roles = this.isWeBank?'JGDJCLG':'QDJL,QDJLG'
      this.loadCompanyUsers(roles).then(data => {
        data = data.sort(this.compare('account'))
        salesUserItem.list.length = 0
        //更新人员信息
        data.forEach(item => {
          // 如果微众/中原银行虚拟帐号不要把这个选项显示在列表中，但需要可以显示出来选中
          salesUserItem.list.push({ key: item.id, name: item.fullname, hidden: item.account === 'wzbUser' || item.account === 'zybUser' })
        })

        salesUserItem.index = this.getIndexByKeyFromArray(salesUserItem.list, salesUserItem.value)
        this.$set(this.info, salesUserItem.sortIndex, Object.assign({}, salesUserItem, { hidden: false }))
      })
    },
    // 卖方收款账户类型
    changeSaleKind(value, idx) {
      const orderItem = this.dataItem || {}
      const cardList = orderItem.accountList || []
      for (let i in cardList) {
        if (cardList[i].type === value) {
          // 处理数值
          const tmp = cardList[i] || {}
          this.setData('number', 'text', tmp['number'])
          this.setData('name', 'text', tmp['name'])
          this.setData(['openBankNo', 'openBank'], 'text', tmp['openBank'])
          this.setData(['openBankNo', 'openBank'], 'values',  [tmp['openBankNo'], tmp['openBank']])
          break
        }
      }
    },
    // 打开房产区域
    doOpenHouseArea(key, idx, item) {
      let that = this
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: 'applyOrder'
        },
        success: data => {
          let companyCode = data.applyOrder.branchId
          this.setHouseNo = data.applyOrder.houseNo
          this.requestApi.company_area_list({
            method: 'GET',
            data: 'companyCode=' + companyCode,
            success: data => {
              that.dialogInfo = true
              that.dialogList = data
            }
          })
        }
      })
    },
    doSureChooseDialog(item) {
      if (item) {
        const info = this.info
        const houseAreaItem = this.findItemByNameBlock(info, ['houseArea', 'houseAreaCode'])
        this.$set(
          info,
          houseAreaItem.sortIndex,
          Object.assign({}, houseAreaItem, {
            values: [item.name, item.id],
            value: item.name,
            changed: true
          })
        )
      }
      this.valueChanged = true
      this.dialogInfo = false
    },
    doCancelChooseDialog() {
      this.dialogInfo = false
    },
    // 选择机构
    doChooseOrg(item) {
      const dateItem = this.chooseOrg
      const idx = dateItem.flag
      const info = this.info
      this.valueChanged = true
      this.$set(
        info,
        idx,
        Object.assign({}, info[idx], {
          values: [item.bankCode, item.bankName],
          value: item.bankName,
          changed: true
        })
      )
    },
    uploadCameraImage(data) {
      this.uploadViewCameraImage(data)
    },
    validateSave(isCommit, data){
      const resultInfo = data
      const customer = this.getData(['salesUserId', 'salesUserName'], 'values') || []
      if(this.isWeBank && customer[1]==='微众银行'){
        Dialog.toast('请选择跟进人员姓名')
        return false
      }

      if(typeof resultInfo === 'boolean') return resultInfo

      let newLoan = resultInfo.newLoan && resultInfo.newLoan[0]
      let applyOrder = resultInfo.applyOrder && resultInfo.applyOrder[0]
      applyOrder = applyOrder || {}
      newLoan = newLoan || {}
      newLoan.applyNo = this.applyNo
      newLoan.bizLoanAmount = this.getData('bizLoanAmount')
      newLoan.houseNo = applyOrder.houseNo || this.dataItem.applyOrder.houseNo
      newLoan.id = this.dataItem.newLoan.id

      resultInfo.newLoan = [newLoan]
      
      return resultInfo
    },
    doStop() {}
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  .interview-attention-box {
    flex-direction: column;
    flex: 1;
    @include setPadding($normal_gap_bottom, $normal_gap_left)
  }

  .interview-attention-head {
    @include setPaddingH();
    margin-bottom: 20px;
    @include setBorderBottom($color_weak, 1px);
    height: 80px;
  }

  .head-title {
    font-size: $font_normal;
    color: $color_nav;
  }
</style>
