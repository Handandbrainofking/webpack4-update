<template>
    <scroller class="card-ground">
      <div class="each-card" v-for="(item, idx) in submitedList" :key="idx">
        <div class="card-title">
          <text class="card-title-text">银行卡-{{ item.accountName }}</text>
        </div>
        <div class="card-content">
          <div class="each-card-content">
            <only-read :label="labelList.accountNo" :content="item.accountNo"></only-read>
          </div>
          <div class="each-card-content">
            <only-read :label="labelList.accountName" :content="item.accountName"></only-read>
          </div>
          <div class="each-card-content">
            <only-read :label="labelList.bankName" :content="item.bankName"></only-read>
          </div>
          <div class="each-card-content">
            <only-read :label="labelList.type" :content="typeInCard(item.cardType)"></only-read>
          </div>
        </div>
      </div>
      <div class="each-card" v-for="(item, yhkindex) in iditem" :key="yhkindex">
        <div class="card-title tosubmit-title">
          <text class="card-title-text">银行卡</text>
          <div class="btn-delete-wrap" @click="deleteBankCard(yhkindex)">
            <d-image src='/image/button_delete.png' width="32" height="38"></d-image>
          </div>
        </div>
        <div class="card-content">
          <div class="item" v-if="item.accountNo.show">
            <input-view
              :dataItem="item.accountNo"
              @changeValue="accountNoInput(yhkindex, $event)"></input-view>
              <div @click="doChangeStateChoose(yhkindex)">
                <text class="btn-choose btn-font">选择</text>
              </div>
              <div @click="openCamera(yhkindex)">
                <text class="btn-choose btn-font">拍摄</text>
              </div>
          </div>
          <div class="item" v-if="!item.accountNo.show">
            <only-read :label="item.accountNo.label" :content="item.accountNo.text" :content-width="420"></only-read>
            <div @click="openchoose(yhkindex)">
              <text class="btn-choose btn-font">选择</text>
            </div>
          </div>
          <input-view
            class="item"
            v-if="item.accountNo.show"
            :dataItem="item.accountName"
            @changeValue="accountNameInput(yhkindex, $event)"></input-view>
          <only-read class="item" v-if="!item.accountNo.show" :label="item.accountName.label" :content="item.accountName.text"></only-read>
          <div class="item" v-if="item.accountNo.show">
            <input-view
              :dataItem="item.bankName"
              @changeValue="bankNameInput(yhkindex, $event)"></input-view>
            <div @click="openbank(yhkindex)">
              <text class="btn-choose btn-font">选择</text>
            </div>
          </div>
          <only-read class="item" v-if="!item.accountNo.show" :label="item.bankName.label" :content="item.bankName.text"></only-read>
          <pick-view
            class="item"
            v-if="item.accountNo.show"
            :pick-title="pickBanktype"
            :data-item="item.cardType"
            @changeValue="cardTypeSelect(yhkindex, $event)"></pick-view>
          <only-read class="item" v-if="!item.accountNo.show" :label="item.cardType.label" :content="typeInCard(item.cardType.text)"></only-read>
          <choose-bankcard v-if="item.cardType.showchoosebankcard" :show-list="accountList" @doSureChooseBankcard="doSureChooseBankcard" @doCancelChooseBankcard="doCancelChooseBankcard"></choose-bankcard>
          <task-choose-org :no-show-city="true" :title="'银行列表'" v-model="item.bankName.showchoosebank" @doChooseOrg="doChooseOrg"></task-choose-org>
        </div>
        <div v-if="deleteFlag" class="mask-requirements" @click="preventMaskClick"></div>        
      </div>
      <div class="btn-add-wrap" @click="doAddBankCard">
        <div class="btn-margin">
          <d-image src="/image/icon_addsell.png" width="34" height="34"></d-image>
        </div>
        <text class="btn-add-text">添加银行卡</text>
        <div v-if="deleteFlag" class="mask-requirements add-button-mask"  @click="preventMaskClick"></div>
      </div>
      <open-bank-camera
        v-if="showCamera"
        v-model="showCamera"
        :applyNo="applyNo"
        fileType="OWNERACCOUNTQK"
        :customerNo="''"
        @doAnalysisImage="doAnalysisImage"></open-bank-camera>    
    </scroller>
</template>

<script>
import PickView from "../../../components/labelvalue/pick.vue";
import InputView from "../../../components/labelvalue/input.vue";
import OnlyRead from "../components/common/only_read.vue";
import successVue from "../../../components/dialog/success.vue"
import OpenBankCamera from '../components/common/bank_camera.vue';//拍照
import ChooseBankcard from './choose_bankcard.vue';
import TaskChooseOrg from '../components/common/choose_org.vue';
import {
  ProductKindList,
  ACCOUNT_TYPE,
  ACCOUNT_TYPE_CASH,
  Dist_List_Get,
  UPLOAD_ID_CARD_TYPE
} from "../../../config/index";
import {native_logMessage} from '@/utils/deal_native';

