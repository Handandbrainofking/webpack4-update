<!--
  function: taskTabItem
  author  : wq
  update  : 2018/11/23 10:13
-->
<template>
  <d-layout :class="['tab-title-item', isActive && 'tab-title-item-active' || '']" text-align="center" :full-parent="false">
    <text :class="['item-text', changeFontSize && 'item-text-small' || '', isActive && 'item-text-active' || '', changeFontSize && isActive && 'item-text-big' || '']">{{ title }}</text>
  </d-layout>
</template>

<script>
export default {
  name: 'taskTabItem',
  props: {
    title: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: false
    },
    changeFontSize: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .tab-title-item {
    height: 76px;
    width: 320px;
    @include setPaddingH(10px);
  }

  .item-text {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: $font_nav;
    color: $color_enclosure;
    lines: 1;
  }

  .tab-title-item-active {
    background-color: $color_white;
    @include setBorderBottom($color_white);
    @include setBorderTop($btn_border_focus);
    @include setBorderLeft($btn_border_focus);
    @include setBorderRight($btn_border_focus);
  }

  .item-text-small{
    font-size: $font_normal;
  }

  .item-text-active {
    color: $btn_border_focus;
  }

  .item-text-big{
    font-size: $font_head;
  }
</style>
