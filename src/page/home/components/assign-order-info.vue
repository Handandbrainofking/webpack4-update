<!--
  function: 用于显示时间冲突弹窗的订单信息
  author: liangcanlun
  update: 2018-05-28
 -->
<template>
    <list class="order-info">
        <cell class="field-group-1">
            <text class="spinder"></text>
            <text class="label">产品名称:</text>
            <text class="content-col-1">{{order.productName}}</text>
            <text class="spinder"></text>
            <text class="label">客户姓名:</text>
            <text class="content-col-2">{{order.sellerName}}</text>
            <text class="spinder"></text>
            <text class="label">渠道经理:</text>
            <text class="content-col-3">{{order.salesUserName}}</text>
        </cell>
        <cell class="field-group-1">
            <text class="spinder"></text>
            <text class="label">房产地址:</text>
            <text class="content-col-4">{{order.applyInfoHouseArea}}</text>
        </cell>
        
    </list>
</template>

<script>
// TODO 多余引入
  import minxin from '@/mixins/index'

  export default {
    name: "order-info",
    mixins: [minxin],
    props: {
      order: {
        type: Object,
        default: {}
      }
    },
    methods:{
      showTextEllipsis(text = '', size = 100){
        if(text.length>size){
          return text.slice(0, size -1)+'...'
        }
        return text;
      }
    }
  };
</script>

<style lang="sass" type="text/scss" scoped>
    @import '../../../css/common';
    .order-info{
        padding: 0;
        justify-content:flex-start;
        align-content:flex-start;
    }

    .field-group{
        flex-direction:row;
        justify-content:flex-start;
        align-items: center;
        flex-wrap:nowrap;
    }

    .field-group-1{
        @extend .field-group;
        padding-bottom: 30px;
    }

    .field-group-2{
        @extend .field-group;
    }

    .field{
        flex-direction: row;
    }

    .label{
        font-size: 30px;
        line-height: 45px;
        color:#677475;
        width: 150px;
    }

    .content{
        font-size: 30px;
        line-height: 45px;
        color: #21363D;
        white-space: nowrap;
    }

    .spinder{
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background-color: #FECA57;
        margin-right: 20.5px;
        transform: rotate(45deg);
    }

    .content-col-1{
        @extend .content;
        width: 520px;
    }
    .content-col-2{
        @extend .content;
        width: 520px;
    }
    .content-col-3{
        @extend .content;
        width: 410px;
    }
    .content-col-4{
        @extend .content;
    }

</style>
