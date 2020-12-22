<!--
  function: 待办基本逻辑处理
  author  : wq
  update  : 2018/5/22 10:08
-->
<template>
  <div class="container-wrap">
    <slot v-if="needTitle" name="title">
      <task-head-title :title="title" :btns="btns" :if-order="true" @doClickBtn="doClickHeadBtn"></task-head-title>
      <div class="grey-line"></div>
    </slot>
    <div>
        <slot name="fundcontent"></slot>
        <slot name="fundplusbtn"></slot>
        <div class="block-mask" v-if="stopEdit" @click="doStop"></div>
    </div>
    <scroller class="scroll-wrap">
      <div class="scroll-wrap-inner">
        <slot name="content"></slot>
        <slot name="plusbtn"></slot>
        <div v-if="needMark" class="mark-tip-wrap" :style="{paddingRight: (labelWidth - 48) + 'px'}">
          <text class="mark-tip">{{ markNum }}/200</text>
        </div>
        <div v-if="needMark" class="area-wrap"
             :style="{paddingRight: (labelWidth - 48) + 'px', paddingLeft: (labelWidth - 48) + 'px'}">
          <text class="input-label">备注</text>
          <textarea class="mark" :value="mark" rows="5" placeholder="请输入备注信息" maxLength="200"
                    @input="doInputMark"></textarea>
        </div>
        <task-head-title v-if="needUpload && dataList.length > 0" title="资料上传"></task-head-title>
        <task-data-image-list
           v-if="needUpload"
           :title="item.name"
           :applyNo="applyNo"
           :fileType="item.typeNo"
           :customer-no="item.custNo"
           v-for="(item,index) in dataList"
           :key="`data-list-${index}`"></task-data-image-list>
        <div class="block-mask" v-if="stopEdit" @click="doStop"></div>
      </div>
    </scroller>
    <footer-button :btns="bottomBtns" v-if="showFooterBtn" :style="{marginTop: footerMargintop + 'px'}" @clickBtn="doClickBtn"></footer-button>
    <task-order-info v-model="showOrderInfo" :orderId="applyNo"></task-order-info>
    <bui-success-tip :msg="successSave.msg" v-model="successSave.show"></bui-success-tip>
    <bui-error-tip :msg="errorSave.msg" v-model="errorSave.show"></bui-error-tip>
    <slot name="plusfootbtn"></slot>
  </div>
</template>

<script>
  import TaskHeadTitle from './title.vue';
  import FooterButton from "../task_footer_button.vue";
  import BuiSuccessTip from '../../../../components/dialog/success.vue';
  import BuiErrorTip from '../../../../components/dialog/error.vue';
  import TaskOrderInfo from './order-info.vue';
  import TaskDataImageList from './data_image_list.vue';

  export default {
    name: "task-base-box",
    components: {
      TaskHeadTitle, FooterButton, TaskOrderInfo, BuiSuccessTip, BuiErrorTip, TaskDataImageList
    },
    props: {
      //  是否需要备注
      needMark: {
        type: Boolean,
        default: true
      },
      needTitle: {
        type: Boolean,
        default: true
      },
      // 是否需要资料上传
      needUpload: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: "信息录入"
      },
      labelWidth: {
        type: [String, Number],
        default: 320
      },
      mark: {
        type: String,
        default: ""
      },
      matterKey: {
        type: [String, Number],
        default: ""
      },
      showFooterBtn: {
        type: Boolean,
        default: true
      },
      stopEdit: {
        type: Boolean,
        default: false
      },
      bottomBtns: {
        type: Array,  
        default: () => (["保存", "提交"])
      },
      footerMargintop: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        btns: [{
          name: "订单信息"
        }],
        showOrderInfo: false,
        applyNo: "",
        successSave: {
          show: false,
          msg: '保存成功'
        },
        errorSave: {
          show: false,
          msg: '保存失败'
        },
        dataList: []
      }
    },
    created() {
      this.applyNo = this.getPageParams("orderId", true);
      this.needUpload && this.requestDataList(this.applyNo, this.getPageParams("productType", true));
    },
    computed: {
      markNum() {
        return this.mark.length;
      }
    },
    model: {
      prop: 'mark',
      event: 'inputMark'
    },
    methods: {
      // 请求资料列表
      requestDataList(applyNo, productId) {
        this.requestApi.task_data_list({
          data: {
            applyNo:applyNo,
            matterKey: this.matterKey,
            productId:productId
          },
          success: (data) => {
            this.dataList = this.dealDataTree(data || []);
          }
        });
      },
      // 处理返回的列表数据
      dealDataTree(data) {
        let list = [], tmp = null;
        for (let i in data) {
          tmp = data[i] || {};
          if (Array.isArray(tmp.children) && tmp.children.length > 0) {
            if (tmp.hasRelation === 1) {
              const tlist = this.dealDataTree(tmp.children).map(item => Object.assign({}, item, {
                hasRelation: true,
                typeNo: tmp.typeNo,
                name: item.name
              }));
              list = [...list, ...tlist]
            } else {
              list = [...list, ...(this.dealDataTree(tmp.children))]
            }
          } else {
            list.push(tmp)
          }
        }
        return list;
      },
      // 输入备注
      doInputMark(e) {
        this.$emit("inputMark", e.value)
      },
      // 点击头部的按钮
      doClickHeadBtn(item, index) {
        if (index === 0) {
          this.showOrderInfo = true;
        }
      },
      showSuccess(code, msg) {
        if (code === 0) {
          msg && (this.successSave.msg = msg);
          this.successSave.show = true;
        } else {
          msg && (this.errorSave.msg = msg);
          this.errorSave.show = true;
        }
      },
      doClickBtn(idx, item) {
        switch (item) {
          case "保存":
            this.doSave();
            break;
          case "提交":
            this.doSubmit();
            break;
          default:
            break;
        }
      },
      doSubmit() {
        this.$emit("commitClick");
      },
      doSave() {
        this.$emit("saveClick");
      },
      doReleaseSave() {
        this.$emit("doReleaseSave");
      },
      doStop() {
      }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import "../../css/mark";

  .container-wrap {
    flex: 1;
    flex-direction: column;
    padding-left: $normal_gap_left;
    padding-right: $normal_gap_left;
  }

  .scroll-wrap {
    flex-direction: column;
    flex: 1;
  }

  .scroll-wrap-inner {
    flex-direction: column;
  }

  .grey-line {
    border-bottom-width: 2px;
    border-bottom-color: #E5E6E7;
  }

  .block-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

</style>