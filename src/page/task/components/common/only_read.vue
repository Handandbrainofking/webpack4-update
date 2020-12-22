<template>
  <div class="input-box" :style="{ height:inputHeight + 'px'}">
    <div class="row-only-read margin40" :style="{ width:labelWidth + 'px' }">
      <text class="only-read-label-read" :style="{ 'font-size':size+'px' }">{{ label }}</text>
      <text v-if="isNeed" class="only-read-label-read input-active" :style="{ 'font-size':size+'px' }">*</text>
    </div>
    <text class="only-read-content" :style="{ width:contentWidth+'px', 'font-size':contentSize+'px' }">{{ content }}</text>
  </div>
</template>

<script>
export default {
  name: "", //带入只读信息，中间对齐，有必填红星
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
    size: {
      type:Number,
      default: 34
    },
    contentSize: {
      type:Number,
      default: 34
    },
    inputHeight: {
      type:Number,
      default: 96
    },
    isNeed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../../../components/labelvalue/input';

  .row-only-read {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

</style>