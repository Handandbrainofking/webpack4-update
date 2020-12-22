<template>
  <div class="data-upload-box">
    <d-layout class="back-box" :full-parent="false" text-align="initial">
      <d-layout class="back-wrap" :full-parent="false" text-align="initial" @clickLayout="doBack">
        <d-image src="/image/arrow-left.png" width="40" height="40"></d-image>
        <text class="back-gray">返回</text>
      </d-layout>
      <d-layout text-align="center">
        <text class="back-title">{{title}}</text>
      </d-layout>
      <template v-if="openChoose">
        <d-layout class="icon-wrap" :full-parent="false" text-align="center" @clickLayout="doSelectAll">
          <d-image :src="chooseAll?'/image/icon-select-empty.png': '/image/icon-select-all.png'" :width="32"
                   :height="32"></d-image>
          <text class="back">{{chooseAll ? '取消全选': '全选'}}</text>
        </d-layout>
        <d-layout :style="{opacity: chooseNum && 1 || 0.3}" class="icon-wrap" :full-parent="false" text-align="center" @clickLayout="doCopyImage">
          <text class="back">复制到</text>
        </d-layout>
        <d-layout :style="{opacity: chooseNum && 1 || 0.3}" class="icon-wrap" :full-parent="false" text-align="center" @clickLayout="doDeleteImage">
          <d-image src="/image/icon-delete.png" :width="32" :height="38"></d-image>
          <text class="back">删除</text>
        </d-layout>
        <d-layout class="icon-wrap" :full-parent="false" text-align="center" @clickLayout="doCancelChoose">
          <d-image src="/image/icon-image-back.png" :width="28" :height="38"></d-image>
          <text class="back">取消</text>
        </d-layout>
      </template>
      <template v-else>
        <d-layout v-if="uploadImageLength > 0" class="icon-wrap" :full-parent="false" text-align="center" @clickLayout="doChooseImg">
          <d-image src="/image/icon-image-choose.png" :width="32" :height="38"></d-image>
          <text class="back">选择</text>
        </d-layout>
      </template>
    </d-layout>
    <upload-image-list
       class="images-box-wrap"
       ref="upload-image-box"
       :apply-no="applyNo"
       :file-type="fileType"
       :customer-no="customerNo"
       :imgUnloadList="imgUnloadList"
       :imgUploadList="imgUploadList"
       @copyImageChoose="copyImageChoose"
       @changeUploadList="changeUploadList"
       @changeUnloadList="changeUnloadList"
       @openChoose="(choose) => openChoose=choose"
       @chooseImg="(num, all) => (chooseNum=num,chooseAll=all) "
       @updateImageList="updateImageList"></upload-image-list>
  </div>
</template>

<script>
import Dialog from '@/utils/dialog'
import UploadImageList from '@/components/upload/upload.vue'
import {
  DEFINE_IMAGE_URL,
  native_module_events,
  native_logMessage,
  DEFINE_UNLOAD_IMAGE,
  DEFINE_IMAGE_COPY
} from '@/utils/deal_native'

