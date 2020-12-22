<template>
  <wxc-popup
    :show="orderPerDetailShow"
    @wxcPopupOverlayClicked="doClosePopupHistory"
    pos="right"
    width="1200">
    <back-head back-title="历史系数" :beforeBack="backClick"></back-head>
    <div class="history-warpper">
      <div class="head-list flex">
        <text class="head-list-text">时间</text>
        <text class="head-list-text">计件系数</text>
      </div>
      <scroller style="height: 1330px" v-if="bodyList.length">
        <div :class="[ idx % 2 != 0 && 'double-body-color']" class="body-list flex" v-for="(item, idx) in bodyList" :key="item">
          <text class="body-list-text">{{ item.cycle }}</text>
          <!-- <text class="body-list-text">{{ returnFloat(item.coefficientValue || 0) }}</text> -->
          <text class="body-list-text">{{ Number((item.coefficientValue || 0).toString().match(/^\d+(?:\.\d{0,1})?/)) }}</text>
        </div>
      </scroller>
      <div v-if="!bodyList.length" class="no-data-content-image" :style="{ 'margin-top': 250 + 'px' }">
        <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
        <text class="no-data-text">暂无数据</text>
      </div>
    </div>
    </wxc-popup>
</template>
<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import loginApi from '@/utils/login'

export default {
  name: 'order-performance-detail',
  components: { WxcPopup, BackHead },
  props: {},
  created() {
    this.requestList()
  },
  data() {
    return {
      orderPerDetailShow: true,
      bodyList: []
    }
  },
  methods: {
    requestList() {
      this.requestApi.history_num({
        method: 'GET',
        data: {
          companyCode: loginApi.getLoginData().companyCode
        },
        success: data => {
          this.bodyList = data.list || []
        }
      })
    },
    doClosePopupHistory() {
      this.$emit('closeHistory', false)
    },
    backClick() {
      this.$emit('closeHistory', false)
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  @import '../performance.scss';

  .history-warpper {
    padding-right: 20px;
    padding-left: 20px;
  }
</style>
