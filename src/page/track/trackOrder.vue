<template>
  <div class="track-order-background">
    <div class="track-order">
      <!-- 回退前会确认统计提交 -->
      <back-head @back="commitStastics"></back-head>
      <div class="track-order-content">
        <div class="order-progress">
          <div class="order-progress-title">
            <text class="order-progress-text">订单进度</text>
            <div class="marginleft1200 order-node">
              <div class="circle wait"></div>
              <text class="order-node-text">待办理</text>
            </div>
            <div class="order-node">
              <d-image src="/image/repeat-handle.png" width="40" height="40"></d-image>
              <text class="order-node-text">可重复办理</text>
            </div>
            <div class="order-node">
              <div class="circle finish"></div>
              <text class="order-node-text">已完成</text>
            </div>
            <div class="order-node">
              <div class="circle delete"></div>
              <text class="order-node-text">已删除事项</text>
            </div>
          </div>
        <div class="message-box">
              <d-image
                class="image-wrap"
                src="/image/ball.png"
                width="42"
                height="32"></d-image>
              <text class="msg-content">{{LatestOperateMatterName}}</text>
              <text class="msg-content">{{formatDate(LatestOperateMatterTime)}}</text>
            </div>
        </div>
        <order-progress :show-list="sendList" :grab-order-show="grabOrderShow"></order-progress>
        <div class="order-progress-title">
          <text class="order-progress-text">基本信息</text>
        </div>
        <basic-info
          :apply-no="applyNo"
          :height="890"
          :read-info-width="785"
          :haveupload="!grabOrderShow"
          :from-user="fromType"
        ></basic-info>
        <div :class="[grabOrderShow?'btn-content-rob-state':'btn-content']">
          <div class="btn-book" @click="orderNode" v-if="!grabOrderShow">
            <text class="btn-book-text">预约</text>
          </div>
          <div class="btn-release" @click="releaseNode" v-if="!grabOrderShow">
            <text class="btn-release-text">释放</text>
          </div>
          <div class="btn-change" @click="transferOrder" v-if="!grabOrderShow">
            <text class="btn-change-text">转单</text>
          </div>
          <div class="btn-change" @click="robOrder" v-if="grabOrderShow&&!collectOrderButtonShow">
            <text class="btn-change-text">抢单</text>
          </div>
          <div class="btn-change" @click="collectOrder" v-if="collectOrderButtonShow">
            <text class="btn-change-text">收单</text>
          </div>
        </div>
        <release-order :data-item="dataItem"
          v-model="releaseOrder.show"
          @orderReleaseSuccess="orderReleaseSuccess"
          v-if="releaseOrder.show"></release-order>
        <reserve-information :data-item="dataItem"
          v-model="reserveInformation.show"
          @orderBookSuccess="orderBookSuccess"
          v-if="reserveInformation.show"></reserve-information>
      </div>
    </div>
    <transfer-dialog @commit="commitTransfer(true)" ref="transferModal" :matter-editable="true"></transfer-dialog>
    <collect-order-dialog
      :applyNo="applyNo"
      :matterKey="robMatterKey"
      :show="showCollectOrderDialog"
      v-if="showCollectOrderDialog"
      @commit="doCollectOrder"
      @cancel="cancelCollectOrder"
    ></collect-order-dialog>
    <rob-doc-modal ref="robDocModal"></rob-doc-modal>
  </div>
</template>
<script>
import BackHead from '@/components/back/head.vue'
import WxcDialog from '@/components/dialog/dialog.vue'
import ReadInfo from '@/page/task/components/common/read_info.vue'
import OrderProgress from '@/page/track/components/orderProgress.vue'
import BasicInfo from '@/page/track/components/basicInfo.vue'
import BuiSelect from '@/components/dropdown/pick.vue'
import BuiSelectDate from '@/components/dropdown/pickdate.vue'
import BuiSelectTime from '@/components/dropdown/picktime.vue'
import RobDocModal from '@/page/home/components/rob-order-modal.vue'
import { InterviewListKind, ProductKindList } from '@/config/index'
import Dialog from '@/utils/dialog'
import ReleaseOrder from '@/components/dialog/release-order.vue'
import ReserveInformation from '@/components/dialog/reserve-information.vue'
import TransferDialog from '@/components/dialog/transfer-order'
import CollectOrderDialog from '@/page/home/transfer-order-views/collect-order-dialog.vue'
import { native_eventStatistic, native_logMessage } from '@/utils/deal_native'
import { debug, debuglog } from 'util';

