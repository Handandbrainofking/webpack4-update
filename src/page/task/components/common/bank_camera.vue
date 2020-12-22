<!--
  身份证上传页面
  需要参数 订单号、文件类型、客户号
-->
<template>
  <wxc-popup
     :show="showCamera"
     ref="popup-overlay-wrap"
     @wxcPopupOverlayClicked="popupOverlayBottomClick"
     pos="right"
     width="2240">
    <back-head :back-title="backTitle" :beforeBack="doCancel"></back-head>
    <div class="card-row">
      <task-upload-image
         class="upload-wrap"
         imageSrc="/image/bank_forward.png"
         v-model="uploadStatus"
         anlysisType="1"
         :applyNo="applyNo"
         :fileType="fileType"
         :customerNo="customerNo" @uploadImage="analysisInfo(0, ...arguments)"></task-upload-image>
      <!--<task-upload-image
         class="upload-wrap"
         imageSrc="/image/bank_backward.png"
         anlysisType="1"
         :applyNo="applyNo"
         :fileType="fileType"
         :customerNo="customerNo" @uploadImage="analysisInfo(1, ...arguments)"></task-upload-image>-->
    </div>
    <footer-button class="footer" :btns="['取消','确认']" @clickBtn="doClickBtn"></footer-button>
  </wxc-popup>
</template>

<script>
  import WxcPopup from '../../../../components/wxc/popup.vue';
  import BackHead from '../../../../components/back/head.vue';
  import Dialog from '@/utils/dialog';
  import TaskUploadImage from './upload_analysis.vue';
  import FooterButton from '../task_footer_button.vue';

  export default {
    components: {
      WxcPopup,
      BackHead,
      FooterButton,
      TaskUploadImage
    },
    data: () => ({
      backTitle: '银行卡识别',
      dataInfo: {},
      buttonLeft: '取消',
      buttonRight: '确认',
      fileId: [],
      uploadStatus: 0
    }),
    props: {
      showCamera: {
        type: Boolean,
        default: false
      },
      applyNo: {
        type: [String, Number],
        default: ""
      },
      fileType: {
        type: [String, Number],
        default: ""
      },
      customerNo: {
        type: [String, Number],
        default: ""
      }
    },
    model: {
      prop: 'showCamera',
      event: 'changeCameraShow'
    },
    beforeMount() {
      this.dataInfo = {};
    },
    methods: {
      //非状态组件，需要在这里关闭
      popupOverlayBottomClick() {
        this.$emit("changeCameraShow", false);
      },
      doClickBtn(idx) {
        switch (idx) {
          case 0:
            this.doCancel();
            break;
          case 1:
            this.doSure();
            break;
          default:
            break;
        }
      },
      doCancel() {
        this.$refs['popup-overlay-wrap'].hide();
      },
      doSure() {
        const data = this.dataInfo;
        if (this.uploadStatus === 0) {
          Dialog.toast("请先上传图片进行识别！");
          return false;
        }
        if (this.uploadStatus === 1 || this.uploadStatus === 2) {
          Dialog.toast("银行卡正在识别，请等待！");
          return false;
        }
        this.$refs['popup-overlay-wrap'].hide();
        this.$emit("doAnalysisImage", data, this.fileId);
      },
      // 识别图像
      analysisInfo(idx, data, error) {
        const tdata = 'string' === typeof data && JSON.parse(data) || data || {};
        if (tdata.result !== 'true') {
          this.uploadStatus = 0;
          Dialog.toast('银行卡识别有误！');
          'function' === typeof error && error();
        } else {
          const info = 'string' === typeof tdata.info && JSON.parse(tdata.info) || tdata || {};
          const bank = info.bank || {};
          if (bank.bankCardNumber) {
            this.fileId.push(tdata.imageKey);
            this.uploadStatus = 3;
            this.dataInfo.bank = this.dataInfo.bank || {};
            this.dataInfo.bank.bankCardNumber = bank.bankCardNumber;
          } else {
            Dialog.toast('银行卡识别有误！');
            this.uploadStatus = 0;
            this.dataInfo = {};
            'function' === typeof error && error();
          }
        }
      }
    }
  };
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../../../css/common';

  .card-row {
    flex-direction: row;
    justify-content: center;
    margin-top: 160px;
  }

  .upload-wrap {
    margin-left: 90px;
    margin-right: 90px;
  }

  .footer {
    margin-top: 212px;
  }
</style>

