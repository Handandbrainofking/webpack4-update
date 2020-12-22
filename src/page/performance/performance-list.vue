<template>
  <div>
    <my-performance></my-performance>
    <div class="flex">
      <performance-detail></performance-detail>
      <operation-recording></operation-recording>
    </div>
  </div>
</template>
<script>
import MyPerformance from '@/page/performance/components/my-performance.vue'
import PerformanceDetail from '@/page/performance/components/performance-detail.vue'
import OperationRecording from '@/page/performance/components/operation-recording.vue'

export default {
  name: 'performance-list',
  statistics: 'performanceList|我要提奖',
  components: {
    MyPerformance,
    PerformanceDetail,
    OperationRecording
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped>
  .flex {
    flex-direction: row
  }
</style>