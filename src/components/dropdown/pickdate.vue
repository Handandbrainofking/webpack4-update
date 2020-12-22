/**
* 使用说明
* 数据
* dataList： 表示数组， 其中值为value，提交时的key为type
* chooseValue： 表示选择的值
* min:Boolean  最小值，默认是true当前日期。
* 方法
* changeSelected: 表示的是切换选择框的回掉方法
*/

<template>
  <div
     class="pick-box"
     :style="{ width: width + 'px', height: height + 'px'}"
     @click="doOpenPick">
    <input class="text" :style="{fontSize: size + 'px'}" :value="selectedDate" :placeholder="placeHolder" />
    <text class="text absolute" @click="doOpenPick"></text>
    <d-image src="/image/arrow-down.png" width="32" height="20"></d-image>
  </div>
</template>

<script>
  const picker = weex.requireModule('picker');
  export default {
    name: "select",
    props: {
      date: {
        type: String,
        default: ""
      },
      value:{ //添加v-model实现
        type: String,
        default: ""
      },
      placeHolder: {
        type: String,
        default: ""
      },
      size: {
        type: [Number, String],
        default: 34
      },
      width: {
        type: [Number, String],
        default: 400
      },
      height: {
        type: [Number, String],
        default: 56
      },
      pickHeight:  {
        type: [Number, String],
        default: 200
      },
      min:{
      		type:Boolean,
      		default:true
      }
    },
    computed:{
      selectedDate(){ //实现v-model效果并与原有:date绑定兼容
        return this.date || this.value;
      }
    },
    methods: {
      doOpenPick(e) {
        const { platform } = weex.config.env;
        if (platform === 'Web') {
          e.preventDefault && e.preventDefault();
          try {
            e.stopImmediatePropagation()
          } catch (ev) {
            e.stopPropagation && e.stopPropagation();
          }
        }
        picker.pickDate({
          value: this.selectedDate  || this.formatDate((new Date()).getTime(),'YYYY-MM-DD'),
          min: (this.min ? this.formatDate((new Date()).getTime(),'YYYY-MM-DD') : ''),
          height: this.pickHeight + 'px'
        }, (ret) => {
          const result = ret.result;
          if (result == 'success') {
            this.$emit('input',  ret.data) //实现v-model效果
            this.$emit("doChoosePick", ret.data);
          }
        })
      },
      setDate(date) {
        this.date = date;
      }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import './pick';
</style>
