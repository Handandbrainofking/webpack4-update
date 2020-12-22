<template>
    <task-base-layout
     ref="task-base-layout"
     :need-mark="false"
     :need-title="false"
     :stop-edit="deleteFlag"
     :matter-key="'TrustAccount'"
     :show-footer-btn="false">
    </task-base-layout>
</template>

<script>
import TaskBaseLayout from "../components/common/base.vue";
export default {
    components: {
        TaskBaseLayout
    },
    props: {
     deleteFlag: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style>

</style>
