<!--
  function: sub-title
  author  : wq
  update  : 2018/5/23 17:53
-->
<template>
  <d-layout class="info-wrap" kind="column" :full-parent="false" text-align="initial" vertical-align="initial">
    <text class="sub-title" v-if="title">{{ title }}</text>
    <d-layout :wrap="true" :full-parent="false" text-align="initial" vertical-align="initial">
      <slot></slot>
    </d-layout>
  </d-layout>
</template>

<script>
  export default {
    name: "form-sub-title",
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  .info-wrap {
    @include setPaddingH();
  }
  .sub-title {
    font-size: $font_nav;
    color: $color_enclosure;
    @include setPaddingV($normal_gap_root_column);
  }
</style>