export default {
  name: 'data-list',
  components: {
    UploadImageList
  },
  data() {
    return {
      title: '',
      applyNo: '',
      fileType: '',
      customerNo: '',
      imgUploadList: [],
      imgUnloadList: [],
      uploadImageLength: 0,
      chooseNum: 0,
      openChoose: false,
      chooseAll: false
    }
  },
  beforeMount() {
    this.title = this.getPageParams('title', true)
    this.requestDataImageList()
     
  },
  methods: {
    // 请求图像列表
    requestDataImageList() {
      const type = this.fileType = this.getPageParams('type', true)
      const customerNo = this.customerNo = this.getPageParams('customerNo', true)
      const applyNo = this.applyNo = this.getPageParams('applyNo', true)
      this.requestUploadImage(applyNo, type, customerNo)
      this.requestUnloadImage(applyNo, type, customerNo)
    },
    // 请求上传的图片
    requestUploadImage(applyNo, type, customerNo) {
      this.requestApi.data_menu_list({
        data: {
          applyNo,
          typeNo: type,
          custNo: customerNo
        },
        success: (data) => {
          const list = data || []
          const urls = list.map(item => item.fileId)
          this.imgUploadList = list
          this.uploadImageLength = list.length
          native_module_events(DEFINE_IMAGE_URL, urls, 1).then((data) => {
            this.imgUploadList = list.map(item => Object.assign({}, item, {
              src: data[item.fileId],
              fileId: item.fileId
            }))
            this.uploadImageLength = this.imgUploadList.length
          })
        }
      })
    },
    // 请求未上传的图片
    requestUnloadImage(applyNo, type, customerNo) {
      native_module_events(DEFINE_UNLOAD_IMAGE, applyNo, type, customerNo).then((data) => {
        var requestData = data || []
        native_logMessage('获取未上传成功的图片有' + requestData.length + '张')
        if (requestData.length === 0) {
          return
        }

        this.imgUnloadList = requestData.map(item => {
          return (Object.assign({}, item, {
            src: item.locationCacheUrl,
            applyNo: applyNo,
            fileId: item.fileId,
            againUpload: true
          }))
        })
      })
    },
    // 更新
    updateImageList() {
      this.requestUploadImage(this.applyNo, this.fileType, this.customerNo)
      this.requestUnloadImage(this.applyNo, this.fileType, this.customerNo)
    },

    changeUploadList(len) {
      this.uploadImageLength = len
    },
    changeUnloadList(unloadList) {
      this.imgUnloadList = unloadList
    },
    // 图片拷贝目录
    copyImageChoose(twoItem, threeItem, list) {
      var originFileIds = []
      list.forEach(item => {
        if (item.chooseIcon) {
          originFileIds.push(item.fileId)
        }
      })
      const custNo = (threeItem && threeItem.custNo) || ''
      native_module_events(DEFINE_IMAGE_COPY, twoItem.typeNo, custNo, originFileIds).then((data) => {
        native_logMessage('图片拷贝结果' + JSON.stringify(data))
        Dialog.toast('' + data.msg)
      })
    },
    // 全选
    doSelectAll() {
      if (this.chooseAll) {
        this.$refs['upload-image-box'].unChooseAll()
      } else {
        this.$refs['upload-image-box'].chooseAll()
      }
    },
    // 删除选择
    doDeleteImage() {
      if (this.chooseNum === 0) {
        return false
      }
      this.$refs['upload-image-box'].doDeleteChooseImg()
    },
    // 复制操作
    doCopyImage() {
      if (this.chooseNum === 0) {
        return false
      }
      this.$refs['upload-image-box'].doCopyImage()
    },
    // 返回初始状态
    doCancelChoose() {
      this.chooseNum = 0
      this.openChoose = false
      this.chooseAll = false
      this.$refs['upload-image-box'].doCancelChoose()
    },
    // 选择图片
    doChooseImg() {
      this.$refs['upload-image-box'].doEditImage()
    },
    doBack() {
      this.back(true)
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .data-upload-box {
    @include setWindowWH();
  }
  .back-box {
    @include setPaddingH($weak_big_gap_left);
    padding-top: 20px;
    height: $back_head_height + px;
  }
  .back-wrap {
    height: 100px;
    padding-left: $normal_gap_left;
  }
  .back-gray {
    font-size: $font_head;
    color: $color_nav;
    padding-left: 10px;
  }
  .back-title {
    font-size: $font_head;
    color: $color_nav;
  }
  .icon-wrap {
    width: 240px;
    height: 100px;
  }
  .back {
    font-size: $font_head;
    color: $color_back;
    padding-left: 10px;
  }
  .images-box-wrap {
    width: $window_width - 40 + px;
    height: $window_height - $back_head_height + px;
    background-color: #ffffff;
    @include setMarginH($normal_gap_left);
    @include setPaddingV($normal_gap_bottom);
  }
</style>
