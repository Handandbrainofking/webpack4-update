<!--
  文本输入的弹出框
 -->
<template>
  <dialog
     :show="true"
     :definedBtn="true"
     width="1600"
     top="300"
     class="dialog">
    <div slot="title" class="title-wrap">
      <text class="order-title">{{title}}</text>
      <text class="order-title-close" @click="doCancel">×</text>
    </div>
    <div slot="content">
      <div>
            <div class="mark-tip-wrap">
              <text class="mark-tip">{{ remarkLength }}/200</text>
            </div>
            <div class="yxzl">
              <text class="yxzl-text">{{areaTitle}}</text>                
              
              <text v-if="required" style="color:red;margin-top:10px;margin-left:10px;">*</text>
              <textarea class="remark-content" rows="5" :placeholder="'请输入'+areaTitle" maxlength="200" 
              v-model="remark" @input="doInputMark()"></textarea>
            </div>
      </div>
      <div class="dialog-footer">
        <div class="btn-wrap-cancel" @click="doCancel">
          <text class="btn-cancel">取消</text>
        </div>
        <div class="btn-wrap-commit" @click="doCommit">
          <text class="btn-commit">确定</text>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script>
import Dialog from '@/components/dialog/dialog.vue';
import DialogToast from '@/utils/dialog'

export default {
  name: 'dialog-textarea',
  components: {
    Dialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    areaTitle: {
      type: String,
      default: ''
    },
    required:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      remark:'',
      remarkLength:0
    }
  },
  methods: {
    doInputMark() {
      const value = this.remark;
      if(this.remark.length > 200) {
        this.remark = value.substring(0, 200);
      }
      this.remarkLength = this.remark.length;
    },
    doCancel() {
      this.$emit('cancel')
    },
    doCommit() {
      if(this.required && !this.remark){
        DialogToast.toast('请输入必填项');
        return;
      }
      this.$emit('commit',this.remark)
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .title-wrap {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 88px;
    background-image: linear-gradient(to right, #02B3B4, #1ABC9C);
    border-radius: 4px 4px 0 0;
  }
  .order-title {
    font-size: 38px;
    color: $color_white;
    margin-right: 624px;
  }

  .order-title-close {
    color: #ffffff;
    font-size: 60px;
    padding-right: 40px;
    width: 60px;
    height: 60px;
  }

  .header-caption {
    font-size: 34px;
    color: #21363D;
  }

  .dialog-content {
    padding-top: 30px;
    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 30px;
    height: 784px;
  }

  .order-info {
    @include setBorderBottom(#EBEBEB, 1px);
    padding-top: 40px;
    padding-bottom: 62px;
  }

  .conflit-order-info {
    @include setBorderBottom(#EBEBEB, 1px, dashed);
    padding-top: 40px;
    padding-bottom: 62px;
  }

  .conflit-caption {
    padding-top: 47px;
  }

  .dialog-footer {
    @include setBorderTop();
    height: 140px;
    margin-top:160px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  .btn {
    font-size: 38px;
  }

  .btn-wrap-cancel {
    @include setBorder($color_enclosure);
    width: 360px;
    height: 88px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
  }

  .btn-wrap-commit {
    @extend .btn-wrap-cancel;
    background-image: linear-gradient(to right, #02B3B4, #1ABC9C);
    border-color: rgba(2, 179, 180, 0.70);
  }

  .btn-commit {
    @extend .btn;
    color: #ffffff;
  }

  .btn-cancel {
    @extend .btn;
    color: #677475;
  }


.remark-content {
  width: 1200px;
  height: 240px;
  margin-right:40px;
  line-height: 50px;
  padding-top: $normal_gap_left;
  padding-left: $normal_gap_left;
  padding-right: $normal_gap_left;
  padding-bottom: $normal_gap_left;
  margin-left: 10px;
  border-width: $condition-border + px;
  border-color: #CACCCF;
  border-radius: 4px;
  font-size: $font_nav;
}
.mark-tip-wrap {
  margin-top:100px;
  margin-left: 1480px;
  flex-direction: row-reverse;
}
.mark-tip {
  color: #BDC3C7;
  font-size: $font_small;
  margin-bottom: 5px;
  margin-right: 110px;
}
.mask-requirements {
    position: absolute;
    bottom: 0;
    left: 0;
    width:2220px;
    height:400px;
}
.yxzl {
  padding-right: 40px;
  flex-direction: row;
}
.yxzl-width {
  margin-top: 10px;
    width: 260px;
    flex-direction: row;
    text-align: right;
}
.yxzl-text {
  color: #21363d;
  font-size: 34px;
  text-align: right;
  margin-left: 80px;
}

</style>