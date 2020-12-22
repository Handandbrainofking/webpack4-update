<template>
<task-base-layout
  ref="task-base-layout"
  :need-mark="false"
  @commitClick="doSubmit"
  @saveClick="doSave"
  :matter-key="AccountTest"
  :show-footer-btn="false"
  :need-upload="needUpload">
  <div slot="content">
    <div class="content" v-if="needUpload">
      <div class="each-card" v-for="(card, index) in showCardList" :key="index">
        <div class="each-card-line">
          <div class="name-width"><text class="each-card-line-text">{{ card.accountName }}</text></div>
          <div class="no-width"><text class="each-card-line-text">{{ card.accountNo }}</text></div>
          <div class="bank-width"><text class="each-card-line-text">{{ card.bankName }}</text></div>
          <div class="test-width" @click="showshowshow(card)">
            <text class="each-card-line-text test">测试</text>
          </div>
        </div>
        <div class="each-card-content" v-for="(record, idx) in testshow(card.id)" :key="idx">
          <text-value :label="testResult" :content="record.testResult==='Y'?'正常':'异常'"></text-value>
          <text-value :label="testChannel" :content="getTestChanel(record)"></text-value>
          <text-value :label="testTime" :content="formatDate(record.queryTime)"></text-value>
          <text-value :label="handleUserName" :content="record.handleUserName"></text-value>
          <text-value :label="remark" :content="record.remark" :content-width="1900" :content-size="30" :input-height="145"></text-value>
        </div>
      </div>
      <bank-card-test v-if="showEntrustInfo" @doSureChooseEntrust="doSureChooseEntrust" @doCancelChooseEntrust="doClosePopupEntrust"></bank-card-test>
    </div>
    <div v-if="!needUpload" class="no-data-content">
      <div class="no-data-content-image">
        <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
      </div>
      <text class="no-data-content-text">暂无数据</text>
    </div>
  </div>
</task-base-layout>
</template>

<script>
import TaskBaseLayout from "./components/common/base.vue";
import TaskHeadTitle from "./components/common/title.vue";
import UploadImageList from "../../components/upload/upload.vue";
import FooterButton from "./components/task_footer_button.vue";
import TaskOrderInfo from "./components/common/order-info.vue";
import TextValue from "./components/common/text_value.vue";
import BankCardTest from "./components/common/bankcard_test.vue";
import Dialog from "../../utils/dialog";
import {native_common_events,DEFINE_GET_LOCATION} from "@/utils/deal_native";
import loginApi from '@/utils/login';
import { native_eventStatistic } from '@/utils/deal_native'
import {DISC_TEST_CHANNEL,  Dist_List_Get} from '@/config/index'

