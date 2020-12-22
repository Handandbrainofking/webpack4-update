<template>
  <d-layout-scroll class="scroller" text-align="left" vertical-align="top" kind="column">
    <d-layout class="right-box" vertical-align="top" :wrap="true" :full-parent="false">
        <d-layout
           class="cell" kind="column" text-align="center" :full-parent="false"
           :key="`data-detail-nav-${index}`"
           v-for="(item, index) in iList"
           @clickLayout="doClickItem(item)">
          <d-layout class="image-wrap" kind="column" text-align="center" :full-parent="false">
            <d-image v-if="!item.total || !item.fileUrl" src="/image/upload-empty.png" :width="242" :height="160"></d-image>
            <d-image v-else :src="item.fileUrl||''" :width="356" :height="356"></d-image>
            <div class="mask-block" v-if="item.total && item.fileUrl"></div>
            <div class="num-box">
              <div class="num-wrap"></div>
              <text class="num-text">{{ item.total || 0 }}张</text>
            </div>
          </d-layout>
          <text class="text text-name">{{ item.name }}</text>
        </d-layout>
    </d-layout>
  </d-layout-scroll>
</template>

<script>
import { DEFINE_IMAGE_URL, native_module_events } from '@/utils/deal_native'

const itemHeight = 490

export default {
  name: 'left',
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    navIndex: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      iList: []
    }
  },
  created() {
    this.getImageUrlByList()
  },
  watch: {
    list: function () {
      this.getImageUrlByList()
    }
  },
  methods: {
    // 获取图片地址当list变化的时候
    getImageUrlByList() {
      const list = this.list
      const urls = list.map(item => item.fileId)
      // 根据fileId获取url
      this.iList = list
      native_module_events(DEFINE_IMAGE_URL, urls, 1).then((data) => {
        this.iList = list.map(item => Object.assign({}, item, {fileUrl: data[item.fileId]}))
      })
    },
    doClickItem(item) {
      this.jump('/data_upload.js', false, true, {
        type: item.typeNo,
        customerNo: item.custNo || '',
        title: item.name,
        productId: item.productId,
        applyNo: this.getPageParams('orderId'),
        typeNo: item.typeNo
      }, {currentTab: this.navIndex})
    }
  }
}
</script>

<style lang="scss" scoped>
  .scroller {
    height: $window_height - $back_head_height - $normal_gap_bottom;
  }
  .right-box {
    @include setPadding(40px, 8px, 20px);
  }
  .cell {
    width: 420px;
    height: 490px;
    padding-bottom: 40px;
  }

  .image-wrap {
    width: 360px;
    height: 360px;
    @include setBorder($color_back, $condition-border, dashed);
  }

  .num-box {
    position: absolute;
    top: -2px;
    right: 0;
    width: 150px;
    height: 150px;
    overflow: hidden;
  }

  .num-wrap {
    position: absolute;
    top: -110px;
    right: -110px;
    width: 212px;
    height: 212px;
    background-color: $color_back;
    transform: rotate(45deg);
  }

  .num-text {
    font-size: $font_normal;
    color: $color_white;
    line-height: 35px;
    margin-top: 10px;
    margin-left: 30px;
    width: 130px;
    text-align: center;
  }

  .text {
    padding-top: 5px;
    padding-bottom: 5px;
    line-height: 35px;
    font-size: $font_normal;
    width: 400px;
    text-align: center;
  }

  .text-name {
    padding-top: 20px;
    line-height: 35px;
    height: 90px;
    lines: 2;
  }

  .mask-block {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
