<template>
  <div class="container" v-if="show">
    <div class="wxc-overlay-wrap" @touchend="handleTouchEnd">
      <wxc-overlay
         :can-auto-close="canAutoClose"
         v-bind="overlayCfg"
         :style="{marginLeft: `${marginLeft}px`}"
         @wxcOverlayBodyClicked="wxcOverlayBodyClicking"></wxc-overlay>
    </div>
    <div
       ref="wxc-popup"
       :height="_height"
       :hack="isNeedShow"
       @click="()=>{}"
       :class="['wxc-popup', pos]"
       :style="padStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import WxcOverlay from '../dialog/overlay.vue'
import { isWeb } from '@/utils/utils'
const animation = weex.requireModule('animation')
export default {
  name: 'popup',
  components: { WxcOverlay },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pos: {
      type: String,
      default: 'bottom'
    },
    popupColor: {
      type: String,
      default: '#FFFFFF'
    },
    canAutoClose: {
      type: Boolean,
      default: true
    },
    overlayCfg: {
      type: Object,
      default: () => ({
        hasAnimation: true,
        timingFunction: ['ease-in', 'ease-out'],
        duration: 300,
        opacity: 0.6
      })
    },
    height: {
      type: [Number, String],
      default: 840
    },
    standOut: {
      type: [Number, String],
      default: 0
    },
    width: {
      type: [Number, String],
      default: 750
    },
    animation: {
      type: Object,
      default: () => ({
        timingFunction: 'ease-in'
      })
    },
    marginLeft: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    isNeedShow() {
      setTimeout(() => {
        this.appearPopup(this.show);
      }, 50);
      return this.show;
    },
    _height() {
      this.appearPopup(this.show, 150);
      return this.height;
    },
    padStyle() {
      const { pos, width, height, popupColor } = this;
      let style = {
        width: `${width}px`,
        backgroundColor: popupColor
      };
      pos === 'top' && (style = {
        ...style,
        top: `${-height}px`,
        height: `${height}px`
      });
      pos === 'bottom' && (style = {
        ...style,
        bottom: `${-height}px`,
        height: `${height}px`
      });
      pos === 'left' && (style = {
        ...style,
        left: `${-width}px`
      });
      pos === 'right' && (style = {
        ...style,
        // right: `${-width}px`
        left:`2560px`
      });
      return style;
    }
  },
  methods: {
    handleTouchEnd(e) {
      // 在支付宝上面有点击穿透问题
      isWeb && e.preventDefault && e.preventDefault();
    },
    hide() {
      this.appearPopup(false);
    },
    wxcOverlayBodyClicking() {
      this.isShow && this.canAutoClose && this.appearPopup(false);
    },
    appearPopup(bool, duration = 300) {
      this.isShow = bool;
      const popupEl = this.$refs['wxc-popup'];
      if (!popupEl) {
        return;
      }
      animation.transition(popupEl, {
        styles: {
          transform: this.getTransform(this.pos, this.width, this.height, !bool)
        },
        duration,
        delay: 0,
        ...this.animation
      }, () => {
        if (!bool) {
          this.$emit('wxcPopupOverlayClicked', { pos: this.pos });
        }
      });
    },
    getTransform(pos, width, height, bool) {
      let _size = pos === 'top' || pos === 'bottom' ? height : width;
      let _transform;
      if (isWeb) {
        _size -= this.standOut;
      }
      bool && (_size = 0);
      switch (pos) {
        case 'top':
          _transform = `translateY(${_size}px)`;
          break;
        case 'bottom':
          _transform = `translateY(-${_size}px)`;
          break;
        case 'left':
          _transform = `translateX(${_size}px)`;
          break;
        case 'right':
          _transform = `translateX(-${_size}px)`;
          break;
      }
      return _transform;
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  .wxc-popup {
    position: fixed;
    width: 2560px;
    z-index: 10001;
  }
  .top {
    left: 0;
    right: 0;
  }
  .bottom {
    left: 0;
    right: 0;
  }
  .left {
    bottom: 0;
    top: 0;
  }
  .right {
    bottom: 0;
    top: 0;
  }
</style>