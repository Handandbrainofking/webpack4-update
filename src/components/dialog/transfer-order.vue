<!--
  function: 转单
  author: liangcanlun
  update: 2018-05-28
 -->
<template>
       <wxc-popup popup-color="#ffffff"
            :show="show"
            @wxcPopupOverlayClicked="doCancel"
            :overlayCfg="{hasAnimation: false}"
            pos="right"
            width="2240">
      <div class="transfer-contain" :style="formStyle">
        <back-head back-title="转单" :beforeBack="doCancel"></back-head>
        <div class="dialog-content" :style="{marginTop:`-${scrollTop}px`}">
          <d-row class="title-row">
            <text class="header-caption">订单信息</text>
          </d-row>
          <d-row class="desc-row">
            <d-col :span="10">
              <text class="spinder"></text>
              <text class="order-label">产品名称:</text>
              <text class="order-text">{{orderInfo.productName}}</text>
            </d-col>
            <d-col :span="8">
              <text class="spinder"></text>
              <text class="order-label">客户姓名:</text>
              <text class="order-text">{{orderInfo.sellerName}}</text>
            </d-col>
            <d-col :span="6">
              <text class="spinder"></text>
              <text class="order-label">渠道经理:</text>
              <text class="order-text">{{orderInfo.salesUserName}}</text>
            </d-col>
          </d-row>
          <d-row class="desc-row">
            <d-col :span="1">
              <text class="spinder"></text>
              <text class="order-label">房产地址：</text>
              <text class="order-address">{{ applyInfoHouseArea }}</text>
            </d-col>
          </d-row>
          <d-row class="splitter"></d-row>
          <d-row class="edit-row">
            <d-col>
              <text class="order-label-required">转出事项</text>
              <text class="required">*</text>
              <pick-view v-if="matterEditable" class="transfer-input" width="520" height="72"
                         :pickTitle="pickLookup"
                         :searchList="mattersLookup"
                         v-model="orderInfo.matterKey" place-holder="请选择转出事项"
                         @doChoosePick="onMatterChanged()"></pick-view>
              <text  v-else class="order-text-matter">{{orderInfo.matterName}}</text>
            </d-col>
          </d-row>
          <d-row class="edit-row">
            <d-col>
              <text class="order-label-title">转入人员</text>
              <pick-group class="transfer-input" width="520" height="72" size='34'
                         pickTitle="转入人员" @showGroupList="showListView" :initValue="initValue"
                         v-model="transferUserId" place-holder="请选择转入人员"></pick-group>
            </d-col>
          </d-row>
          <d-row class="edit-row">
            <d-col>
              <text class="order-label-required">预约时间</text>
              <text class="required">*</text>
              <date-time-picker class="transfer-input" width="420px" height="72px"
                                :datetime="orderInfo.appointTime"
                                @input="orderInfo.appointTime=$event"></date-time-picker>
            </d-col>
          </d-row>
          <d-row class="edit-row">
            <d-col>
              <text class="order-label-required">预约地点</text>
              <text class="required"></text>
              <div v-if="!hasChoose" @click="doOpenHouseArea()">
                <text class="appoint-areaName-text">{{orderInfo.appointAreaName}}</text>
              </div>
              <input type="text" class="transfer-input-addr" v-model="orderInfo.appointAddress"
                     :disabled="orderInfo.matterKey==='Interview'&&orderPlaceList.length">
              <text v-if="orderInfo.matterKey==='Interview'&&orderPlaceList.length" @click="choosePlace"
                    class="btn-choose">选择
              </text>
            </d-col>
          </d-row>
          <d-row class="edit-row-remark">
            <d-col>
                <d-form d-class='remark'
                  v-model="orderInfo.remark" :width="1440"
                  label="备注" :label-width="150" placeholder="请输入备注信息"
                  type="mark" @keyboard="onKeyboard($event, '-450px')"></d-form>
            </d-col>
          </d-row>
          <wxc-popup popup-color="#ffffff"
                     style="left: 6990px"
                     :show="showToDoList"
                     @wxcPopupOverlayClicked="showToDoList=false"
                     pos="right"
                     width="2240">
            <assign-list assignName="transfer" assignTitle="转入人员" :transferUserId="transferUserId" :apply-no="orderInfo.applyNo" :matter-key="orderInfo.matterKey"
            	 @cancel="showToDoList=false" ref="list" @btnActionClick="btnActionClick"></assign-list>
          </wxc-popup>
        </div>
        <footer-button class="footer-button" :btns="bottomBtns" @clickBtn="doClickBottomBtn"></footer-button>
        <picker-list title="预约地点" :options="orderPlaceList" v-if="showPlaceList" @cancel="doCancelPlace"
                     @commit="doSelectPlace($event)"></picker-list>
      </div>
    <ConflitTipDialog v-if="showConflitialog&&show" :order-info="orderInfo" :conflitOrders="conflitOrders"
                      @commit="closeConflit(true)" @cancel="closeConflit(false)"></ConflitTipDialog>
    <task-choose-dialog
       v-if="dialogHouseArea" dialog-title='预约区域' :dialog-top="208" :body-list="dialogList" :head-list="headList"
       @doSureChooseDialog="doSureChooseDialog"
       @doCancelChooseDialog="doCancelChooseDialog"
    ></task-choose-dialog>
  </wxc-popup>
