<template>
    <div>
         <wxc-dialog
          :show="fundShow"
          :width:="2400"
          :height="1112"
          :top="244"
          @wxcDialogConfirmBtnClicked="doAddFund"  @wxcDialogCancelBtnClicked="doAddCancel" >
            <div slot="title" class="fund-title">
              <text class="fund-text">回款消息</text>
            </div>
            <div slot="content" class="content">
                 <d-row  class="header-row">
                   <d-col :span="11" >
                      <div class="mark-row">
                         <text class="mark-title">回款方式</text>
                         <text class="title-mark">*</text>
                      </div>
                   </d-col>
                   <d-col :span="19" >
                       <pick-list :size="fontSize" pick-title= "请选择回款方式" place-holder="请选择回款方式" class="pick-content" :searchList="FundBackType" v-model="settlWay"></pick-list>
                   </d-col>
                   <d-col :span="9">
                      <div class="mark-row">
                       <text class="mark-title">回款金额</text>
                       <text class="title-mark">*</text>
                      </div>
                    </d-col>
                    <d-col :span="19" >
                       <money-input class="input-content" placeholder= "请输入回款金额" v-model="transMoney"></money-input>
                    </d-col>
                  </d-row>
                  <d-row  class="header-row">
                   <d-col :span="11" >
                      <div class="mark-row">
                         <text class="mark-title">回款时间</text>
                         <text class="title-mark">*</text>
                      </div>
                   </d-col>
                   <d-col :span="19" >
                       <pick-date :width= "520" :height= "72" :size="fontSize" place-holder="请选择回款时间" class="date-content" v-model="transDay"></pick-date>
                   </d-col>
                   <d-col :span="9">
                      <div class="mark-row">
                       <text class="mark-title">收款账户卡号</text>
                       <text class="title-mark">*</text>
                      </div>
                    </d-col>
                    <d-col :span="16">
                      <div  style="flex-direction: row">
                       <input  class="input-content"  v-model="payeeAcctNo" placeholder="请选择收款账户卡号"/>
                      </div>
                    </d-col>
                    <d-col :span="3">
                     <text class="btn-choose" @click="doOpenChooseOrg">选择</text>
                    </d-col>
                  </d-row>
                   <d-row  class="header-row"  v-if="payeeAcctNo">
                   <d-col :span="11" >
                      <div class="mark-row">
                         <text class="mark-title">收款账户户名</text>
                      </div>
                   </d-col>
                   <d-col :span="19" >
                       <text class="input-content"> {{payeeAcct}} </text>
                   </d-col>
                   <d-col :span="9" >
                      <div class="mark-row">
                       <text class="mark-title">收款账户开户行</text>
                      </div>
                    </d-col>
                    <d-col :span="19">
                       <text class="input-content"> {{payeeBankName}}</text>
                    </d-col>
                  </d-row>
                  <d-row  class="header-row">
                   <d-col :span="11" >
                      <div class="mark-row">
                         <text class="mark-title">出款账户卡号</text>
                      </div>
                   </d-col>
                   <d-col :span="19" >
                       <input  class="input-content"  v-model="payerAcctNo" placeholder="请输入出款账户卡号"/>
                   </d-col>
                   <d-col :span="9" >
                      <div class="mark-row">
                       <text class="mark-title">出款账户户名</text>
                      </div>
                    </d-col>
                    <d-col :span="19">
                       <input class="input-content"  v-model="payerAcct" placeholder="请输入出款账户户名"/>
                    </d-col>
                  </d-row>
                                    <d-row  class="header-row">
                   <d-col :span="11" >
                      <div class="mark-row">
                         <text class="mark-title">出款账户开户行</text>
                      </div>
                   </d-col>
                   <d-col :span="19" >
                       <input  class="input-content"  v-model="payerBankName" placeholder="请输入出款账户开户行"/>
                   </d-col>
                   <d-col :span="9" >
                    </d-col>
                    <d-col :span="19">
                    </d-col>
                  </d-row>
                <div>
                 <div class="mark-tip-wrap" :style="{paddingRight: (labelWidth - 78) + 'px'}">
                  <text class="mark-tip">{{ marknode.length }}/200</text>
                 </div>
                 <div class="area-wrap">
                   <text class="input-label">备注</text>
                   <textarea class="mark" v-model="marknode" rows="5" placeholder="请输入备注信息" maxLength="200" @input="doInputMark"></textarea>
                 </div>
                </div>
            </div>
           
        </wxc-dialog>
         <task-choose-dialog v-if="dialogInfo" dialog-title= '公司账户列表' :body-list="dialogList" :head-list="dialogHead"
                           @doSureChooseDialog="doSureChooseDialog"
                           @doCancelChooseDialog="doCancelChooseDialog"
                        ></task-choose-dialog>
          <bui-success-tip :msg="successSave.msg" v-model="successSave.show"></bui-success-tip> 
    </div>
