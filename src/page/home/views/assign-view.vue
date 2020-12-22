<template>
    <!-- 派单表单 -->
    <assign-form :order-info="orderInfo" :apply-no="applyNo" v-if="show"
                 @cancel="$emit('update:show',false)"
                 @commit="$emit('update:show',false)" ref="form"></assign-form>
</template>
<script>
import WxcPopup from '@/components/wxc/popup.vue'
import AssignForm from '@/page/home/views/assign-form'
import minxin from '@/mixins/index'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [minxin],
  components: {
    WxcPopup,
    AssignForm
  },
  data() {
    return {
      applyNo: '',
      matterKey: '',
      matterName: '',
      orderInfo: {}
    }
  },
  beforeDestroy() {
    this.clear();
  },
  computed: {
//	  ...mapActions(['geOperateUserList']),
  		...mapGetters(['userInfo','geOperateUserList'])
  },
  props: {
    applyNo: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions('transfer', ['getAppointInfo', 'getOrderInfo']),
    ...mapActions('assign', ['clear']),
    _getAppointInfo(applyNo, matterKey) {
      if (!matterKey) {
        return Promise.resolve({});
      } else {
        return this.getAppointInfo({ applyNo, matterKey });
      }
    },
    //初始化订单信息
    initOrderInfo() {
      return Promise.all([
        this.getOrderInfo(this.applyNo),
        this._getAppointInfo(this.applyNo, this.matterKey)]).then(([orderInfo, appointInfo]) => {
        let houseArea = orderInfo.houseArea && orderInfo.houseArea || ''
        let houseAddress = orderInfo.houseAddress && orderInfo.houseAddress || ''
        let applyInfoHouseArea = houseArea + houseAddress
        this.orderInfo = {
          applyNo: this.applyNo,
          productName: orderInfo.productName,
          sellerName: orderInfo.sellerName,
          salesUserName: orderInfo.salesUserName,
          matterKey: this.matterKey,
          matterName: this.matterName,
          appointTime: this.formatDate(appointInfo.appointTime),
          appointAddress: appointInfo.appointAddress,
          appointUserId: this.userInfo.id,
          appointUserName: this.userInfo.fullname,
          remark: appointInfo.remark || '',
          applyInfoHouseArea: applyInfoHouseArea
        };
        return this.orderInfo;
      });
    },
    //显示并初始化派单页面
    showForm() {
      this.initView(this.applyNo, this.matterKey, this.matterName);
    },
    initView(applyNo, matterKey, matterName) {
      this.applyNo = applyNo;
      this.matterKey = matterKey;
      this.matterName = matterName;
      this.initOrderInfo().then((order) => {
        this.$refs.form.initPanel(order);
      });
    }
  }
}
</script>
