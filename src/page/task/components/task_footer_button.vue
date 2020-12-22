/***
* 任务底部 保存、提交按钮 组件
* saveClick:保存按钮事件
* commitClick:提交按钮事件
*/

<template>
  <d-layout :full-parent="false" text-align="center" :class="['footer', hasTopLine ? 'footer-top-line' : '']" >
    <text
       :class="[getBtnStatus(item),'btn', getBtnStyle(btns,idx), idx === btns.length-1 ? 'btn-commit': '']"
       v-for="(item,idx) in btns"
       :key="`btn-item-${idx}`"
       @click="doClickBtn(idx, item)"
    >{{ item }}</text>
  </d-layout>
</template>

<style lang="sass" type="text/scss" scoped>
  .footer {
    @include setPaddingV($normal_gap_bottom);
  }
  .footer-top-line {
    @include setBorderTop();
  }
  .btn {
    width: 480px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 38px;
    border-radius: 4px;
    @include setMarginH($biggest_gap_left);
  }
  .btn-cancel {
    @include setBorder($color_enclosure);
    color: $color_enclosure;
  }

  .btn-save {
    @include setBorder($color_back);
    color: $color_back;
  }
  .btn-stop {
    border-width: 2px;
    border-color: #02B3B4;
    color: #02B3B4;
  }
  .btn-commit {
    background-color: $color_back;
    background-image: linear-gradient(to right, #02B3B4, #1ABC9C);
    color: $color_white;
  }
  .not-btn-opacity{
  		opacity:0.4
  }
  .btn-opacity{
  		opacity:1
  }
</style>

<script>
import { native_eventStatistic } from '@/utils/deal_native';
import Dialog from '@/utils/dialog'

export default {
  props: {
    btns: {
      type: Array,
      default: () => (['终止', '保存', '提交'])
    },
    //不可点击的按钮
    notBtns: {
      type: Array,
      default:()=>[]
    },
    notBtnMsg:{
    		type:String,
    		default:null
    },
    hasTopLine: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      btnClickStatus:false,//按钮点击状态（默认false=未点击；true=点击中）
    }
  },
  methods: {
    getBtnStyle(btns,idx){
      if(this.btnClickStatus){
        return 'btn-cancel';
      }
      return btns[idx] === '业务终止' ? 'btn-stop': btns[idx] === '取消' ?  'btn-cancel' : 'btn-save';
    },
  	getBtnStatus(item){
  			for(var i=0;i<this.notBtns.length;i++){
  				var notBtnItem = this.notBtns[i];
  				if(item === notBtnItem){
  					return "not-btn-opacity";
  				}
  			}
  			return "btn-opacity";
  	},
    doClickBtn(idx, item) {
      for(var i=0;i<this.notBtns.length;i++){
  				var notBtnItem = this.notBtns[i]; 
  				if(item === notBtnItem){
  					Dialog.toast(this.notBtnMsg ? this.notBtnMsg : item+"按钮不可点击")
  					return ;
  				}
  			}
      if(this.btnClickStatus){
        return Dialog.toast("请求中，请勿重复点击！");
      }
      this.$emit('clickBtn', idx, item, this)
    }
  }
}
</script>

