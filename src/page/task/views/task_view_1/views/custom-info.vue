<template>
  <d-layout class="customer-item" vertical-align="initial" text-align="initial" :full-parent="false">
    <d-form
       v-for="item in displayFields"
       :key="`form-key-${item.sortIndex}`"
       v-bind="item"
       @closeBoard="closeBoard"
       @clickEnclosure="clickEnclosure(item.key, item.sortIndex, item, ...arguments)"
       @input="changeValue(item.key, item.sortIndex, item,  ...arguments)"
    ></d-form>
    <open-camera
       v-if="showCamera"
       v-model="showCamera"
       :applyNo="applyNo"
       :fileType="fileType"
       :customerNo="dataItem.customerNo || ''"
       @doAnalysisImage="doAnalysisImage"></open-camera>
    <wxc-pop-over
       :position="popoverPosition"
       :arrowPosition="popoverArrowPosition"
       v-model="showTip">
      <div class="tip-wrap">
        <text class="text">关系人类型选择优先级为：</text>
        <text class="text">{{messageTip}}</text>
      </div>
    </wxc-pop-over>
  </d-layout>
</template>

<script>
import { CustomerItem } from '@/page/task/config/index'
import {
  UPLOAD_ID_CARD_TYPE,
  Dist_List_Get,
  DISC_SELLER_SHIP_TYPE,
  DISC_BUYER_SHIP_TYPE,
  DISC_CUSTOMER_SHIP_TYPE
} from '@/config/index'
import OpenCamera from '../../../components/common/idcard_camera.vue' // 拍照
import {
  native_module_events,
  DEFINE_UPLOAD_IMAGE_BPMS,
  DEFINE_HIDDEN_KEYBORAD,
  native_common_events
} from '@/utils/deal_native'
import WxcPopOver from '@/components/wxc/popover.vue'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'
import Dialog from '@/utils/dialog'
import {Validator} from '@/utils/validator'
import { mapGetters, mapState, mapMutations } from 'vuex'

