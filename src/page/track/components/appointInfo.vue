<!--
预约信息
-->


<template>
      <scroller :class="['appoint-info', isEmpty&&'empty-ctn']">       
          <div v-if="isEmpty" >                    
              <text :class="['label-read', 'empty-tip']">无预约信息</text>
          </div>          
          <d-row v-if="appointInfoList.length"  class="header-row">                    
              <d-col :span="2"><text class="title-text">预约节点</text></d-col>
              <d-col :span="3"><text class="title-text">预约时间</text></d-col>
              <d-col :span="6"><text class="title-text" >预约地点</text></d-col>
              <d-col :span="2"><text class="title-text">预约人</text></d-col>              
              <d-col :span="6"><text class="title-text">备注</text></d-col>
          </d-row>
          <template  v-if="appointInfoList.length">
            <d-row v-for="(item, index) in appointInfoList" :key="item.id" :class="[index%2&&'row-bg-even']">                    
                <d-col :span="2">
                  <text  @click="showMoreDom(`预约节点`, item.matterName)" :class="[isDomOverflow(item.matterName)?'dom-overflow-text':'cell-text']">{{item.matterName}}</text>
                </d-col>
                <d-col :span="3"><text class="cell-text">{{item.appointTime|date('YYYY-MM-DD hh:mm')}}</text></d-col>
                <d-col :span="6">
                  <text  @click="showMoreInfo(`预约地点-${item.matterName}`, item.appointAddress)" :class="[isTextOverflow(item.appointAddress)?'cell-overflow-text':'cell-text']">{{item.appointAreaName}} {{item.appointAddress}}</text>
                </d-col>
                <d-col :span="2"><text class="cell-text">{{item.appointUserName}}</text></d-col>              
                <d-col :span="6" >
                  <text  @click="showMoreInfo(`预约备注-${item.matterName}`, item.remark)" :class="[isTextOverflow(item.remark)?'cell-overflow-text':'cell-text']">{{item.remark}}</text>
                </d-col>
            </d-row>
          </template>
          <confirm-dlg :title="showMoreTitle" :content="showMoreContent" :show="isShowMore"
                  v-show="isShowMore" @wxcDialogConfirmBtnClicked="isShowMore=false"
                  @wxcDialogCancelBtnClicked="isShowMore=false"></confirm-dlg>  
      </scroller>
</template>

<script>
import ReadInfo from "@/page/task/components/common/read_info.vue";
import DCol from "@/core/Layout/DCol";
import DRow from "@/core/Layout/DRow";
import ConfirmDlg from "@/components/dialog/confirm.vue";

export default {
  name: "addMaterialInfo",
  props: {
    applyNo: {
      type: String
    }
  },
  components: {
    ReadInfo,
    DCol,
    DRow,
    ConfirmDlg
  },
  beforeMount() {
    const applyNo = this.applyNo;
    this.getApplyInfo(applyNo);
  },
  data() {
    return {
      appointInfoList: [],
      isEmpty: false,
      showMoreTitle: "",
      showMoreContent: "",
      isShowMore: false
    };
  },
  computed: {},
  methods: {
    //取得订单信息
    getApplyInfo(applyNo) {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "appointInfoList"
        },
        success: data => {
          this.appointInfoList = data.appointList || [];
          this.isEmpty = !this.appointInfoList.length;
        }
      });
    },
    isDomOverflow(text = ""){
      return text.length > 4 ? true : false;
    },
    isTextOverflow(text = "") {
      return text.length > 25 ? true : false;
    },
    showMoreDom(title, content) {
      if (content.length < 5) {
        return;
      }
      this.showMoreTitle = title;
      this.showMoreContent = content;
      this.isShowMore = true;
    },
    showMoreInfo(title, content) {
      if (content.length < 50) {
        return;
      }
      this.showMoreTitle = title;
      this.showMoreContent = content;
      this.isShowMore = true;
    }
  }
};
</script>

<style src="../trackcss.css" scoped>
</style>

<style lang="scss" scoped>
@import "../../../css/common";

.appoint-info {
  flex: 1;
  padding-top: 30px;
  padding-right: 40px;
  padding-left: 40px;
  padding-bottom: 40px;
}

.appoitments{
  height: 715px;
}


.header-row {
  background-color: #f5f6f9;
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

.empty-tip {
  color: #677475;
}
</style>

