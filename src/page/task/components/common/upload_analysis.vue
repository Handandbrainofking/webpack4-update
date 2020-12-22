<!-- 上传身份证/银行卡等图片识别信息，这里一次只能上传一张 -->
<template>
  <div @click="doUploadImage(applyNo, fileType, customerNo, anlysisType)">
    <d-image :src="uploadImg" :width="width" :height="height"></d-image>
  </div>
</template>

<script>
import Dialog from '@/utils/dialog'
import {
  native_logMessage,
  native_module_events,
  DEFINE_UPLOAD_IDCARD,
  DEFINE_UPLOAD_BANKCARD,
  DEFINE_CHOOSE_IMAGE
} from '@/utils/deal_native';

export default {
  props: {
    width: {
      type: [Number, String],
      default: 860
    },
    height: {
      type: [Number, String],
      default: 576
    },
    imageSrc: {
      type: String,
      default: ''
    },
    anlysisType: { //识别类型 0身份证，1银行卡
      type: [Number, String],
      default: 0
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
    },
    uploadStatus: {
      type: [String, Number],
      default: 0
    }
  },
  model: {
    prop: 'uploadStatus',
    event: 'changeUploadStatus'
  },
  data() {
    return {
      pickOptions: {
        maxSelectCount: 1
      },
      innerUploadList: [],
      innerUnloadList: [],
      analysisData: [] //身份证识别、银行卡识别返回的数据
    }
  },
  computed: {
    isUploaded() {
      return this.innerUnloadList.length <= 0;
    },
    uploadImg() {
      if (this.innerUploadList.length > 0) {
        return this.innerUploadList[0].src;
      } else if (this.innerUnloadList.length > 0) {
        return this.innerUnloadList[0].src;
      } else {
        return this.imageSrc;
      }
    }
  },
  methods: {
    doUploadImage(applyNo, fileType, customerNo, anlysisType) {
      if (!this.isUploaded) {
        Dialog.toast('图片正在识别中，请稍后再试');
        return false;
      }
      this.doUploadClicked(applyNo, fileType, customerNo, anlysisType)
    },
    // 上传图片
    doUploadClicked(applyNo, fileType, customerNo, analysisType) {
      const options = Object.assign({}, this.pickOptions || {});
      var that = this;
      native_module_events(DEFINE_CHOOSE_IMAGE, options, function (images) {
        var image_arr = [];
        for (var i = 0; i < images.length; i++) {
          var image = images[i];
          image_arr[i] = image.path;
        }
        native_logMessage('当前选择的图片====' + JSON.stringify(image_arr));
        that.previewImage(image_arr);
        that.$emit('changeUploadStatus', 1);
        if (analysisType === '0' || analysisType === 0) {
          // 身份证识别
          that.uploadImageForIdCard(applyNo, fileType, customerNo, image_arr);
        } else {
          // 银行卡识别
          that.uploadImageForBankCard(applyNo, fileType, customerNo, image_arr);
        }
      });
//      Nat.image.pick(options, (err, ret) => {
//        const paths = ret.paths;
//        this.previewImage(paths);
//        this.$emit("changeUploadStatus", 1);
//        if (analysisType === "0" || analysisType === 0) {
//          // 身份证识别
//          this.uploadImageForIdCard(applyNo, fileType, customerNo, paths);
//        } else {
//          // 银行卡识别
//          this.uploadImageForBankCard(applyNo, fileType, customerNo, paths);
//        }
//      });
    },
    // 预览图片
    previewImage(paths) {
      paths.forEach((item, index) => {
        const imageUrl = 'file://' + item;
        this.innerUnloadList.push({
          src: imageUrl,
          upload: 1,
          id: index
        });
      })
    },
    // 解析身份证；如果有customerNo 就要传
    uploadImageForIdCard(applyNo, fileType, customerNo = '', paths) {
      const data = {
        applyNo, fileType
      }
      if (customerNo) {
        data.customerNo = customerNo;
      }
      return native_module_events(DEFINE_UPLOAD_IDCARD, data, paths).then(data => {
        this.$emit('changeUploadStatus', 2);
        const tdata = this.toJSON(data);
        this.innerUnloadList = [];
        this.innerUploadList = [Object.assign({}, tdata, {
          src: 'file://' + tdata.imageLocationPath,
          fileId: tdata.imageKey
        })];
        this.$emit('uploadImage', tdata, () => {
          this.innerUploadList = [];
          this.innerUnloadList = [];
        });
      }).catch(msg => {
        this.$emit('uploadImage', {}, () => {
          this.innerUploadList = [];
          this.innerUnloadList = [];
        });
        throw new Error(msg);
      });
    },
    // 解析银行卡
    uploadImageForBankCard(applyNo, fileType, customerNo, paths) {
      return native_module_events(DEFINE_UPLOAD_BANKCARD, applyNo, fileType, paths).then(data => {
        this.$emit('changeUploadStatus', 2);
        const tdata = this.toJSON(data);
        this.innerUnloadList = [];
        this.innerUploadList = [Object.assign({}, tdata, {
          src: 'file://' + tdata.imageLocationPath,
          fileId: tdata.imageKey
        })];
        this.$emit('uploadImage', tdata, tdata, () => {
          this.innerUploadList = [];
          this.innerUnloadList = [];
        });
      }).catch(msg => {
        this.$emit('uploadImage', {}, () => {
          this.innerUploadList = [];
          this.innerUnloadList = [];
        });
        throw new Error(msg);
      });
    },
  }
};
</script>

