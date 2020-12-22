<template>
  <wxc-dialog
     :show="true"
     width="1800"
     height="984"
     top="308"
     @wxcDialogConfirmBtnClicked="doSureChooseBankcard"
     @wxcDialogCancelBtnClicked="doCancelChooseBankcard">
    <div slot="title" class="title-wrap">
      <text class="title">银行卡选择</text>
    </div>
    <div class="content-wrap" slot="content">
      <div class="info-content">
        <div class="info-title">
          <div class="info-title-each">
            <text class="info-text">账号</text>
          </div>
          <div class="info-title-each">
            <text class="info-text">户名</text>
          </div>
          <div class="info-title-each">
            <text class="info-text">开户行</text>
          </div>
        </div>
        <scroller class="list-content">
          <div v-for="(item, index) in showList" :key="index">
            <div class="list-each" :class="[index == tmpindex ? choosed : nochoosed]" @click="choosePerson(index)">
              <div class="info-title-each" >
                <text class="list-text">{{ item.number }}</text>
              </div>
              <div class="info-title-each">
                <text class="list-text">{{ item.name }}</text>
              </div>
              <div class="info-title-each">
                <text class="list-text">{{ item.openBank }}</text>
              </div>
            </div>
          </div>
        </scroller>
      </div>
    </div>
  </wxc-dialog>
</template>

<script>
import WxcDialog from "../../../components/dialog/dialog.vue";
import loginApi from "../../../utils/login";

export default {
  name: "task-choose-entrust",
  components: {
    WxcDialog
  },
  props: {
    showList:{
      type: Array
    },
  },
  data() {
    return {
      returnInfo: {},
      choosed: "choosed",
      nochoosed: "",
      tmpindex: 1000
    };
  },
  methods: {
    choosePerson(index) {
      this.returnInfo = this.showList[index];
      this.tmpindex = index;
    },
    doSureChooseBankcard() {
      this.$emit("doSureChooseBankcard", this.returnInfo);
    },
    doCancelChooseBankcard() {
      this.$emit("doCancelChooseBankcard");
    }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../../css/common';

  .title-wrap {
    height: 88px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgba(2,179,180,1);
  }

  .title {
    font-size: 38px;
    color: #fff;
  }

  .content-wrap {
    height: 688px;
  }

  .info-content {
    flex: 1;
  }

  .info-title {
    height: 88px;
    background-color: #F5F6F9;
    flex-direction: row;
    justify-content: space-between;
  }

  .list-each {
    height: 88px;
    flex-direction: row;
    justify-content: space-between;
  }

  .info-title-each {
    width: 600px;
    justify-content: center;
    align-items: center;
  }

  .info-text {
    color: #677475;
    font-size: 30px;
  }

  .list-text {
    font-size: 30px;
    color: #21363D;
  }

  .list-content {
    flex: 1;
  }

  .choosed {
    background-color: #E5F7F7;
    /*background-image: linear-gradient(to right, #02B3B4, #1ABC9C);*/
  }
</style>