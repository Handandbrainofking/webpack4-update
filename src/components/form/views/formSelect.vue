<!--
  function: formText
  author  : wq
  update  : 2018/11/26 15:51
-->
<template>
  <d-layout text-align="initial" :full-parent="false">
    <d-layout class="row" text-align="initial" :full-parent="false" v-for="(item, idx) in list" :key="`select-${idx}`" @clickLayout="doChooseButton(item, idx)">
      <d-image
         width="32px" height="32px"
         :src="currentIndex === idx && '/image/icon_chosen.png' || '/image/icon_unchoose.png'"
      ></d-image>
      <text class="text">{{ item.name }}</text>
    </d-layout>
  </d-layout>
</template>

<script>
import MixinFormInput from '../mixins/mixinInput'
import { isEqual } from '@/utils/utils'
import Dialog from '@/utils/dialog'

export default {
  mixins: [MixinFormInput],
  props: {
    checking: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lastList: [],
      lastIndex: 0,
      currentIndex: 0
    }
  },
  watch: {
    list(list) {
      if (!isEqual(list, this.lastList)) {
        this.lastList = list
        const value = this.value
        this.currentIndex = this.getIndexByKeyFromArray(list, value, 'key')
      }
    },
    index(value) {
      if (this.lastIndex !== value) {
        this.lastIndex = this.currentIndex = value
      }
    }
  },
  created() {
    const defaultIndex = this.index
    const value = this.value
    const list = this.lastList = this.list
    let index = this.getIndexByKeyFromArray(list, value, 'key')
    if(index === -1 && defaultIndex !== -1) {
      index = defaultIndex
      this.$emit('input', this.getValue(list[index], 'key'), this.getValue(list[index], 'name'), index)
    }
    this.lastIndex = this.currentIndex = index
  },
  methods: {
    doChooseButton(item, index) {
      const current = this.currentIndex;
      if (current === index || this.disabled) {
        return false
      }
      if (this.checking) {
        Dialog.toast('征信查询中，当前不可更换征信获取方式！')
        return false
      }
      this.currentIndex = index
      this.$emit('input', this.getValue(item, 'key'), this.getValue(item, 'name'), index)
    }
  }
}
</script>

<style scoped>
  .row {
    padding-right: 20px;
  }

  .text {
    padding-left: 20px;
    padding-right: 30px;
    font-size: 34px;
    color: #030606;
  }
</style>
