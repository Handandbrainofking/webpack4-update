<!--核实同贷(赎楼贷款)-->
<script>
import { mapGetters } from 'vuex'
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { AgreeLoanMark_AtoneItem } from '@/page/task/config'

import { native_common_events, DEFINE_GET_LOCATION, native_logMessage } from '@/utils/deal_native';
import { Dist_List_Get, RANSOM_REPAY_TYPE } from '@/config/index';
import { Validator } from '@/utils/validator';
import dialog from '@/utils/dialog';

const labelWidth = 440;
export default {
  name: 'loadRegisterRansom',
  statistics: 'loadRegisterRansom|跟单详情-核实同贷（赎楼贷款）',
  extends: ExtendTaskBaseView,
  data() {
    return {
      isTitleArrayConfig: true,
      info: AgreeLoanMark_AtoneItem,
      requestParams: ['applyOrder', 'customerRelList', 'newLoan', 'ransomFloor', 'feeSummary', 'accountList', 'dealInfo', 'orderMatterRecordList'],
      bottomBtns: ['保存', '提交'],
      capitalCode: '',
      showChildren: false
    }
  },
  created(){},
  computed: {
    ...mapGetters(['customerRelList', 'userInfo', 'applyOrder'])
  },
  watch: {
    customerRelList(value, oldValue) {
      if (!this.compareObj(value, oldValue)) {
        this.dealcustomerRelList(value)
      }
    }
  },
  methods: {
    //处理借款人姓名
    dealcustomerRelList(value) {
      const info = this.dealInfoCompatibleArray()
      const sellerNameItem = this.findItemByNameBlock(info, 'sellerName')
      const _value = value || []
      const list = []
      _value.forEach(item => {
        list.push({
          key: item.customer.name,
          name: item.customer.name,
          idCardNo: item.customer.idCardNo
        })
      })
      this.$set(this.info[sellerNameItem.blockIndex].children, sellerNameItem.sortIndex, Object.assign({}, sellerNameItem, { list }))
  },
    initOtherData() {
      const productType = this.productType
      const info = this.dealInfoCompatibleArray()
      // 处理落地行
      if (!(productType & this.getCashProductCode())) {
        this.capitalCode = (this.applyOrder || {}).partnerBankId || ''
      }    
      // 处理转单控制释放
      const userInfo = this.userInfo
      const applyOrder = this.applyOrder
      this.bottomBtns = ['保存', '提交'];
      // 处理新贷款机构，将对应的编号换成名称
      const newLoanBankCodeItem = this.findItemByNameBlock(info, ['newLoanBankCode', 'newLoanBankName'])
      this.initOrgList(newLoanBankCodeItem.sortIndex, newLoanBankCodeItem)
      // 处理开户行机构，将对应的编号换成名称
      const openBankNoItem = this.findItemByNameBlock(info, ['openBankNo', 'openBank'])
      this.initOrgList(openBankNoItem.sortIndex, openBankNoItem)
      // 处理周转卡
      const zzNameItem = this.findItemByNameBlock(this.info[1].children, 'name')
      if (!zzNameItem.productType || (productType & zzNameItem.productType)) {
        this.dealWeekCard(zzNameItem.sortIndex, zzNameItem.value, zzNameItem, zzNameItem.blockIndex)
      }
      this.showChildren = true
    },
    // 修改数据
    changeValue(key, blockIndex, idx, item, value, name) {
      const _value = item.value
      const info = this.info[blockIndex].children
      if (String(_value) !== value) {
        this.valueChanged = true
        if (key === 'sellerName') {
          this.sellerNameSelect(idx, value, item, blockIndex)
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
    sellerNameSelect(idx, value, item, blockIndex) {
      console.log()
      const info = this.dealInfoCompatibleArray()
      const sellerCardNoItem = this.findItemByNameBlock(info, 'sellerCardNo')
      const dataItem = item.list.filter(item => item.key === value)[0]
      this.$set(this.info[sellerCardNoItem.blockIndex].children, sellerCardNoItem.sortIndex, Object.assign({}, sellerCardNoItem, { value: dataItem.idCardNo, changed: true }))
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
    },
    // 处理提交保存验证
    doValidate(bool) {
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
          const type = accountList.type = 'XDKSKK'
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
