<template>
    <scroller class="card-ground">
      <div class="title" v-if="haveRansome">
        <text class="title-label">产证保管位置:</text>
        <text class="title-content">{{certificateKeep}}{{certificateKeepLocation}}</text>
      </div>
      <div class="each-card" v-for="(item, idx) in submitedList" :key="idx">
        <div class="card-title">
          <text class="card-title-text">房产证</text>
        </div>
        <div class="card-content">
          <div class="each-card-content">
            <only-read :label="labelList.type" :content="typeInCard(item.cardType)"></only-read>
          </div>
          <div class="each-card-content">
            <only-read :label="labelList.accountNo" :content="item.accountNo"></only-read>
          </div>
          <remark-read :label="labelList.remark" :content="item.remark" :content-width="1700"></remark-read>
        </div>
      </div>
      <div class="each-card" v-for="(item, houseindex) in iditem" :key="houseindex">
        <div class="card-title tosubmit-title">
          <text class="card-title-text">房产证</text>
          <div class="btn-delete-wrap" @click="deleteHouseCard(houseindex)">
            <d-image src='/image/button_delete.png' width="32" height="38"></d-image>
          </div>
        </div>
        <div class="card-content">
          <pick-view
            class="item"
            :pick-title="pickType"
            :dataItem="item.cardType"
            @changeValue="cardTypeSelect(houseindex, $event)"></pick-view>
          <input-view
            class="item"
            :dataItem="item.accountNo"
            @changeValue="accountNoInput(houseindex, $event)"></input-view>
          <div>
            <div class="mark-tip-wrap">
              <text class="mark-tip">{{ long(item.remark.text) }}/200</text>
            </div>
            <div class="yxzl">
              <div class="yxzl-width">
                <text class="yxzl-text">备注</text>
              </div>
              <textarea class="remark-content" rows="5" placeholder="请输入备注信息" maxlength="200" v-model="item.remark.text" @input="doInputMark(houseindex)"></textarea>
            </div>
          </div>
        </div>    
        <div v-if="deleteFlag" class="mask-requirements" @click="preventMaskClick"></div>
      </div>
      <div class="btn-add-wrap" @click="doAddHouseCard">
        <div class="btn-margin">
          <d-image src="/image/icon_addsell.png" width="34" height="34"></d-image>
        </div>
        <text class="btn-add-text">添加房产证</text>
        <div v-if="deleteFlag" class="mask-requirements add-button-mask"  @click="preventMaskClick"></div>
      </div>

    </scroller>
</template>

<script>
import SelectView from "../../../components/labelvalue/select.vue";
import PickView from "../../../components/labelvalue/pick.vue";
import InputView from "../../../components/labelvalue/input.vue";
import OnlyRead from "../components/common/only_read.vue";
import RemarkRead from "../components/common/remark_read.vue";
import successVue from "../../../components/dialog/success.vue";
import {
  ProductKindList,
  HOUSE_LAND_CERT_FLAG,
  Dist_List_Get
} from "../../../config/index";

const eachHouseCard = {
  index: 1,
  accountNo: {
    text: "",
    index: "",
    list: [],
    label: "产证/土地证编号",
    placeHolder: "请输入产证/土地证编号",
    isNeed: true
  },
  cardType: {
    text: "",
    index: "",
    list: [],
    label: "产证类型",
    placeHolder: "请选择产证类型",
    isNeed: true
  },
  remark: {
    text: "",
    index: "",
    list: [],
    label: "备注",
    isNeed: false
  }
};
const tmpEachHouseCard = {
  index: 1,
  accountNo: {
    text: "",
    index: "",
    list: [],
    label: "产证/土地证编号",
    placeHolder: "请输入产证/土地证编号",
    isNeed: true
  },
  cardType: {
    text: "",
    index: "",
    list: [],
    label: "产证类型",
    placeHolder: "请选择产证类型",
    isNeed: true
  },
  remark: {
    text: "",
    index: "",
    list: [],
    label: "备注",
    isNeed: false
  }
};

