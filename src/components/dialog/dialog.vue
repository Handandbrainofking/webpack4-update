<!-- CopyRight (C) 2017-2022 Alibaba Group Holding Limited. -->
<!-- Created by Tw93 on 16/11/07. -->
<!--A dialog. -->

<template>
  <div class="container">
    <wxc-overlay v-if="show" :show="true" :hasAnimation="false" @wxcOverlayBodyClicked="$emit('wxcOverlayBodyClicked', $event)"></wxc-overlay>
    <div class="dialog-box" v-if="show" :style="mainStyle">
      <div class="dialog-content">
        <slot name="title">
          <text class="content-title">{{title}}</text>
        </slot>
        <slot name="content">
          <text class="content-subtext">{{content}}</text>
        </slot>
        <div
           class="no-prompt"
           v-if="showNoPrompt"
           @click="noPromptClicked">
          <d-image :src="noPromptIcon" class="no-prompt-icon" width="24" height="24" ></d-image>
          <text class="no-prompt-text">{{noPromptText}}</text>
        </div>
      </div>
      <div class="dialog-footer" v-if="!definedBtn">
        <div class="footer-btn cancel"
             v-if="!single"
             @click="secondaryClicked">
          <text class="btn-text" :style="{ color: secondBtnColor }">{{cancelText}}</text>
        </div>
        <div class="footer-btn confirm" @click="primaryClicked">
          <text class="btn-text" :style="{ color: mainBtnColor }">{{confirmText}}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    position: fixed;
    top: 0;
    width: 2560px;
    /*兼容H5异常*/
    height: 1600px;
    z-index: 10001;
  }

  .dialog-box {
    position: fixed;
    background-color: #FFFFFF;
    z-index: 10001;
  }

  .content-title {
    color: #333333;
    font-size: 36px;
    text-align: center;
    margin-bottom: 24px;
  }

  .content-subtext {
    color: #666666;
    font-size: 26px;
    line-height: 36px;
    text-align: center;
  }

  .dialog-footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-top-color: #D9D9D9;
    border-top-width: 2px;
    height: 128px;
    padding-right: 240px;
    padding-left: 240px;
  }

  .footer-btn {
    border-radius: 4px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 360px;
    height: 88px;
  }

  .cancel {
    border-width: 2px;
    border-color: #677475;
  }

  .confirm {
    background-color: #02B3B4;
  }

  .btn-text {
    font-size: 36px;
    color: #677475;
  }

  .no-prompt {
    width: 486px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-top: 24px;
  }

  .no-prompt-icon {
    margin-right: 12px;
  }

  .no-prompt-text {
    font-size: 24px;
    color: #A5A5A5;
  }
</style>

<script>
import WxcOverlay from './overlay.vue'
import { CHECKED, UN_CHECKED } from './type';

export default {
  components: { WxcOverlay },
  props: {
    top: {
      type: [Number, String],
      default: 600
    },
    width: {
      type: [Number, String],
      default: 2048
    },
    show: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    mainBtnColor: {
      type: String,
      default: '#FFFFFF'
    },
    secondBtnColor: {
      type: String,
      default: '#677475'
    },
    showNoPrompt: {
      type: Boolean,
      default: false
    },
    noPromptText: {
      type: String,
      default: '不再提示'
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    definedBtn: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    noPromptIcon: UN_CHECKED,
    pageHeight: 1600
  }),
  created() {
    const { env: { deviceHeight, deviceWidth } } = weex.config;
    this.pageHeight = deviceHeight / deviceWidth * 750;
  },
  methods: {
    secondaryClicked() {
      this.$emit('wxcDialogCancelBtnClicked', {
        type: 'cancel'
      });
    },
    primaryClicked(e) {
      this.$emit('wxcDialogConfirmBtnClicked', {
        type: 'confirm'
      });
    },
    noPromptClicked(e) {
      const isChecked = !this.isChecked;
      this.noPromptIcon = isChecked ? CHECKED : UN_CHECKED;
      this.$emit('wxcDialogNoPromptClicked', { isChecked });
    }
  },
  computed: {
    mainStyle() {
      const width = this.width;
      const left = Math.round((2560 - width) / 2);
      const top = this.top;
      return {
        width: width + 'px',
        left: left + 'px',
        top: top + 'px'
      }
    }
  }
};
</script>
