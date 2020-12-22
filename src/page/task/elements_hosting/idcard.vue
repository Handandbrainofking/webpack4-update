<template>
  <scroller class="card-ground" v-if="showView">
    <div class="title">
      <select-view class="item" :data-item="fitNodeposit" @changeValue="fitSelect"></select-view>
      <select-view class="item" :data-item="applyNodeposit" @changeValue="applySelect"></select-view>
       <div v-if="deleteFlag" class="mask-requirements add-button-mask"  @click="preventMaskClick"></div>
    </div>

    <div class="each-card" v-for="(item, idx) in submitedList" :key="idx">
      <div class="card-title">
        <text class="card-title-text">身份证-{{ item.accountName }}</text>
      </div>
      <div class="card-content">
        <div class="each-card-content">
          <only-read :label="labelList.accountName" :content="item.accountName"></only-read>
        </div>
        <div class="each-card-content">
          <only-read :label="labelList.accountNo" :content="item.accountNo"></only-read>
        </div>
        <div class="each-card-content">
          <only-read :label="labelList.type" :content="typeInPerson(item.accountNo)"></only-read>
        </div>
      </div>
    </div>
    <div class="each-card" v-for="(item, idindex) in iditem" :key="idindex">
      <div class="card-title tosubmit-title">
        <text class="card-title-text">身份证</text>
        <div class="btn-delete-wrap" @click="deleteIdCard(idindex)">
          <d-image src='/image/button_delete.png' width="32" height="38"></d-image>
        </div>
      </div>
      <div class="card-content">
        <pick-view
           class="item"
           :pick-title="pickIdname"
           :dataItem="item.accountName"
           @changeValue="accountNameSelect(idindex, ...arguments)"></pick-view>
        <only-read class="item" :label="labelList.accountNo" :content="item.accountNo.text"></only-read>
        <only-read class="item" :label="labelList.type" :content="typeInPerson(item.accountNo.text)"></only-read>
      </div>
      <div v-if="deleteFlag" class="mask-requirements" @click="preventMaskClick"></div>
    </div>
    <div class="btn-add-wrap" @click="doAddIdCard">
      <div class="btn-margin">
        <d-image src="/image/icon_addsell.png" width="34" height="34"></d-image>
      </div>
      <text class="btn-add-text">添加身份证</text>
      <div v-if="deleteFlag" class="mask-requirements add-button-mask"  @click="preventMaskClick"></div>
    </div>
  </scroller>
</template>

<script>
import SelectView from '../../../components/labelvalue/select.vue';
import PickView from '../../../components/labelvalue/pick.vue';
import InputView from '../../../components/labelvalue/input.vue';
import OnlyRead from '../components/common/only_read.vue';
import successVue from '../../../components/dialog/success.vue';
import {
  ProductKindList,
  RELATION_TYPE_JY,
  RELATION_TYPE_NJY,
  RELATION_TYPE_GUARANTY,
  Dist_List_Get
} from '../../../config/index';

