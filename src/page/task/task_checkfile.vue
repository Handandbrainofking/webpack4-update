<!--查档-->
<template>
  <task-base-layout
     ref="task-base-layout"
     :need-mark="false"
     matter-key="QueryArchive"
     :show-footer-btn="false"
     :need-upload="needUpload">
    <div slot="content" class="content">
      <scroller class="scroll-wrap" v-if="needUpload">
        <div v-for="houseItem in landCertHouseList" :key="houseItem.houseNo">
          <div class="each-card-line" @click="houseItemClick(houseItem)">
            <text class="each-card-line-text">{{ houseItem.certTypeText || houseItem.landParcelNo}}</text>
            <text class="each-card-line-text">{{ houseItem.houseCertNo || houseItem.userightGainWayText}}</text>
            <text class="each-card-line-text">{{ houseItem.houseAddress || houseItem.landUseText}}</text>
            <text class="each-card-line-text test" @click="doQuery(houseItem)">查档</text>
          </div>
          <div class="each-card-content" v-for="(query, queryid) in queryArchiveListFunc(houseItem)" :key="queryid">
            <text-value :label="testResult" :content="query.queryResultText "></text-value>
            <text-value :label="testChannel" :content="query.queryUserName"></text-value>
            <text-value :label="testTime" :content="query.queryTime" :content-width="1500"></text-value>
          </div>
        </div>
      </scroller>
      <div v-if="!needUpload" class="no-data-content">
        <div class="no-data-content-image">
          <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
        </div>
        <text class="no-data-content-text">暂无数据</text>
      </div>
      <wxc-dialog v-if="showQueryDialog" :show="showQueryDialog" width="1600" height="984" top="308"
                  @wxcDialogConfirmBtnClicked="doSureChooseOrg" @wxcDialogCancelBtnClicked="doCancelChooseOrg">
        <div slot="title" class="title-wrap">
          <text class="title" style="font-size: 38px;color: #FFFFFF;">查档</text>
        </div>
        <div class="content-wrap" slot="content">
          <d-row class="edit-row">
            <d-col>
              <div style="flex-direction: row;margin-top: 40px;">
                <text class="order-label">查询时间</text><text style="color: red;font-size: 34px;margin-top: 5px;">*</text>
                <date-time-pick class="transfer-input" width="420px" height="72px" :datetime="dialogInfo.queryTime"
                                @input="dialogInfo.queryTime=$event" :min="dateTimeMin"></date-time-pick>
              </div>
            </d-col>
          </d-row>
          <d-row class="edit-row">
            <d-col>
              <d-form v-model="dialogInfo.queryResult" v-bind="selectViewParam"></d-form>
            </d-col>
          </d-row>
          <d-row class="edit-row">
            <d-col>
              <div style="margin-top: 40px;">
                <div class="mark-tip-wrap">
                  <text class="mark-tip">{{ dialogInfo.remark.length }}/100</text>
                </div>
                <div class="area-wrap">
                  <text class="remark-label">备注</text>
                  <textarea class="remark-input" name="remark" cols="30" rows="10" v-model="dialogInfo.remark"
                            maxLength="100" placeholder="请输入备注信息"></textarea>
                </div>
              </div>
            </d-col>
          </d-row>
        </div>
      </wxc-dialog>
    </div>
  </task-base-layout>
</template>

<script>
import TaskBaseLayout from './components/common/base.vue'
import TextValue from './components/common/text_value.vue'
import WxcDialog from '../../components/dialog/dialog.vue'
import {
  PLEDGE_STATUS,
  Dist_List_Get,
  HOUSE_LAND_CERT_FLAG,
  SYQQDFS_DIC_FLAG,
  FCYT_DIC_FLAG
} from '../../config/index'
import DateTimePick from '@/components/dropdown/pickdatetime'
import Dialog from '../../utils/dialog'
import loginApi from '../../utils/login'
import { native_common_events, DEFINE_GET_LOCATION, native_eventStatistic } from '@/utils/deal_native'

