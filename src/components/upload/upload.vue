<!--
  function: 图片上传相关操作
            数据在create的时候，将传入过来的数据进行写入，在update的时候判断是否数据更新，存在数据更新，则更新数据
  author  : wq
  update  : 2018/5/29 9:10
-->
<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
    <d-layout-scroll class="upload-box" kind="column" :show-scrollbar="false" text-align="initial"
                     vertical-align="initial">
      <d-layout text-align="initial" vertical-align="initial" :wrap="true" :full-parent="false">
        <d-layout
           v-if="fileType !== 'M98001'" class="image-wrap"
           :style="{opacity: showChooseIcon && 0.4 || 1}"
           text-align="center" :full-parent="false"
           @clickLayout="doUploadClicked(applyNo, fileType, customerNo)">
          <d-image src="/image/upload.png" width="64" height="64"></d-image>
          <text class="upload">添加资料</text>
        </d-layout>
        <d-layout
           class="image-wrap" v-for="(item, index) in innerUnloadList" :key="`unload-image-${index}`"
           text-align="center" :full-parent="false"
           @clickLayout="openLightBox(index, item)">
          <d-image width="320" class="opacial5" height="320" :src="item.src"></d-image>
          <text v-if="item.againUpload" class="again-upload" @click="doAgainUpload(item)">重传</text>
        </d-layout>
        <d-layout
           class="image-wrap" v-for="(item, index) in innerUploadList" :key="`upload-image-${index}`"
           text-align="center" :full-parent="false"
           @clickLayout="openLightBox(innerUnloadList.length + index, item)">
          <d-image width="320" height="320" :src="item.src"></d-image>
          <div v-if="showChooseIcon" class="choose-image-wrap image-opacity">
            <div
               class="choose-image"
               @click="doPrevImageChoose(item)">
              <d-image
                 width="60" height="60"
                 :src="item.chooseIcon || '/image/icon-press-select.png'"></d-image>
            </div>
          </div>
        </d-layout>
      </d-layout>
    </d-layout-scroll>
    <wxc-dialog v-if="copyImageDialog" :show="copyImageDialog" width="1600" top="108"
                @wxcDialogConfirmBtnClicked="doCopyImageDialogOk" @wxcDialogCancelBtnClicked="doCopyImageDialogCancel">
      <div slot="title" class="title-wrap">
        <text class="title" style="font-size: 38px;color: #FFFFFF;">复制到</text>
      </div>
      <div style="flex-direction: row;height: 1150px;" slot="content">
        <div class="left-list">
          <list>
            <cell
               :class="['cell', currentIndex === index ? 'cell-active' : '']"
               style="width: 400px;"
               :key="`data-detail-menu-${index}`"
               @click="doChangeItem(item, index)"
               v-for="(item, index) in listMenu">
              <text :class="['text', currentIndex === index ? 'text-active' : '']">{{ item.name }}</text>
              <d-image :src="currentIndex === index ? '/image/arrow-right-focus.png' : '/image/arrow-right.png'"
                       width="36" height="36"></d-image>
            </cell>
          </list>
        </div>
        <div class="two-list">
          <list>
            <cell
               style="height: 100px;width: 600px;"
               :class="['cell', currentTwoIndex === index ? 'cell-active' : '']"
               :key="`data-detail-menu-two-${index}`"
               v-for="(item, index) in listMenu[currentIndex].children"
               @click="doChangeItemTwo(item, index)">
              <text :class="['text', currentTwoIndex === index ? 'text-active' : '']">{{ item.name }}</text>
            </cell>
          </list>
        </div>
        <div class="three-list">
          <list>
            <cell
               style="height: 100px;width: 600px;"
               :class="['cell', currentThreeIndex === index ? 'cell-active' : '']"
               :key="`data-detail-menu-three-${index}`"
               v-for="(item, index) in listMenu[currentIndex].children[currentTwoIndex].children"
               @click="doChangeItemThree(item, index)">
              <text :class="['text', currentThreeIndex === index ? 'text-active' : '']">{{ item.name }}</text>
            </cell>
          </list>
        </div>

      </div>
    </wxc-dialog>
  </d-layout>
</template>

<script>
import WxcDialog from '../dialog/dialog.vue'
import UploadMixin from '../../mixins/upload'
import { isEqual } from '@/utils/utils'
import { ProductKindList } from '@/config'
import Dialog from '@/utils/dialog'
import { native_logMessage, DEFINE_PREVIEW_IMAGE, native_module_events } from '@/utils/deal_native'

