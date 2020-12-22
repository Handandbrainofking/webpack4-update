/**
* 使用说明
* 数据
* dataList： 表示数组， 其中值为value，提交时的key为type
* selectedData： 表示选择的值
* 方法
* changeSelected: 表示的是切换选择框的回掉方法
*/

<template>
  <div
     class="pick-box"
     :style="{ width: width + 'px', height: height + 'px' }"
     @click="doOpenPick">
    <input class="text" :disabled="true" :style="{fontSize: size + 'px' }" :value="value" :placeholder="placeHolder" />
    <text class="absolute" @click="doOpenPick"></text>
    <d-image src="/image/arrow-down.png" width="32" height="20"></d-image>
  </div>
</template>

<script>
  const picker = weex.requireModule('picker');

  export default {
    name: "select",
    data: function () {
      return {
        value: "",
      }
    },
    props: {
      index: {
        type: [Number, String],
        default: 0
      },
      definedClick: {
        type: [Function, null, undefined],
        default: undefined
      },
      size: {
        type: [Number, String],
        default: 30
      },
      list: {
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
        default: ""
      },
    },
    created() {
      this.value = this.list[this.index] || "";
    },
    methods: {
      doOpenPick(val) {
        if ("function" === typeof this.definedClick) {
          this.definedClick();
          return false;
        }
        picker.pick({
          items: this.list,
          height: this.pickHeight + 'px'
        }, (ret) => {
          const result = ret.result;
          if (result == 'success') {
            const value = this.list[ret.data];
            if (this.value !== value) {
              this.value = value;
              this.$emit("doChoosePick", this.list[ret.data], ret.data);
            }
          }
        })
      },
      resetValue() {
        this.value = this.list[this.index] || "";
      }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import './pick';
</style>
