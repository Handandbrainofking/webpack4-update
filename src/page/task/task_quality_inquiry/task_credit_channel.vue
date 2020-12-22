<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
    <list class="list">
      <cell class="body-list"
            v-for="(item,idx) in bodyList"
            :key="`credit-channel-${idx}`">
        <div class="item-wrap">
          <text class="item">{{ item.customer.name }}</text>
          <text class="item">{{ getCheckStatus(RelationList, item.relation )}}</text>
          <text class="item">{{ getCheckStatus(IfProposer, item.isProposer) }}</text>
          <text class="item">{{ getCheckStatus(CreditList, item.customer.creditChannel) }}</text>
          <div class="item detail-item row">
            <text class="detail-text"
                  v-if="item.customer.creditChannel === 'onlinequery' && item.parseWay != 'Y'"
                  :class="[ item.parseWay == 'Y'|| 'N' ? 'credit-success': 'credit-check', item.parseWay == 'QUERYING'? 'credit-checking': '']"
                  @click="checkCredit(item, idx)"> {{ getCheckStatu(item.parseWay) }} </text>
          </div>
        </div>
        <div class="business-list-wrap"
             v-if="item.customer.creditChannel === 'onlinequery' && item.parseWay !== 'Check'">
          <div class="item-wrap">
            <div class="item row flex-start flex2">
              <text class="business-item-label">查询状态</text>
              <text class="business-item-value">{{ getCheckStatus(checkButtonList, item.parseWay)}}</text>
            </div>
            <div class="item row flex-start flex5">
              <text class="business-item-label">备注</text>
              <text class="business-item-value">{{ item.remark || '无' }}</text>
            </div>
            <div class="summary">
              <div v-if="item.parseWay == 'Y'" class="item detail-item row summary-item" @click="summaryDetail(item)">
                <text class="detail">详情</text>
                <d-image src="/image/icon_detail.png" width="56" height="40"></d-image>
              </div>
            </div>
          </div>
        </div>
      </cell>
    </list>
    <wxc-popup
       :show="summaryShow"
       @wxcPopupOverlayClicked="overLayClicked"
       ref="popup-overlay-wrap"
       pos="right"
       width="2300">
      <div class="popup-content">
        <div class="doBack">
          <back-head :beforeBack="doBack" :title-width="titleWidth" back-title="个人征信报告"></back-head>
        </div>
        <DTab :page-height="1600" :page-width="2300" mode="bottom">
          <DTabPage title="信息概要">
            <SummaryMessage :summary-list="summaryList"/>
          </DTabPage>
          <DTabPage title="信息明细">
            <ddWeb style="width: 2240px; height: 1368px" :src="htmlPath"></ddWeb>
          </DTabPage>
        </DTab>
      </div>
    </wxc-popup>
  </d-layout>
</template>

<script>
import Dialog from '../../../utils/dialog'
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import SummaryMessage from '../elements_hosting/summary_message.vue'
import {
  CreditList,
  ConfirmType,
  Dist_List_Get,
  DISC_BUYER_SHIP_TYPE,
  DISC_SELLER_SHIP_TYPE,
  DISC_RELATION_MORTGAGE
} from '@/config'
import { native_logMessage } from '@/utils/deal_native'

const checkButtonList = [
  {
    key: 'Check',
    name: '查询'
  },
  {
    key: 'Y',
    name: '查询成功'
  },
  {
    key: 'QUERYING',
    name: '查询中...'
  },
  {
    key: 'N',
    name: '查询失败'
  },
  {
    key: 'SKIP',
    name: '跳过解析'
  }
]

