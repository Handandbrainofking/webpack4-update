/**
* 使用说明
* 数据
* buttonList 表示数组， 其中值为name，active为选中状态
* selectedData： 表示选择的值
* 方法
* ChooseButton: 表示的是切换按钮的回掉方法
*/
<template>
  <div class="row">
    <div class="row" v-for="(item, index) in buttonList" :key="index" @click="doChooseButton(item, index)">
      <d-image width="32" height="32" :src="currentIndex === index && '/image/icon_chosen.png' || '/image/icon_unchoose.png'"></d-image>
      <text class="text">{{item.name}}</text>
    </div>
  </div>
</template>

<style scoped>
  .row {
    flex-direction: row;
    align-items: center;
    height: 72px;
    padding-left: 20px;
  }

  .text {
    padding-left: 20px;
    padding-right: 30px;
    font-size: 34px;
    color: #030606;
  }
</style>


<script>
  import {isEqual} from '@/utils/utils'
  import Dialog from '@/utils/dialog'
  export default {
    components: {
      Dialog
    },
    props: {
      buttonList: {
        type: Array,
        default: () => []
      },
      index: {
        type: [Number, String],
        default: 0
      },
      disable: {
        type: Boolean,
        default: false
      },
      checking: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        oldButtonList: [],
        oldIndex: 0,
        currentIndex: 0
      }
    },
    watch: {
      buttonList() {
        if (!isEqual(this.buttonList, this.oldButtonList)) {
          this.oldButtonList = this.buttonList;
          this.currentIndex = -1;
        }
      },
      index() {
        if (this.oldIndex !== this.index) {
          this.oldIndex = this.currentIndex = this.index;
        }
      }
    },
    created() {
      this.oldIndex = this.index;
      this.oldButtonList = this.buttonList;
      this.currentIndex = Math.max(this.index, -1);
    },
    methods: {
      doChooseButton(item, index) {
        const current = this.currentIndex;
        if (current == index || this.disable) {
          return;
        }
        if(this.checking){
          Dialog.toast('征信查询中，当前不可更换征信获取方式！')
          return;
        }
        this.currentIndex = index;
        this.$emit('ButtonChoose', this.getValue(item, 'key'), this.getValue(item, 'name'), index);
      }
    }
  }
</script>

