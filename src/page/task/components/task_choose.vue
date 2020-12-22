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
     :style="{ width: width + 'px' }"
     @click="doOpenPick">
    <text class="text">{{ searchType }}</text>
    <d-image src="/image/arrow-down.png" width="24" height="13"></d-image>
  </div>
</template>

<script>
  const picker = weex.requireModule('picker');
  export default {
    name: "select",
    data: function () {
      return {
        searchType: ""
      }
    },
    props: {
      searchList: {
        type: Array,
        default: () => []
      },
      width: {
        type: [Number, String],
        default: 520
      },
      height: {
        type: [Number, String],
        default: 72
      },
    },
    created() {
      this.searchType = this.getValue(this.searchList[0] || "", "name");
    },
    methods: {
      doOpenPick() {
        picker.pick({
          items: this.searchList,
          height: '500px'
        }, (ret) => {
          const result = ret.result;
          if (result == 'success') {
            this.searchType = this.searchList[ret.data];
            this.$emit("doChoosePick", this.searchList[ret.data]);
          }
        })
      },
    }
  }
</script>

<style scoped>
  .pick-box {
   	width:500px;
  	height:72px;
  	border-width: 1px;
    margin-left:20px;
    border-color:#ccc;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }

  .text {
    font-size:34px;
    flex: 1;
    lines: 1;
  }
</style>
