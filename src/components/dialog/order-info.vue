<!--
  订单信息
 -->
<template>
  <wxc-dialog
     :show="true"
     :definedBtn="true"
     width="1200"
     top="200"
     @wxcDialogConfirmBtnClicked="doBookOrderSure"
     @wxcDialogCancelBtnClicked="doBookOrderCancel">
    <div slot="title" class="book-order-title-wrap">
      <text class="book-order-title">{{ title }}</text>
      
    </div>
    <div slot="content">
      <div class="base-info-wrap">
        <div class="apply-fields" v-for="item in dataItem">
                    <read-info v-bind="fieldProps" :label="item.name" :content="item.value"></read-info>
                    
        </div>
      </div>
      <div class="btn-wrap">
        <text class="btn btn-sure" @click="doBookOrderSure">确定</text>
      </div>
    </div>
  </wxc-dialog>
</template>

<script>
import WxcDialog from "../dialog/dialog.vue";
import { InterviewListKind } from "../../config";
import loginApi from "@/utils/login";
import ReadInfo from '@/page/task/components/common/read_info.vue'


import { mapState, mapActions, mapGetters } from 'vuex'

const labelWidth = 150;
export default {
  name: "dialog-order-book",
  components: {
    WxcDialog,
    ReadInfo
  },
  props: {
    dataItem: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: "详情"
    }
  },
  model: {
  },
  data() {
    return {
     
    };
  },
  created() {
  },
  beforeMount() {
  },
  computed: {
    
  },
  methods: {
   doBookOrderSure(){
   	 this.$emit("closeOrderInfo", false);
   },
   doBookOrderCancel(){
   	 this.$emit("closeOrderInfo", false);
   }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../css/common';

  /** 标题 **/
  .book-order-title-wrap {
    flex-direction: row;
    align-items: center;
    background-color: $color_back;
    justify-content: flex-end;
    height: 88px;
  }
    .book-order-title {
    font-size: $font_head;
    color: $color_white;
    lines: 1;
    width: 1200px;
    text-align: center;
  }

    .base-info-wrap {
	    height: 700px;
	    margin-top: 30px;
	    padding-left: 50px;
	    padding-right: 50px;
	    @include setBorderBottom(#EBEBEB)
	  }
  
  /** 按钮 **/
  .btn {
    width: 360px;
    text-align: center;
    height: 88px;
    line-height: 88px;
    margin-left: 150px;
    margin-right: 150px;
    font-size: $font_head;
  }

  .btn-wrap {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-top: 80px;
    padding-bottom: 80px;
  }

  .btn-cancel {
    @include setBorder($color_enclosure);
    color: $color_enclosure;
    line-height: 84px;
    border-radius: 4px;
  }

  .btn-sure {
    background-color: $color_back;
    color: $color_white;
    border-radius: 4px;
  }


  .btn-choose {
    background-color: $color_back;
    color: $color_white;
    height: 72px;
    line-height: 72px;
    width: 150px;
    text-align: center;
    border-radius: 4px;
    font-size: $font_normal;
    margin-left: 20px;
  }
 
.apply-fields {
  flex-wrap: wrap;
  flex-direction: row;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 90px;
}
</style>