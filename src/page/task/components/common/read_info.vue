<template>
  <div class="read-box" @click="testclick" :style="{ width:width+'px' , height: height || (lines * 40 + 24) + 'px'}" @longpress="copyContent()">
    <d-image v-if="haveYellow" class="icon" src="/image/icon_readonly.png" width="17" height="17"></d-image>
    <text class="label-read" :style="{ 'font-size':size+'px' }">{{ label }}</text>
    <text class="label-colon" :style="{ 'font-size':size+'px' }">:</text>
    <text class="label-space"> </text>   <!-- 用户点位，实现 标签与内容有20像素的距离 -->
    <text class="content" :style="{ 'font-size':size+'px', width:(edit ? contentWidth -188 : contentWidth)+'px', lines:lines, color:color}">{{ content }}</text>
    <div v-if="edit" style="width: 100px;height: 50px;margin-top: 5px;lines: lines;" @click="editClick">
    		<d-image  :style="{ 'font-size':size+'px', 'margin-left': '20px'}" src="/image/edit_icon.png" width="30" height="30" @click="editClick"></d-image>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import {native_common_events,DEFINE_COPY_CONTENT,native_logMessage} from "@/utils/deal_native"
import Dialog from '@/utils/dialog';

export default {
  name: "readInfo", //带入只读信息，最左对其，有黄点
  props: {
  		//是否需要长按进行copy操作
  		haveCopyLongpress:{
  			type: Boolean,
      default: true
  		},
    haveYellow: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ""
    },
    content: {
      type: [String, Number, Boolean],
      default: ""
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: String,
      default: 'auto'
    },
    size: {
      type: Number,
      default: 30
    },
    lines:{
      type: Number,
      default:1
    },
    contentWidth:{
      type: Number,
      default: 580
    },
    edit:{
    		type: Boolean,
    		default:false
    },
    color:{
      type: String,
      default: "#21363D"
    }
  },
  data() {
    return {};
  },
  created() {
  },
  methods: {
  		copyContent(){
  			if(this.haveCopyLongpress){
  				native_logMessage('copy content click....');
	    		native_common_events(DEFINE_COPY_CONTENT,this.label,this.content,function(data){
	    			Dialog.toast(data);
	    		});
  			}
  		},
  		editClick(){
  			if(this.edit){
  				this.$emit('editclick',this.content);
  			}
      },
      testclick(e) {
        this.$emit("clickReadInfo");
      }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../../../components/labelvalue/input';

  .row {
    flex-direction: row;
    align-items: center;
  }

  .icon{
    margin-top: 10px;
    margin-right: 20px;
  }

  .read-box {
    flex-direction: row;
    align-items: flex-start;
    padding-top:12px;
  }

  .label-colon{
    @extend .label-read;
    width: 20px;
    text-align:right;
  }

  .label-space{
    @extend .label-colon;
    width: 20px;
    height: 40px;
  }
</style>
