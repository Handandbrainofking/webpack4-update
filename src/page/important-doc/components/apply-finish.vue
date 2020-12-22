<template>
  <wxc-popup
    :show="applyFinishShow"
    @wxcPopupOverlayClicked="doClosePopupApplyBorrow"
    pos="right"
    width="2240">
    <back-head :beforeBack="backClick"></back-head>
    <scroller class="flex1">
      <text class="doc-detail-text">要件详情</text>
      <div class="each-doc" v-for="(essential, index) in bodyList" :key="essential.essentialId">
        <read-info label="要件ID" :content="infoContent(index, 'essentialId')"></read-info>
        <div class="property-layout">
          <read-info class="property-layout-width" :content-width="450" label="客户姓名" :content="infoContent(index, 'customerName')" :contentWidth="500"></read-info>
          <read-info class="property-layout-width" :content-width="450" label="要件类型" :content="infoContent(index, 'accountType')"></read-info>
          <read-info class="property-layout-width" :content-width="450" v-if="essential.accountBigType==='bankCard'" label="开户行" :content="infoContent(index, 'bankName')"></read-info>
          <read-info class="property-layout-width" :content-width="450" v-if="essential.accountBigType!=='other'" :label="labelInSight(index, 'accountNo')" :content="infoContent(index, 'accountNo')"></read-info>
          <read-info class="property-layout-width" :content-width="450" v-if="essential.accountBigType!=='other'" :label="labelInSight(index, 'essentialOwnerName')" :content="infoContent(index, 'essentialOwnerName')"></read-info>
          <read-info class="property-layout-width" :content-width="450" v-if="essential.accountBigType==='bankCard'" label="U盾" :content="infoContent(index, 'usbKey')"></read-info>
          <read-info class="property-layout-width" :content-width="450" v-if="essential.accountBigType==='bankCard'" label="是否关闭网银" :content="infoContent(index, 'isCloseFlag')"></read-info>
          <read-info class="property-layout-width" :content-width="450" label="库存状态" :content="infoContent(index, 'stockStatus')"></read-info>
          <read-info label="库存地址" :content="infoContent(index, 'address')" :lines="2"></read-info>
        </div>
      </div>
      <div class="apply-borrow-margin">
        <text class="doc-detail-text">完结信息</text>
        <div>
          <div class="mark-tip-wrap">
            <text class="mark-tip">{{ applyRemark.length }}/200</text>
          </div>
          <div class="area-wrap">
            <text class="input-label">备注</text>
            <textarea class="mark" placeholder="请输入备注信息" maxLength="200" rows="5" v-model="applyRemark" @input="doInputMark"></textarea>
          </div>
        </div>
      </div>
    </scroller>
    <div class="button-bottom">
      <div @click="backClick" class="cancel-botton"><text class="cancel-botton-text">取消</text></div>
      <div @click="applyFinish" class="ensure-botton"><text class="ensure-botton-text">确定</text></div>
    </div>
  </wxc-popup>
</template>

<script>
import WxcPopup from "@/components/wxc/popup.vue";
import BackHead from "@/components/back/head.vue";
import ReadInfo from "@/page/task/components/common/read_info.vue";
import InputView from "@/components/labelvalue/input.vue";
import SelectView from "@/components/labelvalue/select.vue";
import PickList from "@/components/dropdown/pick.vue";
import TaskChooseDialog from "@/page/task/components/common/choose_dialog.vue";
import PickDateTimeView from "@/components/labelvalue/pickdatetime.vue";
import dialog from "@/utils/dialog";
import { IMPORT_DOC_TYPE, Dist_List_Get } from "@/config/index";

const LABEL_IN_SIGHT_LIST = {
  accountNo: {
    IDCard: "身份证号",
    bankCard: "账号",
    houseLicense: "证件号",
    other: "证件号"
  },
  essentialOwnerName: {
    IDCard: "所属人",
    bankCard: "户名",
    houseLicense: "产权人",
    other: "所属人"
  }
};

