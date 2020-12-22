/**
* 使用说明
* 数据
* dataList： 表示数组， 其中值为value，提交时的key为type
* selectedData： 表示选择的值
* 方法
* changeSelected: 表示的是切换选择框的回掉方法
*/

<template>
  <div class="picker-component">
    <picker-list v-if="showOptions" :title="pickTitle" :options="searchList" :value="_displayText" :input="selected"
                 @cancel="hideList" @commit="selected"></picker-list>
    <div class="picker-box" :style="{ width: width+'px' ,height: height + 'px' }" @click="showList">
      <input class="text" :disabled="true" :style="{fontSize: size + 'px' }" :value="_displayText"
             :placeholder="placeHolder" />
      <d-image src="/image/arrow-down.png" width="32" height="20"></d-image>
    </div>
    <div class="mask" @click="showList" :style="{ width: width+'px', height:'70px'}"></div>
  </div>
</template>

<script>
import PickerList from './PickerList'

export default {
  name: 'DSelect',
  data: function () {
    return {
      showOptions: false,
      currentItem: ''
    }
  },
  props: {
    pickTitle: {
      type: String,
      default: '请选择'
    },
    index: {
      type: [Number, String],
      default: -1
    },
    definedClick: {
      type: [Function, null, undefined],
      default: undefined
    },
    size: {
      type: [Number, String],
      default: 30
    },
    searchList: {
      type: Array,
      default: () => []
    },
    width: {
      type: [Number, String],
      default: 288
    },
    height: {
      type: [Number, String],
      default: 56
    },
    pickHeight: {
      type: [Number, String],
      default: 500
    },
    placeHolder: {
      type: String,
      default: ''
    },
    value: { // 添加v-model实现
      type: [Number, String],
      default: 0
    },
    initValue: {
      type: String,
      default: ''
    }
  },
  watch: {
    index(value) {
      const list = this.list
      if (Array.isArray(list) && list.length > 0) {
        this.currentItem = list[value]
      }
    }
  },
  computed: {
    list() {
      return this.searchList.map(item => {
        if ('string' === typeof item) {
          return item
        } else {
          return item.name
        }
      })
    },
    _displayText() {
      if (this.initValue && !this.currentItem) {
        return this.initValue;
      } else if (this.currentItem) {
        return this.currentItem
      } else if (this.list && this.value) {
        let item = this.list.find(x => x === this.value || x.key === this.value || x.value === this.value)
        if (item) {
          return item.name || item
        }
      }
      return ''
    }
  },
  created() {
    if (this.index >= 0) {
      let item = this.searchList[this.index];
      this.selected(item ? item.name : '')
    }
  },
  methods: {
    // 由于tab-content中的transform会引起我们里面弹窗的位置异常，所以在显示 列表弹窗的时候 要把这个CSS属性去掉,在去掉弹窗的时候又要把这个属性回写
    restoreTransform() {
      // 只处理Web
      if (WXEnvironment.platform !== 'Web') {
        return false
      }
      let containers = document.getElementsByClassName('tab-container')
      for (let ctn of containers) {
        if (ctn.dataset.ddtransform) {
          ctn.style.transform = ctn.dataset.ddtransform
          delete ctn.dataset.ddtransform
        }
      }

    },
    // 去掉tab-content 的transform属性
    removeTransform() {
      // 只处理Web
      if (WXEnvironment.platform !== 'Web') {
        return false
      }
      let containers = document.getElementsByClassName('tab-container')
      for (let ctn of containers) {
        if (ctn.style.transform) {
          ctn.dataset.ddtransform = ctn.style.transform;
          ctn.style.transform = null;
        }
      }
    },
    showList() {
      this.showOptions = true
      this.removeTransform()
    },
    hideList() {
      this.showOptions = false
      this.restoreTransform()
    },
    selected(value, key, item) {
      if (this.value !== value) {
        this.initValue = null
        this.$emit('input', key, value) // 添加v-model实现
        this.$emit('doChoosePick', key, value, item)
        this.currentItem = value
      }
      this.hideList()
    },

    // 重置值
    resetValue() {
      this.currentItem = ''
      this.selected('')
    }
  },
  components: {
    PickerList
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  @import './pick';

  .picker-component {
    border-width: 2px;
    border-color: rgb(202, 204, 207);
    border-radius: 4px;

    flex-direction: row;
    padding-left: 20px;
    padding-right: 20px;
    align-items: center;
  }

  .picker-box {
    flex-direction: row;
    /*padding-left: 20px;*/
    /*padding-right: 20px;*/
    align-items: center;
    border-radius: 4px;
    flex: 1;
  }

  .text {
    font-size: 28px;
    color: $color_nav;
    background-color: transparent;
    flex: 1;
    lines: 1;
    line-height: 70px;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
