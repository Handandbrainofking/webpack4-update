<template>
  <d-layout class="body-list" kind="column" text-align="initial" vertical-align="initial" :full-parent="false">
    <d-layout class="list-item" text-align="initial" vertical-align="initial" :full-parent="false">
      <d-layout class="flex1" text-align="center" :full-parent="false">
        <text class="item-text">{{ item.customerName }}</text>
      </d-layout>
      <d-layout class="flex4" :full-parent="false">
        <text class="item-text">{{ item.workUnit }}</text>
      </d-layout>
      <d-layout class="flex1" text-align="center" :full-parent="false" @clickLayout="queryCompanyLitigation(item)">
        <div class="check-icon"></div>
        <text class="item-text detail-text">查询</text>
      </d-layout>
    </d-layout>
    <d-layout v-if="item.flag" class="list-detail" text-align="initial" vertical-align="initial" :full-parent="false">
      <d-layout class="flex2" :full-parent="false">
        <text class="item-text list-detail-label">查询状态</text>
        <text class="item-text list-detail-value">{{ getFlag(item.flag) }}</text>
      </d-layout>
      <d-layout class="flex2" :full-parent="false">
        <text class="item-text list-detail-label">查询时间</text>
        <text class="item-text list-detail-value">{{ formatDate(item.queryTime, 'YYYY-MM-DD hh:mm:ss') }}</text>
      </d-layout>
      <d-layout class="flex2" :full-parent="false">
        <text class="item-text list-detail-label">疑似法律诉讼</text>
        <text class="item-text list-detail-value">{{ getLitigation(item.hasEcoLitigation) }}</text>
      </d-layout>
      <d-layout class="flex1" :full-parent="false" text-align="center" @clickLayout="detailLitigation(item)">
        <text class="item-text detail-text">详情</text>
        <d-image src="/image/icon_detail.png" :width="56" :height="40"></d-image>
      </d-layout>
    </d-layout>
  </d-layout>
</template>

<script>
import Dialog from '@/utils/dialog'

export default {
  name: 'TaskCompanyItem',
  props: {
    applyNo: {
      type: String
    },
    item: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getFlag(flag) {
      if (flag === 'Y') {
        return '查询成功'
      } else if (flag === 'N') {
        return '查询失败'
      } else {
        return '查询'
      }
    },
    getLitigation(flag) {
      if (flag === 'Y') {
        return '有'
      } else if (flag === 'N') {
        return '无'
      } else {
        return '-'
      }
    },
    queryCompanyLitigation(item) {
      // 理论上已经查询出来了，无需在重复查询，为了保持以前的逻辑暂时不变
      // if (!this.item.flag) {
      this.requestApi.company_litigation_detail({
        data: {
          applyNo: this.applyNo,
          customerNo: item.customerNo,
          workUnit: item.workUnit
        },
        success: data => {
          this.$emit('uploadPage')
          Dialog.toast('成功返回查询结果！')
        }
      })
      // }
    },
    // 诉讼详情展示
    detailLitigation(item) {
      this.$emit('detailLitigation', item)
    }
  }
}
</script>
<style lang="scss" scoped>
  .list-item {
    height: 112px;
    background-color: rgb(245, 246, 249);
    @include setBorderTop($color_white, 24px);
  }

  .flex1 {
    flex: 1;
  }

  .flex2 {
    flex: 2;
  }

  .flex4 {
    flex: 4;
  }

  .item-text {
    @include setFontSize();
    color: $color_content;
  }

  .detail-text {
    color: $color_back;
    padding-right: $normal_text_gap;
    @include setPadding($normal_gap_left);
  }

  /** 保证和详情对齐 **/
  .check-icon {
    width: 3px;
  }

  .list-detail {
    background-color: rgb(250, 250, 252);
    height: 88px;
    padding-left: 100px;
  }

  .list-detail-label {
    color: $color_enclosure;
    padding-right: $normal_gap_column;
  }

  .list-detail-value {
    color: $color_content;
  }
  .body-list {
    width: 2220px;
    margin-left: 120px;
  }
</style>
