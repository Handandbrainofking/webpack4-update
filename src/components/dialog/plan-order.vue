<!--
  function: 预约信息弹窗
  author: liangcanlun
  update: 2018-05-28
 -->
<template>
  <dialog
     :show="true"
     :definedBtn="true"
     width="1615"     
     top="200"
     class="dialog"
     @wxcDialogConfirmBtnClicked="doBookOrderSure"
     @wxcDialogCancelBtnClicked="doBookOrderCancel">
    <div slot="title" class="title-wrap">
      <text class="order-title">预约信息</text>
    </div>
    <div slot="content">
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="header-item">
            <text class="header-label">客户姓名</text>
            <text class="header-content">{{orderInfo.sellerName}}</text>
          </div>
          <div class="header-item">
            <text class="header-label">产品名称</text>
            <text class="header-content">{{orderInfo.productName}}</text>
          </div>
        </div>
        <list class="plan-info">
          <cell class="plan-field">
            <text class="plan-label">预约节点</text>
            <picker class="plan-content" v-model="orderInfo.matterKey" :searchList="matters" placeHolder="请选择预约节点"></picker>
          </cell>
          <cell class="plan-field-appoint">
            <text class="plan-label">预约时间</text>
            <date-picker class="plan-content-date" v-model="orderInfo.appointDate"  placeHolder="请选择预约日期"></date-picker>
            <text class="date-spliter">-</text>
            <picker class="plan-content-time" v-model="orderInfo.appointTime" :searchList="timeRanges" value="time" placeHolder="请选择预约时间"></picker>
          </cell>
          <cell class="plan-field">
            <text class="plan-label">预约地点</text>
            <input class="plan-content" v-model="orderInfo.appointAddress" placeholder="请输入预约地点" type="text"/>
          </cell>
          <cell class="plan-field-remark">
            <text class="plan-label-remark">备注</text>            
            <textarea rows="5" class="plan-content-remark" v-model="orderInfo.remark" placeholder="请输入备注信息"></textarea>
          </cell>
        </list>
        
      </div>      
      <div class="dialog-footer">
        <text class="btn-cancel" @click="doCancel">取消</text>
        <text class="btn-commit" @click="doCommit">提交</text>
      </div>
    </div>
  </dialog>
</template>

<script>
import Dialog from "@/components/dialog/dialog.vue";
import Picker from "@/components/dropdown/pick.vue";
import DatePicker from "@/components/dropdown/pickdate.vue";
import TimePicker from "@/components/dropdown/picktime.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "dialog-order-book",
  components: {
    Dialog,
    Picker,
    DatePicker,
    TimePicker
  },
  props: {
    orderInfo: {
      type: Object,
      default: {
      }
    }
  },
  data() {
    return {
      item:{
       
      },
      timeRanges:[]
    };
  },
  computed: {
    ...mapState({
      managers: s => s.dict.managers
    })
  },
  created(){
    for(let i = 8;i<=19;i++){ //生成时间节点
      this.timeRanges.push(`${(i>9?'':'0') + i}:00`)
    }
  },
  mounted() {
    this.inputOrderUsers.list = managers;
    
  },
  methods: {
    ...mapActions("transfer", ["transferOrder"]),
    doCancel() {
      this.$emit("cancel");
    },
    doCommit() {
      this.$emit("commit");
    },
    showTextEllipsis(text, size){
        if(text.length>size){
            return text.slice(0, size -1)+'...'
        }
        return text;
    }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../css/common';

  @mixin border($width, $style, $color){
    border-width:$width;
    border-style: $style;
    border-color: $color;
  }

  @mixin border-top($width, $style, $color){
    border-top-width:$width;
    border-top-style: $style;
    border-top-color: $color;
  }

  @mixin border-bottom($width, $style, $color){
    border-bottom-width:$width;
    border-bottom-style: $style;
    border-bottom-color: $color;
  }

  .dialog{
    border-radius: 10px;
  }

  .title-wrap{
    justify-content: center;
    padding-left: 47px;
    height:80px;   
    width:1615px; 
    background-color:#515151;
  }
  .order-title{
    font-size: 36px;
    color: $color_white;
    font-weight: $font_bold;
  }

  .dialog-header{
    flex-direction:row;
    justify-content:space-between;
    border-bottom-width:1px;
    border-bottom-style:solid;
    border-bottom-color:$color_weak;
    padding-left: 43px;
    padding-right: 43px;
  }

  .header-item{
    flex-direction:row;
    justify-content:flex-start;
    padding-bottom: 30px;
  }

  .header-label{
    font-size:28px;
    color:#868686;
    margin-right:30px;
    height: 60px;
  }

  .header-content{
    font-size:28px;
    color:#333333;
    line-height:50px;
  }

  .dialog-content{
    padding: 47px 65px 0px 65px;  
  }

  .plan-info{
    padding-top: 30px;
  }

  .plan-field{
    flex-direction: row;    
    justify-content:flex-start;
    align-items: flex-start;;
    text-align: right;
    height: 90px;
  }

  .plan-field-remark{
    @extend .plan-field;
    height : 282px;
  }

  .plan-field-appoint{
    @extend .plan-field;
  }

  .plan-label{
    font-size: 32px;
    line-height: 60px;
    color:#868686;
    width: 150px;
  }

  .plan-label-remark{
    @extend .plan-label;
    line-height: 32px;
  }

  .plan-content{
    @include border(1px, solid, $color_weak);
    width: 400px;
    height: 60px;
  }

  .plan-content-date{    
    @extend .plan-content;
  }

  .plan-content-time{
   @extend .plan-content;
  }

  .plan-content-remark{
    @extend .plan-content;
    width: 1136px;
    height: 282px;
  }

  .date-spliter{
    width: 80px;
    line-height: 60px;
    text-align:center;    
    vertical-align: middle;
  }

  .dialog-footer{    
    height:140px;
    flex-direction:row;
    flex-direction: row;
    align-items: center;
    justify-content:space-around;
  }

  .btn-cancel, .btn-commit{
    width:$btn_width;
    height:$btn_height;
    border-radius: 8px;
    font-size:$btn_font;
    line-height: $btn_line_height;
    padding: 0 66px;
  }

  .btn-commit{
    background-color: $btn_color;
    color: $color_white;
  }

  .btn-cancel{
    color:$btn_color;
    border-width:1px;
    border-style:solid;
    border-color:$btn_color;    
  }

</style>