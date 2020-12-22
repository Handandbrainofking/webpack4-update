<!--
  function: 用于显示时间冲突弹窗的订单信息
  author: liangcanlun
  update: 2018-05-28
 -->
<template>
  <list class="order-info">
    <cell class="field-group-1">
      <text class="spinder"></text>
      <text class="label">客户姓名</text>
      <text class="content-col-1">{{order.sellerName}}</text>
      <text class="spinder"></text>
      <text class="label">产品名称</text>
      <text class="content-col-2">{{order.productName}}</text>
      <text class="spinder"></text>
      <text class="label">预约节点</text>
      <text class="content-col-3">{{showTextEllipsis(order.matterName,5)}}</text>
    </cell>
    <cell class="field-group-2">
      <text class="spinder"></text>
      <text class="label-time">预约时间</text>
      <text class="content-col-time">{{typeof order.appointTime === 'number'?
        formatDate(order.appointTime):order.appointTime}}
      </text>
      <text class="spinder"></text>
      <text class="label">预约地点</text>
      <text class="content-col-2">{{showTextEllipsis(order.appointAddress,11)}}</text>
    </cell>
  </list>
</template>

<script>
import minxin from '@/mixins/index'

export default {
  name: 'order-info',
  mixins: [minxin],
  props: {
    order: {
      type: Object,
      default: {}
    }
  },
  methods: {
    showTextEllipsis(text = '', size = 32) {
      if (text.length > size) {
        return text.slice(0, size - 1) + '...'
      }
      return text;
    }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  .order-info {
    justify-content: flex-start;
    align-content: flex-start;
  }

  .field-group {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
  }

  .field-group-1 {
    @extend .field-group;
    padding-bottom: 30px;
  }

  .field-group-2 {
    @extend .field-group;
  }

  .field {
    flex-direction: row;
  }

  .label {
    font-size: 30px;
    color: #677475;
    margin-right: 30px;
    width: 150px;
    text-align: left;
  }

  .label-time {
    @extend .label;
    color: #EE5253;
  }

  .content {
    color: #21363D;
    font-size: 30px;
    lines: 1;
  }

  .spinder {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background-color: #FECA57;
    margin-right: 20.5px;
    transform: rotate(45deg);
  }

  .content-col-1 {
    @extend .content;
    width: 328px;
  }

  .content-col-2 {
    @extend .content;
    width: 410px;
  }

  .content-col-3 {
    @extend .content;
    width: 249px;
  }

  .content-col-time {
    @extend .content-col-1;
    color: #EE5253;
  }

</style>