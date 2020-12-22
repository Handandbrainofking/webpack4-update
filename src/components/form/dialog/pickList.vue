<!--
  function: pickList
  author  : wq
  update  : 2018/11/26 18:17
-->

<template>
  <div class="dd-picker-list">
    <div class="dd-picker-mask" @click="$emit('cancel')"></div>
    <div class="dd-picker-body" :style="pickerBodyStyle">
      <div class="header">
        <text class="header-text">{{title}}</text>
        <div @click="$emit('cancel')" class="order-title-close">
          <text class="order-title-text">×</text>
        </div>
      </div>
      <div class="content">
        <scroller ref="scroller" :style="scrollerStyle">
          <div class="options">
            <div class="option" v-for="option in displayOptions" :style="isCurrent(option) && selectedStyle"
                 @click="selectOption(option)" :key="option[keyProp]||option[displayProp]">
              <text class="option-text" :style="isCurrent(option) && selectedTextStyle">{{option[displayProp]}}</text>
            </div>
          </div>
        </scroller>
      </div>
      <div class="footer">
        <text class="footer-cancel" @click="$emit('cancel')">取消</text>
        <text class="footer-commit" @click="$emit('commit', currentItem ? currentItem.name:value)">确定</text>
      </div>
    </div>
  </div>
</template>
<script>
import {
  DEFINE_HIDDEN_KEYBORAD,
  native_common_events,
  native_logMessage
} from '@/utils/deal_native';

export default {
  data() {
    return {
      currentItem: null
    }
  },
  props: {
    //options的key字段，它将会跟我们的v-model 一致
    keyProp: {
      type: String,
      default: 'key'
    },
    //列表中显示 的字段
    displayProp: {
      type: String,
      default: 'name'
    },
    //候选字段
    options: {
      type: Array,
      default: []
    },
    selected: {
      type: [Number, String],
      default: null
    },
    title: {
      type: String,
      default: '请选择'
    },
    width: {
      type: Number,
      default: 800
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  created() {
    native_common_events(DEFINE_HIDDEN_KEYBORAD);
  },
  computed: {
    pickerBodyStyle() {
      let height = this.options.length <= 8 ? 800 : 1000;
      return {
        position: WXEnvironment.platform === 'Web' ? 'absolute' : 'fixed',
        width: this.width + 'px',
        height: height + 'px',
        left: Math.round((2560 - this.width) / 2) + 'px',
        top: Math.round((1600 - height) / 2) + 'px'
      };
    },
    selectedStyle() {
      return {
        backgroundColor: '#EBF0F6'
      };
    },
    selectedTextStyle() {
      return {
        color: ' #02B3B4'
      }
    },
    scrollerStyle() {
      let height = this.options.length <= 8 ? 800 : 1000;
      return {
        height: height - 176 + 'px'
      }
    },
    displayOptions() {
      return (this.options || []).map(option => {
        return typeof option === 'string' ? { name: option } : option;
      })
    }
  },
  methods: {
    selectOption(option) {
      this.currentItem = option;
    },
    isCurrent(option) {
      if (this.currentItem) {
        return this.currentItem === option
      } else {
        return this.value === option.name;
      }
    }
  }
}
</script>
<style scoped>
  .order-title-close {
    align-items: center;
    margin-left: -100px;
    width: 100px;
    height: 88px;
  }

  .order-title-text {
    color: #ffffff;
    font-size: 75px;
    font-weight: 100;
  }

  .dd-picker-list {
    position: fixed;
    left: 0;
    top: 0;
    width: 2560px;
    height: 1600px;
    z-index: 10000;
  }

  .dd-picker-mask {
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
    width: 2560px;
    height: 1600px;
    z-index: 98;
  }

  .dd-picker-body {
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff;
    z-index: 99;
  }

  .content {
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
  }

  .header {
    background-image: linear-gradient(to right, #02b3b4, #1abc9c);
    justify-content: center;
    align-items: center;
    width: 800px;
    height: 88px;
    flex-direction: row;
  }

  .header-text {
    width: 800px;
    text-align: center;
    color: #ffffff;
    font-size: 38px;
  }

  .options {
    flex-direction: column;
  }

  .option {
    flex: 1;
    height: 88px;
    width: 800px;
    align-items: center;
    justify-content: center;
  }

  .option-text {
    color: #030606;
    font-size: 30px;
  }

  .footer {
    position: absolute;
    width: 800px;
    height: 88px;
    bottom: 0;
    left: 0;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-top-color: #ebebeb;
    border-top-style: solid;
    border-top-width: 1px;
  }

  .footer-cancel {
    color: #02b3b4;
    font-size: 38px;
    width: 400px;
    background-color: #FFFFFF;
    height: 88px;
    line-height: 88px;
    text-align: center;
  }

  .footer-commit {
    color: #FFFFFF;
    font-size: 38px;
    width: 400px;
    background-image: linear-gradient(to right, #02B3B4, #1ABC9C);
    height: 88px;
    line-height: 88px;
    text-align: center;
  }
</style>
