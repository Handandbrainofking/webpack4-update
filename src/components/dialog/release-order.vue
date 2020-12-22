<!--
  function: 释放
  author: wq
  update: 2018-05-18
 -->
<template>
  <wxc-popup popup-color="#ffffff" :show="true" @wxcPopupOverlayClicked="doBookOrderCancel" :overlayCfg="{hasAnimation: false}"
    pos="right" width="2240">
    <div class="release-order" :style="formStyle">
      <back-head back-title="释放订单" :beforeBack="doBookOrderCancel"></back-head>
      <d-row class="title-row">
        <text class="header-caption">订单信息</text>
      </d-row>
      <d-row class="desc-row">
        <d-col :span="0.52">
          <d-image class="gap-right" src="/image/icon_readonly.png" width="17" height="17"></d-image>
          <text class="label">客户姓名：</text>
          <text class="value">{{ dataItem.sellerName }}</text>
        </d-col>
        <d-col :span="1">
          <d-image class="gap-right" src="/image/icon_readonly.png" width="17" height="17"></d-image>
          <text class="label">产品名称：</text>
          <text class="value">{{ dataItem.productName }}</text>
        </d-col>
      </d-row>
      <d-row class="desc-row desc-bottom">
        <d-col :span="1">
          <d-image class="gap-right" src="/image/icon_readonly.png" width="17" height="17"></d-image>
          <text class="label">房产地址：</text>
          <text class="value">{{ applyInfoHouseArea }}</text>
        </d-col>
      </d-row>
      <d-row class="splitter"></d-row>
      <scroller class="input-wrap release-button">
        <d-form v-model="info.fieldFinished.value" type="select" :index="info.fieldFinished.index"
          label="外勤完结" :label-width="labelWidth" productType="4" :list="info.fieldFinished.list" @closeBoard="closeBoard"
          @input="changeValue(info.fieldFinished.value)"></d-form>
        <d-form v-model="info.nodeId.value" type="pick" :readonly="hasFinished" :label="info.nodeId.label" :label-width="labelWidth"
          :placeholder="info.nodeId.placeholder" :required="true" :list="info.nodeId.list" @input="doChangeNodeSelect"
          @closeBoard="closeBoard"></d-form>
        <d-form :readonly="hasFinished" v-if="otherShow" label="其他事项" :label-width="labelWidth" v-model="otherValue" :required="true" maxlength="30"></d-form>
        <d-form :readonly="hasFinished" label="接收人员" :label-width="labelWidth" placeholder="请选择接收人员"
          :required="info.transferUserId.required">
          <pick-group class="transfer-input" width="520" height="72" size="34" @showGroupList="showListView" pickTitle="接收人员"
            :initValue="initValue" v-model="transferUserId" place-holder="请选择接收人员"></pick-group>
        </d-form>

        <d-form :readonly="hasFinished" v-model="info.datetime.value" label="预约时间" :label-width="labelWidth"
          placeholder="请选择预约时间" type="datetime" :required="info.datetime.required"></d-form>

        <div class="content-row-address" v-if="!isChooseAddress">
          <text class="mark-title" :class="[hasFinished? 'hasFinished-gray': 'hasFinished-common']">预约地点</text>
          <text class="title-mark" v-if="info.address.required">*</text>
          <div @click="doOpenHouseArea()">
            <text class="appoint-areaName-text">{{info.appointAreaName}}</text>
          </div>
          <input :disabled="hasFinished" class="user-picker" v-model="info.address.value" placeholder="请输入预约地点"
            @closeBoard="closeBoard" @input="addressChange">
        </div>
        <d-form :readonly="hasFinished" v-else v-model="info.address.value" type="pick" :maxlength="info.address.maxlength"
          label="预约地点" :label-width="labelWidth" placeholder="请选择预约地点" :required="info.address.required" :list="info.address.list"
          @closeBoard="closeBoard" @input="addressChange" @keyboard="onKeyboard($event, '-450px')">
        </d-form>

        <d-form :readonly="hasFinished" v-model="info.mark.value" :width="1440" label="备注" :label-width="labelWidth"
          placeholder="请输入备注信息" type="mark" @keyboard="onKeyboard($event, '-450px')"></d-form>

        <wxc-popup popup-color="#ffffff" style="left: 6990px" :show="showToDoList" @wxcPopupOverlayClicked="showToDoList=false"
          pos="right" width="2240">
          <assign-list assignName='release' assignTitle="接收人员" :transferUserId="transferUserId" :apply-no="dataItem.applyNo"
            :matter-key="dataItem.matterKey" @cancel="showToDoList=false" @btnActionClick="btnActionClick" ref="list"></assign-list>
        </wxc-popup>
      </scroller>
      <footer-button class="footer-button" :btns="bottomBtns" @clickBtn="doClickBottomBtn"></footer-button>
      <task-choose-dialog v-if="dialogHouseArea" dialog-title='预约区域' :dialog-top="208" :body-list="dialogList"
        :head-list="headList" @doSureChooseDialog="doSureChooseDialog" @doCancelChooseDialog="doCancelChooseDialog"></task-choose-dialog>
      <confirm-dlg :title="showMoreTitle" :content="showMoreContent" :show="isShowMore" @wxcDialogConfirmBtnClicked="isShowMore=false,isAgreed=true"
        @wxcDialogCancelBtnClicked="isShowMore=false"></confirm-dlg>
    </div>
  </wxc-popup>
