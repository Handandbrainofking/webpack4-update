<!--
  function: otherList
  author  : wq
  update  : 2019/1/24 11:30
-->
<template>
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
     @input="changeValue"></task-base-view>
</template>

<script>
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { RequirementsOtherItem } from '@/page/task/config'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'

export default {
  name: 'otherItem',
  components: {
    TaskBaseView
  },
  mixins: [MixinTaskViewIndex],
  props: {
    dataItem: {
      type: Object,
      default: () => ({})
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
      info: this.deepCopy(RequirementsOtherItem)
    }
  },
  methods: {
    afterCreated() {
      const dataItem = this.dataItem || {}
      const info = this.info
      const isServer = dataItem.isServer
      this.initData()
      if (isServer) {
        this.$set(dataItem, 'height', 376)
        info.forEach(item => {
          item.type = 'text'
          item.hasChoose = false
          item.hasBorder = false
        })
      }
    },
    doValidate(bool) {
      if (!this.showBtns || this.dataItem.isServer) {
        return true
      }
      const info = this.info
      if (info.map(item => item.value).join('') === '') {
        return true
      }
      let resultInfo = this.validBaseData(bool, true, '其他证件' + this.dataItem.sortIdx + ': ')
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
        return this.dealSaveDataObjectToArray(obj)
      }
      return true
    }
  }
}
</script>
