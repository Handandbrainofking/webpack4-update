<template>
  <wxc-popup
     v-if="showApproval"
     :show="true"
     @wxcPopupOverlayClicked="doClosePopupOrder"
     pos="right"
     width="2240">
     <back-head :beforeBack="backClick" backTitle="审批详情"></back-head>
      <DTab :page-height="1480" mode="bottom-short" @wxcTabPageCurrentTabSelected="tabChanged">
        <DTabPage title="特批信息">
          <approval-detail class="padding40" :applyNo="applyNo" :supplement="supplement"></approval-detail>
        </DTabPage>
        <DTabPage title="订单信息">
          <apply-info class="padding40" :apply-no="applyNo" :field-width="1000"></apply-info>
        </DTabPage>
     </DTab>
  </wxc-popup>
</template>

<script>
  import ApplyInfo from '@/page/track/components/applyInfo.vue'
  import ApprovalDetail from '@/page/special-approval/views/MyApprovalDetail.vue'
  import WxcPopup from '@/components/wxc/popup.vue'
  import BackHead from '@/components/back/head.vue'

  export default {
    props: {
      applyNo: {
        type: [String, Number],
        default: 0
      },
      height: {
        type: [String, Number],
        default: 1480
      },
      showApproval: {
        type: Boolean,
        default: false
      },
      supplement: {
        type: Boolean,
        default: false
      }
    },
    model: {
      prop: 'showApproval',
      event: 'closeApproval'
    },
    components: {
      WxcPopup,
      ApplyInfo,
      BackHead,
      ApprovalDetail
    },
    data() {
      return {
        currentPage: {}
      }
    },
    methods: {
      tabChanged(e) {
        this.currentPage = e.page
      },
      doClosePopupOrder() {
        this.$emit("closeApproval", false)
      },
      backClick(){
        this.$emit("closeApproval", false)
      }
    },
    watch:{
      showApproval(val){
        if(!val){
          // 提交统计信息
          this.commitStastics()
        } else{
          // 开启统计
          this.startStasitcs()
        }
      }
    }
  }
</script>

<style scoped>

</style>