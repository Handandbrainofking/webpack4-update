<!--
流转记录
-->


<template>
  <scroller :class="['handle-log-info', isEmpty&&'empty-ctn']">
    <div class="tracker" v-if="handleUserName">
      <text class="tracker-text">当前跟单人</text>
      <text class="tracker-text">{{handleUserName}}</text>
    </div>
    <div class="sub-titile" v-if="robAndAssignItems.length">
      <text class="sub-title-text">抢派单记录</text>
    </div>
    <d-row v-if="robAndAssignItems.length" class="header-row">
      <d-col :span="6"><text class="title-text">跟单人</text></d-col>
      <d-col :span="6"><text class="title-text">操作</text></d-col>
      <d-col :span="6"><text class="title-text">操作时间</text></d-col>
      <d-col :span="12" />
    </d-row>
    <template v-if="robAndAssignItems.length">
      <d-row v-for="(item, index) in robAndAssignItems" :key="item.id" :class="['item-row', index%2&&'row-bg-even']">
        <d-col :span="6"> <text class="cell-text">{{getFollowerName(item)}}</text> </d-col>
        <d-col :span="6"> <text class="cell-text">{{getOperateName(item)}}</text> </d-col>
        <d-col :span="6"><text class="cell-text">{{item.createTime|date('YYYY-MM-DD hh:mm')}}</text></d-col>
        <d-col :span="12" />
      </d-row>
    </template>

    <div class="sub-titile" v-if="transferItems.length">
      <text class="sub-title-text">转单记录</text>
    </div>
    <d-row v-if="transferItems.length" class="header-row">
      <d-col :span="6"><text class="title-text">转单事项</text></d-col>
      <d-col :span="6"><text class="title-text">转单发起人</text></d-col>
      <d-col :span="6"><text class="title-text">转单接收人</text></d-col>
      <d-col :span="6"><text class="title-text">转单时间</text></d-col>
      <d-col :span="6" />
    </d-row>
    <template v-if="transferItems.length">
      <d-row v-for="(item, index) in transferItems" :key="item.id" :class="['item-row', index%2&&'row-bg-even']">
        <d-col :span="6"> <text class="cell-text">{{item.matterName}}</text> </d-col>
        <d-col :span="6"><text class="cell-text">{{item.operateUserName}}</text></d-col>
        <d-col :span="6"> <text class="cell-text">{{item.targetUserName}}</text> </d-col>
        <d-col :span="6"><text class="cell-text">{{item.createTime|date('YYYY-MM-DD hh:mm')}}</text></d-col>
        <d-col :span="6" />
      </d-row>
    </template>

    <div v-if="isEmpty && !handleUserName">
      <div class="no-data-content-image">
        <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
      </div>
      <text class="no-data-text">暂无数据</text>
    </div>
  </scroller>

</template>

<script>
import DCol from "@/core/Layout/DCol";
import DRow from "@/core/Layout/DRow";

