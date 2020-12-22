<template>
  <d-layout class="back-box" :full-parent="false" text-align="initial">
    <d-layout class="back-wrap" :full-parent="false" @clickLayout="doBack" text-align="center">
      <d-image src="/image/arrow-left.png" width="40" height="40"></d-image>
      <text class="back">返回</text>
    </d-layout>
    <slot>
      <d-layout class="title-wrapper" text-align="center" :style="{'padding-right': rightWidth + 'px'}">
        <text class="back-title">{{ backTitle }}</text>
      </d-layout>
    </slot>
  </d-layout>
</template>

<script>
export default {
  name: 'DHead',
  props: {
    rightWidth: {
      type: [String, Number],
      default: 245
    },
    backTitle: {
      type: String,
      default: ''
    },
    beforeBack: {
      type: [Function, null, undefined],
      default: undefined
    }
  },
  methods: {
    doBack() {
      this.$emit('back')
      if (typeof this.beforeBack === 'function') {
        this.beforeBack(() => {
          this.back(true)
        })
      } else {
        this.back(true)
      }
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .back-box {
    @include setPaddingH($weak_big_gap_left);
    height: $back_head_height + px;
  }

  .back-wrap {
    width: 140px;
    height: $back_head_height + px;
    transition: all 500ms;
  }

  .back-wrap:active {
    background-color: rgb(232, 243, 251);
    border-radius: 0;
  }

  .back {
    font-size: $font_head;
    color: $color_nav;
    padding-left: 10px;
    width: 120px;
  }

  .back-title {
    font-size: $font_head;
    color: $color_nav;
  }
</style>