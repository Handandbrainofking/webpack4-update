<template>
  <d-layout text-align="initial" vertical-align="initial">
    <d-layout text-align="center" vertical-align="middle" @clickLayout="selectItem">
      <div class="btn-uncheck">
        <d-image :style="{ visibility: checkedVisible }" src="/image/checked.png" :width="46" :height="46"></d-image>
      </div>
    </d-layout>
    <d-layout text-align="center" vertical-align="middle">
      <d-image :src="readImg" :width="58" :height="48"></d-image>
    </d-layout>
    <d-layout class="title-wrap" vertical-align="middle" :full-parent="false" @clickLayout="clickItem(item, idx)">
      <text :class="['text', 'title-text', checkHasRead]">{{ item.msgTitle }}</text>
    </d-layout>
    <d-layout class="time-wrap" text-align="center" :full-parent="false" vertical-align="middle">
      <text :class="['text', 'cell-text', checkHasRead]">{{ this.formatDate(item.sendTime) }}</text>
    </d-layout>
  </d-layout>
</template>

<script>
export default {
  name: 'MessageListItem',
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    checkedVisible() {
      const item = this.item || {}
      const checked = item.checked
      return (checked && 'visible') || 'hidden'
    },
    readImg() {
      const item = this.item || {}
      const hasRead = item.hasRead
      if (hasRead === '1') {
        return '/image/read.png'
      } else if (hasRead === '0') {
        return '/image/unread.png'
      }
    },
    checkHasRead() {
      const item = this.item || {}
      if (item.hasRead === '1') { // 已读
        return 'read-text'
      }
      return ''
    }
  },
  methods: {
    selectItem() {
      this.$emit('changeCheck', this.index)
    },
    clickItem() {
      this.$emit('clickItem', this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
  .center {
    align-items: center;
    justify-content: center;
  }

  .btn-uncheck {
    width: 35px;
    height: 35px;
    border-width: 2px;
    border-color: rgba(103, 116, 117, 0.5);
    border-radius: 6px;
    align-items: center;
    justify-content: center;
  }

  .text {
    flex: 1;
    font-size: $font_normal;
    color: $color_content;
    overflow: hidden;
    text-overflow: ellipsis;
    lines: 1;
  }

  .title-center {
    align-items: center;
  }

  .title-text {
    opacity: 1;
  }

  .cell-text {
    text-align: center;
  }

  .read-text {
    opacity: 0.6;
  }

  .title-wrap {
    flex-direction: row;
    flex: 4;
  }

  .time-wrap {
    flex: 3;
  }

</style>