export default {
  name: "handleLogInfo",
  props: {
    applyNo: {
      type: String
    }
  },
  data() {
    return {
      handleLogs: [],
      handleUserName: "",
      isEmpty: false,
      showMoreTitle: "",
      showMoreContent: "",
      isShowMore: false
    };
  },
  components: {
    DCol,
    DRow
  },
  computed: {
    robAndAssignItems() {
      const types = [
        "ROB", // 抢单
        "ASSIGN", // 派单
        "RELEASE_RECEIVE" //释放到指定人
      ];
      return this.handleLogs.filter(
        item => types.indexOf(item.operateType) !== -1
      );
    },
    transferItems() {
      const types = [
        "TRANSFER_ORDER_POOL_IN", // 转到转单词
        "TRANSFER", // 转单
        "TRANSFER_PC" // pc派单
      ];
      return this.handleLogs.filter(
        item => types.indexOf(item.operateType) !== -1
      );
    }
  },
  mounted() {
    const applyNo = this.applyNo;
    this.fetchData(applyNo);
  },
  methods: {
    //取得订单信息
    fetchData(applyNo) {
      this.requestApi.matter_type({
        data: {
          applyNo: this.applyNo,
          operateType:
            "ROB,TRANSFER,ASSIGN,TRANSFER_ORDER_POOL_IN,TRANSFER_ORDER_POOL_LOCK,RELEASE_RECEIVE,TRANSFER_PC"
        },
        success: data => {
          this.handleLogs = data || [];
          // 合并捞单记录
          this.handleLogs = this.mergeTransferLockItems(this.handleLogs || []);
          this.isEmpty = !this.handleLogs.length && !this.handleUserName;
        }
      });

      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "applyOrder"
        },
        success: data => {
          this.handleUserName = data.applyOrder.robUserName;
        }
      });
    },
    /**
     * 取得跟单人名称
     * 如果是 ROB 则取 operateUserName， 否则取 targetUserName
     * 可能的状态：ROB,TRANSFER,ASSIGN,TRANSFER_ORDER_POOL_IN,RELEASE_RECEIVE
     */
    getFollowerName(item) {
      if ("ROB" === item.operateType) {
        return item.operateUserName;
      }

      return item.targetUserName;
    },
    /**
     * 生成操作的类型显示文本
     * ROB,ASSIGN,RELEASE_RECEIVE
     */
    getOperateName(item) {
      switch (item.operateType) {
        case "ROB":
          return "抢单";
        case "ASSIGN":
          return "派单";
        case "RELEASE_RECEIVE":
          return "释放接收";
      }
      return "";
    },
    /**
     * 合并转单词的捞单记录。
     * 订单转到转单词后默认“转单接收人”是“转单池”，如果发生转单池捞单，则通过这个方法把
     */
    mergeTransferLockItems(items) {
      const transferOrderPoolInItems = items.filter(
        item => item.operateType === "TRANSFER_ORDER_POOL_IN"
      );
      const transferOrderPoolLockItems = this.handleLogs.filter(
        item => item.operateType === "TRANSFER_ORDER_POOL_LOCK"
      );

      // 合并捞单数据
      for (const poolItem of transferOrderPoolInItems) {
        const lockItemIndex = transferOrderPoolLockItems.findIndex(
          item => item.matterKey === poolItem.matterKey
        );
        if (lockItemIndex === -1) continue; // 没有捞单

        const lockItem = transferOrderPoolLockItems.splice(lockItemIndex, 1)[0]; // 取出捞单信息，并从列表移除
        // 更新接收人与转单时间
        poolItem.targetUserName = lockItem.operateUserName;
        poolItem.createTime = lockItem.createTime;
      }
      const sortedItems = items.sort((a,b)=>a.createTime - b.createTime)
      return sortedItems;
    }
  }
};
</script>

<style src="../trackcss.css" scoped>
</style>

<style lang="scss" scoped>
@import "../../../css/common";

.handle-log-info {
  flex: 1;
  padding-top: 30px;
  padding-right: 40px;
  padding-left: 40px;
  padding-bottom: 40px;
  justify-content: flex-start;  
}

.header-row {
  background-color: #f5f6f9;
}

.sub-titile {
  flex-direction: row;
  align-items: center;
  height: 90px;
}

.sub-title-text {
  font-size: 30px;
}

.tracker {
  flex-direction: row;  
  align-items: flex-start;
}

.tracker-text {
  font-size: 30px;
  margin-right: 30px;
}

.header-row {
  margin-left: 90px;
}

.item-row {
  margin-left: 90px;
}

.header-text {
  font-size: 34px;
}
.title-text {
  font-size: 34px;
  color: #677475;
  padding-top: 23px;
  padding-bottom: 23px;
  padding-left: 23px;
}

.cell-text {
  color: #030606;
  font-size: 30px;
  margin-top: 29px;
  margin-bottom: 29px;
  margin-left: 23px;
  margin-right: 8px;
  lines: 1;
}
.dom-overflow-text {
  @extend .cell-text;
  width: 150px;
  height: 43px;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cell-overflow-text {
  @extend .cell-text;
  width: 770px;
  height: 80px;
  overflow: hidden;
  align-items: center;
  lines: 2;
}

.row-bg-even {
  background-color: #fbfbfb;
}

.empty-ctn {
  align-items: center;
  justify-content: center;
}

.no-data-text {
  font-size: 34px;
  color: #677475;
  text-align: center;
  width: 590px;
}
</style>

