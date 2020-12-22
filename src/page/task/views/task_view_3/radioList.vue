<!--
  function: radioList
  author  : wq
  update  : 2019/1/24 11:31
-->
<template>
  <task-base-view
     ref="task-base-view"
     :info="[]"
     :apply-no="applyNo"
     :product-code="productCode"
     :show-footer-btn="true"
     :bottom-btns="[]"
     :has-head="false"
     :show-children="true"></task-base-view>
</template>

<script>
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'

export default {
  name: 'radioList',
  components: {
    TaskBaseView
  },
  mixins: [MixinTaskViewIndex],
  methods: {
    doValidate() {
      return true
    }
  }
}
</script>
