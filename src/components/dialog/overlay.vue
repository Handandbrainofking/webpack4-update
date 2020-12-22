<!-- CopyRight (C) 2017-2022 Alibaba Group Holding Limited. -->
<!-- Created by Tw93 on 16/10/25. -->
<!--A gray overlay mask-->

<template>
  <div
     v-if="show"
    :class="['wxc-overlay', hasAnimation && 'animate' || '']"
    ref="wxc-overlay"
    :hack="shouldShow"
    @click="overlayClicked"
    :style="{backgroundColor: `rgba(0, 0, 0, ${opacity})`}"></div>
</template>

<style scoped>
  .wxc-overlay {
    width: 2560px;
    position: fixed;
    opacity: 1;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10000;
  }

  .animate {
    opacity: 0;
  }
</style>

<script>
  import {
    DEFINE_HIDDEN_KEYBORAD,
    native_common_events
  } from "@/utils/deal_native"
  import { isWeb } from '@/utils/utils'
  
  const animation = weex.requireModule('animation');
  export default {
    props: {
      show: {
        type: Boolean,
        default: true
      },
      hasAnimation: {
        type: Boolean,
        default: true
      },
      duration: {
        type: [Number, String],
        default: 300
      },
      timingFunction: {
        type: Array,
        default: () => (['ease-in', 'ease-out'])
      },
      opacity: {
        type: [Number, String],
        default: 0.6
      },
      canAutoClose: {
        type: Boolean,
        default: true
      }
    },
    created () {
    		native_common_events(DEFINE_HIDDEN_KEYBORAD);
    },
    computed: {
      shouldShow() {
        const {show, hasAnimation} = this
        if (hasAnimation) {
          this.$nextTick(() => {
            this.appearOverlay(show)
          })
        }
        return show
      }
    },
    methods: {
      overlayClicked(e) {
        this.canAutoClose ? this.appearOverlay(false) : this.$emit('wxcOverlayBodyClicked', {});
      },
      appearOverlay(bool, duration = this.duration) {
        const {hasAnimation, timingFunction, canAutoClose} = this
        const needEmit = !bool && canAutoClose
        const overlayEl = this.$refs['wxc-overlay']
        if (hasAnimation && overlayEl) {
          animation.transition(overlayEl, {
            styles: {
              opacity: bool ? 1 : 0
            },
            duration,
            timingFunction: timingFunction[bool ? 0 : 1],
            delay: 0
          }, () => {
            needEmit && (this.$emit('wxcOverlayBodyClicked', {}));
          })
          if (isWeb) {
            needEmit && (this.$emit('wxcOverlayBodyClicked', {}));
          }
        } else {
          needEmit && (this.$emit('wxcOverlayBodyClicked', {}));
        }
      }
    }
  }
</script>
