<!--
  function: remark
  author  : wq
  update  : 2019/1/24 11:30
-->
<template>
  <task-base-view
     ref="task-base-view"
     :info="info"
     :apply-no="applyNo"
     :product-code="productCode"
     :is-title-array-config="isTitleArrayConfig"
     :show-footer-btn="true"
     :bottom-btns="[]"
     :has-upload="false"
     :has-head="false"
     :show-children="true"
     @input="changeValue"></task-base-view>
</template>

<script>
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { RequirementsRemarkItem } from '@/page/task/config'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'

export default {
  name: 'remarkItem',
  components: {
    TaskBaseView
  },
  mixins: [MixinTaskViewIndex],
  data() {
    return {
      info: this.deepCopy(RequirementsRemarkItem),
      isTitleArrayConfig: true
    }
  },
  methods: {
    afterCreated() {
      // 处理备注，不过由于这块没有保存，所以不需要进行处理，每次备注数据都是空的
    },
    // 修改数据
    changeValue(key, blockIndex, idx, item, value, name) {
      const _value = item.value
      const info = this.info[blockIndex].children
      if (String(_value) !== value) {
        this.valueChanged = true
        if (Array.isArray(key) && key.length === 2) {
          this.$set(info, idx, Object.assign({}, item, { values: [value, name], value, changed: true }))
        } else {
          this.$set(info, idx, Object.assign({}, item, { value, changed: true }))
        }
      }
    },
    doValidate(bool) {
      if (!this.showBtns) {
        return true
      }
      let resultInfo = this.validBaseData(bool)
      if (resultInfo === false) {
        return false
      }
      else if (resultInfo === true) {
        return true
      }
      else if (typeof resultInfo === 'object') {
        return this.dealSaveDataObjectToArray(resultInfo)
      }
      return true
    }
  }
}
</script>
