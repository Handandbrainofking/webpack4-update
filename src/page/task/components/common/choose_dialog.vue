<template>
  <wxc-dialog
     :show="true"
     width="1600"
     height="984"
     :top="dialogTop"
     @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked"
     @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked">
    <div slot="title" class="title-wrap">
      <text class="title">{{ dialogTitle }}</text>
    </div>
    <div class="content-wrap" slot="content">
      <div v-if="hasSearch" class="search-content">
        <div class="search-wrap">
          <d-image src="/image/search.png" width="36" height="38"></d-image>
          <input class="input" return-key-type="search" type="text" placeholder="搜索" @return="doSearch"/>
        </div>
      </div>
      <div class="info-content">
        <div class="info-title">
          <div v-for="(headitem, headidx) in headList" :key="headidx" class="info-title-each">
            <text class="info-text">{{ headitem.name }}</text>
          </div>
        </div>
        <scroller class="list-content">
          <div v-for="(bodyitem, bodyidx) in bodyList" :key="bodyidx">
            <div class="list-each" :class="[bodyidx === chooseidx ? choosed : nochoosed]" @click="chooseLine(bodyidx)">
              <div v-for="(item, idx) in headList" :key="idx" class="info-title-each">
                <text :class="[bodyidx === chooseidx ? choosedtext : nochoosedtext]">{{ bodyitem[item.key] }}</text>
              </div>
            </div>
          </div>
        </scroller>
      </div>
    </div>
  </wxc-dialog>
</template>

<script>
import WxcDialog from "../../../../components/dialog/dialog.vue";
import loginApi from "../../../../utils/login";

export default {
  name: "task-choose-entrust",
  components: {
    WxcDialog
  },
  props: {
    dialogTitle: {
      type: String
    },
    hasSearch: {
      type: Boolean,
      default: false
    },
    bodyList: {
      type: Array,
      default: []
    },
    headList: {
      type: Array,
      default: []
    },
    dialogTop: {
      type: Number,
      default: 308
    }
  },
  data() {
    return {
      returnObject: {},
      fullname: "",
      choosed: "choosed",
      nochoosed: "",
      choosedtext: "choosed-text",
      nochoosedtext: "list-text",
      chooseidx: -1
    };
  },
  methods: {
    chooseLine(e) {
      this.chooseidx = e;
      this.returnObject = this.bodyList[e];
    },
    doSearch(e) {
      this.$emit("doSearchChooseDialog", e.value);
    },
    wxcDialogConfirmBtnClicked() {
      this.$emit("doSureChooseDialog", this.returnObject);
    },
    wxcDialogCancelBtnClicked() {
      this.$emit("doCancelChooseDialog");
    }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../../../css/common';

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
    height: 768px;
  }

  .search-content {
    height: 120px;
    justify-content: center;
    align-items: center;
  }

  .search-wrap {
    width: 1000px;
    height: 60px;
    border-width: $condition-border + px;
    border-color: $color_weak;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }

  .input {
    height: 60px;
    width: 800px;
    border-width: 0;
    border-radius: 4px;
    background-color: transparent;
  }

  .info-content {
    flex: 1;
    padding-right: 100px;
    padding-left: 100px;
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
    border-bottom-width: 1px;
    border-bottom-color: #EEEEEE;
  }

  .info-title-each {
    width: 500px;
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
    background-color: #EBF0F6;
  }

  .choosed-text {
    font-size: 30px;
    color: #02B3B4;
  }
</style>
