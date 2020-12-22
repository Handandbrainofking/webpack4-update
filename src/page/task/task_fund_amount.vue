<!-- 确认回款资金到账 -->
<template>
  <task-base-layout
     ref="task-base-layout"
     v-if="showViewTab"
     :title="messageTitle"
     :need-mark="false"
     :need-upload="false"
     :bottom-btns="['保存', '提交']"
     :stop-edit="!showBtns"
     :show-footer-btn="showBtns"
     @commitClick="doAmountSubmit"
     @saveClick="doAmountSave"
     :matter-key="TaskFund">
    <div slot="fundcontent" class="fundcontent">
      <text class="message-title">信息录入</text>
      <div class="content">
        <d-row class="header-row">
          <d-col :span="2">
            <text class="title-text">平台款是否到账</text>
          </d-col>
          <d-col :span="3">
            <text class="read-content">{{ platArrival }}</text>
          </d-col>
          <d-col :span="2">
            <text class="title-text">平台回款路径</text>
          </d-col>
          <d-col :span="3">
            <text class="read-content">{{ platRecePath }}</text>
          </d-col>
        </d-row>
        <d-row class="header-row">
          <d-col :span="2">
            <text class="title-text">实际回款路径</text>
            <text class="title-mark">*</text>
          </d-col>
          <d-col :span="3">
            <pick-list class="pick-content" :size="fontSize" pick-title="请选择实际回款路径" place-holder="请选择实际回款路径"
                       :searchList="factPaySourceList" v-model="factPaySource"></pick-list>
          </d-col>
          <d-col :span="2">
            <div class="mark-row" v-if="factPaySource ==='DZK' || factPaySource === 'DZKBF_OTHER'">
              <text class="mark-title">垫资款</text>
              <text class="title-mark">*</text>
            </div>
          </d-col>
          <d-col :span="3">
            <text v-if="factPaySource ==='DZK' || factPaySource === 'DZKBF_OTHER'" class="read-content">{{ advanceCost }}</text>
          </d-col>
        </d-row>
        <d-row class="header-row">
          <d-col :span="2">
            <text class="title-text">借款回款日（客户）</text>
          </d-col>
          <d-col :span="3">
            <text class="read-content">{{ loanPayDay }}</text>
          </d-col>
          <d-col :span="2">
            <div class="mark-row">
              <text class="mark-title">算头算尾方式</text>
              <text class="title-mark">*</text>
            </div>
          </d-col>
          <d-col :span="3">
            <pick-list :size="fontSize" pick-title="请选择算头算尾方式" place-holder="请选择算头算尾方式" class="pick-content"
                       :searchList="fromtipType" v-model="countHeadTail"></pick-list>
          </d-col>
        </d-row>
      </div>
    </div>
    <div class="fundplusbtn" slot="fundplusbtn">
      <div class="plusbtn">
        <text class="btn-add-title">回款记录</text>
        <div class="btn-add-wrap" @click="doAddfundline">
          <text class="btn-add-text">增加回款信息</text>
        </div>
      </div>
      <d-table
         :load_refresh="load_refresh"
         :load_more="load_more"
         :head-list="headList"
         :body-list="bodyList"
         :no-data="noData"
         cell-key="fundkey"
         :swipe-btn="operBtns"
         @showMark="showMark"
         @clickSwipeBtn="actionClick"
         @loadMore="loadMore"
         @loadFresh="loadFresh"
      ></d-table>
      <confirm-dlg :title="showMoreTitle" :content="showMoreContent" :show="isShowMore"
                   v-show="isShowMore" @wxcDialogConfirmBtnClicked="isShowMore=false"
                   @wxcDialogCancelBtnClicked="isShowMore=false"></confirm-dlg>
      <task-add-backlist
         :apply-no="applyNo"
         :fund-show="fundShow"
         @doAddFund="doAddFund"
         @doAddCancel="doAddCancel">
      </task-add-backlist>
      <bui-success-tip :msg="successSave.msg" v-model="successSave.show"></bui-success-tip>
    </div>

  </task-base-layout>
</template>