</template>

<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import utils from '@/utils/dialog'
import PickGroup from '@/components/dropdown/pickgroup.vue'
import PickView from '@/components/dropdown/pick.vue'
import DateTimePicker from '@/components/dropdown/pickdatetime'
import OrderInfo from '@/components/order/order-info'
import minxin from '@/mixins/index'
import minxinForm from '@/mixins/form'
import ConflitTipDialog from '@/components/dialog/time-conflit'
import DRow from '@/core/Layout/DRow'
import DCol from '@/core/Layout/DCol'
import AssignList from '@/page/home/views/assign-doc'
import FooterButton from '@/page/task/components/task_footer_button.vue'
import PickerList from '@/components/dropdown/PickerList.vue'
import TaskChooseDialog from '@/page/task/components/common/choose_dialog.vue';
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'dialog-order-book',
  mixins: [minxin, minxinForm],
  components: {
    BackHead,
    PickView,
    PickGroup,
    DateTimePicker,
    OrderInfo,
    DRow,
    DCol,
    AssignList,
    WxcPopup,
    ConflitTipDialog,
    PickerList,
    TaskChooseDialog,
    FooterButton
  },
  props: {
    matterEditable: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    return {
      orderInfo: {
        remark: ''
      },
      show: false,
      transferUserId: '',
      rawUserData: [],
      rawMatters: [],
      conflitOrders: [],
      showConflitialog: false,
      showToDoList: false,
      scrollTop: 0,
      pickLoopup: '转出事项',
      belongCityCode: '',
      orderPlaceList: [],
      showPlaceList: false,
      dialogHouseArea: false,
      initValue: '',
      applyInfoHouseArea: '',
      headList: [
        {
          name: '区域',
          key: 'name'
        },
        {
          name: '城市',
          key: 'cityName'
        },
      ],
     bottomBtns: ['取消', '确定'],
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    mattersLookup() {
      return Array.prototype.map.call(this.rawMatters || [], m => {
        return { name: m.matterName, key: m.matterKey }
      })
    },
    companyUsers() {
      return Array.prototype.map.call(this.rawUserData || [], s => {
        return { name: s.fullname, key: s.userId }
      })
    },
    remarkCount() {
      return this.orderInfo && this.orderInfo.remark ? this.orderInfo.remark.length : 0
    }
  },
  methods: {
    ...mapActions('transfer', ['transferOrder', 'getUndoMatters', 'getAppointInfo', 'getOrderInfo']),
    ...mapActions('rob', ['checkTimeConflit']),
    ...mapActions(['geOperateUserList']),
    doCancel() {
      this.$emit('cancel')
      this.show = false
      this.initValue = this.transferUserId = ''
      this.onDisappear()
    },
    getBranchId() {
      this.requestApi.order_info({
        data: {
          applyNo: this.orderInfo.applyNo,
          relationKey: 'applyOrder'
        },
        success: data => {
          this.belongCityCode = data.applyOrder.branchId;
          this.getOrderPlaceList()
        }
      })
    },
    getOrderPlaceList() {
      this.requestApi.order_place({
        method: 'GET',
        data: 'belongCityCode=' + this.belongCityCode,
        success: data => {
          if (data.length) {
            let tmpList = []
            for (let i in data) {
              tmpList.push(data[i].appointAddress)
            }
            this.orderPlaceList = tmpList;
          }
        }
      })
    },
    choosePlace() {
      this.showPlaceList = true
    },
    doCancelPlace() {
      this.showPlaceList = false
    },
    doSelectPlace(e) {
      this.orderInfo.appointAddress = e
      this.showPlaceList = false
    },
    //显示时间冲突弹窗
    showRobDocConflit(conflitItems) {
      if (conflitItems && conflitItems.length) {
        this.conflitOrders = conflitItems
        this.showConflitialog = true
      } else {
        this.doTransferOrder()
      }
    },
    closeConflit(result) {
      this.showConflitialog = false
      if (result) {
        this.doTransferOrder()
      }
    },
    //执行转单操作
    doTransferOrder() {
      let user = Array.prototype.find.call(this.rawUserData, u => u.userId === this.transferUserId) || ''
      this.transferOrder({ ...this.orderInfo, user: user }).then(result => {
        if (result) {
          utils.toast('转单成功!')
          this.$emit('commit')
          this.$eventHub.$emit('BroadcastTransferOrderSuccess')
          this.show = false
          this.initValue = this.transferUserId = ''
          this.onDisappear()
        }
      })
    },
    btnActionClick(item) {
      this.transferUserId = item.assigneeId
      this.initValue = item.assigneeName
    },
        /** 转单 **/
    doClickBottomBtn(idx, item) {
      switch (item) {
        case '取消':
          this.doCancel()
          break
        case '确定':
          this.doCommit()
          break
        default:
          break
      }
    },
    doCommit() {
      if (!this.orderInfo.matterName) {
        utils.toast('转出事项不能为空！')
        return
      }
      if (!this.orderInfo.appointTime) {
        utils.toast('预约时间不能为空！')
        return
      }
      if (this.orderInfo.appointAddress && this.orderInfo.appointAddress.length > 60) {
        utils.toast('预约地点最大长度不能超过60字！')
        return
      }
      if (this.orderInfo.remark && this.orderInfo.remark.length > 200) {
        utils.toast('备注最大长度不能超过200字！')
        return
      }
      if (this.orderInfo.appointAreaName == '请选择区域') {
        this.orderInfo.appointAreaName = '';
      }
      if(this.transferUserId) {
        this.checkTimeConflit({ order: this.orderInfo, handleUserId: this.transferUserId }).then(this.showRobDocConflit) //检查是否与其他项目冲突
      }else {
        this.doTransferOrder()
      }
    },
    showTextEllipsis(text = '', size = 32) {
      if (text.length > size) {
        return text.slice(0, size - 1) + '...'
      }
      return text
    },
    onMatterChanged() {
      this.updateAppointInfo()
      this.updateMattersDict()
    },
    updateAppointInfo() {
      this.orderInfo.matterName = Array.prototype.find.call(
        this.mattersLookup,
        m => m.key === this.orderInfo.matterKey
      ).name
      this.getAppointInfo({ applyNo: this.orderInfo.applyNo, matterKey: this.orderInfo.matterKey }).then(data => {
        data = data || {}
        this.orderInfo.appointTime =
          typeof data.appointTime === 'number' ? this.formatDate(data.appointTime) : data.appointTime
        this.orderInfo.appointAddress = data.appointAddress
        // this.orderInfo.remark = data.remark;
        this.$set(this.orderInfo, 'remark', data.remark)
      })
    },
    updateMattersDict() {
		  this.geOperateUserList({ matterKey: this.orderInfo.matterKey, applyNo: this.orderInfo.applyNo }).then(data => {
        //更新公司员工信息
        this.rawUserData = data
     }) 
    },
    initViewData() {
      let promises = []

      if (this.matterEditable) {
        promises[0] = this.getUndoMatters(this.orderInfo.applyNo).then(data => {
          //取得当前订单所有未完成节点
          this.rawMatters = data
          //更新预约信息
          if (this.orderInfo.matterKey) {
            this.updateAppointInfo()
            this.updateMattersDict()
          }
        })
      } else {
        this.rawMatters = [{ matterName: this.orderInfo.matterName, matterKey: this.orderInfo.matterKey }]
        this.updateAppointInfo()
        this.updateMattersDict()
      }

      if (!this.orderInfo.productName) {
        promises[promises.length] = this.getOrderInfo(this.orderInfo.applyNo).then(data => {
          //取得订单基本信息
          this.orderInfo.productId = data.productId
          this.orderInfo.productName = data.productName
          this.orderInfo.sellerName = data.sellerName
          this.orderInfo.salesUserId = data.salesUserId
          this.orderInfo.salesUserName = data.salesUserName
        })
      }
      promises[promises.length] =  this.getOrderInfo(this.orderInfo.applyNo).then(data => {
          //取得订单基本信息
          let houseArea = data.houseArea && data.houseArea || ''
          let houseAddress = data.houseAddress && data.houseAddress || ''
          this.applyInfoHouseArea = houseArea + houseAddress
      })
      this.orderInfo.appointAreaName = this.orderInfo.appointAreaName || '请选择区域';
      return promises
    },

    init(order) {
      order = typeof order === 'string' ? { applyNo: order } : order
      this.orderInfo = {
        ...order,
        appointTime: typeof order.appointTime === 'number' ? this.formatDate(order.appointTime) : order.appointTime
      }
      this.handleUserId = this.userInfo.id
      this.handleUserName = this.userInfo.fullname
      this.getBranchId();
      return this.initViewData()
    },
    showModal(order) {
      Promise.all(this.init(order)).then(() => {
        //等待所有信息摄取完成再显示弹窗
        this.show = true
      })
    },
    showListView() {
      this.showToDoList = true
//    this.$refs.list.refreshPage() //刷新
    },
    //打开房产区域
    doOpenHouseArea(title) {
      let that = this;
      this.requestApi.order_info({
        data: {
          applyNo: this.orderInfo.applyNo,
          relationKey: 'applyOrder'
        },
        success: data => {
          let companyCode = data.applyOrder.branchId;
          this.requestApi.company_area_list({
            method: 'GET',
            data: 'companyCode=' + companyCode,
            success: data => {
              that.dialogList = data;
              that.dialogHouseArea = true;
            }
          });
        }
      });
    },
    doSureChooseDialog(e) {
      if (e) {
        this.orderInfo.appointAreaName = e.name;
      }
      this.dialogHouseArea = false;
    },
    doCancelChooseDialog() {
      this.dialogHouseArea = false;
    },
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .modal-wrapper {
    padding: 0;
  }

  .pop-content {
    height: 1700px;
  }
  .dialog {
    border-radius: 10px;
  }

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
    margin-right: 662px;
  }

  .order-title-close {
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100px;
    height: 88px;
  }

  .order-title-close:active {
    transition: background-color 0.2s;
    background-color: #02B3B4;
  }

  .order-title-text {
    color: #ffffff;
    font-size: 75px;
    font-weight: 100;
  }

  .dialog-content {
    flex-direction: column;
  }

  .header-caption {
    color: #21363D;
    font-size: 38px;
  }

  .splitter {
    margin: 36px 40px 20px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #EBEBEB;
    width: 2200px;
  }

  .desc-row {
    align-items: center;
    height: 50px;
    margin-bottom: 24px;
    padding: 0 40px;
  }

  .title-row {
    height: 104px;
    align-items: center;
    justify-content: flex-start;
    padding: 0 40px;
  }

  .edit-row {
    padding: 34px 78px 0 78px;
  }
  .edit-row-remark {
    padding: 0px 78px 34px 60px;
  }
  .order-label {
    font-size: 30px;
    color: #677475;
    width: 150px;
  }

  .order-label-required {
    font-size: 34px;
  }
  .order-label-title {
    font-size: 34px;
    width: 167px;
  }
  .order-label-mark {
    @extend .order-label-title;
    align-self: flex-start;
    padding-left: 70px;
  }

  .order-text {
    font-size: 30px;
    color: #21363D;
    lines: 1;
    width: 420px;
  }
  .order-address {
    font-size: 30px;
    color: #21363D;
  }

  .order-text-matter {
    @extend .order-text;
    color: #FF9F43;
    padding-left: 10px;
    height: 72px;
    line-height: 72px;
    font-weight: 500;
    font-size: 34px;
  }

  .spinder {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background-color: #FECA57;
    margin-right: 20.5px;
    transform: rotate(45deg);
  }

  .transfer-input {
    border-width: 2px;
    border-style: solid;
    border-color: #CACCCF;
    width: 520px;
    height: 72px;
    lint-height: 72px;
    font-size: 34px;
  }

  .transfer-input-addr {
    @extend .transfer-input;
    padding: 0 15px;
  }

  .remark-input {
    @extend .transfer-input;
    height: 200px;
    width: 1241px;
  }

  .dialog-footer {
    // border-top-style: solid;
    // border-top-color: $color_weak;
    // border-top-width: 2px;
    height: 128px;

    // flex-direction: row;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    box-shadow: 0 -2px 0 0 #D9D9D9;
  }

  .btn {
    font-size: 38px;
  }

  .btn-wrap {
    border-width: 2px;
    border-style: solid;
    width: 360px;
    height: 88px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    border-color: #677475;
  }

  .btn-wrap-commit {
    @extend .btn-wrap;
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

  .todo-detail {
    font-size: 34px;
    color: #02b3b4;
    line-height: 72px;
    text-decoration: underline;
  }

  .remark-counter {
    justify-content: flex-end;
    padding-right: 770px;
  }

  .remark-counter-text {
    font-size: 34px;
    color: #02b3b4;
  }

  .required {
    color: red;
    width: 30px;
    font-size: 34px;
    line-height: 45px;
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

  .appoint-areaName-text {
    width: 200px;
    height: 72px;
    font-size: 34px;
    text-align: center;
    padding-top: 12px;
    color: #FFFFFF;
    background-color: $color_back;
    border-radius: 4px;
    margin-right: 20px;
  }
  .transfer-contain {
    height: 1600px;
  }
  .footer-button {
    position: absolute;
    width: 2260px;
    top: 1475px;
    height: 125px;
  }
</style>