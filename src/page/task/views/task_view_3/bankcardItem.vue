<!--
  function: bankCardItem
  author  : wq
  update  : 2019/1/24 11:47
-->
<template>
  <div>
    <task-base-view
       ref="task-base-view"
       :info="info"
       :apply-no="applyNo"
       :product-code="productCode"
       :show-footer-btn="true"
       :bottom-btns="[]"
       :has-upload="false"
       :has-head="false"
       :show-children="true"
       @input="changeValue"
       @clickEnclosure="clickEnclosure"
       @chooseOrgBank="doChooseOrg"
       @analysisImage="doAnalysisImage">
      <d-form label="账号" :label-width="420" :width="1178" placeholder="请输入账号" :type="info[0].type" :disabled="info[0].disabled" :has-border="info[0].hasBorder !== false"
              :required="true" slot="slot-account-no" v-model="info[0].value" slot-scope="accountNo" @input="inputAccountNo">
        <div style="flex-direction: row;width: 2400px;height: 72px;" slot="other-tip">
          <div class="btn-choose-ctn"><text class="btn-choose" @click="openCardList">选择</text></div>
          <div class="btn-choose-ctn" v-if="info[0].type !== 'text'"><text class="btn-choose" @click="openCamera('accountNo', 0, info[0])">拍摄</text></div>
        </div>
      </d-form>
    </task-base-view>
    <choose-bankcard
       v-if="showCardList" :show-list="accountList"
       @doSureChooseBankcard="doSureChooseBankcard" @doCancelChooseBankcard="doCancelChooseBankcard"></choose-bankcard>
  </div>
</template>

<script>
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { RequirementsBankcardItem } from '@/page/task/config'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'
import { ACCOUNT_TYPE, ACCOUNT_TYPE_CASH, Dist_List_Get } from '@/config'
import ChooseBankcard from './choose_bankcard.vue'
import { native_module_events, DEFINE_UPLOAD_IMAGE_BPMS } from '@/utils/deal_native'
import Dialog from '@/utils/dialog'