const searchList = Object.values(InterviewListKind).slice(1)

export default {
  name: 'trackOrder',
  statistics: 'trackOrder|订单进度',
  components: {
    BackHead,
    Dialog,
    WxcDialog,
    ReadInfo,
    OrderProgress,
    BasicInfo,
    BuiSelect,
    BuiSelectDate,
    BuiSelectTime,
    ReleaseOrder,
    ReserveInformation,
    RobDocModal,
    TransferDialog,
    CollectOrderDialog
  },
  created() {
    const applyNo = this.getPageParams('applyNo', true) || 1 //订单编号
    const sellerName = this.getPageParams('sellerName', true) || 1
    const productName = this.getPageParams('productName', true) || 1
    const productId = this.getPageParams('productId', true) || 1 //产品编号
    const grabOrderShow = this.getPageParams('grabOrderShow', true) || false
    const collectOrderButtonShow = this.getPageParams('collectOrderButtonShow', true) || false

    this.fromType = this.getPageParams('from', true) != null ? this.getPageParams('from', true) : null

    this.robMatterKey = this.getPageParams('matterKey', true)
    this.robMatterName = this.getPageParams('matterName', true)

    this.applyNo = applyNo
    this.sellerName = sellerName
    this.productName = productName
    this.productId = productId
    this.grabOrderShow = grabOrderShow
    this.collectOrderButtonShow = collectOrderButtonShow
    this.dataItem = {
      applyNo: this.applyNo,
      sellerName: this.sellerName,
      productName: this.productName
    }
    this.getAllNodeState()
    this.getLatestOperateMatter()
  },
  data() {
    return {
      applyNo: '',
      robMatterKey: '',
      robMatterName: '',
      sellerName: '',
      productName: '',
      productId: '',
      grabOrderShow: false,
      collectOrderButtonShow: false,
      isRansomFloor: '',
      sendList: [],
      matterList: [],
      searchList: searchList,
      showTransferDialog: false,
      namelabel: '客户姓名',
      productlabel: '产品名称',
      namecontent: '',
      productcontent: '',
      dataItem: {},
      releaseOrder : {
        show: false
      },
      reserveInformation: {
        show: false
      },
      fromType: null,
      CancleMortgage: false,
      showCollectOrderDialog: false,
      LatestOperateMatterName: '',
      repeatNodeList: ['Notarization', 'TrustAccount', 'AccountTest', 'QueryArchive'],
      transferMatterList: [],
      LatestOperateMatterTime: '',
      appointList: []
    }
  },
  methods: {
    getAllNodeState() {
      this.requestApi.order_approve_status({
        method: 'GET',
        data: 'applyNo=' + this.applyNo,
        success: data => {
          this.isRansomFloor = data.isRansomFloor
          this.matterList = data.matterList.filter(item => item.status !== 'reject')
          this.getTransferMatter()
        }
      })
    },
    getTransferMatter() {
      this.requestApi.matter_type({
        data: {
          applyNo: this.applyNo,
          operateType: 'TRANSFER,TRANSFER_ORDER_POOL_LOCK,TRANSFER_ORDER_POOL_IN,TRANSFER_PC'
        },
        success: data => {
          this.transferMatterList = data.reverse()
          this.getAppointList()
        }
      })
    },
    getLatestOperateMatter() {
      this.requestApi.history_approval({
        method: 'GET',
        data: {
          applyNo: this.applyNo,
        },
        success: data => {
          let operateList = data
          for(let operateItemIndex = operateList.length - 1; operateItemIndex >= 0; operateItemIndex--) {
            if(operateList[operateItemIndex].completeTime) {
              this.LatestOperateMatterTime = operateList[operateItemIndex].completeTime
              this.LatestOperateMatterName = operateList[operateItemIndex].taskName
              return true
            }
          }
        }
      })
    },
    getAppointList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "appointInfoList"
        },
        success: data => {
          this.appointList = data.appointList || []
          this.defeatSendList()
        }
      });
    },
    defeatSendList() {  //TODO xxz 这块代码太混乱、复杂
      this.getSendListByRansomFloor()
      this.addNodeStateByMatterList()
      this.addTransferHandlePersonInSendList()
    },
    // 通过
    getSendListByRansomFloor() {
      if (this.grabOrderShow || !this.isRansomFloor) {
        this.initSendListByRansomFloor("nodes")
      } else if (this.isRansomFloor === '0') {
        this.initSendListByRansomFloor("preNodes")
      } else if (this.isRansomFloor === '1') {
        this.initSendListByRansomFloor("afterNodes")
      }
    },
    addNodeStateByMatterList() {
      for (let i in this.sendList) {
        for (let j in this.matterList) {
          if (this.sendList[i].matterKey === this.matterList[j].matterKey) {
            this.sendList[i].taskId = this.matterList[j].relateId
            if (this.repeatNodeList.indexOf(this.sendList[i].matterKey) > -1) {
              this.defeatRepeatMatterNodeState(this.sendList[i], this.matterList[j])
            } else {
              this.defeatNormalMatterNodeState(this.sendList[i], this.matterList[j])
            }
          }
        }
      }
      this.twiceDefeatRepeatMatterNodeState()
    },
    // 处理 代办人 的数据
    addTransferHandlePersonInSendList() {
      for(let i in this.transferMatterList) {
        for(let j in this.sendList) {
          if(this.transferMatterList[i].matterKey === this.sendList[j].matterKey) {
            this.sendList[j].transferHandlePerson = this.transferMatterList[i].targetUserName || this.transferMatterList[i].operateUserName
          }
        }
      }
      for(let k in this.sendList) {
        if(this.sendList[k].handleUserName !== undefined) {
          if(this.sendList[k].handleUserName === this.sendList[k].transferHandlePerson || this.sendList[k].transferHandlePerson === '转单池') {
            this.sendList[k].showThisPerson = true
          }else {
            this.sendList[k].showThisPerson = false
          }
        }
      }
    },
    initSendListByRansomFloor(ransomFloorState) {
      let nodeItem
      ProductKindList[this.productId][ransomFloorState].forEach((item, index) => {
        nodeItem = { matterName: InterviewListKind[item].name, matterKey: InterviewListKind[item].key, transferHandlePerson: '' }
        this.sendList.push(nodeItem)
      })
    },
    defeatRepeatMatterNodeState(nodeItem, matterItem) {
      if (nodeItem.nodeState !== 'complete') {
        this.nodeStateBymatterSymbol(nodeItem, matterItem)
      }
    },
    defeatNormalMatterNodeState(nodeItem, matterItem) {
      this.nodeStateBymatterSymbol(nodeItem, matterItem)
    },
    nodeStateBymatterSymbol(nodeItem, matterItem) {
      if (matterItem.deleteFlag == 1) {
        nodeItem.nodeState = 'delete'
      } else if (matterItem.isHandled == 0) {
        nodeItem.nodeState = 'todo'
      } else if (matterItem.isHandled == 1) {
        nodeItem.nodeState = 'complete'
      }
    },
    twiceDefeatRepeatMatterNodeState() {
      let notarizationList = [], trustAccountList = [], accountTestList = [], queryArchiveList = []
      for (let i in this.matterList) {
        this.matterList[i].matterKey == 'Notarization' && notarizationList.push(this.matterList[i])
        this.matterList[i].matterKey == 'TrustAccount' && trustAccountList.push(this.matterList[i])
        this.matterList[i].matterKey == 'AccountTest' && accountTestList.push(this.matterList[i])
        this.matterList[i].matterKey == 'QueryArchive' && queryArchiveList.push(this.matterList[i])
      }
      for (let j in this.sendList) {
        if(this.sendList[j].matterKey == 'Notarization') {
          this.sendList[j].isHandled = notarizationList[notarizationList.length - 1].isHandled
          if(notarizationList[notarizationList.length - 1].isHandled == 1) {
            this.sendList[j].nodeState = 'finish'
          }
        }
        if(this.sendList[j].matterKey == 'TrustAccount') {
          this.sendList[j].isHandled = trustAccountList[trustAccountList.length - 1].isHandled
          if(trustAccountList[trustAccountList.length - 1].isHandled == 1) {
            this.sendList[j].nodeState = 'finish'
          }
        }
        if(this.sendList[j].matterKey == 'AccountTest') {
          this.sendList[j].isHandled = accountTestList[accountTestList.length - 1].isHandled
          if(accountTestList[accountTestList.length - 1].isHandled == 1) {
            this.sendList[j].nodeState = 'finish'
          }
        }
        if(this.sendList[j].matterKey == 'QueryArchive') {
          this.sendList[j].isHandled = queryArchiveList[queryArchiveList.length - 1].isHandled
          if(queryArchiveList[queryArchiveList.length - 1].isHandled == 1) {
            this.sendList[j].nodeState = 'finish'
          }
        }
      }
      for(let p in this.sendList) {
        for(let q in this.appointList) {
          if(this.sendList[p].matterKey === this.appointList[q].matterKey) {
            this.sendList[p].handleUserName = this.appointList[q].lockUserName || ''
          }
        }
      }
    },
    // 点击预约按钮
    orderNode() {
      native_eventStatistic('trackOrderNode', '订单进度-预约按钮（trackOrder.vue）')
      this.reserveInformation.show = true
    },
    // 点击释放按钮
    releaseNode() {
      native_eventStatistic('trackOrderRelease', '订单进度-释放按钮（trackOrder.vue）')
      this.releaseOrder.show = true
    },
    orderReleaseSuccess() {
      setTimeout(this.back(true), 3000)
    },
    transferOrder() {
      native_eventStatistic('trackOrderTransfer', '订单进度-转单按钮（trackOrder.vue）')
      this.$refs.transferModal.showModal(this.applyNo)
    },
    robOrder() {
      native_eventStatistic('trackOrderRob', '订单进度-抢单按钮（trackOrder.vue）')
      this.$refs.robDocModal.showRobModal(this.applyNo, this.robMatterKey, this.robMatterName)
    },
    collectOrder() {
      this.showCollectOrderDialog = true
    },
    doCollectOrder() {
      this.requestApi.collect_order_matter({
        data: {
          applyNo: this.applyNo,
          matterKey: this.robMatterKey
        },
        success: data => {
          this.showCollectOrderDialog = false
          Dialog.toast('收单成功')
          setTimeout(this.back(true), 3000)
        }
      })
    },
    cancelCollectOrder() {
      this.showCollectOrderDialog = false
    },
    orderReleaseSuccess() {
      this.back(true)
    }
  }
}
</script>

<style src="./trackcss.css" scoped></style>
<style scoped>
.return-text {
  font-size: 38px;
  color: black;
}

.progress-states {
  width: 2520px;
  border: 1px solid red;
}

  .back-btn {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 160px;
    height: 100px;
    border-radius: 50px;
    transition: all 200ms;
  }
  .message-box {
    flex-direction: row;
    margin: 27px 0 0 42px;
  }    
  .msg-content {
      font-size: 28px;
      color: #2980B9;
      margin-left: 10px;
      height: 35px;
      line-height: 35px;
    }
  .back-btn:active {
    background-color: #ebf0f6;
    border-radius: 0;
  }
</style>
