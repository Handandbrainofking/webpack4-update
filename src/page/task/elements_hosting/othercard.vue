<template>
    <scroller class="card-ground">
      <div class="each-card" v-for="(item, idx) in submitedList" :key="idx">
        <div class="card-title">
          <text class="card-title-text">其他证件</text>
        </div>
        <div class="card-content">
          <div class="each-card-content">
            <only-read :label="labelList.accountName" :content="item.accountName"></only-read>
          </div>
          <remark-read :label="labelList.remark" :content="item.remark" :content-width="1700" :content-size="30" :input-height="130"></remark-read>
        </div>
      </div>
      <div class="each-card" v-for="(item, otherindex) in iditem" :key="otherindex">
        <div class="card-title tosubmit-title">
          <text class="card-title-text">其他证件</text>
          <div class="btn-delete-wrap" @click="deleteOtherCard(otherindex)">
            <d-image src='/image/button_delete.png' width="32" height="32"></d-image>
          </div>
        </div>
        <div class="card-content">
          <input-view
            class="item"
            :dataItem="item.accountName"
            @changeValue="accountNameInput(otherindex, $event)"></input-view>
          <div>
            <div class="mark-tip-wrap">
              <text class="mark-tip">{{ long(item.remark.text) }}/200</text>
            </div>
            <div class="yxzl">
              <div class="yxzl-width">
                <text class="yxzl-text">备注</text>
              </div>
              <textarea class="remark-content" rows="5" placeholder="请输入备注信息" maxlength="200" v-model="item.remark.text" @input="doInputMark(otherindex)"></textarea>
            </div>
          </div>
        </div>    
        <div v-if="deleteFlag" class="mask-requirements" @click="preventMaskClick"></div>  
      </div>
      <div class="btn-add-wrap" @click="doAddOtherCard">
        <div class="btn-margin">
          <d-image src="/image/icon_addsell.png" width="34" height="34"></d-image>
        </div>
        <text class="btn-add-text">添加其他证件</text>
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

const eachOtherCard = {
  index: 1,
  accountName: {
    text: "",
    index: "",
    list: [],
    label: "证件名称",
    placeHolder: "请输入证件名称",
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
const tmpEachOtherCard = {
  index: 1,
  accountName: {
    text: "",
    index: "",
    list: [],
    label: "证件名称",
    placeHolder: "请输入证件名称",
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
  name: "", //要件托管其他证件
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
    }
  },
  created() {
    const applyNo = this.getPageParams("orderId", true) || 1;
    this.applyNo = applyNo;
  },
  beforeMount() {
    this.requestList();
    this.iditem = [this.deepCopy(eachOtherCard)];
  },
  data() {
    return {
      applyNo: "",
      accountType: "QT",
      iditem: [],
      submitedList: [],
      labelList: {
        accountName: "证件名称",
        remark: "备注"
      }
    };
  },
  computed: {},
  methods: {
    requestList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "projectAccountList"
        },
        success: data => {
          if (data.projectAccountList.length !== 0) {
            data.projectAccountList.forEach((item, index) => {
              if (item.accountType == this.accountType) {
                this.submitedList.push(item);
              }
            });
          }
        }
      });
    },
    doAddOtherCard() {
      let i = this.iditem.length + 1;
      var tmpInfo = this.deepCopy(
        Object.assign({}, tmpEachOtherCard, { index: i })
      );
      this.iditem.push(tmpInfo);
    },
    deleteOtherCard(index) {
      Vue.delete(this.iditem, index);
    },
    accountNameInput(idx, value) {
      this.iditem[idx].accountName.text = value;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
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
