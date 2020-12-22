<!--
	作者：jun-rong@tom.com
	时间：2018-11-22
	描述：派单弹出框
-->
<template>

    <wxc-popup
     popup-color="#ffffff"
     :show="true"
     pos="right"
     width="2240"
     @wxcPopupOverlayClicked="goBack"
     :overlay-cfg="{hasAnimation: false}"
     :can-auto-close="true"
  >
        <back-head  back-title="派单" :beforeBack="goBack"  :style="formStyle"></back-head>
        <div class="order-info"  :style="formStyle">
            <text class="order-title">订单信息</text>
            <order-info :order="orderInfo"></order-info>
        </div>
        <div class="content"  :style="formStyle">
            <div class="content-row">
                <text class="label unrequired">派单任务</text>
                <pick-view class="user-picker" place-holder="请选择派单任务" :pickTitle="pickMatterkey" :searchList="mattersLookup" width="520px" :index="selectedMatterIndex"
                           height="72px"
                           v-model="model.matterKey"  @doChoosePick="onMatterChanged()"></pick-view>
            </div>
            <div class="content-row">
                <text class="label">指派人员</text>
                <text class="title-mark">*</text>
                <pick-group class="user-picker" :initValue="model.appointUserName"
                        pickTitle="指派人员" @showGroupList="showToDoList"
                        place-holder="请选择指派人员"></pick-group>
            </div>
            <div class="content-row">
                <text class="label">预约时间</text>
                <text class="title-mark">*</text>
                <date-time-picker class="user-picker" width="520" height="72px"
                                  :datetime="model.appointTime"
                                  @input="model.appointTime=$event"></date-time-picker>
            </div>
            <div class="content-row-address">
                <text class="label unrequired">预约地点</text>
                <div v-if="!(model.matterKey==='Interview'&&orderPlaceList.length)" @click="doOpenHouseArea()">
                    <text class="appoint-areaName-text">{{model.appointAreaName}}</text>
                </div>
                <input class="user-picker" v-model="model.appointAddress" @focus="scrollTop=200" @blur="scrollTop=0" :disabled="model.matterKey==='Interview'&&orderPlaceList.length">
                <text v-if="model.matterKey==='Interview'&&orderPlaceList.length" @click="choosePlace" class="btn-choose">选择</text>
            </div>
            <div class="counter-wrap">
              <d-form d-class='remark'
                v-model="model.remark" :width="1440"
                label="备注" :label-width="150" placeholder="请输入备注信息"
                type="mark" @keyboard="onKeyboard($event, '-400px')"></d-form>
            </div>
        </div>
        <footer-button class="footer-button" :btns="bottomBtns" @clickBtn="doClickBottomBtn"></footer-button>
        <picker-list title="预约地点" :options="orderPlaceList" v-if="showPlaceList" @cancel="doCancelPlace" @commit="doSelectPlace($event)"></picker-list>
        <ConflitTipDialog v-if="showConflitialog" :orderInfo="orderInfo" :conflitOrders="conflitOrders"
                          @commit="closeConflit(true)" @cancel="closeConflit(false)"></ConflitTipDialog>
        <task-choose-dialog
	       v-if="dialogHouseArea" dialog-title='预约区域' :dialog-top="208" :body-list="dialogList" :head-list="headList"
	       @doSureChooseDialog="doSureChooseDialog"
	       @doCancelChooseDialog="doCancelChooseDialog"
	    ></task-choose-dialog>
          <wxc-popup popup-color="#ffffff"
                     style="left: 6990px"
                     :show="isHanduserShow"
                     @wxcPopupOverlayClicked="showToDoList=false"
                     pos="right"
                     width="2240">
            <assign-list assignName="assign" assignTitle="转入人员" :transferUserId="model.appointUserId" :apply-no="orderInfo.applyNo"
            	 @cancel="isHanduserShow=false" ref="list" @btnActionClick="setHanduerId"></assign-list>
          </wxc-popup>
    </wxc-popup>
</template>

<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import AssignList from '@/page/home/views/assign-doc'
import PickView from '@/components/dropdown/pick.vue'
import PickGroup from '@/components/dropdown/pickgroup.vue'
import DateTimePicker from '@/components/dropdown/pickdatetime'
import OrderInfo from '../components/assign-order-info'
import utils from '@/utils/dialog'
import ConflitTipDialog from '@/components/dialog/time-conflit'
import DRow from '@/core/Layout/DRow'
import DCol from '@/core/Layout/DCol'
import minxin from '@/mixins/index'
import minxinForm from '@/mixins/form'
// TODO 多余引入，没有使用
import { mapState, mapActions } from 'vuex'
import PickerList from '@/components/dropdown/PickerList.vue'
import TaskChooseDialog from '@/page/task/components/common/choose_dialog.vue';
import FooterButton from '@/page/task/components/task_footer_button.vue'