export default {
  name: 'upload-box',
  mixins: [UploadMixin],
  components: {
    WxcDialog
  },
  data: function () {
    return {
      innerUploadList: [],
      innerUnloadList: [],
      slideIndex: 1,
      showChooseIcon: false,
      chooseNum: 0,
      copyImageDialog: false,
      currentIndex: 0,
      currentTwoIndex: 0,
      currentThreeIndex: 0,
      currentTwoChild: null,
      currentThreeChild: null,
      orderInfo: {},
      listMenu: []
    }
  },
  props: {
    pickOptions: {
      type: Object,
      default: () => ({})
    },
    imgUnloadList: {
      type: Array,
      default: () => []
    },
    imgUploadList: {
      type: Array,
      default: () => []
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
    this.currentIndex = this.initIndex || 0
    this.orderInfo.productName = (ProductKindList[this.getPageParams('productId')] || {}).name || ''
    this.orderInfo.name = decodeURIComponent(this.getPageParams('name'))
    this.orderInfo.applyNo = this.getPageParams('orderId') || this.getPageParams('applyNo')
    this.orderInfo.productId = this.getPageParams('productId') || this.getPageParams('productType')
    this.orderInfo.typeNo = this.getPageParams('typeNo')
  },
  mounted() {
    this.innerUploadList = this.deepCopy(this.tmpUploadList = this.imgUploadList)
    this.innerUnloadList = this.deepCopy(this.tmpUnloadList = this.imgUnloadList)
  },

  // 原则上中途不会修改原始的值，不过也可能出现数据中途更新，不影响
  watch: {
    imgUploadList() {
      if (!isEqual(this.tmpUploadList, this.imgUploadList)) {
        this.innerUploadList = this.deepCopy(this.tmpUploadList = this.imgUploadList)
      }
    },
    imgUnloadList() {
      if (!isEqual(this.tmpUnloadList, this.imgUnloadList)) {
        this.innerUnloadList = this.deepCopy(this.tmpUnloadList = this.imgUnloadList)
      }
    }
  },

  computed: {
    isUploaded() {
      return this.innerUnloadList.length <= 0
    },
    imgList() {
      return [...(this.innerUnloadList), ...(this.innerUploadList)]
    },
    // 上传中的图片不能删除
    hasChooseAll() {
      return this.chooseNum === this.innerUploadList.length
    }
  },

  methods: {
    overDeleteImage() {
      this.$emit('updateImageList')
      // this.innerUploadList();
    },
    // 图片放大预览
    openLightBox(index) {
      this.slideIndex = index
      var imageUrls = []
      var fileIds = []
      this.imgList.forEach(function (item, index) {
        imageUrls[index] = item.src
        fileIds[index] = item.fileId
      })
      native_logMessage('imageUrls=' + JSON.stringify(imageUrls) + ' current=' + this.slideIndex)
      var that = this
      native_module_events(DEFINE_PREVIEW_IMAGE, {
        urls: imageUrls,
        current: this.slideIndex,
        applyNo: this.applyNo,
        fileIds: fileIds
      }, function (data) {
        if (data.refresh) {
          that.$emit('updateImageList')
        }
      })
    },
    doDelete(index) {
      let item, fileId
      if (typeof index === 'object') {
        item = index
        fileId = item.fileId
      } else {
        const list = this.imgList || []
        item = list[index] || {}
        fileId = item.fileId
      }
      const applyNo = this.applyNo
      const fileType = this.fileType
      this.doDeleteImg(applyNo, fileType, fileId, item)
    },
    // 重传
    doAgainUpload(item) {
      this.againUpload(item)
    },
    // 列表图片选择
    doPrevImageChoose(item) {
      if (item.chooseIcon) {
        this.chooseNum -= 1
        Vue.set(item, 'chooseIcon', null)
      } else {
        this.chooseNum += 1
        this.$set(item, 'chooseIcon', '/image/icon-press-selected.png')
      }
      this.$emit('chooseImg', this.chooseNum, this.hasChooseAll)
    },
    // 选中所有
    chooseAll() {
      this.innerUploadList.forEach(item => {
        if (!item.chooseIcon) {
          Vue.set(item, 'chooseIcon', '/image/icon-press-selected.png')
        }
      })
      this.chooseNum = this.innerUploadList.length
      this.$emit('chooseImg', this.chooseNum, true)
    },
    // 取消所有选中
    unChooseAll() {
      this.innerUploadList.forEach(item => {
        if (item.chooseIcon) {
          this.$set(item, 'chooseIcon', null)
        }
      })
      this.chooseNum = 0
      this.$emit('chooseImg', this.chooseNum, false)
    },
    // 切换菜单
    doChangeItem(item, index) {
      this.currentIndex = index
    },
    doChangeItemTwo(item, index) {
      this.currentTwoIndex = index
      this.currentTwoChild = item
    },
    doChangeItemThree(item, index) {
      this.currentThreeIndex = index
      this.currentThreeChild = item
    },
    currentTwoIndexClass(item, index) {
      if (this.orderInfo.typeNo === item.typeNo) {
        if (index === 0 && this.currentTwoIndex === 0) {
          this.currentTwoIndex = 1
        }
        return 'text-gray'
      } else if (this.currentTwoIndex === index) {
        return 'text-active'
      }
      return 'text'
    },
    doDeleteChooseImg() {
      Dialog.confirm({
        message: '确定删除吗？'
      }, (value) => {
        if (value === '确定') {
          this.innerUploadList.forEach(item => {
            if (item.chooseIcon) {
              this.doDelete(item)
            }
          })
          this.doCancelChoose()
          this.$emit('changeUploadList', this.innerUploadList.length)
          this.$emit('openChoose', false)
          this.$emit('chooseImg', this.chooseNum, false)
        }
      })
    },
    doCopyImage() {
      this.getDataList()
      this.copyImageDialog = true
    },
    doCopyImageDialogOk() {
      this.copyImageDialog = false
      if (!this.currentTwoChild) {
        this.currentTwoChild = this.listMenu[this.currentIndex].children[this.currentTwoIndex]
      }
      if (!this.currentThreeChild && this.currentTwoChild.children.length > 0) {
        this.currentThreeChild = this.currentTwoChild.children[this.currentThreeIndex]
      }
      this.$emit('copyImageChoose', this.currentTwoChild, this.currentThreeChild, this.innerUploadList)
      this.doCancelChoose()
      this.$emit('changeUploadList', this.innerUploadList.length)
      this.$emit('openChoose', false)
      this.$emit('chooseImg', this.chooseNum, false)
    },
    doCopyImageDialogCancel() {
      this.copyImageDialog = false
    },
    doCancelChoose() {
      this.showChooseIcon = false
      this.chooseNum = 0
      this.innerUploadList.forEach(item => {
        if (item.chooseIcon) {
          item.chooseIcon = null
        }
      })
    },
    doEditImage() {
      if (this.showChooseIcon) {
        return false
      }
      if (this.fileType === 'M98001') {
        Dialog.toast('该类型不支持该操作！')
        return false
      }
      if (!this.isUploaded) {
        Dialog.toast('存在上传中的图片，请等待上传完成！')
        return false
      }
      this.showChooseIcon = true
      this.$emit('openChoose', true)
    },
    getDataList() {
      //获取所有的资料项，用于复制图片操作
      var productId = this.orderInfo.productId
      var applyNo = this.orderInfo.applyNo
      this.requestApi.task_data_list({
        data: {
          applyNo,
          productId
        },
        success: (data) => {
          this.listMenu = data
        }
      })
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .upload-box {
    @include setPadding($normal_gap_bottom, $weak_big_gap_left);
  }

  .image-wrap {
    width: 320px;
    height: 320px;
    @include setMargin($normal_gap_bottom, $small_gap_left);
    @include setBorder($color_back, $condition-border + px, dashed);
  }

  .upload {
    padding-top: $normal_gap_bottom;
    font-size: $font_normal;
    color: $color_back;
  }

  .again-upload {
    font-size: 38px;
    background-color: rgb(2, 179, 180);
    width: 120px;
    position: absolute;
    text-align: center;
    top: 20px;
    right: 20px;
    height: 52px;
    color: white;
    font-weight: lighter;
  }

  .opacial5 {
    opacity: 0.5;
  }

  .choose-image-wrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .choose-image {
    position: absolute;
    @include setPadding(20px);
    top: 0;
    right: 0;
  }

  .image-opacity {
    background-color: rgba(0, 0, 0, 0.4);
  }

  .title-wrap {
    height: 88px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgba(2, 179, 180, 1);
  }

  .left-list {
    height: 1150px;
    width: $data_detail_left + px;
  }

  .two-list {
    width: 600px;
    height: 1150px;
  }

  .three-list {
    width: 600px;
    height: 1150px;
  }

  .text {
    color: $color_nav;
    font-size: $font_nav;
  }

  .text-active {
    color: $color_back;
  }

  .text-gray {
    color: gray;
  }

  .cell {
    flex-direction: row;
    align-items: center;
    padding-left: $big_gap_left;
    padding-right: $big_gap_left;
    height: 100px;
  }

  .cell-active {
    background-color: #EBF0F6;
    height: 100px;
  }
</style>
