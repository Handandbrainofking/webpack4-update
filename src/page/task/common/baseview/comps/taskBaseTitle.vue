<!--
  function: taskBaseTitle
  author  : wq
  update  : 2018/11/30 9:48
-->
<template>
  <d-layout class="head-wrap" text-align="initial" :full-parent="false">
    <d-layout>
      <text class="title">{{ title }}</text>
    </d-layout>
    <template v-if="isOrder">
      <d-layout text="right" :full-parent="false" @clickLayout="openOrderInfo">
        <text class="btn-wrap">订单信息</text>
        <d-image src="/image/icon_detail.png" width="40" height="40"></d-image>
      </d-layout>
      <task-order-info v-model="openOrder" :orderId="applyNo"></task-order-info>
    </template>
    <template v-else-if="tabs.length > 0">
      <text class="btn-wrap" v-for="(item, index) in tabs" @click="$emit('clickHeadBtn', index, item)" :key="index">{{
        getValue(item, 'name') }}
      </text>
    </template>
  </d-layout>
</template>

<script>
import MixinTaskBaseHead from '../mixins/mixinTaskBaseHead'
import TaskOrderInfo from '@/page/task/components/common/order-info.vue'

export default {
  name: 'taskBaseTitle',
  components: { TaskOrderInfo },
  mixins: [MixinTaskBaseHead],
  props: {
    applyNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      openOrder: false
    }
  },
  methods: {
    openOrderInfo() {
      this.openOrder = true
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .head-wrap {
    height: 120px;
    @include setPaddingH($normal_gap_column);
  }
  .title {
    font-size: $font_head;
    color: $color_nav;
  }
  .btn-wrap {
    height: $btn_height + px;
    line-height: $btn_height + px;
    color: $color_back;
    text-align: center;
    font-size: $font_nav;
  }
</style>
