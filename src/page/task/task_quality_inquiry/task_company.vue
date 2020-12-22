<template>
  <d-layout class="body-table" kind="column" text-align="initial" vertical-align="initial">
    <d-table
       :is-head="false"
       :enable-load-more="false"
       :head-list="headList"
       :body-list="bodyList"
       :no-data="noData"
       :body-height="-1"
       @loadFresh="refreshPage">
      <task-company-item
         slot="DTableBody" slot-scope="bodyData" :list="bodyData.list" :style="bodyData.cellStyle" :apply-no="applyNo"
         :index="bodyData.index" :item="bodyData.item" @uploadPage="doSkipPage(currentPage)" @detailLitigation="detailLitigation"></task-company-item>
    </d-table>
    <d-paging class="table-page" v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
    <wxc-popup
       :show="showLitigationDetail"
       @wxcPopupOverlayClicked="showLitigation"
       ref="popup-overlay-wrap"
       pos="right"
       width="2200">
      <div class="demo-content">
        <div class="doBack">
          <back-head :beforeBack="doBack" :title-width="2500" back-title="诉讼信息"></back-head>
        </div>
        <scroller style="height: 1400px">
          <div v-if="noDetail" class="no-data">
            <div class="no-data-content-image">
              <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
            </div>
            <text class="no-data-text">暂无数据</text>
          </div>
          <div v-else v-for="(iteml, index) in litiContent" :key="index">
            <text class="litigation-popup-title">{{ iteml.type }}</text>
            <div>
              <text class="litigation-popup-content">{{ iteml.content }}</text>
            </div>
          </div>
        </scroller>
      </div>
    </wxc-popup>
  </d-layout>
</template>

<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import PageLoaderMixins from '@/mixins/page'
import TaskCompanyItem from './task_company_item'

export default {
  mixins: [PageLoaderMixins],
  components: {
    WxcPopup,
    BackHead,
    TaskCompanyItem
  },
  data() {
    return {
      applyNo: '',
      params: {
        applyNo: ''
      },
      requestListKey: 'company_litigation_list',
      headList: [],
      bodyList: [],
      showLitigationDetail: false,
      noData: true,
      noDetail: true,
      litigation: {},
      litiContent: []
    }
  },
  beforeMount() {
    this.applyNo = this.getPageParams('applyNo')
    this.params.applyNo = this.applyNo
    this.requestList()
  },
  methods: {
    // 公司诉讼查询成功的详情接口
    detailLitigation(item) {
      this.requestApi.company_detail_content({
        method: 'GET',
        data: 'companyLitigationId=' + item.id,
        success: data => {
          this.showLitigationDetail = true
          if (data.lawxinInfo.lawxinInfo && data.lawxinInfo.lawxinInfo.length > 0) {
            this.litiContent = data.lawxinInfo.lawxinInfo
            this.noDetail = false
          } else {
            this.noDetail = true
          }
        }
      })
    },
    showLitigation() {
      this.showLitigationDetail = false
    },
    doBack() {
      this.showLitigationDetail = false
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  .text {
    font-size: 30px;
    text-align: center;
    color: #9ea7b4;
  }

  .no-data-content-image {
    justify-content: center;
    align-content: center;
    margin-bottom: 60px;
  }

  .no-data-text {
    font-size: 34px;
    color: #677475;
    text-align: center;
    width: 590px;
  }

  .litigation-popup-title {
    flex: 1;
    text-align: center;
    font-size: $font_head;
    line-height: 80px;
    color: $color_nav;
  }

  .litigation-popup-content {
    padding-left: 50px;
  }

  .no-data {
    width: 2200px;
    height: 1500px;
    padding-left: 800px;
    align-content: center;
    text-align: center;
    font-size: $font_nav;
    line-height: 100px;
    color: $color_enclosure;
  }
  .body-table {
    width: 2220px;
    padding-top: 20px;
  }
  .table-page {
    width: 2350px;
  }
</style>