export default {
  name: 'bankCardItem',
  components: {
    TaskBaseView, ChooseBankcard
  },
  mixins: [MixinTaskViewIndex],
  props: {
    dataItem: {
      type: Object,
      default: () => ({})
    },
    accountList: {
      type: Array,
      default: () => ([])
    },
    applyNo: {
      type: String
    },
    applyOrder: {
      type: Object
    },
    accountType: {
      type: String
    }
  },
  data() {
    return {
      info: this.deepCopy(RequirementsBankcardItem),
      showCardList: false
    }
  },
  methods: {
    afterCreated() {
      const dataItem = this.dataItem || {}
      const productCode = this.productCode
      const info = this.info
      const cardTypeItem = this.findItemByNameBlock(info, 'cardType')
      const isServer = dataItem.isServer
      if (this.isInsuranceProduct(productCode)) {
        cardTypeItem.list = Dist_List_Get(ACCOUNT_TYPE)
      }
      else {
        cardTypeItem.list = Dist_List_Get(ACCOUNT_TYPE_CASH)
      }
      this.initData()
      if (isServer) {
        info.forEach(item => {
          if (item.type === 'slot') {
            item.hidden = true
            return false
          }
          if (item.key === 'accountNo') {
            item.hidden = false
          }
          if (this.compareObj(item.key, ['bankCode', 'bankName'])) {
            item.value = this.dataItem[item.key[1]]
          }
          if (item.key === 'cardType') {
            item.value = this.getKeyByName(item.list, item.value, 'key', 'name')
          }
          item.type = 'text'
          item.hasChoose = false
          item.hasBorder = false
        })
      }
    },
    // 输入账号
    inputAccountNo() {
      const info = this.info
      const accountNoItem = this.findItemByNameBlock(info, 'accountNo')
      accountNoItem.changed = true
      this.valueChanged = true
    },
    // 选择附件按钮
    clickEnclosure(key, idx, item, event) {
      // 点击开户行
      if (this.compareObj(key, ['bankCode', 'bankName'])) {
        this.doOpenChooseOrg(key, idx, item)
      }
    },
    openCardList() {
      this.showCardList = true
    },
    doSureChooseBankcard(e) {
      if (e.number === undefined && e.name === undefined && e.openBank === undefined && e.type === undefined) {
        Dialog.toast('您选择的银行卡数据为空，请选择其他！')
        return false
      }
      this.valueChanged = true
      const info = this.info
      const accountNoItem = this.findItemByNameBlock(info, 'accountNo')
      const accountNameItem = this.findItemByNameBlock(info, 'accountName')
      const bankNameItem = this.findItemByNameBlock(info, ['bankCode', 'bankName'])
      const cardTypeItem = this.findItemByNameBlock(info, 'cardType')
      accountNoItem.value = e.number
      accountNoItem.changed = true
      accountNameItem.value = e.name
      accountNameItem.changed = true
      bankNameItem.value = e.openBank
      bankNameItem.changed = true
      bankNameItem.values = [e.openBankNo, e.openBank]
      cardTypeItem.value = e.type
      cardTypeItem.changed = true
      this.doCancelChooseBankcard()
      this.stopInputInfo()
    },
    // 选择账号后其他进行操作，只能选择
    stopInputInfo() {
      const info = this.info
      info.forEach(item => {
        if (item.type === 'slot') {
          return false
        }
        item.type = 'text'
        item.hasChoose = false
        item.hasBorder = false
      })
    },
    doCancelChooseBankcard() {
      this.showCardList = false
    },
    // 对识别的图像进行上传
    uploadViewCameraImage(data) {
      const fileResources = this.fileResources || {}
      if (Object.keys(fileResources).length > 0) {
        const customerNo = ''
        Object.keys(fileResources).forEach(item => {
          const fileId = fileResources[item]
          const url = []
          for (let i in fileId) {
            url.push(fileId[i])
          }
          let fileType = 'M05006'
          const info = this.info
          const cardTypeItem = this.findItemByNameBlock(info, 'cardType')
          if (cardTypeItem.value === 'GLK') {
            fileType = 'M05001'
          }
          else if (['XDKSKK', 'JGHKK', 'AJHKZH', 'GJJHKZH', 'ZZZJSKZH', 'QT(MMD)'].indexOf(cardTypeItem.value) > -1) {
            fileType = 'M05002'
          }
          native_module_events(DEFINE_UPLOAD_IMAGE_BPMS, this.applyNo, fileType, url, customerNo, 0)
        })
      }
    },
    doValidate(bool) {
      if (!this.showBtns) {
        return true
      }
      const info = this.info
      if (info.map(item => item.value).join('') === '') {
        return true
      }
      let resultInfo = this.validBaseData(bool, true, '银行卡' + this.dataItem.sortIdx + ': ')
      if (resultInfo === false) {
        return false
      }
      else if (resultInfo === true) {
        return true
      }
      else if (typeof resultInfo === 'object') {
        const obj = {
          projectAccountList: Object.assign({}, resultInfo, { accountType: this.accountType })
        }
        const info = this.info
        if (!info[0].disabled) {
          obj.accountList = {
            name: resultInfo.accountName,
            number: resultInfo.accountNo,
            openBank: resultInfo.bankName,
            openBankNo: resultInfo.bankCode,
            type: resultInfo.cardType
          }
        }
        return this.dealSaveDataObjectToArray(obj)
      }
      return true
    },
    // 对识别的图像进行上传
    uploadCameraImage(data) {
      this.uploadViewCameraImage(data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-choose {
    color: $color_back;
    height: 72px;
    line-height: 72px;
    width: 80px;
    text-align: center;
    margin-left: 10px;
    font-size: $btn_font;
  }
</style>