export default {
  components: {
    Dialog,
    WxcPopup,
    BackHead,
    SummaryMessage
  },
  data() {
    return {
      bodyList: [],
      IfProposer: [
        {
          key: 'Y',
          name: '申请人'
        },
        {
          key: 'N',
          name: '非申请人'
        }
      ],
      CreditList: CreditList,
      remarklist: [],
      RelationList: [],
      checkButtonList: checkButtonList,
      summaryShow: false,
      summaryList: [],
      htmlPath: null,
      checkBtnStatus:false
    }
  },
  beforeMount() {
    this.applyNo = this.getPageParams('applyNo')
    this.RelationList = Dist_List_Get(DISC_BUYER_SHIP_TYPE).concat(
      Dist_List_Get(DISC_SELLER_SHIP_TYPE),
      Dist_List_Get(DISC_RELATION_MORTGAGE)
    )
    this.requestList()
  },
  methods: {
    //  请求订单信息/客户列表
    requestList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: 'customerRelList'
        },
        success: data => {
          console.log('客户信息', data)
          let temp1 = []
          let temp2 = []
          const tempdata = []
          for (let i = 0; i < data.customerRelList.length; i++) {
            if (data.customerRelList[i].customer.creditChannel == 'onlinequery') {
              temp1.push(data.customerRelList[i])
            }
            if (data.customerRelList[i].customer.creditChannel == 'offlineprint') {
              temp2.push(data.customerRelList[i])
            }
            tempdata.push(data.customerRelList[i].customerNo)
          }
          this.bodyList = temp1.concat(temp2)
          this.requestCreditList(tempdata)
        }
      })
    },
    // 请求征信信息
    requestCreditList(customerNo) {
      let that = this
      this.requestApi.credit_channel_list({
        data: {
          customerNos: customerNo
        },
        success: data => {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < that.bodyList.length; j++) {
                if (data[i].customerNo == that.bodyList[j].customerNo && data[i].parseWay) {
                  Vue.set(that.bodyList, j, Object.assign({}, that.bodyList[j], {parseWay: data[i].parseWay}))
                  Vue.set(that.bodyList, j, Object.assign({}, that.bodyList[j], {remark: data[i].remark || '无'}))
                }
              }
            }
          }
          for (let i = 0; i < that.bodyList.length; i++) {
            if (that.bodyList[i].customer.creditChannel && that.bodyList[i].customer.creditChannel == 'onlinequery' && !that.bodyList[i].parseWay) {
              Vue.set(that.bodyList, i, Object.assign({}, that.bodyList[i], {parseWay: 'Check'}))
            }
          }
        }
      })
    },
    //征信查询接口操作
    checkCreditRequest(item){
      return new Promise((resolve) => {
         let that = this
          this.requestApi.credit_zld_list({
            data: {
              applyNo: this.applyNo,
              customerNo: item.customerNo,
              queryOrgCode: 'zld'
            },
            success: function (data, msg, code) {
              if (msg) {
                Dialog.toast(msg)
                resolve()
                return
              }
              //查询成功返回查询结果
              that.requestApi.credit_channel_list({
                data: {
                  customerNos: [item.customerNo]
                },
                success: data => {
                  if (data[0] && data[0].parseWay) {
                    Dialog.toast('成功返回查询结果！')
                    item.parseWay = data[0].parseWay
                    item.remark = data[0].remark
                  }
                  resolve()
                }
              })
            }
          })
      })
    },
    //点击查询按钮
    checkCredit(item, index) {
      if (item.parseWay === 'QUERYING' || item.parseWay === 'Y') {
        return
      } else {
        if(this.checkBtnStatus){
          Dialog.toast('查询中，请稍后')
          return;
        }
        this.checkBtnStatus = true;
        this.checkCreditRequest(item).then(() =>{
          this.checkBtnStatus = false;
        })

      }
    },
    getCheckStatu(key) {
      if (key === 'N' || key === 'SKIP') {
        return '重新查询'
      }
      if (key === 'QUERYING') {
        return '查询中...'
      }
      if (key === 'Check') {
        return '查询'
      }
    },
    getCheckStatus(list, key) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].key == key) {
          return list[i].name
        }
      }
    },
    doBack() {
      this.summaryShow = false
    },
    overLayClicked() {
      this.summaryShow = false
    },
    summaryDetail(item) {
      this.summaryShow = true
      this.requestApi.credit_summary_message({
        method: 'GET',
        data: 'customerNo=' + item.customerNo,
        success: data => {
          this.summaryList = data

        }
      })
      this.requestApi.credit_detail_message({
        method: 'GET',
        data: 'customerNo=' + item.customerNo,
        success: data => {
          this.htmlPath = data.path
          native_logMessage('当前征信详情 path===' + this.htmlPath)

        }
      })
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  @import './task_cell_common';

  .list {
    @include setPadding($normal_gap_bottom, 100px);
    flex: 1;
  }

  .btn {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 34px;
  }

  .item {
    font-size: 34px
  }

  .credit-check {
    width: 148px;
    border-width: 2px;
    border-color: #02B3B4;
    font-size: 34px;
    color: #02B3B4;
  }

  .credit-success {
    color: #02B3B4;
  }

  .credit-checking {
    color: #02B3B4;
    opacity: 0.4;
    border-width: 0
  }

  .popup-scroll {
    flex: 1;
  }

  .summary-content {
    margin-left: 50px;
  }

  .detail-content {
    width: 700px;
    height: 500px;
  }
</style>