const eachBankCard = {
  index: 1,
  accountNo: {
    text: "",
    index: "",
    list: [],
    label: "账号",
    placeHolder: "请输入账号",
    isNeed: true,
    show: true
  },
  accountName: {
    text: "",
    index: "",
    list: [],
    label: "户名",
    placeHolder: "请输入户名",
    isNeed: true,
    show: true
  },
  bankName: {
    text: "",
    index: "",
    list: [],
    label: "开户行",
    placeHolder: "请输入开户行",
    isNeed: true,
    show: true,
    disabled: true,
    showchoosebank:false
  },
  bankNo: {
    text: ""
  },
  cardType: {
    text: "",
    index: "",
    list: [],
    label: "账户类型",
    placeHolder: "请选择账户类型",
    isNeed: true,
    show: true,
    showchoosebankcard:false
  },
  url: {
    list: []
  }
};
const tmpEachBankCard = {
  index: 1,
  accountNo: {
    text: "",
    index: "",
    list: [],
    label: "账号",
    placeHolder: "请输入账号",
    isNeed: true,
    show: true
  },
  accountName: {
    text: "",
    index: "",
    list: [],
    label: "户名",
    placeHolder: "请输入户名",
    isNeed: true,
    show: true
  },
  bankName: {
    text: "",
    index: "",
    list: [],
    label: "开户行",
    placeHolder: "请输入开户行",
    isNeed: true,
    show: true,
    disabled: true,
    showchoosebank:false
  },
  bankNo: {
    text: ""
  },
  cardType: {
    text: "",
    index: "",
    list: [],
    label: "账户类型",
    placeHolder: "请选择账户类型",
    isNeed: true,
    show: true,
    showchoosebankcard:false
  },
  url: {
    list: []
  }
};
export default {
  name: "", //要件托管银行卡
  components: {
    PickView,
    InputView,
    OnlyRead,
    OpenBankCamera,
    ChooseBankcard,
    TaskChooseOrg
  },
  props: {
    deleteFlag: {
      type: Boolean,
      default: false
    }
  },
  created() {
    const applyNo = this.getPageParams("orderId", true) || 1;
    this.applyNo = applyNo;
    const productType = this.getPageParams("productType", true) || 1;
    this.productType = productType;
  },
  beforeMount() {
    if (ProductKindList[this.productType].kind > 20) {
      this.accountTypeList = Dist_List_Get(ACCOUNT_TYPE);
      eachBankCard["cardType"].list = Dist_List_Get(ACCOUNT_TYPE);
      tmpEachBankCard["cardType"].list = Dist_List_Get(ACCOUNT_TYPE);
    } else {
      this.accountTypeList = Dist_List_Get(ACCOUNT_TYPE_CASH);
      eachBankCard["cardType"].list = Dist_List_Get(ACCOUNT_TYPE_CASH);
      tmpEachBankCard["cardType"].list = Dist_List_Get(ACCOUNT_TYPE_CASH);
    }
    this.requestList();
    this.iditem = [this.deepCopy(eachBankCard)];
  },
  data() {
    return {
      productType: "",
      applyNo: "",
      accountType: "YHK",
      iditem: [],
      submitedList: [],
      labelList: {
        accountName: "户名",
        accountNo: "账号",
        bankName: "开户行",
        type: "账户类型"
      },
      accountTypeList: [],
      accountList: [],
      showCamera: false,
      tmpindex: 0,  //银行卡识别索引
      tmpbankindex: 0,//开户行索引
      tmpchooseindex: 0, //已录入银行卡索引
      pickBanktype: '账户类型'
    };
  },
  computed: {},
  methods: {
    requestList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "projectAccountList,accountList"
        },
        success: data => {
          if (data.projectAccountList.length !== 0) {
            data.projectAccountList.forEach((item, index) => {
              if (item.accountType == this.accountType) {
                this.submitedList.push(item);
              }
            });
          }
          this.accountList = data.accountList || [];
        }
      });
    },
    doAddBankCard() {
      let i = this.iditem.length + 1;
      var tmpInfo = this.deepCopy(
        Object.assign({}, tmpEachBankCard, { index: i })
      );
      this.iditem.push(tmpInfo);
    },
    deleteBankCard(index) {
      Vue.delete(this.iditem, index);
    },
    accountNoInput(idx, value) {
      this.iditem[idx].accountNo.text = value;
    },
    accountNameInput(idx, value) {
      this.iditem[idx].accountName.text = value;
    },
    bankNameInput(idx, value) {
      this.iditem[idx].bankName.text = value;
    },
    cardTypeSelect(idx, value) {
      this.iditem[idx].cardType.text = value;
    },
    typeInCard(e) {
      for(var i in this.accountTypeList) {
        if(this.accountTypeList[i].key == e) {
          return this.accountTypeList[i].name;
        }
      }
    },
    doAnalysisImage(data, fileId) {
      const bank = this.toJSON(data.bank);
      let tmp = [];
      if (bank.bankCardNumber) {
        this.iditem[this.tmpindex].accountNo.text = bank.bankCardNumber;
      }
      for (let i in fileId) {
        tmp.push(fileId[i]);
      }
      this.iditem[this.tmpindex].url.list = tmp;
    },
    doChangeState(e) {
      this.iditem[e].accountNo.text = "";
      this.iditem[e].accountName.text = "";
      this.iditem[e].bankName.text = "";
      this.iditem[e].cardType.text = "";
      this.iditem[e].accountNo.show = !this.iditem[e].accountNo.show;
    },
    doChangeStateChoose(e) {
      this.tmpchooseindex = e;
      this.iditem[e].cardType.showchoosebankcard = true;
    },
    doSureChooseBankcard(e) {
      this.iditem[this.tmpchooseindex].accountNo.show = 
      (e.number === undefined && e.name === undefined && e.openBank === undefined &&
      e.type === undefined) ? true :false;

      this.iditem[this.tmpchooseindex].accountNo.text = e.number || '';
      this.iditem[this.tmpchooseindex].accountName.text = e.name || '';
      this.iditem[this.tmpchooseindex].bankName.text = e.openBank || '';
      this.iditem[this.tmpchooseindex].cardType.text = e.type || '';
      this.iditem[this.tmpchooseindex].cardType.showchoosebankcard = false;
    },
    doCancelChooseBankcard() {
      this.iditem[this.tmpchooseindex].cardType.showchoosebankcard = false;
    },
    //打开已录入银行卡选择窗口
    openchoose(e) {
      this.tmpchooseindex = e;
      this.iditem[e].cardType.showchoosebankcard = true;
    },
    //打开银行卡识别
    openCamera(e) {
      this.tmpindex = e;
      this.showCamera = true;
    },
    //打开开户行选择
    openbank(e) {
      this.tmpbankindex = e;
      this.iditem[e].bankName.showchoosebank = true;
    },
    doChooseOrg(item) {
      this.iditem[this.tmpbankindex].bankName.text = item.bankName;
      this.iditem[this.tmpbankindex].bankNo.text = item.bankCode;
    },
    preventMaskClick(e){
      e.preventDefault()
    }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../components/interview/customer';

