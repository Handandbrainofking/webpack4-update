<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
    <d-table :head-list="headList" :no-data="noData" :filterParams="params" :fix-width="true" :fix-left-column="2" :body-list="bodyList"
      :body-height="100" @loadFresh="refreshPage" :enable-load-more="false" @search="doSearch">
      <d-table-line-cell slot="DTableBody" slot-scope="bodyData" :list="bodyData.list" :style="bodyData.cellStyle"
        :index="bodyData.index" :item="bodyData.item" :fix-width="bodyData.fixWidth" :body-height="bodyData.bodyHeight"></d-table-line-cell>
    </d-table>
    <d-paging v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum" :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
  </d-layout>
</template>

<script>
import PageLoaderMixins from "@/mixins/page";
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: "person-track-doc-summary",
  statistics: "person-track-doc-summary|首页-跟单池-进度",
  mixins: [PageLoaderMixins],
  props: {
    params: {
      type: Object,
      default: () => ({
        productId: "",
        queryKeyword: ""
      })
    },
    products: {
      type: Array
    }
  },
  data() {
    return {
      requestListKey: "home_track_list_summary",
      idKey: "applyNo",
      headList: [
        {
          title: "姓名",
          width: 150
        },
        {
          title: "产品名称",
          width: 300,
          filterKey:'productId',
          filterList:() => this.products
        },
        {
          title: "面签",
          width: 300
        },
        {
          title: "报审",
          width: 300
        },
        {
          title: "托管",
          width: 300
        },
        {
          title: "预约赎楼",
          width: 300
        },
        {
          title: "核同贷",
          width: 300
        },
        {
          title: "审查/审批",
          width: 300
        },
        {
          title: "账户测试",
          width: 300
        },
        {
          title: "查档",
          width: 300
        },
        {
          title: "录入完成",
          width: 300
        },
        {
          title: "外传指令推送",
          width: 300
        },
        {
          title: "资料外传",
          width: 300
        },
        {
          title: "放款指令推送",
          width: 300
        },
        {
          title: "发送放款指令",
          width: 300
        },
        {
          title: "赎楼登记",
          width: 300
        },
        {
          title: "取注销资料",
          width: 300
        },
        {
          title: "过户递件",
          width: 300
        },
        {
          title: "抵押递件",
          width: 300
        },
        {
          title: "确认回款资金到账",
          width: 600
        }
      ],
      bodyList: [],
      currentPage: 1
    };
  },
  beforeMount() {
    // this.requestList()
    this.reset = this.resetMethod.bind(this);
    this.$eventHub.$on("BroadcastChangedOrganization", this.reset);
    this.$eventHub.$on("BroadcastRobOrder", this.reset); // 抢单广播
    this.$eventHub.$on("BroadcastReleaseOrder", this.reset); // 释放
  },
  methods: {
    resetMethod() {
      this.requestList((this.currentPage = 1));
    },
    formatListData(tData) {
      return tData.map(item => {
        const list = item.matterStatusList;
        const obj = Object.assign({}, item, { matterStatusList: null });
        list.forEach(itm => {
          if (
            obj[itm.matterKey] &&
            obj[itm.matterKey]["status"] === "finished"
          ) {
            return true;
          }
          obj[itm.matterKey] = {
            status: itm.status,
            handleUserName: itm.handleUserName
          };
        });
        return obj;
      });

      // 提交页面加载性能统计
      this.commitStastics();
    },
    // 搜索
    doSearch() {
      this.requestList(this.currentPage = 1)
    },
    changePage(data) {
      let action = data.action
      if(action === 'first') {
        native_eventStatistic('trackSummaryPageFirst', '跟单池进度-首页person-track-summary.v')
      } else if(action === 'prev') {
        native_eventStatistic('trackSummaryPagePrev', '跟单池进度上一页person-track-summary.v')
      } else {
        native_eventStatistic('trackSummaryPageNext', '跟单池进度下一页person-track-summary.v')
      }
    }
  },
  beforeDestroy() {
    this.$eventHub.$off("BroadcastChangedOrganization", this.reset);
    this.$eventHub.$off("BroadcastRobOrder", this.reset);
    this.$eventHub.$off("BroadcastReleaseOrder", this.reset);
  }
};
</script>
