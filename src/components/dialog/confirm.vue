<!-- CopyRight (C) 2017-2022 Alibaba Group Holding Limited. -->
<!-- Created by Tw93 on 16/11/07. -->
<!--A dialog. -->

<template>
  <div class="container">
    <wxc-overlay v-if="show" :show="true" :hasAnimation="false"></wxc-overlay>
    <div class="dialog-box" v-if="show" :style="mainStyle">
      <div class="image-wrap">
        <d-image src="/image/confirm-bg.png" :width="width" :height="bgImageHeight"></d-image>
      </div>
      <div class="dialog-content">
        <slot name="title">
          <text class="content-title">{{title}}</text>
        </slot>
        <slot name="content">
          <text class="content-subtext">{{content}}</text>
        </slot>
        <div class="no-prompt"
             v-if="showNoPrompt"
             @click="noPromptClicked">
          <image :src="noPromptIcon" class="no-prompt-icon"></image>
          <text class="no-prompt-text">{{noPromptText}}</text>
        </div>
      </div>
      <div class="dialog-footer">
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
    width: 2560px;
    /*兼容H5异常*/
    z-index: 99999;
  }

  .dialog-box {
    position: fixed;
    background-color: #FFFFFF;
    z-index:10001;
  }

  .dialog-content {
    padding-top: 150px;
    padding-bottom: 100px;
    padding-left: 36px;
    padding-right: 36px;
  }

  .content-title {
    padding-top: 30px;
    font-size: 42px;
    color: #21363D;
    padding-bottom: 60px;
    align-items: center;
  }

  .content-subtext {
    font-size: 34px;
    color: #21363D;
    line-height: 40px;
    align-items: center;
    padding-bottom: 30px;
  }

  .dialog-footer {
    flex-direction: row;
    align-items: center;
    border-top-color: #F3F3F3;
    border-top-width: 2px;
  }

  .footer-btn {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 120px;
  }

  .cancel {
    border-right-color: #F3F3F3;
    border-right-width: 2px;
  }

  .btn-text {
    font-size: 38px;
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
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  .no-prompt-text {
    font-size: 24px;
    color: #A5A5A5;
  }

  .image-wrap {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<script>
  import WxcOverlay from './overlay.vue';
  import { CHECKED, UN_CHECKED } from './type';

  export default {
    components: {
      WxcOverlay
    },
    props: {
      top: {
        type: [Number, String],
        default: 600
      },
      width: {
        type: [Number, String],
        default: 800
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
        default: '#02B3B4'
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
      }
    },
    data: () => ({
      noPromptIcon: UN_CHECKED,
      pageHeight: 1600
    }),
    created () {
      const { env: { deviceHeight, deviceWidth } } = weex.config;
      this.pageHeight = deviceHeight / deviceWidth * 750;
    },
    methods: {
      secondaryClicked () {
        this.$emit('wxcDialogCancelBtnClicked', {
          type: 'cancel'
        });
      },
      primaryClicked (e) {
        this.$emit('wxcDialogConfirmBtnClicked', {
          type: 'confirm'
        });
      },
      noPromptClicked (e) {
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
      },
      bgImageHeight() {
        return Math.round(286 * this.width / 800);
      }
    }
  };
</script>