.card-ground {
  padding-top: 20px;
  padding-right: 100px;
  padding-left: 100px;
  flex: 1;
  padding-bottom: 360px;
  height: 1400px;
}
.each-card {
  width: 2220px;
  border-radius: 4px;
  border-color: #ddedf8;
  border-width: 2px;
  margin-bottom: 60px;
}
.card-title {
  height: 80px;
  padding-left: 20px;
  padding-right: 80px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}
.card-title-text {
  font-size: 30px;
  color: #21363d;
}
.tosubmit-title {
  background-color: #e8f3fb;
}
.card-content {
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
}
.each-card-content {
  height: 96px;
}
.yxzl {
  padding-left: 40px;
  padding-right: 40px;
  flex-direction: row;
}
.yxzl-width {
  margin-top: 31px;
  width: 330px;
}
.yxzl-text {
  color: #21363d;
  font-size: 34px;
  text-align: right;
}
.btn-add-text {
  font-size: 34px;
  color: $color_back;
}
.item {
  width: 1060px;
  flex-direction: row;
  align-items: center;
}
.camera-box {
  width: 92px;
  height: 72px;
  align-items: center;
  justify-content: center;
}
.btn-choose-text {
  color: $color_back;
  height: 72px;
  line-height: 72px;
  width: 65px;
  text-align: center;
  border-radius: 4px;
  margin-left: 20px;
  font-size: $font_normal;
}
.btn-choose {
  color: $color_back;
  height: 72px;
  line-height: 72px;
  width: 80px;
  text-align: center;
  margin-left: 10px;
}
.btn-font {
  font-size: $font_normal;
}
.btn-delete-wrap {
    height: 80px;
    width: 80px;
    align-items: center;
    justify-content: center;
}
.mask-requirements {
    position: absolute;
    bottom: 0;
    left: 0;
    width:2220px;
    height:350px;
}
.add-button-mask {
  height: 68px;
}
</style>