export default {
  mixins: [minxin, minxinForm],
  name: 'assign-form',
  data() {
    return {
      orderInfo: {},
      conflitOrders: [],
      isHanduserShow: false,
      showConflitialog: false,
      showRobConfirmDialog: false,
      rawUserData: [],
      rawMatters: [],
      selectedMatterIndex: -1,
      scrollTop: 0,
      dialogHouseArea:false,
      appointAreaNameDefaultValue: '请选择区域',
      model: {
      	appointAreaName:'请选择区域',
        appointAddress: '',
        appointTime: '',
        remark: '',
        appointUserId: '',
        appointUserName: '',
        matterKey: '',
        matterName: ''
      },
      pickMatterkey: '派单任务',
      pickAppointuser: '指派人员',
      belongCityCode: '',
      orderPlaceList: [],
      showPlaceList: false,
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
  props: {
    applyNo: {
      type: String,
      default: ''
    }
  },
  computed: {
    mattersLookup() {
      return Array.prototype.map.call(this.rawMatters || [], m => {
        return { name: m.matterName, key: m.matterKey }
      })
    }
  },
  components: {
    WxcPopup,
    BackHead,
    PickView,
    PickGroup,
    OrderInfo,
    AssignList,
    ConflitTipDialog,
    DateTimePicker,
    DRow,
    DCol,
    PickerList,
    TaskChooseDialog,
    FooterButton
  },
  methods: {
  	...mapActions(['geOperateUserList']),
    ...mapActions('transfer', ['getUndoMatters', 'getAppointInfo']),
    ...mapActions('assign', ['assignOrder', 'getOrderInfo']),
    ...mapActions('rob', ['checkTimeConflit', 'removeDisplay']),
    // 派单
    doClickBottomBtn(idx, item) {
      switch (item) {
        case '取消':
          this.goBack()
          break
        case '确定':
          this.doAssign()
          break
        default:
          break
      }
    },
    goBack() {
      this.$emit('cancel')
      this.onDisappear()
    },
    //取得订单信息
    getApplyInfo(applyNo) {

      return new Promise (resolve => {
        this.requestApi.order_detail({
        method: 'GET',
        data: 'applyNo=' + applyNo,
        success: data => {
          let houseArea = data.houseArea && data.houseArea || ''
          let houseAddress = data.houseAddress && data.houseAddress || ''
          resolve(houseArea + houseAddress)
        }
      })
     }
    )},
    getBranchId() {
      this.requestApi.order_info({
        data: {
          applyNo: this.orderInfo.applyNo,
          relationKey: 'applyOrder'
        },
        success: data => {
          this.belongCityCode = data.applyOrder.branchId
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
            this.orderPlaceList = tmpList
          }
        }
      })
    },
    choosePlace() {
      this.showPlaceList = true
    },
    //选择区域
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
    closePopupHandle() {
      this.isHanduserShow = false
      },
    setHanduerId(item) {
      this.model.appointUserName = item.assigneeName
      this.model.appointUserId = item.assigneeId
    },
    doSureChooseDialog(e) {
      if (e) {
      	this.model.appointAreaName = e.name;
      }
      this.dialogHouseArea = false;
    },
    doCancelChooseDialog() {
      this.dialogHouseArea = false;
    },
    doCancelPlace() {
      this.showPlaceList = false
    },
    doSelectPlace(e) {
      this.model.appointAddress = e
      this.showPlaceList = false
    },
    //显示时间冲突弹窗
    showRobDocConflit(conflitItems) {
      if (conflitItems && conflitItems.length) {
        this.conflitOrders = conflitItems
        this.showConflitialog = true
      } else {
        this.commitAssignOrder()
      }
    },

    //关闭冲突提示，执行派单动作
    closeConflit(result) {
      this.showConflitialog = false
      if (result) {
        this.commitAssignOrder()
      }
    },

    /**
     * 执行派单请求
     */
    commitAssignOrder() {
      this.assignOrder({ ...this.orderInfo, ...this.model }).then(() => {
        utils.toast('派单成功!')
        this.$emit('commit')
        this.removeDisplay(this.orderInfo.applyNo)
      })
    },
    assert(val, tip) {
      if (!val) {
        throw new Error(tip)
      }
    },

    /*
      派单BUTTON被点击
      * */
    doAssign() {
      try {
        this.model.appointAddress = this.model.appointAddress || ''
        this.model.remark = this.model.remark || ''
        this.assert(this.model.matterKey, '派单任务不能为空！')
        this.assert(this.model.appointUserId, '指派人员不能为空！')
        this.assert(this.model.appointTime, '预约时间不能为空！')
        this.assert(this.model.appointAddress.length <= 60, '预约地点长度不能超过100个字！')
        // this.assert(this.model.appointAddress, "预约地点不能为空！");
        this.assert(this.model.remark.length <= 200, '备注长度不能超过200个字！')
      } catch (e) {
        utils.toast(e.message)
        return
      }
      let order = {
        applyNo: this.orderInfo.applyNo,
        matterKey: this.model.matterKey,
        matterName: this.model.matterName,
        handleUserId: this.model.appointUserId,
        appointTime: this.model.appointTime,
        appointAddress: this.model.appointAddress,
        appointAreaName:this.model.appointAreaName === this.appointAreaNameDefaultValue ? '' : this.model.appointAreaName,
        remark: this.model.remark || ''
      }
      this.checkTimeConflit({
        order,
        handleUserId: this.model.appointUserId
      }).then(this.showRobDocConflit) //检查是否与其他项目冲突
    },
    onMatterChanged() {
      this.updateAppointInfo()
      this.updateMattersDict()
    },
    updateAppointInfo() {
      let matterName = (Array.prototype.find.call(this.mattersLookup, m => m.key === this.model.matterKey) || {}).name
      this.$set(this.model, 'matterName', matterName)
      this.getBranchId();
      this.getAppointInfo({
        applyNo: this.orderInfo.applyNo,
        matterKey: this.model.matterKey
      }).then(data => {
        data = data || {}
        let appointTime = typeof data.appointTime === 'number' ? this.formatDate(data.appointTime) : data.appointTime
        let appointAddress = data.appointAddress
        let remark = data.remark || ''
        this.$set(this.model, 'appointUserId', data.appointUserId || '')
        this.$emit('setAppointUserId', data.appointUserId || '')
        this.$set(this.model, 'appointUserName', data.appointUserName || '')
        this.$set(this.model, 'appointTime', appointTime)
        this.$set(this.model, 'appointAddress', appointAddress)
        this.$set(this.model, 'appointAreaName', data.appointAreaName || this.appointAreaNameDefaultValue)
        this.$set(this.model, 'remark', remark)
      })
    },
    showToDoList() {
      this.isHanduserShow = true
    },
    updateMattersDict(applyNo) {
      this.geOperateUserList({ applyNo: applyNo }).then(data => {
        //更新公司员工信息
        this.rawUserData = data;
      })

    },
    initPanel(orderInfo) {
      let appointTime =
        typeof orderInfo.appointTime === 'number' ? this.formatDate(orderInfo.appointTime) : orderInfo.appointTime
      this.orderInfo = orderInfo
      this.$set(this.model, 'appointUserId', orderInfo.appointUserId)
      this.$set(this.model, 'appointUserName', orderInfo.appointUserName)
      this.$set(this.model, 'appointTime', appointTime)
      this.$set(this.model, 'appointAddress', orderInfo.appointAddress)
      this.$set(this.model, 'appointAreaName', orderInfo.appointAreaName || this.appointAreaNameDefaultValue)
      this.$set(this.model, 'matterKey', orderInfo.matterKey)
      this.$set(this.model, 'matterName', orderInfo.matterName)
      this.$set(this.model, 'remark', orderInfo.remark)

      this.getUndoMatters(orderInfo.applyNo).then(data => {
        this.selectedMatterIndex = data.findIndex(x => x.matterKey === orderInfo.matterKey)
        //取得当前订单所有未完成节点
        this.rawMatters = data
        //更新预约信息
        if (this.model.matterKey) {
          // this.updateAppointInfo()
          this.updateMattersDict(orderInfo.applyNo)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.pop-content {
  height: 1700px;
}
.column {
  flex-direction: column;
  flex: 1;
  align-items: flex-start;
  position: relative;
}
.unrequired {
  margin-right: 14px;
}
.unrequired-mark {
  margin-right: 33px;
}
.order-info {
  padding-left: 60px;
  padding-top: 30px;
  padding-bottom: 29px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #ebebeb;
}

.order-title {
  color: #21363d;
  font-size: 38px;
  // padding-top: 40px;
  padding-bottom: 40px;
}

.content {
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 60px;
  margin-top: 60px;
}

.content-row {
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 24px;
  position: relative;
}

.content-row-address {
  @extend .content-row;
  margin-bottom: 20px;
}

.label {
  line-height: 74px;
  font-size: 34px;
  color: #21363d;
  text-align: right;

  width: 174px;
}

.user-picker {
  width: 520px;
  height: 72px;
  border-width: 2px;
  border-style: solid;
  border-color: #cacccf;
  padding-left: 20px;
  margin-left: 20px;
}

.todo-detail {
  font-size: 30px;
  color: #02b3b4;
  line-height: 72px;
  text-decoration: underline;
}

.counter-wrap {
  margin-left: 25px;
}

.counter {
  font-size: 26px;
  color: #02b3b4;
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
.select-area{
  line-height: 74px;
  font-size: 34px;
  color: rgb(33, 54, 61);
  text-align: center;
  width: 170px;
  margin-right: 15px;
  margin-top: 15px;
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
  margin-left: 20px;
}
.title-mark {
    color: red;
    font-size: 34px;
    line-height: 72px;
  }
.remark {
  margin-left: 25px;
}
.footer-button {
  position: absolute;
  width: 2260px;
  top: 1475px;
  height: 125px;
}
</style>
