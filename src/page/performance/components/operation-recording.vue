<template>
    <div class="op-wrapper">
        <div class="flex header">
            <text class="small-title-text">作业记录</text>
            <text @click="toAllOperation" class="middle-grey-text all-button">全部</text>
        </div>
        <scroller v-if="bodyList.length" class="flex1">
            <div class="op-single" v-for="item in bodyList" :key="item">
                <div class="flex single-header">
                    <text class="middle-black-text">{{ item.nodeName }}</text>
                    <text class="small-grey-text">{{ item.handleTime|date('YYYY-MM-DD hh:mm') }}</text>
                </div>
                <div class="flex single-header">
                  <text class="middle-grey-text">{{ item.applyNo }}</text>
                  <text class="middle-grey-text">{{ item.productName }}</text>
                </div>
                <text class="middle-grey-text">{{ item.sellerName }}</text>
            </div>
        </scroller>
        <div v-if="!bodyList.length" class="no-data-content-image" :style="{ 'margin-top': 150 + 'px' }">
            <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
            <text class="no-data-text">暂无数据</text>
        </div>
    </div>
</template>
<script>
import { OperationView } from '../../../router/defined'
export default {
  name: 'operation-recording',
  created() {
    this.initDate()
    this.getRequestList(this.curMonth)
    this.$eventHub.$on('changePerformanceTime', this.changeTime)
    this.$eventHub.$on("BroadcastChangedOrganization", this.getRequestList)
  },
  data() {
    return {
      bodyList: [],
      curMonth: ''
    }
  },
  methods: {
    initDate() {
      let today = new Date()
      let thisYear = today.getFullYear()
      let thisMonth = today.getMonth()
      this.curMonth = thisYear * 100 + thisMonth + 1
    },
    changeTime(curMonth) {
      this.curMonth = curMonth
      this.getRequestList()
    },
    getRequestList() {
      this.requestApi.operate_list({
        data: {
          curMonth: this.curMonth,
          pageNumber: 1,
          pageSize: 999
        },
        success: data => {
          this.bodyList = data.list
        }
      })
    },
    toAllOperation() {
      this.jump(
        OperationView,
        false,
        true,
        {
          applyNo: "",
        },
        {hash_url: encodeURIComponent(this.$route.path)}
      )
    },
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  @import '../performance.scss';

  .op-wrapper {
    background-color: $color_white;
    width: 860px;
    height: 1120px;
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 20px;
    padding-left: 20px;
  }
  .op-single {
    width: 820px;
    height: 204px;
    border-width: 2px;
    border-radius: 4px;
    border-top-color: #E0D3F9;
    border-bottom-color: #E0D3F9;
    border-right-color: #E0D3F9;
    border-left-color: #9368E7;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 40px;
    padding-left: 40px;
    margin-bottom: 20px;
  }
</style>