export default {
  name: "", //要件托管房产证
  components: {
    SelectView,
    PickView,
    InputView,
    OnlyRead,
    RemarkRead
  },
  props: {
     deleteFlag: {
      type: Boolean,
      default: false
    }},
  created() {
    const applyNo = this.getPageParams("orderId", true) || 1;
    this.applyNo = applyNo;
    const productType = this.getPageParams("productType", true) || 1;
    this.productType = productType;
    const haveRansome = ProductKindList[this.productType].haveRansom;
    this.haveRansome = haveRansome;
  },
  beforeMount() {
    this.houseTypeList = Dist_List_Get(HOUSE_LAND_CERT_FLAG);
    eachHouseCard["cardType"].list = Dist_List_Get(HOUSE_LAND_CERT_FLAG);
    tmpEachHouseCard["cardType"].list = Dist_List_Get(HOUSE_LAND_CERT_FLAG);
    this.requestList();
    this.iditem = [this.deepCopy(eachHouseCard)];
  },
  data() {
    return {
      applyNo: "",
      accountType: "FDCZ",
      iditem: [],
      submitedList: [],
      labelList: {
        accountNo: "产证/土地证编号",
        type: "产证类型",
        remark: "备注"
      },
      houseTypeList: [],
      houseList: [],
      landCertList: [],
      certificateKeep: "",
      certificateKeepLocation: "",
      pickType: '产证类型'
    };
  },
  computed: {},
  methods: {
    requestList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "projectAccountList,houseList,landCertList,applyOrderExtend"
        },
        success: data => {
          if (data.projectAccountList.length !== 0) {
            data.projectAccountList.forEach((item, index) => {
              if (item.accountType == this.accountType) {
                this.submitedList.push(item);
              }
            });
          }
          this.houseList = data.houseList || [];
          this.landCertList = data.landCertList || [];
          if(data.applyOrderExtend) {
            this.dealLoaction(data.applyOrderExtend);
          }
        }
      });
    },
    doAddHouseCard() {
      let i = this.iditem.length + 1;
      var tmpInfo = this.deepCopy(
        Object.assign({}, tmpEachHouseCard, { index: i })
      );
      this.iditem.push(tmpInfo);
    },
    deleteHouseCard(index) {
      Vue.delete(this.iditem, index);
    },
    cardTypeSelect(idx, value) {
      this.iditem[idx].cardType.text = value;
      if(this.iditem[idx].cardType.text == "02" && this.landCertList[0].landParcelNo) {
          this.iditem[idx].accountNo.text = this.landCertList[0].landParcelNo;
      }
      for(var i in this.houseList) {
        if(this.iditem[idx].cardType.text == this.houseList[i].certType) {
          this.iditem[idx].accountNo.text = this.houseList[i].houseCertNo;
        }
      }
    },
    accountNoInput(idx, value) {
      this.iditem[idx].accountNo.text = value;
    },
    typeInCard(e) {
      for(var i in this.houseTypeList) {
        if(this.houseTypeList[i].key == e) {
          return this.houseTypeList[i].name;
        }
      }
    },
    dealLoaction(e) {
      if(e.certificateKeep == 1) {
        this.certificateKeep = "自留";
      }else if(e.certificateKeep == 2) {
        this.certificateKeep = "银行/其他机构";
      }
      if(e.certificateKeepLocation) {
        this.certificateKeepLocation = e.certificateKeepLocation;
      }
    },
    doInputMark(e) {
      const value = this.iditem[e].remark.text;
      if(this.iditem[e].remark.text.length > 200) {
        this.iditem[e].remark.text = value.substring(0, 200);
      }
    },
    long(e) {
      return e.length;
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
  padding-bottom: 360px;
  height: 1400px;
  flex: 1;
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
  width: 1000px;
}
.title {
  margin-left: 20px;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 20px;
}
.title-label {
  font-size: 34px;
  color: #21363D;
}
.title-content {
  font-size: 34px;
  color: #030606;
}
.remark-content {
  width: 1200px;
  height: 320px;
  line-height: 50px;
  padding-top: $normal_gap_left;
  padding-left: $normal_gap_left;
  padding-right: $normal_gap_left;
  padding-bottom: $normal_gap_left;
  margin-left: 35px;
  border-width: $condition-border + px;
  border-color: #CACCCF;
  border-radius: 4px;
  font-size: $font_nav;
}
.mark-tip-wrap {
  margin-left: 1480px;
  flex-direction: row-reverse;
}
.mark-tip {
  color: $color_back;
  font-size: $font_small;
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
    height:600px;
}
.add-button-mask {
  height: 68px;
}
</style>
