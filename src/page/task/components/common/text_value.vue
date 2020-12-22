<template>
  <div class="input-box" :style="{height:inputHeight + 'px'}">
    <div class="row margin20" :style="{ width:labelWidth + 'px' }">
      <text class="label-read">{{ label }}</text>
    </div>
    <text class="content" :style="{ width:contentWidth+'px' }">{{ content }}</text>
  </div>
</template>

<script>
export default {
  name: "", //带入只读信息，中间对齐，没有黄色点
  props: {
    label: {
      type: String,
      default: ""
    },
    labelWidth: {
      type: Number,
      default: 330
    },
    content: {
      type: String,
      default: ""
    },
    contentWidth: {
      type: Number,
      default: 600
    },
    inputHeight: {
      type: Number,
      default: 96
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../../../components/labelvalue/input';

  .row {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

</style>