<script>
import TaskBaseLayout from './components/common/base.vue'
import PickDateView from '@/components/labelvalue/pickdate.vue'
import PickView from '@/components/labelvalue/pick.vue'

import PickList from '@/components/dropdown/pick.vue'
import TaskChooseDialog from './components/common/choose_dialog.vue'
import Dialog from '../../utils/dialog'
import ReadOnly from './components/common/only_read.vue'

import TaskAddBacklist from './components/task_add_backlist.vue'
import DCol from '@/core/Layout/DCol'
import DRow from '@/core/Layout/DRow'
import ConfirmDlg from '@/components/dialog/confirm.vue'
import BuiSuccessTip from '@/components/dialog/success.vue'

import FooterButton from './components/task_footer_button.vue'
import WxcDialog from '@/components/dialog/dialog.vue'
import { formatDate } from '@/store/common/utils'
import PageLoaderMixins from '../../mixins/page'
import {
  native_common_events,
  DEFINE_GET_LOCATION,
  native_logMessage,
  native_eventStatistic
} from '@/utils/deal_native'
import { RETURN_AMT_FROM } from '@/config'
import { Dist_List_Get } from '@/config/index.js'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'task_fund', //资金回款
  statistics: 'taskFundAmount|跟单详情-确认回款资金到账',
  mixins: [PageLoaderMixins],
  components: {
    TaskBaseLayout,
    PickDateView,
    PickView,
    PickList,
    TaskChooseDialog,
    DCol,
    DRow,
    ConfirmDlg,
    ReadOnly,
    TaskAddBacklist,
    WxcDialog,
    FooterButton,
    BuiSuccessTip
  },
  data() {
    return {
      requestListKey: 'fund_back_list',
      params: {
        applyNo: ''
      },
      perNum: 5,
      messageTitle: '',
      noData: false,
      borrowingAmount: 0,
      factPaySourceIndex: -1,
      showMoreTitle: '',
      showMoreContent: '',
      isShowMore: false,
      successSave: {
        show: false,
        msg: '保存成功'
      },
      headList: [
        {
          title: '回款方式',
          width: 2,
          key: item => {
            for (let i = 0; i < 3; i++) {
              if (this.FundBackType[i].key == item.settlWay) {
                return this.FundBackType[i].name
              }
            }
            return item.settlWay
          }
        },
        {
          title: '预约时间',
          width: 3,
          key: item => {
            return formatDate(item['transDay'], 'YYYY-MM-DD')
          }
        },
        {
          title: '回款金额',
          width: 2,
          key: 'transMoney'
        },
        {
          title: '收款账户卡号',
          width: 4,
          key: 'payeeAcctNo'
        },
        {
          title: '收款账户户名',
          width: 5,
          key: 'payeeAcct'
        },
        {
          title: '收款账户开户行',
          width: 5,
          key: 'payeeBankName'
        },
        {
          title: '备注',
          width: 4,
          key: 'remark',
          click: true
        }
      ],
      showViewTab: true,
      fundShow: false,
      fontSize: 34,
      applyNo: '',
      operatorLocationX: 0,
      operatorLocationY: 0,
      operatorAddress: '',
      bodyList: [],
      payeeBankCode: '',
      factPaySourceList: Dist_List_Get(RETURN_AMT_FROM),
      platArrival: '',
      platRecePath: '',
      loanPayDay: '',
      advanceCost: 0,
      factPaySource: '',
      countHeadTail: '',
    }
  },

  computed: {
    ...mapState('taskfund', [
      'platRecePathList',
      'FundBackType',
      'fromtipType',
      'platArrivalList',
      'operBtns'
    ])
  },
  props: {
    traceItem: {
      type: Object,
      default: () => ({})
    },
    // 是否显示保存提交按钮
    showBtns: {
      type: Boolean,
      default: true
    }
  },
  // 数据初始化
  created() {
    const applyNo = this.getPageParams('orderId', true) || 1
    this.params.applyNo = applyNo
    this.applyNo = applyNo
    var that = this
    this.getOrderInfo(this.applyNo).then(data => {
      let tempdata = data
      if (Object.getOwnPropertyNames(data).length !== 0) {
        that.borrowingAmount = data.feeSummary.borrowingAmount || 0 //获取借款金额
        // 带入平台款是否到账
        if (
          data.fundModule.platArrival == '' ||
          data.fundModule.platArrival == null
        ) {
          that.platArrival = '否'
        } else {
          that.platArrival = that.translateKey(that.platArrivalList, data.fundModule.platArrival)
        }
        // 带入借款日期
        that.loanPayDay = formatDate(
          data.fundModule.loanPayDay,
          'YYYY-MM-DD'
        )
        /* 资金模块订单信息里的平台款路径或计算方式接口为一个,
            任一为空，则请求接口，平台回款路径和计算方式的默认接口*/
        if (!data.fundModule.platRecePath || !data.fundModule.countHeadTail) {
          this.getFundDefault(this.applyNo).then(data => {
            if (!tempdata.fundModule.platRecePath) {
              //平台回款路径
              that.platRecePath = that.translateKey(that.platRecePathList, data.platRecePath)
            } else {
              that.platRecePath = that.translateKey(that.platRecePathList, tempdata.fundModule.platRecePath)
            }
            if (true || !tempdata.fundModule.countHeadTail) {
              //计算方式
              that.countHeadTail = that.translateKey(that.fromtipType, data.feeCalcWay)
            } else {
              that.countHeadTail = that.translateKey(that.fromtipType, tempdata.fundModule.countHeadTail)
            }
          })
        } else {
          //平台回款路径
          that.platRecePath = that.translateKey(that.platRecePathList, data.fundModule.platRecePath)
          that.countHeadTail = that.translateKey(that.fromtipType, data.fundModule.countHeadTail)
        }
        // let feefundSource = tempdata.fundModule.factPaySource || tempdata.feeSummary.refundSource
        if (!tempdata.fundModule.factPaySource) {
          //查询垫资款
          that.getFactPaySource(that.applyNo).then(data => {
            if (Object.keys(data).length !== 0) {
              //查询有垫资款
              that.factPaySource = '垫资款'
              that.advanceCost = data.advAmt //垫资款
            }
          })
        }
        else {
          that.factPaySource = that.translateKey(that.factPaySourceList, tempdata.fundModule.factPaySource)
        }
        if (tempdata.fundModule.advanceCost) {
          that.advanceCost = tempdata.fundModule.advanceCost
        }
      }

      this.requestList()
      // this.getFundbackList();
      //生成地理位置
      native_common_events(DEFINE_GET_LOCATION)
        .then(data => {
          const tdata = this.toJSON(data)
          this.operatorLocationX = tdata.longitude || '0'
          this.operatorLocationY = tdata.latitude || '0'
          this.operatorAddress = tdata.address
        })
        .catch(() => {
        })
    })
  },

  methods: {
    ...mapActions('taskfund', [
      'getOrderInfo',
      'getFundDefault',
      'getFactPaySource',
      'getFundbackData'
    ]),
    /*对字典的key-name值在展示的时候做一个转换*/
    translateKey(list, key) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].key == key) {
          return list[i].name
        }
      }
    },
    translateName(list, name) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].name == name) {
          return list[i].key
        }
      }
    },
    showMark(index, item, headItem, headIndex) {
      console.log(item)
      this.showMoreTitle = '备注'
      this.showMoreContent = item.remark
      this.isShowMore = true
    },
    /*获取最新的回款列表，展示时对回款方式和时间进行处理
      获取最新的借款日期*/
    getFundbackList() {
      this.getFundbackData(this.applyNo).then(data => {
        this.bodyList = []
        if (data.list.length !== 0) {
          this.noData = false
          console.log('回款' + data.list)
          for (let i = 0; i < data.list.length; i++) {
            data.list[i].settlWay = this.translateKey(
              this.FundBackType,
              data.list[i].settlWay
            )
            data.list[i].transDay = formatDate(
              data.list[i].transDay,
              'YYYY-MM-DD'
            )
            this.bodyList.push(data.list[i])
          }
        } else {
          this.noData = true
        }
      })
      this.getOrderInfo(this.applyNo).then(data => {
        if (data.fundModule.loanPayDay) {
          this.loanPayDay = formatDate(
            data.fundModule.loanPayDay,
            'YYYY-MM-DD'
          )
        } else {
          this.loanPayDay = ''
        }
      })
    },
    /*点击增加回款记录按钮，展开回款信息弹框，清空上次数据*/
    doAddfundline() {
      this.fundShow = true
    },
    /*确认增加回款信息，需要进行必填校验
    提交后重新拉取最新的回款列表*/
    doAddFund() {
      this.getFundbackList()
      this.fundShow = false
    },
    doAddCancel() {
      this.fundShow = false
    },
    //删除回款记录
    actionClick(index, item) {
      native_logMessage('删除回款记录' + index + 'item:' + item)
      this.requestApi.fund_delete_list({
        data: {
          applyNo: this.applyNo,
          costIds: [item.costId]
        },
        success: data => {
          this.getFundbackList()
        }
      })
    },
    // 保存页面操作
    getPageMessage() {
      let info = {
        applyNo: this.applyNo,
        platArrival: this.translateName(this.platArrivalList, this.platArrival),
        platRecePath: this.translateName(this.platRecePathList, this.platRecePath),
        factPaySource: this.translateName(this.factPaySourceList, this.factPaySource) || this.factPaySource,
        advanceCost: this.advanceCost,
        loanPayDay: new Date(this.loanPayDay).getTime(),
        countHeadTail: this.translateName(this.fromtipType, this.countHeadTail) || this.countHeadTail
      }
      return info
    },

    doAmountSave() {
      native_eventStatistic('paymentArrivalSave', '确认回款资金到账-保存')
      const _data = {}
      let info = this.getPageMessage()
      _data.fundModule = [info]
      this.requestApi.order_info_save({
        data: {
          applyNo: this.applyNo,
          taskId: this.traceItem.relateId,
          data: _data
        },
        success: _data => {
          this.successSave.msg = '保存成功'
          this.successSave.show = true
        },
        error: (msg, code, obj) => {
          if (force !== false && 'function' === typeof func) {
            func(false, msg, code, obj)
          } else {
            Dialog.toast(msg)
          }
        }
      })
    },
    // 提交录入信息数据
    doAmountSubmit() {
      native_logMessage('提交')
      native_eventStatistic('paymentArrivalSubmit', '确认回款资金到账-提交')
      if (!this.factPaySource) {
        Dialog.toast('请选择实际回款路径')
        return false
      }
      if (!this.countHeadTail) {
        Dialog.toast('请选择算头算尾方式')
        return false
      }
      let advAmt = parseFloat(this.advanceCost) || 0
      let total = 0
      let that = this
      if (this.factPaySource ==='DZK' || this.factPaySource === 'DZKBF_OTHER') {
        this.requestApi.fund_amount_total({
          data: {
            applyNo: this.applyNo
          },
          success: data => {
            total = data
            if (advAmt + total == that.borrowingAmount) {
              that.submitRequest()
            } else {
              Dialog.toast('回款金额不等于借款金额')
            }
          }
        })
      } else {
        this.submitRequest()
      }
    },
    submitRequest() {
      const _data = {}
      let info = this.getPageMessage()
      _data.fundModule = [info]
      this.requestApi.order_info_save({
        data: {
          applyNo: this.applyNo,
          taskId: this.traceItem.relateId,
          data: [_data]
        },
        success: data => {
          this.requestApi.order_info_submit({
            data: {
              applyNo: this.applyNo,
              taskId: this.traceItem.relateId,
              operatorLocationX: this.operatorLocationX,
              operatorLocationY: this.operatorLocationY,
              operatorAddress: this.operatorAddress
              // data: _data
            },
            success: data => {
              this.successSave.msg = '提交成功'
              this.successSave.show = true
              this.$emit('upDateTaskId')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  @import './components/interview/customer';
  @import '../../css/common';
  @import '../../components/labelvalue/input';
  @import '../../page/task/css/task_fund';
</style>