export default {
  name: '',
  statistics: 'taskCheckfile|跟单详情-查档',
  components: {
    TaskBaseLayout,
    WxcDialog,
    DateTimePick,
    TextValue
  },
  props: {
    traceItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      btns: [
        {
          name: '订单信息'
        }
      ],
      dateTimeMin: false,
      landCertHouseList: [],
      queryArchiveList: [],
      needUpload: true,
      orderId: 0,
      testResult: '查档结果',
      testChannel: '经办人',
      testTime: '查档时间',
      remark: '备注',
      showQueryDialog: false,
      dialogInfo: {
        houseNo: '',
        queryTime: '',
        queryResult: '1',
        remark: ''
      },
      selectViewParam: {
        name: 'maritalStatus',
        label: '查档结果',
        list: [],
        disc: PLEDGE_STATUS,
        index: 0,
        required: true,
        inner: 'customer',
        type: 'select'
      },
      currentUserInfo: {},
      operatorLocationX: '0',
      operatorLocationY: '0',
      operatorAddress: '',
      discHouseType: []
    }
  },
  created() {
    // 获取订单数据
    this.requestOrderInfo((this.orderId = this.getPageParams('orderId')))
    this.selectViewParam.list = Dist_List_Get(PLEDGE_STATUS)
    this.discHouseType = Dist_List_Get(HOUSE_LAND_CERT_FLAG)
    this.currentUserInfo = loginApi.getLoginData()
    this.syqqdfsDic = Dist_List_Get(SYQQDFS_DIC_FLAG)
    this.fcytDic = Dist_List_Get(FCYT_DIC_FLAG)

    native_common_events(DEFINE_GET_LOCATION).then(data => {
      const tdata = this.toJSON(data)
      this.operatorLocationX = tdata.longitude || '0'
      this.operatorLocationY = tdata.latitude || '0'
      this.operatorAddress = tdata.address
    }).catch(() => {
    })

  },
  methods: {
    // 请求订单信息
    requestOrderInfo(applyNo) {
      var that = this
      this.requestApi.order_info({
        data: {
          applyNo,
          relationKey: 'houseList,landCertList,queryArchiveList'
        },
        success: data => {
          //将房产信息、土地证信息合并到一起
          data.houseList.forEach(function (item) {
            item.showQueryStatus = false
            item.landParcelNo = ''
            for (var i = 0; i < that.discHouseType.length; i++) {
              var key = that.discHouseType[i].key
              if (item.certType === key) {
                item.certTypeText = that.discHouseType[i].name
                break
              }
            }
          })
          data.landCertList.forEach(function (item) {
            item.showQueryStatus = false
            item.certType = '02' //国有土地使用证
            for (var i = 0; i < that.syqqdfsDic.length; i++) {
              var key = that.syqqdfsDic[i].key
              if (item.userightGainWay === key) {
                item.userightGainWayText = that.syqqdfsDic[i].name
                break
              }
            }
            for (var i = 0; i < that.fcytDic.length; i++) {
              var key = that.fcytDic[i].key
              if (item.landUse === key) {
                item.landUseText = that.fcytDic[i].name
                break
              }
            }
            data.houseList.push(item)
          })
          data.queryArchiveList.forEach(function (item) {
            if (typeof item.queryTime == 'string') {
              item.queryTime = that.formatDate(
                Number(item.queryTime),
                'YYYY-MM-DD hh:mm:ss'
              )
            } else {
              item.queryTime = that.formatDate(
                item.queryTime,
                'YYYY-MM-DD hh:mm:ss'
              )
            }
            item.queryTime = item.queryTime
            for (var i = 0; i < that.selectViewParam.list.length; i++) {
              var key = that.selectViewParam.list[i].key
              if (item.queryResult === key) {
                item.queryResultText = that.selectViewParam.list[i].name
                break
              }
            }
          })
          that.queryArchiveList = data.queryArchiveList
          that.landCertHouseList = data.houseList.filter(function (item) {
            if (!item.certTypeText && !item.landParcelNo) {
              return false
            }
            return true
          })
          if (that.landCertHouseList.length === 0) {
            this.needUpload = false
          }
        }
      })
    },
    doQuery(item) {
      if (!this.traceItem.relateId) {
        Dialog.toast('您没有办理查档的权限')
        return
      }
      this.dialogInfo.queryTime = ''
      this.dialogInfo.queryResult = '1'
      this.dialogInfo.remark = ''
      this.dialogInfo.houseNo = item.houseNo
      this.dialogInfo.certType = item.certType
      this.dialogInfo.certNo = item.houseCertNo || item.landParcelNo
      this.showQueryDialog = true
    },
    // 点击头部的按钮
    doClickHeadBtn(item, index) {
      if (index === 0) {
        this.showOrderInfo = true
      }
    },
    updateImageList() {
    },
    doClosePopupOrder() {
      this.showOrderInfo = false
    },
    doValidate(needValidate) {
    },
    // 提交数据
    doSubmit() {
    },
    // 保存数据
    doSave(func) {
      typeof func == 'function' && func()
    },
    houseItemClick(houseItem) {
      //显示或隐藏查档列表
      houseItem.showQueryStatus = !houseItem.showQueryStatus
    },
    queryArchiveListFunc(houseItem) {
      return this.queryArchiveList.filter(function (item) {
        if (item.certType === houseItem.certType &&
          (item.certNo === houseItem.houseCertNo || item.certNo === houseItem.landParcelNo)) {
          return true
        }
        return false
      })
    },
    doSureChooseOrg() {
      var that = this
      this.dialogInfo.queryUserName = this.currentUserInfo.fullname
      this.dialogInfo.queryUserId = this.currentUserInfo.id
      if (!this.dialogInfo.queryResult) {
        Dialog.toast('请选择查询结果')
        return
      }
      if (!this.dialogInfo.queryTime) {
        Dialog.toast('请选择查询时间')
        return
      }
      //查档操作
      native_eventStatistic('QueryArchiveOperation', '查档操作（task_checkfile.vue）')
      this.requestApi.order_info_submit({
        data: {
          opinion: this.dialogInfo.remark,
          applyNo: this.orderId,
          operatorLocationX: this.operatorLocationX,
          operatorLocationY: this.operatorLocationY,
          operatorAddress: this.operatorAddress,
          taskId: this.traceItem.relateId,
          data: {
            queryArchiveList: [that.dialogInfo]
          }
        },
        success: data => {
          that.showQueryDialog = false
          that.requestOrderInfo(that.orderId)
          that.$emit('upDateTaskId')
        }
      })
    },
    doCancelChooseOrg() {
      this.showQueryDialog = false
    },
    queryChangeValue(item) {
      //查档结果选择
      this.dialogInfo.queryResult = item //this.selectViewParam.list[item].key;
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  @import './components/interview/customer';

  .each-card-line {
    height: 100px;
    background-color: $color_card_title;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin-top: 24px;
  }

  .each-card-content {
    height: 300px;
    background-color: $color_card_content;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 40px;
    padding-right: 40px;
    border-bottom-color: #cac8c8;
    border-bottom-width: 1px;

  }

  .each-card-line-text {
    font-size: $font_nav;
    color: $color_nav;
    flex: 1;
    padding-left: 200px;
  }

  .test {
    color: $btn_border_focus;
    width: 120px;
    height: 44px;
    padding-left: 30px;
  }

  .transfer-input {
    border-width: 2px;
    border-style: solid;
    border-color: #CACCCF;
    margin-left: 20px;
    width: 520px;
    height: 72px;
    font-size: 30px;
  }

  .title-wrap {
    height: 88px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgba(2, 179, 180, 1);
  }

  .remark-label {
    @extend .order-label;
    vertical-align: top;
  }

  .remark-input {
    @extend .transfer-input;
    height: 250px;
    width: 1060px;
    font-size: 34px;
    margin-left: 20px;
  }

  .order-label {
    color: rgb(33, 54, 61);
    font-size: 34px;
    text-align: right;
    width: 330px;
  }

  .order-text {
    font-size: 30px;
    color: #21363D;
    height: 45px;
    overflow: hidden;
    flex: 1;
  }

  .edit-row {
    padding: 0px 78px 34px 78px;
  }

  .mark-tip-wrap {
    padding-right: $bigger_gap_left;
    flex-direction: row;
    justify-content: flex-end;
  }

  .mark-tip {
    color: $color_back;
    font-size: $font_small;
    margin-right: 0px;
  }

  .area-wrap {
    flex-direction: row;
    align-items: flex-start;
    height: 320px;
  }

  .no-data-content {
    padding-top: 220px;
    align-items: center;
  }

  .no-data-content-image {
    margin-bottom: 60px;
  }

  .no-data-content-text {
    font-size: 34px;
    color: #677475;
  }
</style>