</template>

<script>
import minxinForm from '@/mixins/form'
import BackHead from '@/components/back/head.vue'
import FooterButton from '@/page/task/components/task_footer_button.vue'
import PickGroup from '@/components/dropdown/pickgroup.vue'
import Dialog from '@/utils/dialog'
import ConflitTipDialog from '@/components/dialog/time-conflit'
import ConfirmDlg from '@/components/dialog/confirm.vue'
import WxcPopup from '@/components/wxc/popup.vue'
import AssignList from '@/page/home/views/assign-doc'
import OrderInfo from '@/components/order/order-info'
import DRow from '@/core/Layout/DRow'
import DCol from '@/core/Layout/DCol'
import { InterviewListKind } from '../../config'
import { ConfirmType } from '@/config'
import loginApi from '@/utils/login'
import TaskChooseDialog from '@/page/task/components/common/choose_dialog.vue'
import { mapActions } from 'vuex'
import { DEFINE_HIDDEN_KEYBORAD, native_common_events } from '@/utils/deal_native'

const labelWidth = 150
export default {
  name: 'dialog-release-order',
  mixins: [minxinForm],
  components: {
    BackHead,
    DCol,
    DRow,
    WxcPopup,
    AssignList,
    PickGroup,
    OrderInfo,
    FooterButton,
    ConflitTipDialog,
    TaskChooseDialog,
    ConfirmDlg
  },
  props: {
    dataItem: {
      type: Object,
      default: () => ({})
    },
    showOrderBook: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'showOrderBook',
    event: 'closeOrderBook'
  },
  data() {
    return {
      labelWidth,
      itemInfo: [],
      currentOrder: {},
      conflitOrders: [],
      showConflitialog: false,
      orderPlaceList: [],
      rawUserData: [],
      dialogHouseArea: false,
      otherShow: false,
      isAgreed: false,
      showToDoList: false,
      hasFinished: false,
      showMoreTitle: '确定释放',
      showMoreContent: '您选择的为“外勤完结”，释放后该笔订单不进入抢单池及跟单池中，外勤事项将无法办理！',
      isShowMore: false,
      appointAreaNameDefaultValue: '请选择区域',
      applyInfoHouseArea: '',
      info: {
        id: undefined,
        btnSureText: '确认',
        appointAreaName: '请选择区域',
        fieldFinished: {
          value: '',
          index: 1,
          required: true,
          hidden: true,
          // prototype: ConfirmType,  // []常规节点
          list: ConfirmType
        },
        nodeId: {
          value: '',
          index: -1,
          list: [],
          required: true,
          disabled: false
        },
        transferUserId: {
          value: '',
          index: -1,
          hidden: true,
          required: false,
          list: [],
          disabled: false
        },
        datetime: {
          value: '',
          required: true,
          disabled: false
        },
        address: {
          value: '',
          maxlength: 60,
          list: [],
          disabled: false,
          isNeed: false
        },
        mark: {
          value: '',
          disabled: false
        }
      },
      headList: [
        {
          name: '区域',
          key: 'name'
        },
        {
          name: '城市',
          key: 'cityName'
        }
      ],
      bottomBtns: ['取消']
    }
  },
  computed: {
    // 是否选择地址
    isChooseAddress() {
      const info = this.info
      const addressList = info.address.list
      const bookNodeId = info.nodeId.value
      return bookNodeId === 'Interview' && Array.isArray(addressList) && addressList.length > 0
    }
  },
  created() {
    const info = this.info
    const bottomBtns = this.bottomBtns
    this.getApplyInfo()
    info.nodeId.label = '释放节点'
    info.nodeId.placeholder = '请选择释放节点'
    bottomBtns.push('释放')
    info.transferUserId.hidden = false
    info.fieldFinished.hidden = false
    this.getBranchId()
  },
  beforeMount() {
    this.requestNodeList()
  },
  methods: {
    ...mapActions(['getMatterUsers', 'geOperateUserList']),
    companyUsers() {
      return Array.prototype.map.call(this.rawUserData || [], s => {
        return { name: s.fullname, key: s.id }
      })
    },
    //取得订单信息
    getApplyInfo() {
      this.requestApi.order_detail({
        method: 'GET',
        data: 'applyNo=' + this.dataItem.applyNo,
        success: data => {
          let houseArea = (data.houseArea && data.houseArea) || ''
          let houseAddress = (data.houseAddress && data.houseAddress) || ''
          this.applyInfoHouseArea = houseArea + houseAddress
        }
      })
    },
    // 获取订单详情信息，从订单详情中获取branchId
    getBranchId() {
      const dataItem = this.dataItem || {}
      const branchId = dataItem.branchId
      if (branchId) {
        this.getOrderPlaceList(branchId)
      } else {
        this.requestApi.order_info({
          data: {
            applyNo: this.dataItem.applyNo,
            relationKey: 'applyOrder'
          },
          success: data => {
            this.getOrderPlaceList((data.applyOrder || {}).branchId)
          }
        })
      }
    },
    //
    addressChange(key, val, item) {
      if (val) {
        this.info.address.value = val
      }
    },
    // 外勤完结控制
    changeValue(value) {
      const info = this.info
      const { nodeId, datetime, address, mark, transferUserId } = info
      if (value === 'Y') {
        this.hasFinished = true
      } else {
        this.hasFinished = false
      }
    },
    //组员待办明细
    showListView() {
      this.showToDoList = true
    },
    // 获取预约地点下拉列表
    getOrderPlaceList(belongCityCode) {
      this.requestApi.order_place({
        method: 'GET',
        data: 'belongCityCode=' + belongCityCode,
        success: data => {
          if (data.length) {
            let tmpList = []
            for (let i in data) {
              tmpList.push(data[i].appointAddress)
            }
            this.$set(this.info.address, 'list', tmpList)
          }
        }
      })
    },
    // 查询预约节点对应的信息
    requestBookOrderInfo(matterKey) {
      this.requestApi.order_book_info({
        data: {
          applyNo: this.dataItem.applyNo,
          matterKey
        },
        success: data => {
          const _data = data || {}
          if (_data.id) {
            this.info.id = _data.id
          }
          const info = this.info
          info.datetime.value = this.formatDate(_data.appointTime || '')
          info.address.value = _data.appointAddress || ''
          info.appointAreaName = _data.appointAreaName || this.appointAreaNameDefaultValue
          info.mark.value = _data.remark || ''
        }
      })
    },
    // 选择预约/释放节点
    doChangeNodeSelect(value, name) {
      this.dataItem.matterKey = value
      this.requestBookOrderInfo(value, name)
      this.otherShow = value === 'other'
      this.info.nodeId.values = [value, name]
      return new Promise((resolve, reject) => {
        this.geOperateUserList({ matterKey: value, applyNo: this.dataItem.applyNo }).then(data => {
          //更新公司员工信息
          this.rawUserData = data
        })
      })
    },
    btnActionClick(item) {
      this.transferUserId = item.assigneeId
      this.initValue = item.assigneeName
    },
    // 释放
    doReleaseOrderRequest(id, applyNo, matterKey, matterName, appointTime, appointAddress, appointAreaName, remark, receiveUserId) {
      this.requestApi.order_release({
        data: {
          id,
          applyNo,
          matterKey,
          matterName,
          appointTime,
          appointAddress,
          appointAreaName,
          remark,
          receiveUserId
        },
        success: () => {
          this.$emit('closeOrderBook', false)
          Dialog.toast('释放成功')
          this.$emit('orderReleaseSuccess')
          this.$eventHub.$emit('BroadcastReleaseOrder') //释放订单
          this.onDisappear()
        }
      })
    },
    // 查询可预约节点
    requestNodeList() {
      this.requestApi.book_matter({
        method: 'GET',
        data: {
          applyNo: this.dataItem.applyNo
        },
        success: data => {
          const tdata = data || []
          let tdataObj = {}
          let tdataArray = []
          for (let i = 0, t = tdata.length; i < t; i++) {
            tdataObj[tdata[i].matterKey] = tdata[i]
          }
          for (let i = 1; i < InterviewListKind.length; i++) {
            if (tdataObj[InterviewListKind[i].key]) {
              tdataArray.push(InterviewListKind[i])
            }
          }
          tdataArray.push({ key: 'other', name: '其他事项', sort: 20 })
          this.info.nodeId.list = tdataArray
        }
      })
    },

    closeConflit() {
      this.showConflitialog = false
    },
    /** 预定 **/
    doClickBottomBtn(idx, item) {
      switch (item) {
        case '取消':
          this.doBookOrderCancel()
          break
        case '确定':
        case '释放':
          this.doBookOrderSure()
          break
        default:
          break
      }
    },
    doBookOrderCancel() {
      this.$emit('closeOrderBook', false)
      this.onDisappear()
    },
    // 节点预约确定
    doBookOrderSure() {
      const info = this.info
      const { nodeId, fieldFinished, datetime, address, mark, transferUserId } = info
      const nodeValues = nodeId.values
      if (fieldFinished.value !== 'Y') {
        if (!Array.isArray(nodeValues) || nodeValues.length < 2) {
          Dialog.toast('请选择预约节点')
          return false
        }
        if (!datetime.value) {
          Dialog.toast('请选择预约时间')
          return false
        }
        if (nodeValues[0] === 'other') {
          nodeId.values[1] = this.otherValue
          if (!nodeId.values[1]) {
            Dialog.toast('请输入其他事项')
            return false
          }
          if (this.otherValue && this.otherValue.length > 30) {
            Dialog.toast('其他事项最多输入30个字')
            return false
          }
        }
      }
      if (fieldFinished.value === 'Y' && !this.isAgreed) {
        this.isShowMore = true
        return false
      }
      //TODO: ylh *释放订单和预约页面和逻辑写在一起
        let isFinishedOutwork = ''
        if (fieldFinished.value === 'Y') {
            isFinishedOutwork = '1'
            this.requestApi.order_release({
            data: {
                applyNo: this.dataItem.applyNo,
                isFinishedOutwork
            },
            success: () => {
                this.$emit('closeOrderBook', false)
                Dialog.toast('释放成功')
                this.$emit('orderReleaseSuccess')
                this.$eventHub.$emit('BroadcastReleaseOrder') //释放订单
                this.onDisappear()
            }
            })
        } else {
            this.doReleaseOrderRequest(this.info.id, this.dataItem.applyNo, ...nodeId.values, datetime.value, address.value, info.appointAreaName === this.appointAreaNameDefaultValue ? '' : info.appointAreaName, mark.value, this.transferUserId)
        }
    },
    //选择区域
    doOpenHouseArea(title) {
      if (this.hasFinished) {
        return
      }
      let that = this
      this.requestApi.order_info({
        data: {
          applyNo: this.dataItem.applyNo,
          relationKey: 'applyOrder'
        },
        success: data => {
          let companyCode = data.applyOrder.branchId
          this.requestApi.company_area_list({
            method: 'GET',
            data: 'companyCode=' + companyCode,
            success: data => {
              that.dialogList = data
              that.dialogHouseArea = true
            }
          })
        }
      })
    },
    doSureChooseDialog(e) {
      if (e) {
        this.info.appointAreaName = e.name
      }
      this.dialogHouseArea = false
    },
    doCancelChooseDialog() {
      this.dialogHouseArea = false
    },
    closeBoard() {
      native_common_events(DEFINE_HIDDEN_KEYBORAD)
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .row {
    flex-direction: row
  }
  .hasFinished-gray {
    opacity: 0.6;
  }
  .hasFinished-common {
    opacity: 1;
  }
  .release-order {
    height: 1700px;
  }
  .gap-right {
    margin-right: 10px;
  }
  .footer-button {
    position: absolute;
    width: 2260px;
    top: 1480px;
    height: 125px;
  }
  /** 内容 **/
  .base-info-wrap {
    height: 100px;
    @include setPaddingH(100px);
    @include setBorderBottom(#EBEBEB)
  }
  .todo-detail {
    font-size: 30px;
    color: #02b3b4;
    line-height: 72px;
    text-decoration: underline;
  }
  .label {
    color: $color_enclosure;
    font-size: $font_normal;
  }

  .value {
    color: $color_nav;
    font-size: $font_normal;
  }

  .input-wrap {
    @include setPadding(40px, 80px);
  }
  .orderbtn {
    margin-bottom: 224px;
  }
  .release-button {
    margin-bottom: 50px;
    height: 1050px;
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
    margin-left: 35px;
  }
  .order-label-required {
    color: rgb(33, 54, 61);
    font-size: 34px;
    text-align: right;
    width: 150px;
    line-height: 70px;
  }
  .required {
    color: red;
    width: 34px;
    font-size: 30px;
    line-height: 70px;
  }
  .transfer-input {
    font-size: 34px;
    border-width: 2px;
    border-style: solid;
    border-color: #CACCCF;
    width: 520px;
    height: 72px;
    margin-left: 20px;
  }
  .splitter {
    margin: 36px 40px 20px;
    @include setBorderBottom(#EBEBEB)
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
    margin-left: 40px;
  }
  
  .header-caption {
    color: #21363D;
    font-size: 38px;
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
.user-picker {
  width: 520px;
  height: 72px;
  border-width: 2px;
  border-style: solid;
  border-color: #cacccf;
  padding-left: 20px;
  margin-left: 20px;
}
.mark-title {
    color: #21363D;
    font-size: 34px;
    line-height: 72px;
    text-align: right;
    width: 150px;
}
.title-mark {
  color: red;
  font-size: 34px;
  line-height: 72px;
}
</style>
