<template>
  <dialog :show="show" :definedBtn="true" width="1260" top="491" class="dialog">
    <div slot="title" class="title-bar">
      <text class="title-text">收单</text>
      <div @click="doCancel" class="order-title-close">
        <text class="order-title-text">×</text>
      </div>
    </div>
    <div slot="content">
      <div class="dialog-content">
        <read-info :width="491" :contentWidth="300" label="客户姓名" :content="orderInfo.sellerName || orderInfo.buyerName"></read-info>
        <read-info :width="635" :contentWidth="450" label="产品名称" :content="orderInfo.productName"></read-info>
        <read-info :width="491" :contentWidth="300" label="预约时间" :content="appointInfo.appointTime|date('YYYY-MM-DD hh:mm')"></read-info>
        <read-info :width="635" :contentWidth="450" label="预约节点" :content="appointInfo.matterName"></read-info>
        <read-info :width="635" :contentWidth="950" label="预约地点" :content="appointInfo.appointAddress"></read-info>
        <read-info :width="1062" :contentWidth="950" :lines="2" label="备注信息" :content="appointInfo.remark||'-'"></read-info>
      </div>
      <div class="dialog-footer">
        <div class="btn-cancel" @click="doCancel">
          <text class="btn-cancel-text">取消</text>
        </div>
        <div class="btn-commit" @click="doCommit">
          <text class="btn-commit-text">确定</text>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script>
import Dialog from '@/components/dialog/dialog.vue'
import AppointInfo from '@/components/order/appoint-info.vue'
import ReadInfo from '@/page/task/components/common/read_info'
import { mapActions } from 'vuex'

export default {
  name: 'dialog-order-conflit',
  data() {
    return {
      orderInfo: {},
      appointInfo: {}
    }
  },
  components: {
    Dialog,
    AppointInfo,
    ReadInfo
  },
  computed: {
    readProps() {
      return {
        width: 600,
        contentWidth: 450
      }
    }
  },
  props: {
    //当前预约订单信息
    applyNo: {
      type: String,
      default: ''
    },
    matterKey: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.initViewData()
  },
  methods: {
    ...mapActions('order', ['getOrderInfo', 'getAppointInfo']),
    doCancel() {
      this.$emit('cancel')
    },
    doCommit() {
      this.$emit('commit')
    },
    initViewData() {
      this.getAppointInfo({
        applyNo: this.applyNo,
        matterKey: this.matterKey
      }).then(data => {
        this.appointInfo = data
      })
      this.getOrderInfo(this.applyNo).then(data => {
        this.orderInfo = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../css/common';

    @mixin border-bottom($width, $style, $color) {
        border-bottom-width: $width;
        border-bottom-style: $style;
        border-bottom-color: $color;
    }

    .title-bar {
        flex-direction: row;
        align-items: center;
        height: 88px;
        background-image: linear-gradient(to right,#02B3B4,#1ABC9C);
        border-radius: 4px 4px 0 0;
    }

    .title-text {
        font-size: 38px;
        color: $color_white;
        width:1260px;
        text-align:center;
    }

    .order-title-close {
        align-items: center;
        justify-content: center;
        flex-direction:row;
        width: 100px;
        margin-left:-100px;
        height: 88px;
    }
    .order-title-text {
        color: #ffffff;
        font-size: 75px;
        font-weight: 100;
    }

    .dialog-content {
        padding-top: 100px;
        padding-bottom: 100px;
        padding-left: 100px;
        flex-direction:row;
        flex-wrap: wrap;
        align-items:center;
        justify-content: flex-start;
    }


    .dialog-footer {
        border-top-style: solid;
        border-top-color: $color_weak;
        border-top-width: 2px;

        height: 140px;
        flex-direction: row;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }

    .btn-cancel{
        border-width: 2px;
        border-style: solid;
        border-color: #677475;

        width: 360px;
        height: 88px;
        border-radius: 8px;
        align-items: center;
        justify-content: center;
    }

    .btn-commit{
        @extend .btn-cancel;
        background-image: linear-gradient(to right,#02B3B4,#1ABC9C);
        border-color: rgba(2, 179, 180, 0.70);
    }

    .btn-commit-text {
         font-size: 38px;
        color: #ffffff;
    }

    .btn-cancel-text {
         font-size: 38px;
        color: #677475;

    }

</style>
