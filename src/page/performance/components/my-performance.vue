<template>
    <div class="my-wrapper">
        <div class="flex header">
            <text class="big-titile-text">我的提奖</text>
            <div class="flex" @click="openRule">
                <text class="middle-grey-text">提奖计算规则 </text>
                <d-image src="/image/performance-note.png" width="26" height="26"></d-image>
            </div>
        </div>
        <div class="flex header">
            <div class="flex" @click="chooseTime">
                <text class="middle-black-text">{{ year }}年{{ month }}月 </text>
                <d-image src="/image/icon-calender.png" width="38" height="38"></d-image>
            </div>
            <div @click="seechange" style="width: 120px;height: 50px;padding-left: 40px;">
                <d-image v-if="cansee" src="/image/icon-see.png" width="36" height="36"></d-image>
                <d-image v-if="!cansee" src="/image/icon-notsee.png" width="36" height="36"></d-image>
            </div>
        </div>
        <touch-dialog v-if="one" :tipWidth="770" :tipTop="140" :tipLeft="60" tipContent="放款启动计件：当月已放款的业务中已完成作业环节的累计计件提奖金额。归档启动计件：当月已归档的业务中已完成作业环节的累计计件提奖金额。"></touch-dialog>
        <touch-dialog v-if="two" :tipWidth="820" :tipTop="140" :tipLeft="650" tipContent="放款启动计件：截至当月未放款的业务中已完成作业环节的累计计件提奖金额。归档启动计件：截至当月未归档的业务中已完成作业环节的累计计件提奖金额。"></touch-dialog>
        <touch-dialog v-if="three" :tipWidth="400" :tipHeight="50" :tipTop="165" :tipLeft="1100" tipContent="当月累计完成的计件作业环节数。"></touch-dialog>
        <touch-dialog v-if="four" :tipWidth="500" :tipTop="140" :tipLeft="1600" tipContent="计件提奖（不含偏远地区等补贴类计件提奖）的计算系数，与当月人均产能达成情况挂钩。"></touch-dialog>
        <div class="flex num-space">
            <div>
                <div class="flex height-distance" @touchstart="seeone" @touchend="seeone">
                    <text class="middle-grey-text">已计提奖金（元）</text>
                    <d-image src="/image/performance-note.png" width="26" height="26"></d-image>
                </div>
                <text v-if="cansee" class="num-text">{{ realTotal }}</text>
                <text v-if="!cansee" class="num-text">****</text>
            </div>
            <div class="grey-line"></div>
            <div>
                <div class="flex height-distance" @touchstart="seetwo" @touchend="seetwo">
                    <text class="middle-grey-text">未计提奖金（元）</text>
                    <d-image src="/image/performance-note.png" width="26" height="26"></d-image>
                </div>
                <text v-if="cansee" class="num-text">{{ freezeTotal }}</text>
                <text v-if="!cansee" class="num-text">****</text>
            </div>
            <div class="grey-line"></div>
            <div>
                <div class="flex height-distance" @touchstart="seethree" @touchend="seethree">
                    <text class="middle-grey-text">累计作业环节数 </text>
                    <d-image src="/image/performance-note.png" width="26" height="26"></d-image>
                </div>
                <text v-if="cansee" class="num-text">{{ taskNumber }}</text>
                <text v-if="!cansee" class="num-text">****</text>
            </div>
            <div class="grey-line"></div>
            <div>
                <div class="flex height-distance" @touchstart="seefour" @touchend="seefour">
                    <text class="middle-grey-text">计提系数</text>
                    <text class="blue-text" @click="openHistory">（历史系数）</text>
                    <d-image src="/image/performance-note.png" width="26" height="26"></d-image>
                </div>
                <text v-if="cansee" :class="[styleColor ? 'num-text' : 'unnum-text']">{{ opRate }}</text>
                <text v-if="!cansee" class="num-text">****</text>
            </div>
        </div>
        <operate-rule
            v-if="showRule"
            @closeRuleShow="closeRule"></operate-rule>
        <history-coefficient
            v-if="showHistory"
            @closeHistory="closeHistory"></history-coefficient>
    </div>
