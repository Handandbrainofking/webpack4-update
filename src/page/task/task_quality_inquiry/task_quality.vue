<template>
  <div class="container-box">
    <back-head></back-head>
    <DTab
       mode="text"
       wrap-bg-color="#fff"
       ref="d-tab-set"
       :swipe-change="true"
       :page-width="tabPageWidth"
       :page-height="1480">
      <task-tab-item
         :slot="`tab-title-${index}`" slot-scope="titleItem"
         v-bind="titleItem"
         :change-font-size="true"
         :key="`task-tab-title-${index}`" v-for="(item, index) in tabTitles"></task-tab-item>
      <DTabPage
         class="tab-set-page"
         :title="item.title"
         :key="`task-tab-page-${index}`" v-for="(item, index) in tabTitles">
        <component
           :ref="`task-main-tab-${index}`"
           :is="item.component"
           :filter="getFilter(i)"
        ></component>
      </DTabPage>
    </DTab>
  </div>
</template>

<script>
import TaskTabItem from '@/page/task/components/common/taskTabItem.vue'
import BackHead from '@/components/back/head.vue'
import TaskCreditChannel from './task_credit_channel.vue' // 征信查询
import TaskLitigation from './task_litigation.vue' // 个人诉讼
import TaskCompany from './task_company.vue' // 公司诉讼
import TaskBussiness from './task_business.vue' // 工商信息
import TaskHeadApproval from './task_head_approval.vue' // 总部审批结果

export default {
  name: 'sign',
  components: {
    TaskTabItem,
    BackHead,
    TaskCreditChannel,
    TaskLitigation,
    TaskCompany,
    TaskBussiness,
    TaskHeadApproval
  },
  data() {
    return {
      tabPageWidth: 2700,
      tabTitles: [
        {
          title: '征信查询',
          component: 'TaskCreditChannel'
        },
        {
          title: '个人诉讼',
          component: 'TaskLitigation'
        },
        {
          title: '工商信息',
          component: 'TaskBussiness'
        },
        {
          title: '公司诉讼',
          component: 'TaskCompany'
        },
        {
          title: '总部审批结果',
          component: 'TaskHeadApproval'
        }
      ],
      needSlider: true,
    }
  },
  methods: {
    getFilter(idx) {
      if (idx === 2) {
        return ['InputInfo', 'InputInfoComplete', 'Investigate', 'ManCheck'];
      }
      return undefined;
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  .container-box {
    flex-direction: column;
    @include setWindowWH();
  }
  .tab-set-page {
    width: 2420px;
  }
</style>