</template>

<script>
import TaskChooseDialog from "../components/common/choose_dialog.vue";
import WxcDialog from "@/components/dialog/dialog.vue";
import ReadOnly from "../components/common/only_read.vue";
import MoneyInput from "@/components/money/moneyInput.vue";
import PickList from "@/components/dropdown/pick.vue";
import PickDate from "@/components/dropdown/pickdate.vue";
import DCol from "@/core/Layout/DCol";
import DRow from "@/core/Layout/DRow";
import BuiSuccessTip from "@/components/dialog/success.vue";

import Dialog from "../../../utils/dialog";
import { mapState, mapActions } from "vuex";
export default {
  name: "task_add_backlist",
  components: {
    WxcDialog,
    TaskChooseDialog,
    PickDate,
    MoneyInput,
    PickList,
    DRow,
    DCol,
    BuiSuccessTip
  },
  data() {
    return {
      fontSize: 34,
      dialogInfo: false,
      settlWay: "",
      transMoney: "",
      transDay: "",
      payeeAcctNo: "",
      payeeAcct: "",
      payeeBankName: "",
      payerAcctNo: "",
      payerAcct: "",
      payerBankName: "",
      payeeBankCode: "",
      marknode: "",
      successSave: {
        show: false,
        msg: "保存成功"
      }
    };
  },
  props: {
    applyNo: {
      type: String,
      default: ""
    },
    fundShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("taskfund", ["FundBackType", "dialogHead"])
  },
  created(){},
  methods: {
    ...mapActions("taskfund", ["getCompanyList"]),
    doAddFund() {
      //字段校验
      let _data = {
        applyNo: this.applyNo,
        settlWay: this.settlWay,
        transMoney: this.transMoney,
        transDay: new Date(this.transDay).getTime(),
        payeeAcctNo: this.payeeAcctNo,
        payeeAcct: this.payeeAcct,
        payeeBankName: this.payeeBankName,
        payeeBankCode: this.payeeBankCode,
        payerAcct: this.payerAcct,
        payerAcctNo: this.payerAcctNo,
        payerBankName: this.payerBankName,
        remark: this.marknode
      };

      if (
        _data.settlWay &&
        _data.transMoney &&
        _data.transDay &&
        _data.payeeAcctNo
      ) {
        this.requestApi.fund_addback_account({
          data: _data,
          success: _data => {
            this.successSave.msg = "添加回款记录成功";
            this.successSave.show = true;
            this.$emit("doAddFund");
            (this.settlWay = ""),
              (this.transMoney = ""),
              (this.transDay = ""),
              (this.payeeAcctNo = ""),
              (this.payeeAcct = ""),
              (this.payeeBankName = ""),
              (this.payerAcctNo = ""),
              (this.payerAcct = ""),
              (this.payeeBankName = "");
            this.marknode = "";
          }
        });
      } else {
        Dialog.toast("请填写前四项必填信息");
      }
    },
    //取消
    doAddCancel() {
      this.$emit("doAddCancel");
      (this.settlWay = ""),
        (this.transMoney = ""),
        (this.transDay = ""),
        (this.payeeAcctNo = ""),
        (this.payeeAcct = ""),
        (this.payeeBankName = ""),
        (this.payerAcctNo = ""),
        (this.payerAcct = ""),
        (this.payeeBankName = "");
      this.marknode = "";
    },
    /*点击选择展开公司列表弹框*/
    doOpenChooseOrg() {
      console.log("订单号" + this.applyNo);
      let partnerCode = "";
      let that = this;
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "applyOrder"
        },
        success: data => {
          partnerCode = data.applyOrder.partnerInsuranceId;
          this.getCompanyList({ applyNo: this.applyNo, partnerCode }).then(
            companydata => {
              that.dialogList = companydata;
              that.dialogInfo = true;
            }
          );
        }
      });
    },
    /*确认选择带入收款账户卡号，收款账户户名，收款账户开户行*/
    doSureChooseDialog(e) {
      this.payeeAcctNo = e.accountNo;
      this.payeeAcct = e.accountName;
      this.payeeBankName = e.openBankName;
      this.payeeBankCode = e.openBankCode;
      this.dialogInfo = false;
    },
    doCancelChooseDialog() {
      this.dialogInfo = false;
    },
    doInputMark() {
      const value = this.marknode;
      if (this.marknode.length > 200) {
        this.marknode = value.substring(0, 200);
      }
    }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../components/interview/customer';
  @import '../../../css/common';
  @import '../../../components/labelvalue/input';

  .item {
    width: 1030px;
    flex-direction: row;
    align-items: center;
  }
  .row {
    width: 1030px;
    flex-direction: row;
    align-items: center;
    height: $input_label_height;
  }
  .header-row {
    width: 2000px;
    height: 106px;
  }
   .mark-title {
    color: #21363D;
    font-size: 34px;
  }
   .title-mark {
     color: red;
     font-size: 34px;
   }
   .fund-title{
    background-color: rgba(2,179,180,1);;
    border-radius: 4px 4px 0 0;
    height: 88px;
    justify-content:center;
  }
  .fund-text{
    line-height: 88px;
    font-size:38px;
    color: #FFFFFF;
    text-align: center;
  }
  .mark-tip-wrap {
    padding-right: $bigger_gap_left;
    flex-direction: row;
    margin-left: 1580px;
  }
  .pick-content {
    width: 520px;
    height: 72px;
    margin-left: 30px;
  }
  .date-content {
    border-width: 2px;
    border-color: #CACCCF;
    border-radius: 4px;
    margin-left: 30px;
  }
  .input-content {
    width: 520px;
    height: 72px;
    border-width: 2px;
    font-size: 34px;
    border-color: #CACCCF;
    border-radius: 4px;
    line-height: 70px;
    margin-left: 30px;
    padding-left: 16px;
  }
  .mark-tip {
    color: $color_back;
    font-size: $font_small;
    text-align:right;
  }
  .area-wrap {
    flex-direction: row;
    align-items: flex-start;
    height: 320px;
    margin-left:305px;
  }

  .mark {
    width: 1260px;
    height: 240px;
    line-height: 50px;
    padding-top: $normal_gap_left;
    padding-left: 16px;
    padding-right: $normal_gap_left;
    padding-bottom: $normal_gap_left;
    margin-left: 15px;
    border-width: $condition-border + px;
    border-color: #CACCCF;
    font-size: $font_nav;
    flex: 1;
  }
  .mark-row{
    flex: 1;
    justify-content: flex-end;
    flex-direction: row;
    justify-self: flex-end;
    padding-right: 20px;
  }
 .btn-choose {
    background-color: $color_light_focus;
    color: $color_back;
    height: 72px;
    line-height: 72px;
    width: 100px;
    text-align: center;
    border-radius: 4px;
  
    border-width: 2px;
    border-color: $color_back;
    font-size: $font_normal;
  }

  .input-label {
    font-size: $font_nav;
    color: $color_enclosure;
    padding-top: $normal_gap_left;
    padding-right: 20px;
  }
   .content {
    display:flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 40px;
    margin-right: 40px;
  }
</style>
