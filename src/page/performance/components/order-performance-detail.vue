<template>
  <wxc-popup
    :show="orderPerDetailShow"
    @wxcPopupOverlayClicked="doClosePopupOrderPerDetail"
    pos="right"
    width="2240">
    <back-head back-title="提奖明细" :beforeBack="backClick"></back-head>
    <div class="flex">
      <div class="tab-part">
        <text :class="[getTabClass('per')]" @click="changeTab('per')">提奖明细</text>
      </div>
      <div class="tab-part">
        <text :class="[getTabClass('order')]" @click="changeTab('order')">订单信息</text>
      </div>
    </div>
    <div v-if="tabName==='per'">
      <text class="tip-text">作业环节提奖=标准计件*计提时间当月的计提系数+偏远补贴</text>
      <div class="head-list flex">
        <text class="head-list-text">作业环节</text>
        <text class="head-list-text">经办时间</text>
        <text class="head-list-text">计提时间</text>
        <text class="head-list-text">标准计件</text>
        <text class="head-list-text">偏远补贴</text>
        <text class="head-list-text">合计</text>
      </div>
      <scroller style="height: 1280px" v-if="bodyList.length">
        <div :class="[ idx % 2 != 0 && 'double-body-color']" class="body-list flex" v-for="(item, idx) in bodyList" :key="item">
          <text class="body-list-text">{{ item.nodeName }}</text>
          <text class="body-list-text">{{ item.createTime|date('YYYY-MM-DD hh:mm') }}</text>
          <text class="body-list-text">{{ item.handleTime|date('YYYY-MM-DD hh:mm') }}</text>
          <text class="body-list-text">{{ item.amount }}</text>
          <text class="body-list-text">{{ item.remoteAllowance }}</text>
          <text class="body-list-text">{{ item.total }}</text>
          <!-- <text class="body-list-text">{{ getStatus(item.status) }}</text> -->
        </div>
      </scroller>
      <div v-if="!bodyList.length" class="no-data-content-image" :style="{ 'margin-top': 250 + 'px' }">
        <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
        <text class="no-data-text">暂无数据</text>
      </div>
    </div>
    <scroller class="flex1" v-else>
      <apply-info :apply-no="applyNo" :field-width="1000"></apply-info>
    </scroller>
  </wxc-popup>
</template>
<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import ApplyInfo from '@/page/track/components/applyInfo.vue'

export default {
  name: 'order-performance-detail',
  components: { WxcPopup, BackHead, ApplyInfo },
  props: {
    applyNo: {
      type: String
    }
  },
  created() {
    this.getRequestList()
  },
  data() {
    return {
      orderPerDetailShow: true,
      tabName: 'per',
      bodyList: []
    }
  },
  methods: {
    getRequestList() {
      this.requestApi.order_performance({
        data: {
          applyNo: this.applyNo
        },
        success: data => {
          this.bodyList = data.list
        }
      })
    },
    getTabClass(tabName) {
      if (this.tabName === tabName) {
        return 'middle-green-text'
      } else {
        return 'middle-grey-text'
      }
    },
    changeTab(tabName) {
      this.tabName = tabName
    },
    doClosePopupOrderPerDetail() {
      this.$emit('closeOrderChoose', false)
    },
    backClick() {
      this.$emit('closeOrderChoose', false)
    },
    getStatus(status) {
      if(status === 'ENTERING') {
        return '入账中'
      } else if(status === 'ENTERED') {
        return '已到账'
      }
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  @import '../performance.scss';

  .tip-text {
    color: rgb(2, 179, 180);
    font-size: 30px;
    text-align: right;
    margin-right: 20px;
  }
</style>
