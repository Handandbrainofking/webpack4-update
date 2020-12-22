<!--
  function: supply-card
  author  : wq
  update  : 2018/12/13
-->
<template>
  <task-base-view
     ref="task-base-view"
     :info="info"
     :apply-no="applyNo"
     :product-code="productCode"
     :show-footer-btn="true"
     :bottom-btns="[]"
     :width="width"
     matter-key="other"
     :is-title-array-config="false"
     :has-upload="false"
     :has-head="false"
     :show-children="true"
     @input="changeValue"
     @clickEnclosure="clickEnclosure"
     @chooseGroundBank="doChooseGroundBank"
     @chooseOrgBank="doChooseOrg"
     @analysisImage="doAnalysisImage"
  ></task-base-view>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { SupplyLoanMarkCardItem } from '@/page/task/config'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'
import { native_module_events, DEFINE_UPLOAD_IMAGE_BPMS } from '@/utils/deal_native'

export default {
  name: 'supply-card',
  components: {
    TaskBaseView
  },
  mixins: [MixinTaskViewIndex],
  props: {
    dataItem: {
      type: Object,
      default: () => ({})
    },
    width: {
      type: Number
    }
  },
  data() {
    return {
      info: this.deepCopy(SupplyLoanMarkCardItem)
    }
  },
  computed: {
    ...mapGetters({
      applyOrder: 'applyOrder'
    })
  },
  methods: {
    afterCreated() {
      this.initData()
      this.initOtherData()
    },
    initOtherData() {
      const info = this.dealInfoCompatibleArray()
      const openBankNoItem = this.findItemByNameBlock(info, ['openBankNo', 'openBank'])
      this.initOrgList(openBankNoItem.sortIndex, openBankNoItem)
    },
    // 点击附件，打开选择等
    clickEnclosure(key, idx, item, event) {
      if(this.compareObj(key, ['openBankNo', 'openBank'])) {
        this.doOpenChooseOrg(key, idx, item)
      }
      else if(key === 'number') {
        this.openCamera(key, idx, item)
      }
    },
    // 对识别的图像进行上传
    uploadCameraImage() {
      const fileId = this.fileResources || {}
      if (Object.keys(fileId).length > 0) {
        const customerNo = ''
        let fileType = 'M05002'
        const url = []
        for (let i in fileId) {
          url.push(fileId[i])
        }
        native_module_events(DEFINE_UPLOAD_IMAGE_BPMS, this.applyNo, fileType, url, customerNo, 0)
      }
    },
    doValidate(bool) {
      let resultInfo = this.validBaseData(bool)
      if (resultInfo === false) {
        return false
      }
      else if (resultInfo === true) {
        return true
      }
      else if (typeof resultInfo === 'object') {
        if (this.dataItem.id) {
          resultInfo.id = this.dataItem.id
        }
        resultInfo.type = 'GLK'
        return this.dealSaveDataObjectToArray({accountList: resultInfo})
      }
      return true
    }
  }
}
</script>
