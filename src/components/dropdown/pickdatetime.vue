/**
* 使用说明
* 数据
* dataList： 表示数组， 其中值为value，提交时的key为type
* date, time： 表示选择的值
* 方法
* changeSelected: 表示的是切换选择框的回掉方法
*/

<template>
  <div
     class="pick-box"
     :style="{ width: width + 'px', height: height + 'px'}"
     @click="doOpenPick">
    <input class="text" :style="{fontSize: size + 'px'}" :value="datetime" :placeholder="placeHolder" />
    <text class="text absolute" @click="doOpenPick"></text>
    <d-image src="/image/arrow-down.png" width="32" height="20"></d-image>
  </div>
</template>

<script>
  const picker = weex.requireModule('picker')

  export default {
    name: "select-pick-date-time",
    props: {
      datetime: {
        type: String,
        default: ""
      },
      value: { //添加v-model支持
        type: String,
        default: ""
      },
      size: {
        type: [Number, String],
        default: 34
      },
      placeHolder: {
        type: String,
        default: ""
      },
      width: {
        type: [Number, String],
        default: 400
      },
      height: {
        type: [Number, String],
        default: 56
      },
      pickHeight: {
        type: [Number, String],
        default: 500
      },
      min:{
      		type:Boolean,
      		default:true
      }
    },
    computed: {
      date() {
        const datetime = this.datetime || this.value; //添加v-model支持并兼容原有绑定方式
        if (!datetime) {
          return "";
        } else {
          return datetime.split(" ")[0];
        }
      },
      time() {
        const datetime = this.datetime || this.value; //添加v-model支持并兼容原有绑定方式
        if (!datetime) {
          return "";
        } else {
          return datetime.split(" ")[1];
        }
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

        var value = this.date  || this.formatDate((new Date()).getTime(),'YYYY-MM-DD')
        this.openDate(value,platform)
      },
      openDate(date, platform) {
        const now = new Date().getTime()
        const formatNow = this.formatDate(now, 'YYYY-MM-DD')
        if(platform  != 'Web'){
          this.openDateAndTime(date)
          return;
        }
        picker.pickDate(
          {
            value: date || formatNow,
            min:  (this.min ? this.formatDate((new Date()).getTime(),'YYYY-MM-DD') : ''),
            height: this.pickHeight + 'px'
          },
          ret => {
            const result = ret.result
            if (result === 'success') {
              this.doPickTime(ret.data)
            }
          }
        )
      },

      doPickTime(date) {
        picker.pickTime({
          value: this.time  || this.formatDate((new Date()).getTime(),'YYYY-MM-DD HH:mm'),
          min: (this.min ? this.formatDate((new Date()).getTime(),'YYYY-MM-DD HH:mm') : ''),
          height: this.pickHeight + 'px'
        }, (ret) => {
          const result = ret.result;
          if (result == 'success') {
            const time = ret.data
            this.$emit('input', date + " " + time); //添加v-model支持
            this.$emit("changeValue", date + " " + time, date, time);
          }
        });
      },
      openDateAndTime(_time) {
        const now = new Date().getTime()
        const formatNow = this.formatDate(now, 'YYYY-MM-DD HH:mm')
        try {
          picker.pickDateAndTime(
          {
            value: _time || formatNow,
            min: this.min ? formatNow : '',
            height: this.pickHeight + 'px'
          },
          ret => {
            const result = ret.result
            if (result === 'success') {
              const time = ret.data
              this.$emit('input', time)
              this.$emit("changeValue", time);
            }
          }
        )  
        } catch (error) {
          this.openDate(_time);
        }
        
      } 
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import './pick';
</style>
