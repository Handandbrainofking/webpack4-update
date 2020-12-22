<template>
    <div class="de-wrapper">
        <div class="flex header">
            <text class="small-title-text">当月提奖明细</text>
        </div>
        <div class="flex">
            <div class="tab-part" v-for="(i, idx) in tabList" :key="i">
                <text :class="[getTabClass(idx)]" @click="changeTab(idx)">{{ i.name }}</text>
            </div>
        </div>
        <scroller v-if="bodyList.length" class="flex1">
            <div class="per-single" v-for="item in bodyList" :key="item" @click="showOrderDetail(item.applyNo)">
                <read-info class="readinfo" label="订单编号" :content="item.applyNo" @clickReadInfo="showOrderDetail(item.applyNo)"></read-info>
                <read-info class="readinfo" label="业务品种" :content="item.productName" @clickReadInfo="showOrderDetail(item.applyNo)"></read-info>
                <read-info class="readinfo" label="客户姓名" :content="item.sellerName" @clickReadInfo="showOrderDetail(item.applyNo)"></read-info>
                <read-info class="readinfo" label="订单状态" :content="getApplyStatus(item.applyStatus)" :color="getPerColor(item.perforType)" @clickReadInfo="showOrderDetail(item.applyNo)"></read-info>
                <read-info class="readinfo" label="作业环节数" :content="item.taskNumber" @clickReadInfo="showOrderDetail(item.applyNo)"></read-info>
                <read-info class="readinfo" label="提奖" :content="item.monthTotal" @clickReadInfo="showOrderDetail(item.applyNo)"></read-info>
            </div>
        </scroller>
        <div v-if="!bodyList.length" class="no-data-content-image" :style="{ 'margin-top': 50 + 'px' }">
          <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
          <text class="no-data-text">暂无数据</text>
        </div>
        <order-performance-detail
            :applyNo="applyNo"
            v-if="showOrderPerformanceDetail"
            @closeOrderChoose="closeOrderChoose">
        </order-performance-detail>
    </div>
</template>
<script>
import ReadInfo from '@/page/task/components/common/read_info.vue'
import OrderPerformanceDetail from '@/page/performance/components/order-performance-detail.vue'
import {Dist_List_Get, DISC_ORDER_STATUS } from '@/config'

export default {
  name: 'performance-detail',
  components: {
    ReadInfo,
    OrderPerformanceDetail
  },
  created() {
    this.initData()
    this.requestList(this.curMonth)
    this.$eventHub.$on('changePerformanceTime', this.changeTime)
    this.$eventHub.$on('BroadcastChangedOrganization', this.requestList)

  },
  data() {
    return {
      tabPageNum: 0,
      tabList: [{ name: '已计提', key: 'YJT' }, { name: '未计提', key: 'WJT' }, { name: '已失效', key: 'YSX' }],
      showOrderPerformanceDetail: false,
      curMonth: '',
      sendType: '',
      applyNo: '',
      bodyList: [],
      typeList: []
    }
  },
  methods: {
    initData() {
      let today = new Date()
      let thisYear = today.getFullYear()
      let thisMonth = today.getMonth()
      this.curMonth = thisYear * 100 + thisMonth + 1
      this.sendType = this.tabList[this.tabPageNum].key
      this.typeList = Dist_List_Get(DISC_ORDER_STATUS)
    },
    changeTime(curMonth) {
      this.curMonth = curMonth
      this.requestList()
    },
    requestList(curMonth) {
      this.requestApi.performance_detail({
        data: {
          curMonth: this.curMonth,
          performanceStatus: this.sendType
        },
        success: data => {
          this.bodyList = data.list
        }
      })
    },
    getTabClass(idx) {
      if (idx == this.tabPageNum) {
        return 'middle-green-text'
      } else {
        return 'middle-grey-text'
      }
    },
    changeTab(idx) {
      this.tabPageNum = idx
      this.sendType = this.tabList[this.tabPageNum].key
      this.requestList(this.curMonth)
    },
    getPerColor(perforType) {
      if (perforType === '未计提') {
        return '#02B3B4'
      } else if (perforType === '已失效') {
        return '#BDC3C7'
      } else {
        return '#21363D'
      }
    },
    showOrderDetail(applyNo) {
      this.applyNo = applyNo
      this.showOrderPerformanceDetail = true
    },
    closeOrderChoose() {
      this.showOrderPerformanceDetail = false
    },
    getApplyStatus(key) {
      for(let item of this.typeList) {
        if(item.key === key) {
          return item.name
        }
      }
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  @import '../performance.scss';

  .de-wrapper {
    background-color: $color_white;
    width: 1340px;
    height: 1120px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 20px;
    padding-left: 20px;
  }
</style>
