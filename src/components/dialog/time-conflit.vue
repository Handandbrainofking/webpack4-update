<!--
  function: 用户显示抢单等时间冲突信息
  author: liangcanlun
  update: 2018-05-28
 -->
<template>
  <dialog
     :show="true"
     :definedBtn="true"
     width="1600"
     top="300"
     class="dialog">
    <div slot="title" class="title-wrap">
      <text class="order-title">时间冲突</text>
      <text class="order-title-close" @click="doCancel">×</text>
    </div>
    <div slot="content">
      <list class="dialog-content">
        <cell>
          <text class="header-caption">当前订单预约信息</text>
        </cell>
        <cell class="order-info">
          <!-- 订单信息 -->
          <appoint-info :order="orderInfo"></appoint-info>
        </cell>
        <cell>
          <text class="header-caption conflit-caption">{{`冲突订单信息 (${conflitOrders.length})`}}</text>
        </cell>
        <cell v-for="order in conflitOrders" :key="order" class="conflit-order-info">
          <appoint-info :order="order" class="conflit-order"></appoint-info>
        </cell>
      </list>
      <div class="dialog-footer">
        <div class="btn-wrap-cancel" @click="doCancel">
          <text class="btn-cancel">取消</text>
        </div>
        <div class="btn-wrap-commit" @click="doCommit">
          <text class="btn-commit">继续</text>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script>
import Dialog from '@/components/dialog/dialog.vue';
import AppointInfo from '@/components/order/appoint-info.vue'

export default {
  name: 'dialog-order-conflit',
  components: {
    Dialog,
    AppointInfo
  },
  props: {
    //当前预约订单信息
    orderInfo: {
      type: Object,
      default: {}
    },
    //冲突订单信息
    //可以用多个
    conflitOrders: {
      type: Array,
      default: []
    }
  },
  methods: {
    doCancel() {
      this.$emit('cancel')
    },
    doCommit() {
      this.$emit('commit')
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .title-wrap {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 88px;
    background-image: linear-gradient(to right, #02B3B4, #1ABC9C);
    border-radius: 4px 4px 0 0;
  }

  .order-title {
    font-size: 38px;
    color: $color_white;
    margin-right: 624px;
  }

  .order-title-close {
    color: #ffffff;
    font-size: 60px;
    padding-right: 40px;

    width: 60px;
    height: 60px;
  }

  .header-caption {
    font-size: 34px;
    color: #21363D;
  }

  .dialog-content {
    padding-top: 30px;
    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 30px;
    height: 784px;
  }

  .order-info {
    @include setBorderBottom(#EBEBEB, 1px);
    padding-top: 40px;
    padding-bottom: 62px;
  }

  .conflit-order-info {
    @include setBorderBottom(#EBEBEB, 1px, dashed);
    padding-top: 40px;
    padding-bottom: 62px;
  }

  .conflit-caption {
    padding-top: 47px;
  }

  .dialog-footer {
    @include setBorderTop();
    height: 140px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  .btn {
    font-size: 38px;
  }

  .btn-wrap-cancel {
    @include setBorder($color_enclosure);
    width: 360px;
    height: 88px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
  }

  .btn-wrap-commit {
    @extend .btn-wrap-cancel;
    background-image: linear-gradient(to right, #02B3B4, #1ABC9C);
    border-color: rgba(2, 179, 180, 0.70);
  }

  .btn-commit {
    @extend .btn;
    color: #ffffff;
  }

  .btn-cancel {
    @extend .btn;
    color: #677475;
  }

</style>