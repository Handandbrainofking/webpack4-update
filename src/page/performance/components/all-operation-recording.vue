<template>
  <div>
    <back-head></back-head>
    <div class="detail-wrapper">
      <div class="flex header"><text class="big-titile-text">作业记录</text></div>
      <div class="flex condition-header">
        <text class="middle-title-text">时间：</text>
        <text :class="[chooseTime === 'month' ? 'choose-text' : 'not-choose-text']" @click="chooseTheTime('month')">当月</text>
        <text :class="[chooseTime === 'season' ? 'choose-text' : 'not-choose-text']" @click="chooseTheTime('season')">当季</text>
        <div
           style="height: 72px"
           :class="['pick-box','input',startTime.length === 0 ? 'no-choose-input' : 'choose-input']"
           @click="startTimeSelect">
          <input class="text" :disabled="true" :value="startTime" placeholder="开始时间"/>
          <d-image src="/image/arrow-down.png" width="32" height="20"></d-image>
          <text class="absolute" @click="startTimeSelect"></text>
        </div>
        <div
           style="height: 72px"
           :class="['pick-box','input',endTime.length === 0 ? 'no-choose-input' : 'choose-input']"
           @click="endTimeSelect">
          <input class="text" :disabled="true" :value="endTime" placeholder="结束时间"/>
          <d-image src="/image/arrow-down.png" width="32" height="20"></d-image>
          <text class="absolute" @click="endTimeSelect"></text>
        </div>
      </div>
      <div><text class="operate-sum">累计作业环节数：{{ operateSum }}</text></div>
      <div class="head-list flex">
        <text class="head-list-text">作业事项</text>
        <text class="head-list-text">时间</text>
        <text class="head-list-text">订单编号</text>
        <text class="head-list-text">业务品种</text>
        <text class="head-list-text">客户姓名</text>
      </div>
      <scroller style="height: 1330px" v-if="bodyList.length">
        <div :class="[ idx % 2 != 0 && 'double-body-color']" class="body-list flex" v-for="(item, idx) in bodyList" :key="item">
          <text class="body-list-text">{{ item.nodeName }}</text>
          <text class="body-list-text">{{ item.handleTime|date('YYYY-MM-DD hh:mm') }}</text>
          <text class="body-list-text">{{ item.applyNo }}</text>
          <text class="body-list-text">{{ item.productName }}</text>
          <text class="body-list-text">{{ item.sellerName }}</text>
        </div>
      </scroller>
      <div v-if="!bodyList.length" class="no-data-content-image" :style="{ 'margin-top': 250 + 'px' }">
        <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
        <text class="no-data-text">暂无数据</text>
      </div>
    </div>
  </div>
</template>
<script>
import BackHead from '@/components/back/head.vue'
import { native_eventStatistic } from '@/utils/deal_native'


const picker = weex.requireModule('picker')
export default {
  name: 'all-operation-recording',
  components: {
    BackHead
  },
  props: {},
  created() {
    this.initDate()
    this.getRequestList()
  },
  data() {
    return {
      chooseTime: 'month',
      curMonth: '',
      bodyList: [],
      startTime: '',
      endTime: '',
      sendStartTime: '',
      sendendTime: '',
      minDate:'2018-12-1',
      operateSum: 0
    }
  },
  methods: {
    initDate() {
      let today = new Date()
      let thisYear = today.getFullYear()
      let thisMonth = today.getMonth()
      this.curMonth = thisYear * 100 + thisMonth + 1
    },
    getRequestList() {
      let sendDate = this.judgeSendDateType()
      sendDate.pageSize = 999
      sendDate.pageNumber = 1
      this.requestApi.operate_list({
        data: sendDate,
        success: data => {
          this.bodyList = data.list
          this.operateSum = data.total
        }
      })
    },
    judgeSendDateType() {
      let sendDate = {}
      if (this.chooseTime === 'month') {
        sendDate.curMonth = this.curMonth
      } else if (this.chooseTime === 'season') {
        sendDate = this.getSeasonByMonth()
      } else if (!this.chooseTime.length && (!this.sendStartTime.length || !this.sendendTime.length)) {
        sendDate.curMonth = this.startTime.split('-').join('') || this.endTime.split('-').join('')
      } else {
        sendDate.startTime = this.sendStartTime
        sendDate.endTime = this.sendendTime
      }
      return sendDate
    },
    chooseTheTime(time) {
      if(time == 'month') {
        native_eventStatistic('operateRecordMonth','提江全部作业记录-当月');
      } else {
        native_eventStatistic('operateRecordSeason','提江全部作业记录-当季');
      }
      this.resetAllTime(time)
      this.getRequestList()
    },
    resetAllTime(time) {
      this.chooseTime = time
      this.startTime = ''
      this.endTime = ''
      this.sendStartTime = ''
      this.sendendTime = ''
    },
    startTimeSelect() {
      native_eventStatistic('operateRecordStart','提江全部作业记录-开始时间');
      picker.pickDateNoDay(
        {
          value: this.formatDate(new Date().getTime(), 'YYYY-MM'),
          min: this.minDate
        },
        event => {
          if (event.result === 'success') {
            this.chooseTime = ''
            this.startTime = event.data
            let temparray = event.data.split('-')
            let year = temparray[0]
            let month = temparray[1]
            this.sendStartTime = this.formatDate((new Date(year, month - 1, 1)).getTime(), 'YYYY-MM-DD')
            this.getRequestList()
          }
        }
      )
    },
    endTimeSelect() {
      native_eventStatistic('operateRecordEnd','提江全部作业记录-结束时间');
      picker.pickDateNoDay(
        {
          value: this.formatDate(new Date().getTime(), 'YYYY-MM'),
          min: this.minDate
        },
        event => {
          if (event.result === 'success') {
            this.chooseTime = ''
            this.endTime = event.data
            let temparray = event.data.split('-')
            let year = temparray[0]
            let month = temparray[1]
            this.sendEndTime = this.formatDate((new Date(year, month, 0)).getTime(), 'YYYY-MM-DD')
            this.getRequestList()
          }
        }
      )
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  @import '../performance.scss';

  .detail-wrapper {
    height: 1480px;
    background-color: $color_white;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 40px;
  }

  .operate-sum {
    text-align: right;
    margin-right: 20px;
    size: 26px;
    color: #677475;
  }
</style>
