<template>
  <div class="order-info">
    <div class="order-field">
      <text class="order-label">产品名称</text>
      <text class="order-content">{{order.productName||'-'}}</text>
    </div>
    <div class="order-field">
      <text class="order-label">客户姓名</text>
      <text class="order-content">{{order.sellerName||'-'}}</text>
    </div>
    <div class="order-field">
      <text class="order-label">渠道经理</text>
      <text class="order-content">{{order.salesUserName||'-'}}</text>
    </div>
    <div class="order-field">
      <text class="order-label">运营跟单人</text>
      <text class="order-content">{{order.robUserName||'-'}}</text>
    </div>
    <div class="order-field">
      <text class="order-label">订单状态</text>
      <text class="order-content">{{applyStatus.name||'-'}}</text>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    applyStatus() {
      const dictItem = this.getDictItem('orderStatus', this.order.applyStatus)
      return dictItem || {}
    }
  }
}
</script>

<style lang="scss" scoped>
.order-info {
  width: 1840px;
  height: 200px;
  border-radius: 4px;
  @include setBorder(#ddedf8, 2px, dashed);
  background-color: #f6fafd;
  margin-top: 32px;
  margin-bottom: 12px;
  margin-left: 250px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 40px;
}

.order-field {
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.order-label {
  border-left-style: solid;
  border-left-width: 6px;
  border-left-color: #feca57;
  padding-left: 4px;
  font-size: 30px;
  color: #677475;
  vertical-align: middle;
}

.order-content {
  padding-left: 10px;
  font-size: 30px;
  margin-top: 20px;
  height: 40px;
}
</style>
