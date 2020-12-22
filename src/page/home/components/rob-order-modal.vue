<template>
    <div>

        <!-- 抢单确认弹窗 -->
        <RobConfirmDialog title="我要抢单" :applyNo="applyNo" :matterKey="matterKey" :show="showRobConfirmDialog" v-if="showRobConfirmDialog"
                    @commit="doRobDoc"
                    @cancel="cancelConfirm"></RobConfirmDialog>

        <!-- 抢单超过50条报警窗口 -->
        <confirm-dlg :title="robWarmingTitle" content="是否继续抢单？" :show="showRobWarmingConfirmDialog"
                     @wxcDialogConfirmBtnClicked="doRobDoc"
                     @wxcDialogCancelBtnClicked="cancelConfirm"></confirm-dlg>

        <ConflitTipDialog v-if="showConflitialog" :orderInfo="order"
                          :conflitOrders="conflitOrders" @commit="closeConflit(true)"
                          @cancel="closeConflit(false)"></ConflitTipDialog>
    </div>
</template>
<script>
  import ConfirmDlg from '@/components/dialog/confirm.vue';
  import ConflitTipDialog from '@/components/dialog/time-conflit';
  import RobConfirmDialog from '@/page/home/modals/rob-confirm-dialog';
  import utils from '@/utils/dialog';
  import {mapActions, mapGetters} from 'vuex';

  export default {
    components: {
      ConflitTipDialog,
      ConfirmDlg,
      RobConfirmDialog
    },
    data() {
      return {
        order: {},
        applyNo: '',
        matterKey: '',
        matterName: '',
        conflitOrders: [],
        showConflitialog: false,
        showRobConfirmDialog: false ,
        robDocConfirmContent: '',
        showRobWarmingConfirmDialog: false,
        robWarmingTitle: '您的在途业务量已达50条'
      };
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      ...mapActions('rob', ['checkRobDocWarming', 'commitRobDoc', 'checkTimeConflit']),
      ...mapActions('transfer', ['getAppointInfo', 'getOrderInfo']),
      //显示超出50个警告弹窗
      showRobDocWarming(status) {
        if (status.over) {
          this.robWarmingTitle = `您的在途业务量已达${status.warnLine || 50}条`;
          this.showRobWarmingConfirmDialog = true; //超出显示警告窗
        } else {
          this.checkTimeConflit({order: this.order, handleUserId: this.userInfo.id}).then(this.showRobDocConflit); //检查是否与其他项目冲突
        }
      },
      //显示时间冲突弹窗
      showRobDocConflit(conflitItems) {
        if (conflitItems && conflitItems.length) {
          this.conflitOrders = conflitItems;
          this.showConflitialog = true;
        } else {
          this.showRobConfirmDialog = true;
        }
      },
      closeConflit(result) {
        this.showConflitialog = false;
        if (result) {
          this.showRobConfirmDialog = true;
        }
      },
      //执行抢单
      doRobDoc() { //抢单
        this.commitRobDoc(this.order).then(result => {
          if (result) {
            utils.toast('抢单成功');
          }
        }); //提交抢单请求
        this.showRobWarmingConfirmDialog = false;
        this.showRobConfirmDialog = false;
      },
      cancelConfirm() {
        this.showRobConfirmDialog = false;
        this.showRobWarmingConfirmDialog = false;
      },

      initModal(applyNo, matterKey, matterName) {
        this.applyNo = applyNo;
        this.matterKey = matterKey;
        this.matterName = matterName;
        return Promise.all([
          this.getOrderInfo(applyNo),
          this.getAppointInfo({applyNo, matterKey})]).then(([orderInfo, appointInfo]) => {
          this.order = {
            applyNo: this.applyNo,
            productName: orderInfo.productName,
            sellerName: orderInfo.sellerName,
            salesUserName: orderInfo.salesUserName,
            matterKey: this.matterKey,
            matterName: this.matterName,
            appointTime: typeof appointInfo.appointTime === 'number' ? appointInfo.appointTime : this.formatDate(appointInfo.appointTime),
            appointAddress: appointInfo.appointAddress,
            appointUserId: this.userInfo.id,
            appointUserName: this.userInfo.fullname,
            remark: appointInfo.remark || ''
          };
          return this.orderInfo;
        });
      },

      showRobModal(applyNo, matterKey, matterName) {
        //this.order = order;
        this.$nextTick(() => {
          this.initModal(applyNo, matterKey, matterName).then(() => {
            this.robDocConfirmContent = `客户 ${this.order.sellerName}  ${this.order.productName}`;
            //检查是否已经超出50条待办
            this.checkRobDocWarming(this.order).then(this.showRobDocWarming);
          });
        });
      }
    }
  }
</script>