const eachIdCard = {
  index: 1,
  accountName: {
    text: '',
    index: '',
    list: [],
    label: '客户姓名',
    placeHolder: '请选择客户',
    isNeed: true
  },
  accountNo: {
    text: '',
    index: '',
    list: [],
    label: '证件号码',
    placeHolder: '请输入证件号码',
    isNeed: true
  },
  relation: {
    text: '',
    index: '',
    list: [],
    label: '关系人类型',
    placeHolder: '请选择关系人类型',
    isNeed: true
  },
  cardType: {
    text: 'CER'
  }
};
const tmpEachIdCard = {
  index: 1,
  accountName: {
    text: '',
    index: '',
    list: [],
    label: '客户姓名',
    placeHolder: '请选择客户',
    isNeed: true
  },
  accountNo: {
    text: '',
    index: '',
    list: [],
    label: '证件号码',
    placeHolder: '请输入证件号码',
    isNeed: true
  },
  relation: {
    text: '',
    index: '',
    list: [],
    label: '关系人类型',
    placeHolder: '请选择关系人类型',
    isNeed: true
  },
  cardType: {
    text: 'CER'
  }
};
export default {
  name: '', //要件托管身份证
  components: {
    SelectView,
    PickView,
    InputView,
    OnlyRead
  },
  props: {
     deleteFlag: {
      type: Boolean,
      default: false
    }
  },
  created() {
    const applyNo = this.getPageParams('orderId', true) || 1;
    const productType = this.getPageParams('productType', true) || 1;
    this.applyNo = applyNo;
    this.productType = productType;
    if (ProductKindList[this.productType].kind % 10 == 1) {
      //交易类
      this.relationList = Dist_List_Get(RELATION_TYPE_JY);
      eachIdCard['relation'].list = Dist_List_Get(RELATION_TYPE_JY);
      tmpEachIdCard['relation'].list = Dist_List_Get(RELATION_TYPE_JY);
    } else if (ProductKindList[this.productType].kind % 10 == 2) {
      this.relationList = Dist_List_Get(RELATION_TYPE_NJY);
      eachIdCard['relation'].list = Dist_List_Get(RELATION_TYPE_NJY);
      tmpEachIdCard['relation'].list = Dist_List_Get(RELATION_TYPE_NJY);
    }
    this.requestList();
  },
  data() {
    return {
      showView: false,
      applyNo: '',
      accountType: 'SFZ',
      iditem: [eachIdCard],
      submitedList: [],
      labelList: {
        accountName: '客户姓名',
        accountNo: '证件号码',
        type: '关系人类型'
      },
      productType: '',
      personList: [],
      relationList: [],
      fitNodeposit: {
        text: '',
        label: '是否符合身份证免托管政策',
        list: [
          {
            key: 'Y',
            name: '是'
          },
          {
            key: 'N',
            name: '否'
          }
        ],
        placeHolder: '请选择是否符合身份证免托管政策',
        index: -1,
        isNeed: true,
        labelWidth: 500
      },
      applyNodeposit: {
        text: '',
        label: '是否申请身份证免托管',
        list: [
          {
            key: 'Y',
            name: '是'
          },
          {
            key: 'N',
            name: '否'
          }
        ],
        placeHolder: '请选择是否申请身份证免托管',
        index: -1,
        isNeed: true,
        labelWidth: 500
      },
      ifFitNodeposit: true,
      ifApplyNodeposit: true,
      pickIdname: '客户姓名'
    };
  },
  computed: {},
  methods: {
    requestList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: 'projectAccountList,customerRelList,applyOrderExtend'
        },
        success: data => {
          if (data.projectAccountList.length !== 0) {
            data.projectAccountList.forEach((item, index) => {
              if (item.accountType == this.accountType) {
                this.submitedList.push(item);
              }
            });
          }
          if (data.customerRelList.length !== 0) {
            let customerList = [];
            for (var i in data.customerRelList) {
              customerList.push({
                name: data.customerRelList[i].customer.name,
                key: data.customerRelList[i].customer.name,
                accountNo: data.customerRelList[i].customer.idCardNo,
                relation: data.customerRelList[i].relation
              });
              eachIdCard['accountName'].list = customerList;
              tmpEachIdCard['accountName'].list = customerList;
              var tempPerson = {
                accountName: data.customerRelList[i].customer.name,
                accountNo: data.customerRelList[i].customer.idCardNo,
                relation: data.customerRelList[i].relation
              };
              this.personList.push(tempPerson);
            }
            let tmpInfo = this.deepCopy(Object.assign({}, eachIdCard))
            this.iditem = [tmpInfo];
          }
          if (data.applyOrderExtend) {
            this.fitNodeposit.text = data.applyOrderExtend.identityUntrusteeshipPolicy || '';
            this.applyNodeposit.text = data.applyOrderExtend.identityUntrusteeshipApply || '';
            if (data.applyOrderExtend.identityUntrusteeshipPolicy === 'Y') {
              this.fitNodeposit.index = 0;
            } else if (data.applyOrderExtend.identityUntrusteeshipPolicy === 'N') {
              this.fitNodeposit.index = 1;
            }
            if (data.applyOrderExtend.identityUntrusteeshipApply === 'Y') {
              this.applyNodeposit.index = 0;
            } else if (data.applyOrderExtend.identityUntrusteeshipApply === 'N') {
              this.applyNodeposit.index = 1;
            }
          }
          this.showView = true;
        }
      });
    },
    doAddIdCard() {
      let i = this.iditem.length + 1;
      var tmpInfo = this.deepCopy(
        Object.assign({}, tmpEachIdCard, { index: i })
      );
      this.iditem.push(tmpInfo);
    },
    deleteIdCard(index) {
      Vue.delete(this.iditem, index);
    },
    fitSelect(value) {
      this.fitNodeposit.text = value;
    },
    applySelect(value) {
      this.applyNodeposit.text = value;
    },
    accountNameSelect(idx, value, name, item) {
      this.iditem[idx].accountName.text = value
      this.iditem[idx].accountNo.text = item.accountNo
      this.iditem[idx].relation.text = item.relation
      this.iditem[idx].accountNo.show = false
      this.iditem[idx].relation.show = false
    },
    accountNameInput(idx, value) {
      this.iditem[idx].accountName.text = value;
    },
    accountNoInput(idx, value) {
      this.iditem[idx].accountNo.text = value;
    },
    relationSelect(idx, value) {
      this.iditem[idx].relation.text = value;
    },
    typeInPerson(e) {
      for (var i in this.personList) {
        if (this.personList[i].accountNo == e) {
          for (var j in this.relationList) {
            if (this.relationList[j].key == this.personList[i].relation) {
              return this.relationList[j].name;
            }
          }
        }
      }
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

  .title {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
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
