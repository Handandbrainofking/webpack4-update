<template>
    <wxc-dialog
        :show="true"
        width="1600"
        height="584"
        top="336"
        @wxcDialogConfirmBtnClicked="doSureChooseOrg"
        @wxcDialogCancelBtnClicked="doCancelChooseOrg">
    <div slot="title" class="title-wrap">
        <text class="title">账户测试</text>
    </div>
    <div slot="content" class="content-wrap">
        <pick-view class="item" :pick-title="pickTeststate" :dataItem="teststate" @changeValue="changeStateValue($event)"></pick-view>
        <pick-view class="item" :pick-title="pickTesttype" :dataItem="testtype" @changeValue="changeTypeValue($event)"></pick-view>
        <pick-date-time-view
           class="item"
           :dataItem="testdate"
           @changeValue="changeDateValue($event)"></pick-date-time-view>
        <div class="remark-wrap">
          <div class="mark-tip-wrap">
            <text class="mark-tip">{{ remarkLength }}/200</text>
          </div>
          <div class="area-wrap">
            <text class="label">备注</text>
            <textarea class="mark" placeholder="请输入备注信息" maxLength="200" rows="5" v-model="remark" @input="doInputMark"></textarea>
          </div>
        </div>
    </div>
    </wxc-dialog>
</template>

<script>
import WxcDialog from "../../../../components/dialog/dialog.vue";
import PickView from "../../../../components/labelvalue/pick.vue";
import PickDateTimeView from "../../../../components/labelvalue/pickdatetime.vue";
import {TEST_CHANNEL, TEST_STATUS, Dist_List_Get} from '../../../../config/index';
import loginApi from '../../../../utils/login';

export default {
  name: "", //账户测试里的测试小窗口
  components: {
    WxcDialog,
    PickView,
    PickDateTimeView
  },
  created() {
    this.teststate.list = Dist_List_Get(TEST_STATUS);
    this.testtype.list = Dist_List_Get(TEST_CHANNEL);
    this.currentUserInfo = loginApi.getLoginData();
  },
  data() {
    return {
      teststate: {
        text: "",
        index: "",
        list: [],
        label: "测试状态",
        placeHolder: "请选择测试状态",
        labelWidth: 200,
        isNeed: true
      },
      testtype: {
        text: "",
        index: "",
        list: [],
        label: "测试方式",
        placeHolder: "请选择测试方式",
        labelWidth: 200,
        isNeed: true
      },
      testdate: {
        text: "",
        index: "",
        list: [],
        label: "测试时间",
        placeHolder: "请选择测试时间",
        labelWidth: 200,
        isNeed: true
      },
      remark: "",
      currentUserInfo: {},
      pickTeststate: '测试状态',
      pickTesttype: '测试方式'
    };
  },
  computed: {
    remarkLength: function() {
      return this.remark.length
    }
  },
  methods: {
    doInputMark() {
      const value = this.remark;
      if(this.remark.length > 200) {
        this.remark = value.substring(0, 200);
      }
    },
    changeStateValue(value) {
      this.teststate.text = value;
    },
    changeTypeValue(value) {
      this.testtype.text = value;
    },
    changeDateValue(value) {
      this.testdate.text = value;
    },
    doSureChooseOrg() {
      this.$emit("doSureChooseEntrust", this.teststate, this.testtype, this.testdate, this.remark, this.currentUserInfo);
    },
    doCancelChooseOrg() {
      this.$emit("doCancelChooseEntrust");
    }
  }
};
</script>

<style>
.title-wrap {
  height: 88px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(2, 179, 180, 1);
}

.title {
  font-size: 38px;
  color: #fff;
}

.content-wrap {
  height: 640px;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;

}

.item {
  width: 800px;
}

.remark-wrap{
    width: 1556px;
    flex-direction: column;
    justify-content: flex-start;
    height: 360px;
}

.mark-tip-wrap {
    flex-direction: row;
    justify-content: flex-end;
    flex: 1;
    text-align: right;
    height: 40px;
  }

  .mark-tip {
    color: #02B3B4;
    font-size: 26px;
  }

  .area-wrap {
    flex-direction: row;
    align-items: flex-start;
    /*height: 400px;*/
  }

  .label {
    color: #21363D;
    font-size: 34px;
    width: 200px;
    text-align: right;
  }

  .mark {
      flex: 1;
    /*width: 1200px;*/
    height: 320px;
    line-height: 50px;
    padding: 20px;
    margin-left: 35px;
    border-width: 2px;
    border-color: #CACCCF;
    font-size: 34px;
  }
</style>