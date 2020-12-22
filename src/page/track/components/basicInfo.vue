<template>
  <DTab :page-width="2560" :page-height="height" mode="bottom-short" @wxcTabPageCurrentTabSelected="tabChanged">
    <DTabPage title="订单信息">
      <apply-info class="tab-content" v-if="currentPage===0" :apply-no="applyNo" :field-width="readInfoWidth" :from-user="fromUser"></apply-info>
    </DTabPage>
    <DTabPage title="补件信息">
      <missing-material-info class="tab-content" v-if="currentPage===1" :apply-no="applyNo"></missing-material-info>
    </DTabPage>
    <DTabPage title="预约信息">
      <appoint-info class="tab-content" v-if="currentPage===2" :apply-no="applyNo"></appoint-info>
    </DTabPage>
    <DTabPage title="流转记录" @slidePage="slidePage">
      <handle-log-info class="tab-content" v-if="currentPage===3" :apply-no="applyNo"></handle-log-info>
    </DTabPage>
    <DTabPage title="操作信息">
      <task-head-approval class="tab-content" v-if="currentPage===4" :apply-no-prop="applyNo"></task-head-approval>
    </DTabPage>
    <DTabPage title="特批信息" v-if="isSpecialApproved">
      <approval-detail class="tab-content" v-if="currentPage===5" :apply-no="applyNo"></approval-detail>
    </DTabPage>
    <template slot="tab-title-other">
      <div v-if="haveupload" :class="['info-upload', 'fixed-upolad-btn']" @click="goMaterialUploadView">
        <text class="info-upload-text">资料上传</text>
      </div>
    </template>
  </DTab>
</template>

<script>
import ApplyInfo from "./applyInfo.vue";
import MissingMaterialInfo from "./missingMaterialInfo.vue";
import AppointInfo from "./appointInfo.vue";
import handleLogInfo from "./handleLogInfo.vue";
import TaskHeadApproval from "@/page/task/task_quality_inquiry/task_head_approval.vue"; //总部审批结果
import ApprovalDetail from '@/page/special-approval/views/MyApprovalDetail.vue'
import { DataDetail } from "@/router/defined";
import { native_eventStatistic, native_logMessage } from "@/utils/deal_native";

export default {
  name: "basicinfo",
  props: {
    applyNo: {
      type: [Number, String]
    },
    height: {
      type: [Number, String],
      default: 870
    },
    haveupload: {
      type: Boolean,
      default: false
    },
    readInfoWidth: {
      type: Number,
      default: 1000
    },
    fromUser: {
      type: String,
      default: null
    }
  },
  components: {
    ApplyInfo,
    MissingMaterialInfo,
    AppointInfo,
    handleLogInfo,
    TaskHeadApproval,
    ApprovalDetail
  },
  created() {
    this.productId = this.getPageParams("productId", true);
    this.orderId = this.getPageParams("applyNo", true);
    this.requestApi.order_info({
      data: {
        applyNo: this.orderId || this.applyNo,
        relationKey: "applyOrder, isrMixed"
      },
      success: data => {
        this.name = data.applyOrder.sellerName;
        this.isSpecialApproved = data.isrMixed.isSpecialApproved === '1' ? true : false
      }
    });
  },
  data() {
    return {
      isApply: true,
      productId: "",
      orderId: "",
      name: "",
      currentPage: {},
      isSpecialApproved: false
    };
  },
  methods: {
    slidePage() {
      native_eventStatistic(
        "basicInfoHandleLogInfo",
        "跟踪订单-流转记录（handleLogInfo.vue）"
      );
    },
    tabChanged(e) {      
      this.currentPage = e.page
    },
    goMaterialUploadView() {
      native_eventStatistic(
        "basicInfoMaterialUpload",
        "跟踪订单-资料上传（basicInfo.vue）"
      );
      this.jump(DataDetail, false, true, {
        orderId: this.orderId || this.applyNo,
        name: encodeURIComponent(this.name),
        productId: this.productId
      });
    }
  }
};
</script>

<style src="../trackcss.css" scoped></style>

<style lang="scss" scoped>
.tab-content {
  border-radius: 4px;
  border-width: 2px;
  border-color: rgb(221, 237, 248);
  margin-bottom: 20px;
}

.fixed-upolad-btn {
  position: fixed;
  right: 105px;
  top: 600px;
}
</style>
