<!--
  function: formText
  author  : wq
  update  : 2018/11/26 15:51
-->
<template>
  <d-layout>
    <input
       class="input" disabled="disabled" :style="{ fontSize: `${size}px`, height: `${height}px` }" :value="displayText"
       :placeholder="placeholder" />
    <d-image src="/image/arrow-down.png" width="32" height="20"></d-image>
    <template v-if="type === 'pick'">
      <picker-list
         v-if="show" :title="pickTitle" :options="list" :value="displayText"
         @cancel="hideList" @commit="selected"
      ></picker-list>
    </template>
    <div class="mask" @click="showList"></div>
  </d-layout>
</template>

<script>
import PickerList from '../dialog/pickList.vue'
import MixinFormInput from '../mixins/mixinInput'
import { isWeb } from '@/utils/utils'

const picker = weex.requireModule('picker')
export default {
  name: 'formText',
  components: {
    PickerList
  },
  mixins: [MixinFormInput],
  data() {
    return {
      show: false,
      splitSymbol: ' '
    }
  },
  computed: {
    displayText() {
      const value = this.value
      if (this.isEmpty(value)) {
        return ''
      } else {
        if (this.type === 'pick') {
          const list = this.list || []
          const item = this.getItemByName(list, value, 'key')
          if (item) {
            return this.getValue(item, 'name')
          } else {
            return ''
          }
        }
        else {
          return value
        }
      }
    }
  },
  methods: {
    showList(e) {
      const type = this.type
      if (type === 'pick') {
        this.show = true
      }
      else if (type === 'date' || type === 'datetime' || type === 'time') {
        // web 阻止冒泡
        const value = this.value
        const values = value.split(this.splitSymbol)
        if (isWeb) {
          e.preventDefault && e.preventDefault()
          try {
            e.stopImmediatePropagation()
          } catch (ev) {
            e.stopPropagation && e.stopPropagation()
          }
        }
        if (type === 'time') {
          this.openTime('', values[0])
        } else {
          this.openDate(values[0], values[1] || '')
        }
      }
    },
    hideList() {
      this.show = false
    },
    selected(value) {
      if (this.value !== value) {
        this.$emit('input', this.getKeyByName(this.list, value), value)
      }
      this.hideList()
    },
    openDate(date, time) {
      const now = new Date().getTime()
      const formatNow = this.formatDate(now, 'YYYY-MM-DD')
      picker.pickDate({
        value: date || formatNow,
        min: (this.min ? formatNow : ''),
        height: this.pickHeight + 'px'
      }, (ret) => {
        const result = ret.result
        if (result === 'success') {
          if (this.type === 'datetime') {
            this.openTime(ret.data, time)
          } else {
            this.$emit('input', ret.data) // 实现v-model效果
          }
        }
      })
    },
    openTime(date, _time) {
      const now = new Date().getTime()
      const formatNow = this.formatDate(now, 'YYYY-MM-DD HH:mm')
      picker.pickTime({
        value: _time || formatNow,
        min: (this.min ? formatNow : ''),
        height: this.pickHeight + 'px'
      }, (ret) => {
        const result = ret.result
        if (result === 'success') {
          const time = ret.data
          if (date) {
            this.$emit('input', date + ' ' + time)
          }
          else {
            this.$emit('input', time)
          }
        }
      })
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .input {
    flex-direction: row;
    flex: 1;
    align-items: center;
    background-color: transparent;
    color: $color_content
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
  }
</style>
