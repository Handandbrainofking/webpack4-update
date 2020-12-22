<!--
  function: headCloseX
  author  : wq
  update  : 2018/12/3 11:14
-->
<template>
  <d-layout slot="title" class="title-wrap">
    <d-layout text-align="center">
      <text class="title">{{ title }}</text>
    </d-layout>
    <d-layout v-if="hasClose" class="title-close-wrap" :full-parent="false" @clickLayout="$emit('clickClose', $event)">
      <text class="title-close-text">×</text>
    </d-layout>
  </d-layout>
</template>

<script>
export default {
  name: 'dialogHead',
  props: {
    title: {
      type: String,
      default: ''
    },
    hasClose: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  $titleHeight: 88;
  .title {
    font-size: 38px;
    color: $color_white;
  }
  .title-wrap {
    height: $titleHeight + px;
    background-image: linear-gradient(to right, #02B3B4, #1ABC9C);
  }

  .title-close-wrap {
    width: 100px;
    height: $titleHeight + px;
    margin-left: -100px;
  }

  .title-close-text {
    color: $color_white;
    font-size: 75px;
    font-weight: 100;
  }
</style>