</template>

<script>
import TouchDialog from '@/components/dialog/touch-dialog.vue'
import HistoryCoefficient from '@/page/performance/components/history-coefficient.vue'
import OperateRule from '@/page/performance/components/operate-rule.vue'
import { native_logMessage,native_eventStatistic } from '@/utils/deal_native'

const picker = weex.requireModule('picker')
export default {
  name: 'my-performance',
  components: {
    HistoryCoefficient,
    OperateRule,
    TouchDialog
  },
  created() {
    this.initData()
    this.requestData()
    this.$eventHub.$on("BroadcastChangedOrganization", this.requestData)
  },
  data() {
    return {
      realTotal: 0,
      freezeTotal: 0,
      taskNumber: 0,
      opRate: 1,
      showHistory: false,
      showRule: false,
      cansee: false,
      month: '',
      year: '',
      curMonth: '',
      one: false,
      two: false,
      three: false,
      four: false,
      styleColor: true
    }
  },
  methods: {
    seeone(e) {
      this.one = !this.one
    },
    seetwo() {
      this.two = !this.two
    },
    seethree() {
      this.three = !this.three
    },
    seefour() {
      this.four = !this.four
    },
    initData() {
      let today = new Date()
      this.year = today.getFullYear()
      this.month = today.getMonth() + 1
      this.curMonth = this.formatDate((new Date(this.year, this.month - 1, 1)).getTime(), 'YYYY-MM-DD')
    },
    requestData() {
      this.requestApi.my_performance({
        data: {
          month: this.curMonth
        },
        success: data => {
          this.realTotal = data.realTotal || 0
          this.freezeTotal = data.freezeTotal || 0
          this.taskNumber = data.taskNumber || 0
          this.opRate = data.opRate || 1
          if(!data.opRate) {
            this.styleColor = false
          }
        }
      })
    },
    chooseTime() {
      native_eventStatistic('choosePerformanceTime','提奖-切换月份查看提奖系数');
      picker.pickDateNoDay(
        {
          value: this.formatDate(new Date().getTime(), 'YYYY-MM'),
          min: '2018-10-1'
        },
        event => {
          if (event.result === 'success') {
            let temparray = event.data.split('-')
            this.year = temparray[0]
            this.month = temparray[1]
            this.curMonth = this.formatDate((new Date(this.year, this.month - 1, 1)).getTime(), 'YYYY-MM-DD')
            let curMonthA = this.year + this.month
            this.requestData()
            this.$eventHub.$emit('changePerformanceTime', curMonthA)
          }
        }
      )
    },
    seechange() {
      native_eventStatistic('seePerformanceNum','提奖-切换提奖系数可视状态');
      this.cansee = !this.cansee
    },
    openHistory() {
      native_eventStatistic('openHistory','提奖-打开历史系数');
      this.showHistory = true
    },
    closeHistory() {
      this.showHistory = false
    },
    openRule() {
      native_eventStatistic('openRule','提奖-打开规则页面');
      this.showRule = true
    },
    closeRule() {
      this.showRule = false
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../performance.scss';

  .my-wrapper {
    background-color: $color_white;
    height: 440px;
    margin-top: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 40px;
    padding-left: 40px;
  }
  .blue-text {
    color: #147EFA;
    font-size: $font_normal;
  }
  .num-text {
    color: $color_nav;
    font-size: 54px;
    font-weight: 400;
  }
  .grey-line {
    width: 2px;
    height: 160px;
    background-color: #EBEBEB;
  }
  .num-space {
    margin-top: 30px;
    justify-content: space-around;
    padding-right: 100px;
    padding-left: 100px;
  }
  .height-distance {
    margin-bottom: 10px;
  }
  .unnum-text {
    color: $color_enclosure;
    font-size: 54px;
    font-weight: 400;
    opacity: 0.5;
  }
</style>
