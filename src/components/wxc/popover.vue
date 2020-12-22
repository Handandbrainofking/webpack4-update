<!--
  function: only for a popover to toast message that can position (left right top bottom)
  author  : wq
  update  : 2018/7/2 9:33
-->
<!-- CopyRight (C) 2017-2022 WeexUI Group Holding Limited. -->
<!-- Created by git@zwwill on 18/02/08. -->
<!--A popover box with customized contents.-->

<template>
  <div>
    <div class="g-cover"
         v-if="show"
         @touchend="wxcOverlayBodyClicked"
         :style="coverStyle"></div>
    <div ref="wxc-popover"
         class="g-popover"
         v-if="show"
         :style="contentStyle">
      <div class="u-popover-inner">
        <slot></slot>
      </div>
      <div class="u-popover-arrow" :style="arrowStyle"></div>
    </div>
  </div>
</template>

<script>
  const { platform } = weex.config.env;
  const isWeb = typeof window === 'object' && platform.toLowerCase() === 'web';

  export default {
    props: {
      position: Object,
      arrowPosition: Object,
      coverColor: String,
      show: {
        type: Boolean,
        default: false
      }
    },
    model: {
      prop: "show",
      event: "closePop"
    },
    computed: {
      coverStyle() {
        return this.coverColor ? { backgroundColor: this.coverColor } : '';
      },
      contentStyle() {
        let { x = 0, y = 0 } = this.position,
          style = {};
        x < 0 ? (style.right = `${-x}px`) : (style.left = `${x}px`);
        y < 0 ? (style.bottom = `${-y}px`) : (style.top = `${y}px`);
        return style;
      },
      arrowStyle() {
        let { pos = 'top', x = 0, y = 0 } = this.arrowPosition,
          style = {};
        switch (pos) {
          case 'top':
            style.top = '4px';
          case 'bottom':
            !style.top && (style.bottom = '4px');
            style.transform = 'scaleX(0.8) rotate(45deg)';
            if(x>=0 && x<22){
              x = 22;
            }else if(x<0 && x>-22){
              x =-22;
            }
            x < 0 ? (style.right = `${-x}px`) : (style.left = `${x}px`);
            break;
          case 'left':
            style.left = '4px';
          case 'right':
            !style.left && (style.right = '4px');
            style.transform = 'scaleY(0.8) rotate(45deg)';
            if(y>=0 && y<22){
              y = 22;
            }else if(y<0 && y>-22){
              y =-22;
            }
            y < 0 ? (style.bottom = `${-y}px`) : (style.top = `${y}px`);
            break;
          default:
            break;
        }
        return style;
      }
    },
    methods: {
      wxcOverlayBodyClicked() {
        this.$emit("closePop", false)
      }
    }
  };
</script>

<style scoped>
  .g-cover {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .g-popover {
    position: fixed;
    padding:15px;
  }
  .u-popover-arrow {
    position: absolute;
    border-left-width: 2px;
    border-left-color: #02B3B4;
    border-bottom-width: 2px;
    border-bottom-color: #02B3B4;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    background-color: #fff;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.21);
  }
  .u-popover-inner {
    display: block;
    border-width: 2px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-color: #02B3B4;
    border-radius: 10px;
    background-color: #fff;
  }
</style>
