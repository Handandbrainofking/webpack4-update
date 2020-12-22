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
    <div class="picker-box" :style="{ width: width+'px' ,height: height + 'px' }">
      <input class="text" :disabled="true" :style="{fontSize: size + 'px' }" :value="initValue"
             :placeholder="placeHolder" />
      <d-image src="/image/arrow-down.png" width="32" height="20"></d-image>
    </div>
    <div class="mask" @click="showGroupList"></div>
  </div>
</template>

<script>

export default {
  name: 'select',
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
  methods: {
   showGroupList(){
       this.$emit('showGroupList')
   }
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
    background-color: transparent;
  }
</style>
