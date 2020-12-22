<template>
  <wxc-popup
     v-if="showOrder"
     :show="true"
     @wxcPopupOverlayClicked="doClosePopupOrder"
     pos="right"
     width="2240">
    <back-head :beforeBack="backClick"></back-head>
    <basic-info class="padding40" :apply-no="orderId" :height="height"></basic-info>
  </wxc-popup>
</template>

<script>
  import BasicInfo from "@page/track/components/basicInfo.vue"
  import WxcPopup from '@/components/wxc/popup.vue'
  import BackHead from '@/components/back/head.vue'

  export default {
    name: "task-order-info",
    statistics: 'taskOrderInfo|订单管理-订单信息',
    props: {
      orderId: {
        type: [String, Number],
        default: 0
      },
      height: {
        type: [String, Number],
        default: 1480
      },
      showOrder: {
        type: Boolean,
        default: false
      }
    },
    model: {
      prop: 'showOrder',
      event: 'closeOrder'
    },
    components: {
      WxcPopup,
      BasicInfo,
      BackHead
    },
    methods: {
      doClosePopupOrder() {
        this.$emit("closeOrder", false)
      },
      backClick(){
      		this.$emit("closeOrder", false)
      }
    },
    watch:{
      showOrder(val){
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