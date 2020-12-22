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
         imageSrc="/image/button_forward.png"
         anlysisType="0"
         v-model="uploadStatus.forStatus"
         :applyNo="applyNo"
         :fileType="fileType"
         :customerNo="customerNo" @uploadImage="analysisInfo(0, ...arguments)"></task-upload-image>
      <task-upload-image
         class="upload-wrap"
         imageSrc="/image/button_backword.png"
         anlysisType="0"
         v-model="uploadStatus.backStatus"
         :applyNo="applyNo"
         :fileType="fileType"
         :customerNo="customerNo" @uploadImage="analysisInfo(1, ...arguments)"></task-upload-image>
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
    backTitle: '身份证识别',
    dataInfo: {},
    buttonLeft: '取消',
    buttonRight: '确认',
    uploadStatus: {
      backStatus: 0,
      forStatus: 0
    },
    fileId: {}
  }),
  props: {
    showCamera: {
      type: Boolean,
      default: false
    },
    applyNo: {
      type: [String, Number],
      default: ''
    },
    fileType: {
      type: [String, Number],
      default: ''
    },
    customerNo: {
      type: [String, Number],
      default: ''
    }
  },
  model: {
    prop: 'showCamera',
    event: 'changeCameraShow'
  },
  beforeMount() {
    this.dataInfo = {}
  },
  methods: {
    // 非状态组件，需要在这里关闭
    popupOverlayBottomClick() {
      this.$emit('changeCameraShow', false)
    },
    doClickBtn(idx) {
      switch (idx) {
        case 0:
          this.doCancel()
          break
        case 1:
          this.doSure()
          break
        default:
          break
      }
    },
    doCancel() {
      this.$refs['popup-overlay-wrap'].hide();
    },
    doSure() {
      const data = this.dataInfo;
      if (this.uploadStatus.backStatus === 0 && this.uploadStatus.forStatus === 0) {
        Dialog.toast('请先上传图片进行识别！')
        return false;
      }
      if (this.uploadStatus.forStatus === 1 || this.uploadStatus.forStatus === 2) {
        Dialog.toast('身份证正面正在识别，请等待！')
        return false
      }
      if (this.uploadStatus.backStatus === 1 || this.uploadStatus.backStatus === 2) {
        Dialog.toast('身份证反面正在识别，请等待！')
        return false
      }
      this.$refs['popup-overlay-wrap'].hide()
      this.$emit('doAnalysisImage', data, this.fileId)
    },
    // 识别图像
    analysisInfo(idx, data, error) {
      const tdata = 'string' === typeof data && JSON.parse(data) || data || {};
      const names = ['正面', '反面']
      const statusName = ['forStatus', 'backStatus']
      if (tdata.result !== 'true') {
        this.uploadStatus[statusName[idx]] = 0
        Dialog.toast('身份证' + names[idx] + '识别有误！')
        'function' === typeof error && error()
      } else {
        const info = 'string' === typeof tdata.info && JSON.parse(tdata.info) || tdata || {};
        const customer = info.customer || {};
        const infoCustomer = this.dataInfo.customer || {};
        if (idx === 0) {
          if (!customer.name && !customer.age && !customer.idCardNo && !customer.sex && !customer.address) {
            Dialog.toast('身份证正面识别有误！');
            this.uploadStatus.forStatus = 0;
            // 删除以前的正面识别
            if (infoCustomer.expireDate) {
              this.dataInfo.customer = { expireDate: infoCustomer.expireDate }
            } else {
              this.dataInfo = {};
            }
            'function' === typeof error && error();
            throw new Error('身份证正面识别有误！');
          } else {
            this.fileId['forward'] = tdata.imageKey;
            this.dataInfo.customer = this.dataInfo.customer || {};
            this.dataInfo.customer.name = customer.name;
            this.dataInfo.customer.age = customer.age;
            this.dataInfo.customer.idCardNo = customer.idCardNo;
            this.dataInfo.customer.sex = customer.sex;
            this.dataInfo.customer.address = customer.address;
            this.uploadStatus.forStatus = 3;
          }
        }
        if (idx === 1) {
          if (!customer.expireDate) {
            Dialog.toast('身份证反面识别有误！');
            this.uploadStatus.backStatus = 0;
            if (infoCustomer) {
              this.dataInfo.customer.expireDate = undefined;
              delete this.dataInfo.customer.expireDate;
            }
            'function' === typeof error && error();
            throw new Error('身份证反面识别有误！');
          } else {
            this.fileId['backward'] = tdata.imageKey;
            this.dataInfo.customer = this.dataInfo.customer || {};
            this.dataInfo.customer.expireDate = customer.expireDate;
            this.uploadStatus.backStatus = 3;
          }
        }
      }
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
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