export default {
  components: {
    OpenCamera,
    WxcPopOver
  },
  mixins: [MixinTaskViewIndex],
  props: {
    titleName: {
      type: String,
      default: ''
    },
    dataItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      info: this.deepCopy(CustomerItem),
      applyNo: '',
      fileType: UPLOAD_ID_CARD_TYPE,
      fileResources: {},
      valueChanged: false,
      showCamera: false,
      popoverPosition: {x: -1, y: 440},
      popoverArrowPosition: {pos: 'left', y: 50},
      messageTip: '',
      showTip: false
    }
  },
  computed: {
    ...mapState(['customers']),
    ...mapGetters(['applyOrder', 'customerRelList', 'isWeBank']),
    shipRelation() {
      const name = this.titleName
      return (name === '客户' && 'OWN') || ((name === '卖方' && 'OWN') || 'BUY')
    },
    displayFields() {
      return this.info.filter(item => !item.hidden)
    },
    customer(){
      const name = this.getData('name')
      const customerNo = this.dataItem.customerNo
      return {name, customerNo}
    }
  },
  methods: {
    ...mapMutations(['setCustomer', 'removeCustomer']),
    // 继续处理完字典的后续处理
    afterCreated() {
      // 处理提示信息
      const relationItem = this.findItemByNameBlock(this.info, 'relation')
      const otherResidenceItem = this.findItemByNameBlock(this.info, 'provideOtherPersonalLocalResidences')
      const productType = this.productCode
      const titleName = this.titleName
      if (titleName === '卖方') {
        this.messageTip = '卖方共权人>配偶>第三方借款人'
        relationItem.hasTips = true
        relationItem.list = Dist_List_Get(DISC_SELLER_SHIP_TYPE)
      } else if (titleName === '买方') {
        otherResidenceItem.hidden = true
        relationItem.hasTips = false
        relationItem.list = Dist_List_Get(DISC_BUYER_SHIP_TYPE)
      } else {
        relationItem.hasTips = true
        this.messageTip = '产权人＞新贷款借款人＞原贷款借款人＞产权人配偶＞新贷款抵押人＞原贷款抵押人＞第三方收款人＞其他联系人'
        relationItem.list = Dist_List_Get(DISC_CUSTOMER_SHIP_TYPE)
      }
      // 处理投保人和主借款人
      const isActualBorrowerNameItem = this.findItemByNameBlock(this.info, 'isActualBorrowerName')
      if (this.isInsuranceProduct(productType)) {
        isActualBorrowerNameItem.label = '是否为投保人'
        isActualBorrowerNameItem.placeholder = '请选择是否为投保人'
      } else {
        isActualBorrowerNameItem.label = '是否为主借款人'
        isActualBorrowerNameItem.placeholder = '请选择是否为主借款人'
      }

      
      // 默认初始化数据只处理数据的填充
      this.initData()
      this.initCreditData()
      this.initOtherData()
      this.initWebBankDispaly()

      // 配偶类型下拉数据设置
      this.setData('otherRelation', 'list', this.getRelationCustomers())

    },
    initWebBankDispaly() {
      // 设置微众银行的显示字段
      this.setData('customerIdentity', 'hidden', !this.isWeBank)

      // 当用户为微众法人时，该字段不可以修改
      const customerIdentity = this.dataItem.customer && this.dataItem.customer.customerIdentity
      this.setData('customerIdentity', 'readonly', this.isWeBank && customerIdentity==='legalPerson')

      // 设置微众银行的只读字段
      this.setData('phone', 'readonly', this.isWeBank && this.getData('relation') === 'CQR')

      // 只有微从才会显示营业执照
      let list = this.getData('idCardType', 'list') || []
      if (!this.isWeBank) {
        // 只有微众才会显示 营业执照
        list = list.filter(item => item.key !== 'YYZZ')
      }
      this.setData('idCardType', 'list', list)

      // 只有微从才会显示配偶名称
      // this.setData('otherRelation', 'hidden', !this.isWeBank)
      if (this.isWeBank && (this.getData('relation') === 'CQRPO' || this.dataItem.isSpouse)) { // 产权人配偶设置
        this.setData('idCardNo', 'required', true)
        const tmp = this.dataItem._temp        
        // 有tmp说明这个数据是新增的
        if(tmp){
          this.setData('otherRelation', 'value', tmp.otherRelation)
          this.setData('relation','value', tmp.relation)
          this.setData('sex','value', tmp.customer.sex)
          this.setData('address', 'value',tmp.customer.address)
          this.setData('maritalStatus','value', tmp.customer.maritalStatus)
          this.setData('idCardType','value', tmp.customer.idCardType)
          this.setData('customerIdentity','value', tmp.customer.customerIdentity)
        } else{
          this.setData('otherRelation', 'value', this.dataItem.otherRelation)
        }
      }

    },
    // 处理其他初始化
    initOtherData() {
      const info = this.info
      // 处理证件类型
      const idCardTypeItem = this.findItemByNameBlock(info, 'idCardType')
      this.doDealCardType(idCardTypeItem.sortIndex, idCardTypeItem.value)
      // 处理证件号码 -- 首次应该不需要处理
      // const idCardNoItem = this.findItemByNameBlock(info, 'idCardNo')
      // 处理收入类型
      const incomeTypeItem = this.findItemByNameBlock(info, 'incomeType')
      this.doSelectIncome(incomeTypeItem.sortIndex, incomeTypeItem.value)
      // 处理关系人类型
      const relationItem = this.findItemByNameBlock(info, 'relation')
      this.doDealRelationShip(relationItem.sortIndex, relationItem.value)
      // 处理主借款人
      const isActualBorrowerNameItem = this.findItemByNameBlock(info, 'isActualBorrowerName')
      this.doDealMainer(isActualBorrowerNameItem.sortIndex, isActualBorrowerNameItem.value)
      // 处理申请人
      const isProposerItem = this.findItemByNameBlock(info, 'isProposer')
      this.doDealApply(isProposerItem.sortIndex, isProposerItem.value)

      const customerIdentityItem = this.findItemByNameBlock(info, 'customerIdentity')
      this.onCustomerIdentityChanged(customerIdentityItem.sortIndex, customerIdentityItem.value)

      const maritalStatusItem = this.findItemByNameBlock(info, 'maritalStatus')
      this.onMaritalStatusChanged(maritalStatusItem.sortIndex, maritalStatusItem.value)

      this.setCustomer(this.customer)
    },
    // 初始化征信的相关操作
    initCreditData() {
      const info = this.info
      const dataItem = this.dataItem || {}
      const creditChannelItem = this.findItemByNameBlock(info, 'creditChannel')
      if (creditChannelItem.value === 'onlinequery') {
        const customerNo = (dataItem[creditChannelItem.inner] || {}).custNo
        this.requestApi.credit_channel_list({
          data: {
            customerNos: [customerNo]
          },
          success: data => {
            if (data.length && data[0].parseWay && data[0].parseWay === 'QUERYING') {
              this.$set(info, creditChannelItem.sortIndex, Object.assign({}, creditChannelItem, { checking: true }))
            }
          }
        })
      }
    },
    clickEnclosure(key, idx, item, event) {
      // 点击客户姓名的照相
      if (key === 'name') {
        this.openCamera(key, idx, item)
      }
      else if (key === 'relation') {
        this.openTips(event)
      }
      else if (key === 'idCardValidity') {
        this.checkLong(idx, item)
      }else if(key === 'otherRelation') {
        this.addSpouse()
      }
    },
    // 重写修改数据
    changeValue(key, idx, item, value) {
      const _value = item.value
      if (_value !== value) {
        this.dealFirstTrialStatus(key, value)
        // 处理身份证号码
        if (key === 'relation') {
          this.doDealRelationShip(idx, value)
        } else if (key === 'idCardType') {
          this.doDealCardType(idx, value)
        } else if (key === 'idCardNo') {
          this.dealIdCard(idx, value, item)
        } else if (key === 'idCardValidity') {
          this.timeSelect(idx, value)
        } else if (key === 'incomeType') {
          this.doSelectIncome(idx, value)
        } else if (key === 'isActualBorrowerName') {
          this.doDealMainer(idx, value)
        } else if (key === 'isProposer') {
          this.doDealApply(idx, value)
        } else if (key === 'customerIdentity') {
          this.onCustomerIdentityChanged(idx, value)
        } else if (key === 'maritalStatus') {
          this.onMaritalStatusChanged(idx, value)
        } else if( key=== 'name'){
          this.setCustomer({customerNo:this.customer.customerNo, name:value})
        }
        this.$set(this.info, idx, Object.assign({}, item, { value, changed: true }))
        this.valueChanged = true
      }

      this.$emit('customer-change', {customerNo: this.dataItem.customerNo, key, value})
    },
    dealFirstTrialStatus(key, value) {
      if (key === 'name' || key === 'relation' || key === 'idCardType' || key === 'idCardNo' || key === 'phone' || key === 'maritalStatus' || key === 'otherRelation') {
        const relationStatus = ['CQR', 'CQRPO']
        const info = this.info
        const relationItem = this.findItemByNameBlock(info, 'relation')
        const oldValue = relationItem.value
        if ((key === 'relation' && relationStatus.indexOf(value) > -1 && relationStatus.indexOf(oldValue) < 0) || (key !== 'relation' && relationStatus.indexOf(oldValue) > -1)) {
          if (this.$store.state.hasFirstApproval) {
            this.$store.commit('setFirstApproval', false)
            Dialog.toast('产权人&配偶信息发生变化，请重新进行初审')
          }
        }
      }
    },
    // 选择时间特殊处理
    timeSelect(idx, item) {
      this.$set(this.info, idx, Object.assign({}, item, {hasCheckbox: 1}))
    },
    // 选择收入类型
    doSelectIncome(idx, value) {
      this.setData('employer', 'hidden', value === 'OTH')
    },
    // 点击长期
    checkLong(idx, item) {
      const hasCheckbox = item.hasCheckbox
      const info = this.info
      let value = ''
      if (hasCheckbox === 2) {
        value = '2099-12-31'
      }
      this.$set(info, idx, Object.assign({}, item, {value, changed: true, hasCheckbox: 3 - hasCheckbox}))
      this.valueChanged = true
    },
    openCamera() {
      this.showCamera = true
    },
    openTips(e) {
      try {
        this.popoverPosition.y = e.position.y - 25
      } catch (e) {
        try {
          this.popoverPosition.y = event.touch.pageY - 60
        } catch (e) {
        }
      }
      this.showTip = true
    },
    // 添加配偶（产权人或法人）
    addSpouse() {
      const data = {
        customerNo: this.dataItem.customerNo,
        customer:{
          sex: this.getData('sex'),
          address: this.getData('address'),
          maritalStatus: this.getData('maritalStatus'),
          customerIdentity: this.getData('customerIdentity')
        }
      }
      this.$emit('addCustomer', {
        type: 'otherRelation',
        from: data,
        callback: spouse=>{
          let index = this.getRelationCustomers().findIndex(item => item.customerNo === spouse.customerNo)

          this.setData('otherRelation', 'value', spouse.customerNo)
          this.setData('otherRelation', 'index', index)
        }
      })
    },
    /**
     * 其它客户选择下拉
     */
    getRelationCustomers(customers) {
      let result = []
      customers = customers || this.customers || []
      result = customers.filter(item=>item.customerNo!==this.dataItem.customerNo)
      result = result.map(item=>{
        return {
          key: item.customerNo,
          name: item.name
        }
      })
      
      return result
    },
    doValidate(bool) {
      let resultInfo = this.validBaseData(bool, false, this.titleName + this.dataItem.sortIdx + ': ')

      // 微众必需要有关系人类型
      if(this.isWeBank && !this.getData('relation')){
        Dialog.toast('请选择关系人类型')
        return false
      }

      if (resultInfo === false) {
        return false
      }
      else if (resultInfo === true) {
        return true
      }
      else if (typeof resultInfo === 'object') {
        if (Object.keys(resultInfo).length > 0) {
          const dataItem = this.dataItem || {}
          const customer = dataItem.customer || {}
          resultInfo.applyNo = this.applyNo
          resultInfo.role = this.shipRelation
          resultInfo.customerNo = dataItem.customerNo || ''
          resultInfo.id = dataItem.id || ''
          resultInfo.customer = resultInfo.customer || {}
          resultInfo.customer.id = customer.id
          resultInfo.customer.custNo = customer.custNo
          resultInfo.customer.name = resultInfo.customer.name || customer.name
          resultInfo.otherRelation = resultInfo.otherRelation || dataItem.otherRelation

          // #region (LIANGCANLUN)微众需求中，客户的配偶信息如果为新增的话会给一个临时的 customerNo（以spouse_ 开头），保存的时候要把这个数据重置，后台会完成余下的处理
          if(/^spouse_|^tmp_/.test(resultInfo.customerNo)){
            this.removeCustomer(resultInfo.customerNo)
            resultInfo.customerNo = ''
          }

          if(/^spouse_|^tmp_/.test(resultInfo.otherRelation)){
            resultInfo.otherRelation = ''
          }

          // #endregion

          return {
            customerRelList: [resultInfo]
          }
        }
      }
      return true
    },
    doAnalysisImage(data, fileId) {
      const customer = this.toJSON(data.customer)
      this.valueChanged = true

      if (customer.name) {
        this.setData('name', 'value', customer.name)
      }
      if (customer.age) {
        this.setData('age', 'value', customer.age)
      }
      if (customer.idCardNo) {
        this.setData('idCardNo', 'value', customer.idCardNo)
      }
      if (customer.sex) {
        const sexList = this.getData('sex', 'list')||[]
        const index = customer.sex === '男' ? 1 : 0
        this.setData('sex', 'index', index)
        this.setData('sex', 'value', this.getValue(sexList[index]))
      }
      if (customer.address) {
        this.setData('address', 'value', customer.address)
      }
      if (customer.expireDate) {
        const idCardValidityItem = this.findItemByNameBlock(this.info, 'idCardValidity')

        const value = this.formatDate(Number(customer.expireDate), 'YYYY-MM-DD')
        this.setData('idCardValidity', 'value', value)
        this.timeSelect(idCardValidityItem.sortIndex, idCardValidityItem)
      }
      this.fileResources = fileId
    },
    uploadCameraImage(data) {
      const fileId = this.fileResources || {}
      if (Object.keys(fileId).length > 0) {
        const data = this.dataItem
        const customerNo = (data || {}).customerNo
        const url = []
        for (let i in fileId) {
          url.push(fileId[i])
        }
        native_module_events(DEFINE_UPLOAD_IMAGE_BPMS, this.applyNo, this.fileType, url, customerNo, 0)
      }
    },
    // 处理证件类型
    doDealCardType(idx, value) {
      const info = this.info

      // 重置条件
      this.setData('idCardNo', 'required', false)
      this.setData('idCardNo', 'valid', undefined)
      this.setData('idCardNo', 'maxlength', undefined)

      if (value === 'CER') {
        this.setData('idCardNo', 'maxlength', 18)
        this.setData('idCardNo', 'valid', 'id')
      } else if (value === 'YYZZ') {
        // 营业执照
        this.setData('idCardNo', 'maxlength', 18)
        this.setData('idCardNo', 'required', true)
        this.setData('idCardNo', 'valid', 'businessNo')
      }
      else {
        this.setData('idCardNo', 'maxlength', 30)
        this.setData('idCardNo', 'valid', undefined)
      }
    },
    // 处理身份证输入判断
    dealIdCard(idx, value, item) {
      if (item.valid === 'id' && Validator.id(value) === 'OK') {
        const age = new Date().getFullYear() - value.substring(6, 10)
        const sex = Number(value.substring(16, 17)) % 2
        const sexList = this.getData('sex', 'list')

        this.setData('age', 'value', age)
        this.setData('sex', 'index', sex)
        this.setData('sex', 'value', this.getValue(sexList[sex]))
      }
    },
    // 处理证件类型
    doDealRelationShip(idx1, value) {
      // 卖方第三方借款人、卖家、卖方共权人
      const productCode = this.productCode
      const titleName = this.titleName
      const isWeBankCQRPO = this.isWeBank && this.getData('relation')==='CQRPO' /* 是否为微众的产权人配偶 */

      if (this.isDealProduct(productCode) && (value === 'OTHIRD' || value === 'OWN' || value === 'PAT')) {
        this.setData('creditChannel', 'required', true)
      } else {
        this.setData('creditChannel', 'required', false)
      }
      if (titleName === '卖方') {
        const isOWN = value === 'OWN'
        this.setData('maritalStatus', 'required', isOWN)
        this.setData('phone', 'required', isOWN)
        this.setData('incomeType', 'required', isOWN)
        this.setData('employer', 'required', isOWN)
        this.setData('monthlyIncome', 'hidden', false)
      } else if (titleName === '买方') {
        const isBmateBuy = (value === 'BMATE' || value === 'BUY') && this.getData('isActualBorrowerName') === 'Y'
        this.setData('phone', 'required', isBmateBuy)
        this.setData('monthlyIncome', 'hidden', true)
      } else if (titleName === '客户') {        
        const isCQR = value === 'CQR'
        this.setData('incomeType', 'required', isCQR)
        this.setData('employer', 'required', isCQR && !isWeBankCQRPO) // 微众银行产权人配偶不必填
        this.setData('monthlyIncome', 'hidden', true)
      }

      const iseEployerRequired = (productCode === 'TFB_YSL_NJY_ISR' || productCode === 'TFB_NSL_NJY_ISR') &&
        (value === 'CQR' || value === 'CQRPO' || value === 'JKR' || value === 'YDKDYR' || value === 'XDKJKR' || value === 'XDKDYR')
      this.setData('employer', 'required', iseEployerRequired && !isWeBankCQRPO)

      // (微众)如果是产权人，婚姻状况为必填 REF: 17056#6
      this.setData('maritalStatus', 'required', this.isWeBank && value === 'CQR')
      // 是否显示产权人配偶
      const isShowOtherRelation = this.isWeBank && value === 'CQR' && this.getData('maritalStatus') === 'MRI'
      this.setData('otherRelation','hidden', !isShowOtherRelation)
    },
    // 是否主贷款人
    doDealMainer(idx1, value) {
      const productCode = this.productCode
      let productJSD = productCode === 'SLY_YSL_YJY_CSH' || productCode === 'SLY_YSL_NJY_CSH' || productCode === 'JSD_NSL_YJY_CSH' || productCode === 'JSD_NSL_NJY_CSH'

      const titleName = this.titleName
      const relationValue = this.getData('relation')
      const isMonthlyIncomeRequired = titleName === '卖方' && this.isDealProduct(productCode) && value === 'Y'
      this.setData('andGuaranteeRelation', 'hidden', value === 'Y' && productJSD)
      this.setData('monthlyIncome', 'required', isMonthlyIncomeRequired)

      if (titleName === '买方') {
        const isRequired = (relationValue === 'BMATE' || relationValue === 'BUY') && value === 'Y'
        this.setData('phone', 'required', isRequired)
      } else if (titleName === '客户') {
        const isRequired = value === 'Y'
        this.setData('phone', 'required', isRequired)
      }
    },
    // 是否为申请人
    doDealApply(idx1, value) {
      const titleName = this.titleName
      if (titleName === '客户') {
        const isRequired = value === 'Y'
        this.setData('maritalStatus', 'required', isRequired)
        this.setData('creditChannel', 'required', isRequired)
      }
    },
    // 客户身份变化响应
    onCustomerIdentityChanged(index, value) {
      // 是否为微众银行推送的企业法人
      const isWeBankLegalPerson = value === 'legalPerson' && this.isWeBank
      const hasAdd = this.isWeBank && (value === 'legalPerson' || value === 'shareholder')

      // (微众)微众推送过来的『法人』信息，【姓名】、【身份证】不可编辑 REF: 17056#4
      this.setData('name', 'hasCamera', !isWeBankLegalPerson)
      this.setData('name', 'readonly', isWeBankLegalPerson)
      this.setData('idCardType', 'readonly', isWeBankLegalPerson)
      this.setData('idCardNo', 'readonly', isWeBankLegalPerson)
      // this.setData('otherRelation', 'hasAdd', hasAdd) // 产权人和法人才会有加配偶的功能
    },
    onMaritalStatusChanged(index, value){
      // 如果是已婚,配偶姓名为必填
      if(this.isWeBank){
        // this.isWeBank && value === 'CQR' && this.getData('maritalStatus') === 'MRI'
        const relation = this.getData('relation')
        this.setData('otherRelation', 'hidden', !(value === 'MRI' && relation === 'CQR'))
        this.setData('otherRelation', 'required', value === 'MRI')
        if(value !== 'MRI'){
          this.setData('otherRelation', 'value', undefined)
        }
      }
    },
    closeBoard() {
      native_common_events(DEFINE_HIDDEN_KEYBORAD)
    }
  },
  watch:{
    customers(items) {
      // 配偶类型下拉数据设置
      this.setData('otherRelation', 'list', this.getRelationCustomers(items))      
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .customer-item {
    flex-wrap: wrap;
    margin-top: 40px;
    margin-bottom: 16px;
  }
  .tip-wrap {
    width: 320px;
  }
  .text {
    font-size: $font_small;
    color: $color_enclosure;
    line-height: 40px;
  }
</style>
