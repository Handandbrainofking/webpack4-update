<template>
  <div class="input-box-remark">
    <div class="row margin40" :style="{ width:labelWidth + 'px' }">
      <text class="only-read-label-read" :style="{ 'font-size':size+'px' }">{{ label }}</text>
    </div>
    <text class="only-read-content" :style="{ width:contentWidth+'px', 'font-size':contentSize+'px' }">{{ content }}</text>
  </div>
</template>

<script>
export default {
  name: "", //备注只读
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
      type: Number,
      default: 34
    },
    contentSize: {
      type: Number,
      default: 34
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../../../components/labelvalue/input';

.input-box-remark {
    flex-direction: row;
    padding-top: 20px;
}

.row {
    flex-direction: row;
    justify-content: flex-end;
}

</style>