export default {
  name: "apply-borrow",
  components: {
    WxcPopup,
    BackHead,
    ReadInfo,
    InputView,
    SelectView,
    PickList,
    TaskChooseDialog,
    PickDateTimeView
  },
  props: {
    essentialIds: {
      type: Array,
      default: []
    },
    height: {
      type: [String, Number],
      default: 1480
    },
    bodyList: {
      type: Array,
      default: []
    }
  },
  created() {
    this.statusList = Dist_List_Get(IMPORT_DOC_TYPE);
  },
  data() {
    return {
      applyRemark: "",
      statusList: [], // 要件状态字典列表
      applyFinishShow: true
    };
  },
  methods: {
    doClosePopupApplyBorrow() {
      // 点击蒙板区域
      this.$emit("closeApplyFinish", false);
    },
    backClick() {
      // 返回按钮
      this.$emit("closeApplyFinish", false);
    },
    infoContent(index, key) {
      if (key === "stockStatus") {
        for (let i in this.statusList) {
          if (this.statusList[i].key === this.bodyList[index][key]) {
            return this.statusList[i].name;
          }
        }
      } else if (key === "usbKey" || key === "isCloseFlag") {
        if (this.bodyList[index][key] === "Y") {
          return "是";
        } else if (this.bodyList[index][key] === "N") {
          return "否";
        }
      }
      return this.bodyList[index][key];
    },
    labelInSight(index, key) {
      return LABEL_IN_SIGHT_LIST[key][this.bodyList[index].accountBigType];
    },
    doInputMark() {
      const value = this.applyRemark;
      if (this.applyRemark.length > 200) {
        this.applyRemark = value.substring(0, 200);
      }
    },
    applyFinish() {
      let data = {
        essentialIds: this.essentialIds,
        remark: this.applyRemark
      };
      this.$emit("doApplyFinish", data);
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../../css/common.scss';
.flex1 {
  flex: 1;
  padding-left: 60px;
}

.row {
  flex-direction: row;
  align-items: center;
}

.choose-button {
  width: 120px;
  height: 72px;
  border-width: 2px;
  border-color: #02B3B4;
  border-radius: 4px;
  color: #02B3B4;
  background-color: #E5F7F7;
  font-size: 30px;
  line-height: 65px;
  text-align: center;
  margin-left: 10px;
}

.doc-detail-text {
  font-size: 38px;
  color: #21363d;
}

.each-doc {
  margin-top: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #ebebeb;
}

.property-layout {
  flex-direction: row;
  flex-wrap: wrap;
}

.property-layout-width {
  width: 680px;
}

.apply-borrow-margin {
  margin-top: 20px;
}

.button-bottom {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 310px;
  padding-left: 310px;
  height: 128px;
  box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.1);
}

.cancel-botton {
  width: 480px;
  height: 88px;
  border-width: 2px;
  border-color: #02b3b4;
  border-radius: 4px;
  justify-content: center;
}

.ensure-botton {
  width: 480px;
  height: 88px;
  border-radius: 4px;
  justify-content: center;
  background-color: #02b3b4;
}

.cancel-botton-text {
  text-align: center;
  font-size: 38px;
  color: #02b3b4;
}

.ensure-botton-text {
  text-align: center;
  font-size: 38px;
  color: #ffffff;
}

.mark-tip-wrap {
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 670px;
}

.mark-tip {
  color: $color_back;
  font-size: $font_small;
  padding-top: $normal_gap_bottom;
}

.area-wrap {
  flex-direction: row;
  align-items: flex-start;
  height: 240px;
}

.input-label {
  font-size: $font_nav;
  color: $color_nav;
  padding-top: $normal_gap_left;
  padding-right: 35px;
  padding-left: 160px;
}

.mark {
  height: 240px;
  width: 1260px;
  line-height: 50px;
  padding-top: $normal_gap_left;
  padding-left: $normal_gap_left;
  padding-right: $normal_gap_left;
  padding-bottom: $normal_gap_left;
  border-width: $condition-border + px;
  border-color: #CACCCF;
  font-size: $font_nav;
}
</style>