export default {
  name: "", //账户测试
  statistics: 'taskAccounttest|跟单详情-账户测试',
  components: {
    TaskBaseLayout,
    TaskHeadTitle,
    UploadImageList,
    FooterButton,
    TaskOrderInfo,
    TextValue,
    BankCardTest
  },
  props: {
    traceItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      AccountTest: "AccountTest",
      showEntrustInfo: false,
      btns: [
        {
          name: "订单信息"
        }
      ],
      showCardList: [],
      testList: [],
      nowCard: {},
      showOrderInfo: false,
      applyNo: "",
      testResult: "账户状态",
      testChannel: "测试方式",
      testTime: "测试时间",
      handleUserName: "经办人",
      remark: "备注",
		  operatorLocationX: '0',
		  operatorLocationY:'0',
		  operatorAddress:'',
      needUpload: true
    };
  },
  created() {
    const applyNo = this.getPageParams("orderId", true) || 1;
    this.applyNo = applyNo;
     native_common_events(DEFINE_GET_LOCATION).then(data => {
            const tdata = this.toJSON(data);
            this.operatorLocationX = tdata.longitude || '0';
            this.operatorLocationY = tdata.latitude || '0';
            this.operatorAddress = tdata.address;
         }).catch(() => {
      });
  },
  beforeMount() {
    this.requestList();
  },
  methods: {
  		getTestChanel(record){
  			var dic = Dist_List_Get(DISC_TEST_CHANNEL);
  			for(var item in dic){
  				if(dic[item].key == record.testChannel){
  					return dic[item].name;
  				}
  			}  			
  		},
    testshow(e) {
      var tmpList = [];
      for (var i in this.testList) {
        if (this.testList[i].accountId == e) {
          var tmpRecord = {
            testResult: this.testList[i].testResult,
            testChannel: this.testList[i].testChannel,
            queryTime: this.formatDate(
              this.testList[i].testTime,
              "YYYY-MM-DD hh:mm:ss"
            ), //this.testList[i].testTime,
            handleUserName: this.testList[i].handleUserName,
            remark: this.testList[i].remark
          };
          tmpList.push(tmpRecord);
        }
      }
      return tmpList;
    },
    //获取账户测试的后台数据
    requestList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "projectAccountList,applyOrder"
        },
        success: data => {
          if (data.projectAccountList.length != 0) {
            for (var i in data.projectAccountList) {
              if (data.projectAccountList[i].accountType === "YHK") {
                this.showCardList.push(data.projectAccountList[i]);
              }
            }
            this.getAccountTestList();
          }
          if(this.showCardList.length === 0) {
            this.needUpload = false;
          }
        }
      });
    },
    getAccountTestList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "testRecordList"
        },
        success: data => {
          this.testList = data.testRecordList;
        }
      });
    },
    showshowshow(e) {
      if(!this.traceItem.relateId) {
        Dialog.toast("您没有办理账户测试的权限");
        return;
      }
      this.nowCard = e;
      this.showEntrustInfo = true;
    },
    doClosePopupEntrust() {
      this.showEntrustInfo = false;
    },
    doSureChooseEntrust(teststate, testtype, date, remark, userinfo) {
      if (!teststate.text || teststate.text === "" || !testtype.text || testtype.text === "" || date.text === '') {
        Dialog.toast("请输入必填信息");
        return;
      }
      const _info = [];
      const tmp = {
        accountId: this.nowCard.id,
        handleUserId: userinfo.id,
        handleUserName: userinfo.fullname,
        testTime: date.text,
        remark: remark,
        testChannel: testtype.text,
        testResult: teststate.text
      };
      _info.push(tmp);
      this.requestApi.order_info_save({
        data: {
          applyNo: this.applyNo,
          taskId: this.traceItem.relateId,
          data: {
            testRecordList: _info
          }
        },
        success: data => {
          this.requestApi.order_info_submit({
            data: {
            		opinion: remark,
              applyNo: this.applyNo,
              operatorLocationX:this.operatorLocationX,
              operatorLocationY:this.operatorLocationY,
              operatorAddress:this.operatorAddress,
              taskId: this.traceItem.relateId
            },
            success: data => {
              this.getAccountTestList();
              this.$emit("upDateTaskId");
              Dialog.toast("提交成功");
            }
          });
        }
      });
      this.showEntrustInfo = false;
    },
    // 点击头部的按钮
    doClickHeadBtn(item, index) {
      if (index === 0) {
        this.showOrderInfo = true;
      }
    },
    updateImageList() {},
    doClosePopupOrder() {
      this.showOrderInfo = false;
    },
    doValidate(needValidate) {
      const productType = Number(this.productType);
      const { info } = this;

      let tmp,
        i = 0,
        _info = {};
      for (i in info) {
        tmp = info[i];
        if (!tmp.readOnly && (tmp.productType & productType) > 0) {
          if (needValidate && tmp.isNeed) {
            if (tmp.text === "") {
              Dialog.toast(tmp.placeHolder);
              return;
            }
          }
          if (tmp.text) {
            _info[i] = tmp.text;
          }
        }
      }
      return _info;
    },
    // 提交数据
    doSubmit() {
      native_eventStatistic('AccountTestSubmit', '账户测试-提交（task_accounttest.vue）')
      const _info = this.doValidate(true);
    },
    // 保存数据
    doSave(func) {
      native_eventStatistic('AccountTestSave', '账户测试-保存（task_accounttest.vue）')
      const _info = this.doValidate();
      "function" === typeof func && func();
    }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
@import './components/interview/customer';

.each-card {
  width: 2280px;
}

.each-card-line {
  height: 100px;
  background-color: $color_card_title;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 24px;
  border-radius: 4px;
}

.each-card-content {
  flex-direction: row;
  flex-wrap: wrap;
  background-color: $color_card_content;
  border-width: 1px;
  border-top-color: #EBEBEB;
  border-bottom-color: $color_card_content;
  border-left-color: $color_card_content;
  border-right-color: $color_card_content;
  border-radius: 4px;
  padding-bottom: 20px;
}

.each-card-line-text {
  font-size: $font_nav;
  color: $color_nav;
  text-align: center;
}

.test {
  color: $btn_border_focus;
}

.content {
  align-items: center;
}

.name-width {
  width: 280px;
}
.no-width {
  width: 800px;
}
.bank-width {
  width: 806px;
}
.test-width {
  width: 394px;
}
.no-data-content {
  padding-top: 220px;
  align-items: center;
}
.no-data-content-image {
  margin-bottom: 60px;
}
.no-data-content-text {
  font-size: 34px;
  color: #677475;
}
</style>
