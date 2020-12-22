/**
* 使用说明
* 数据
* dataList： 表示数组， 其中值为value，提交时的key为type
* chooseValue： 表示选择的值
* 方法
* changeSelected: 表示的是切换选择框的回掉方法
*/

<template>
  <div
     class="pick-box"
     :style="{ width: width + 'px', height: height + 'px' }"
     @click="doOpenPick">
    <text class="text" :style="{fontSize: size + 'px' }">{{ time }}</text>
    <text class="text absolute" @click="doOpenPick"></text>
    <d-image src="/image/arrow-down.png" width="32" height="20"></d-image>
  </div>
</template>

<script>
  const picker = weex.requireModule('picker');
  export default {
    name: "select",
    data: function () {
      return {
        _time: ""
      }
    },
    props: {
      size: {
        type: [Number, String],
        default: 30
      },
      width: {
        type: [Number, String],
        default: 220
      },
      height: {
        type: [Number, String],
        default: 56
      },
      pickHeight: {
        type: [Number, String],
        default: 200
      },
      chooseValue: {
        type: String,
        default: ""
      },
      value:{ //添加v-model支持
         type: String,
         default: ""
      },
      min:{
      		type:Boolean,
      		default:true
      }
    },
    created() {
      this.time = this.chooseValue || this.value || "";
    },
    computed:{
      time:{
        get(){
          return this.value || this._time;
        },
        set(val){
          this._time = val
          this.$emit("input", val); //添加v-model支持
        }
      }
    },
    methods: {
      doOpenPick() {
        picker.pickTime({
          value: this.time || this.formatDate((new Date()).getTime(),'YYYY-MM-DD HH:mm'),
          min: (this.min ? this.formatDate((new Date()).getTime(),'YYYY-MM-DD HH:mm') : ''),
          height: this.pickHeight + "px"
        }, (ret) => {
          const result = ret.result;
          if (result == 'success') {
            this.time = ret.data;
            this.$emit("doChoosePick", ret.data);
          }
        })
      },
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import './pick';
</style>
