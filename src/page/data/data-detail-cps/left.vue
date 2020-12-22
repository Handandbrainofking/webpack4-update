<template>
  <div class="left-box">
    <d-layout class="text-wrap" :full-parent="false">
      <d-image class="gap-right" src="/image/icon_readonly.png" :width="17" :height="17"></d-image>
      <text class="text">{{ orderInfo.productName }}</text>
    </d-layout>
    <d-layout class="text-wrap" :full-parent="false">
      <d-image class="gap-right" src="/image/icon_readonly.png" :width="17" :height="17"></d-image>
      <text class="text">{{ orderInfo.name }}</text>
    </d-layout>
    <d-layout class="text-wrap" :full-parent="false">
      <d-image class="gap-right" src="/image/icon_readonly.png" :width="17" :height="17"></d-image>
      <text class="text">{{ orderInfo.applyNo }}</text>
    </d-layout>
    <list class="list">
      <cell
         :class="['cell', currentIndex === index ? 'cell-active' : '']"
         :key="`data-detail-menu-${index}`"
         v-for="(item, index) in listMenu"
         @click="doChangeItem(item, index)">
        <text :class="['text', currentIndex === index ? 'text-active' : '']">{{ item.name }}</text>
        <d-image :src="currentIndex === index ? '/image/arrow-right-focus.png' : '/image/arrow-right.png'" :width="36"
                 :height="36"></d-image>
      </cell>
    </list>
  </div>
</template>

<script>
import { ProductKindList } from '@/config'

export default {
  name: 'left',
  props: {
    initIndex: {
      type: [Number, String],
      default: 0
    },
    listMenu: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      orderInfo: {}
    }
  },
  beforeMount() {
    this.currentIndex = this.initIndex || 0
    this.orderInfo.productName = (ProductKindList[this.getPageParams('productId')] || {}).name || ''
    this.orderInfo.name = decodeURIComponent(this.getPageParams('name'))
    this.orderInfo.applyNo = this.getPageParams('orderId')
  },
  methods: {
    // 切换菜单
    doChangeItem(item, index) {
      this.currentIndex = index
      this.$emit('doChangeItem', item, index)
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .left-box {
    padding-top: $bigger_gap_left;
    padding-bottom: $normal_gap_root_column;
    height: ($window_height - $back_head_height) + px;
    width: $data_detail_left + px;
    background-color: $color_white;
    @include setBorderRight(#eeeeee);
  }

  .row {
    flex-direction: row;
    align-items: center;
  }

  .text-wrap {
    @include setPadding(15px 0 15px 40px);
  }

  .gap-right {
    margin-right: 10px;
  }

  .text {
    color: $color_nav;
    font-size: $font_nav;
  }

  .text-active {
    color: $color_back;
  }

  .list {
    padding-top: 100px;
  }

  .cell {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding-left: $big_gap_left;
    padding-right: $big_gap_left;
    height: 100px;
  }

  .cell-active {
    background-color: #EBF0F6;
  }
</style>
