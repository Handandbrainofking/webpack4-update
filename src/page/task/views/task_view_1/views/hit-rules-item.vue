<!--
  function: 命中规则
  author  : wq
  update  : 2019/3/19 14:13
-->
<template>
  <d-layout vertical-align="top">
    <d-layout class="num" kind="column" text-align="center" :full-parent="false">
      <text class="text">{{ item.num }}</text>
    </d-layout>
    <d-layout class="rule-name" kind="column" text-align="center" vertical-align="top" :full-parent="false">
      <text class="text">{{ item.ruleName }}</text>
    </d-layout>
    <d-layout class="rule-message" kind="column" text-align="center" vertical-align="top" :full-parent="false">
      <text class="text">{{ item.hitMessage }}</text>
    </d-layout>
    <d-layout class="create-time" kind="column" text-align="center" :full-parent="false">
      <text class="text">{{ item.createTime | date('YYYY-MM-DD hh:mm:ss') }}</text>
    </d-layout>
  </d-layout>
</template>

<script>

export default {
  name: 'hit-rules',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
  .text {
    @include setPadding($normal_gap_bottom, $normal_text_gap);
    font-size: $font_normal;
    color: $color_nav;
    line-height: 40px;
  }
  .num {
    flex: 1;
  }
  .rule-name {
    flex: 3;
  }
  .rule-message {
    flex: 4;
  }
  .create-time {
    flex: 2;
  }
</style>
