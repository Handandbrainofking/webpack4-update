<!--
  function: taskDataUpladList
  author  : wq
  update  : 2018/11/30 10:32
-->
<template>
  <div>
    <d-layout class="back-box" text-align="initial" :full-parent="false">
      <d-layout>
        <text class="back-title">{{title}}</text>
      </d-layout>
      <template v-if="!openChoose">
        <d-layout v-if="uploadImageLength > 0" class="icon-wrap" text-align="center" :full-parent="false" @clickLayout="doChooseImg" :key="`data-upload-${new Date().getTime()}-choose`">
          <d-image src="/image/icon-image-choose.png" width="32" height="38"></d-image>
          <text class="back">选择</text>
        </d-layout>
      </template>
      <template v-else>
        <d-layout class="icon-wrap" :style="{opacity: chooseNum && 1 || 0.3}" text-align="center" :full-parent="false" @clickLayout="doDeleteImage">
          <d-image src="/image/icon-delete.png" width="32" height="38"></d-image>
          <text class="back">删除</text>
        </d-layout>
        <d-layout class="icon-wrap" text-align="center" :full-parent="false" @clickLayout="doCancelChoose">
          <d-image src="/image/icon-image-back.png" width="28" height="38"></d-image>
          <text class="back">取消</text>
        </d-layout>
      </template>
    </d-layout>
    <upload-image-list
       class="images-box-wrap"
       :applyNo="applyNo"
       :fileType="fileType"
       :customer-no="customerNo"
       :ref="`upload-image-box`"
       :imgUnloadList="imgUnloadList"
       :imgUploadList="imgUploadList"
       @changeUploadList="changeUploadList"
       @openChoose="(choose) => openChoose=choose"
       @chooseImg="(num, all) => (chooseNum=num,chooseAll=all) "
       @updateImageList="updateImageList"></upload-image-list>
  </div>
</template>

<script>
import UploadImageList from '@/components/upload/upload.vue'
import { DEFINE_IMAGE_URL, native_module_events, native_logMessage, DEFINE_UNLOAD_IMAGE } from '@/utils/deal_native'

export default {
  name: 'taskDataUploadList',
  components: {
    UploadImageList
  },
  data() {
    return {
      imgUploadList: [],
      imgUnloadList: [],
      uploadImageLength: 0,
      chooseNum: 0,
      openChoose: false,
      chooseAll: false
    }
  },
  props: {
    title: {
      type: String
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
  beforeMount() {
    this.requestDataImageList()
  },
  methods: {
    // 请求图像列表
    requestDataImageList() {
      const type = this.fileType
      const customerNo = this.customerNo
      const applyNo = this.applyNo
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
            this.uploadImageLength = this.uploadImageLength.length
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
          return false
        }

        this.imgUnloadList = requestData.map(item => {
          return (Object.assign({}, item, { src: item.locationCacheUrl }))
        })
      })
    },
    // 更新
    updateImageList() {
      this.requestUploadImage(this.applyNo, this.fileType, this.customerNo)
      this.requestUnloadImage(this.applyNo, this.fileType, this.customerNo)
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
    // 返回初始状态
    doCancelChoose() {
      this.chooseNum = 0
      this.openChoose = false
      this.chooseAll = false
      this.$refs['upload-image-box'].doCancelChoose()
    },

    changeUploadList(len) {
      this.uploadImageLength = len
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
  .back-box {
    @include setPadding(20px, $weak_big_gap_left, 0);
    height: 70px;
  }
  .back-title {
    font-size: $font_normal;
    color: $color_nav;
  }

  .title {
    font-size: $font_head;
    color: $color_nav;
  }
  .icon-wrap {
    width: 240px;
    height: 100px;
  }

  .back {
    font-size: $font_normal;
    color: $color_back;
    padding-left: 10px;
  }

  .back-gray {
    font-size: $font_normal;
    color: $color_nav;
    padding-left: 10px;
  }

  .images-box-wrap {
    width: 2500px;
    margin-left: -10px;
  }
</style>
