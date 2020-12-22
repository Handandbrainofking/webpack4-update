<!--
  function: 处理基本的视图信息
  author  : wq
  update  : 2018/11/30 9:38
-->
<template>
  <d-layout kind="column" vertical-align="initial" text-align="initial">
    <template v-if="hasHead">
      <slot name="head">
        <task-base-head
           class="grey-line"
           :title="title"
           :tabs="tabs"
           :apply-no="applyNo"
           :is-order="isOrder"
           @clickHeadBtn="clickHeadBtn"
        ></task-base-head>
      </slot>
    </template>
    <slot>
      <task-base-product-form
         :info="info"
         :width="width"
         :show-children="showChildren"
         :stop-edit="!showFooterBtn"
         :has-upload="hasUpload"
         :data-list="reDataList"
         :apply-no="applyNo"
         :product-code="productCode"
         :matter-key="matterKey"
         :is-title-array-config="isTitleArrayConfig"
         @input="input"
         @change="change"
         @clickEnclosure="clickEnclosure">
        <template v-if="!!$scopedSlots[item.key]" v-for="item in slotList" :slot="item.key" slot-scope="configItem">
          <slot :name="item.key" :item="configItem"></slot>
        </template>
      </task-base-product-form>
    </slot>
    <template v-if="showFooterBtn && (!bottomBtns || bottomBtns.length > 0)">
      <footer-button :btns="bottomBtns" :not-btns="notBtns" @clickBtn="doClickBottomBtn" :not-btn-msg="notBtnMsg"></footer-button>
    </template>
    <bui-success-tip :msg="saveMessage.msg" v-model="saveMessage.showSuccess"></bui-success-tip>
    <bui-error-tip :msg="saveMessage.msg" v-model="saveMessage.showError"></bui-error-tip>
    <!-- <dialog-order-book
       v-if="bookOrder.show"
       :data-item="bookOrder.chooseItem"
       :flag="bookOrder.flag"
       :title="bookOrder.title"
       v-model="bookOrder.show"
       @orderReleaseSuccess="orderReleaseSuccess"
    ></dialog-order-book> -->
    <dialog-confirm
    :show="confirmSubmit.show"
    :title="confirmSubmit.title"
    :content="confirmSubmit.content"
    @wxcDialogCancelBtnClicked="cancelConfirm"
    @wxcDialogConfirmBtnClicked="clickConfirm"></dialog-confirm>
    <dialog-end
       v-if="stopTask.firstShow"
       v-model="stopTask.show"
       :apply-no="applyNo"></dialog-end>
    <task-choose-ground-bank
       v-if="firstShowGroundBank"
       :title="dialog.title"
       :product-id="dialog.productCode"
       v-model="showGroundBank"
       :capital-code="dialog.capitalCode"
       @doChooseOrg="doChooseGroundBank"></task-choose-ground-bank>
    <task-choose-org
       v-if="firstShowOrgChoose"
       :title="dialog.title"
       v-model="showOrgChoose"
       :no-show-city="true"
       @doChooseOrg="doChooseOrg"></task-choose-org>
    <open-bank-camera
       v-if="showBankCamera"
       v-model="showBankCamera"
       :applyNo="applyNo"
       :fileType="dialog.fileType"
       :customerNo="dialog.customerNo"
       @doAnalysisImage="doAnalysisImage"></open-bank-camera>
  </d-layout>
</template>

<script>
import TaskBaseHead from './comps/taskBaseTitle.vue'
import TaskBaseProductForm from './comps/taskBaseProductForm.vue'
import FooterButton from '@/page/task/components/task_footer_button.vue'
import BuiSuccessTip from '@/components/dialog/success.vue'
import DialogConfirm from '@/components/dialog/confirm.vue'
import BuiErrorTip from '@/components/dialog/error.vue'
// import DialogOrderBook from '@/components/dialog/order-book.vue'
import DialogEnd from '@/page/task/components/common/task_end_dialog.vue'
import TaskChooseOrg from '@/page/task/components/common/choose_org.vue'
import TaskChooseGroundBank from '@/page/task/components/common/chooseGroundBank.vue'
import OpenBankCamera from '@/page/task/components/common/bank_camera.vue'
import MixinTaskBaseLayout from './mixins/mixinTaskBaseLayout'
import MixinTaskBaseHead from './mixins/mixinTaskBaseHead'
import MixinTaskProductForm from './mixins/mixinTaskProductForm'
import LocalStorageManage from '@/utils/storage'

export default {
  name: 'taskViewBase',
  components: {
    TaskBaseHead,
    TaskBaseProductForm,
    FooterButton,
    BuiSuccessTip,
    BuiErrorTip,
    // DialogOrderBook,
    DialogConfirm,
    DialogEnd,
    TaskChooseOrg,
    TaskChooseGroundBank,
    OpenBankCamera
  },
  mixins: [MixinTaskBaseLayout, MixinTaskBaseHead, MixinTaskProductForm],
  data() {
    return {
      reDataList: [],
      saveMessage: {
        msg: '',
        showSuccess: false,
        showError: false
      },
      bookOrder: {
        title: '订单释放',
        flag: 2,
        chooseItem: {},
        show: false
      },
      stopTask: {
        firstShow: false,
        show: false
      },
      firstShowGroundBank: false,
      firstShowOrgChoose: false,
      showOrgChoose: false,
      showGroundBank: false,
      showBankCamera: false,
      dialog: {}
    }
  },
  computed: {
    slotList() {
      const slotScope = this.$scopedSlots || {}
      const list = []
      Object.keys(slotScope).forEach(item => {
        if (item.indexOf('slot-') === 0) {
          list.push({
            key: item,
            component: slotScope[item]
          })
        }
      })
      return list
    }
  },
  methods: {
    orderReleaseSuccess() {
      LocalStorageManage.getLocalStorage('PARAMS_LIST').then((data) => {
         if(data.length >2) {
          let localParams = JSON.parse(data.split('||')[1] || "") || {}
          localParams.searchParams = decodeURIComponent(localParams.searchParams)
          this.jump('/index.js', false, true, localParams)
         }
      })
    },
    // 下面的按钮部分
    doClickBottomBtn(...args) {
      this.$emit('clickBottomBtn', ...args)
    },
    // 终止业务
    doStopTask() {
      if (!this.stopTask.firstShow) {
        this.stopTask.firstShow = true
      }
      this.stopTask.show = true
    },
    // 保存成功
    doSaveSuccess(msg = '保存成功') {
      this.saveMessage.msg = msg
      this.saveMessage.showSuccess = true
    },
    // 保存失败
    doSaveError(msg = '保存失败') {
      this.saveMessage.msg = msg
      this.saveMessage.showError = true
    },
    // 提交成功
    doCommitSuccess(msg = '提交成功') {
      this.saveMessage.msg = msg
      this.saveMessage.showSuccess = true
    },
    // 提交失败
    doCommitError(msg = '提交失败') {
      this.saveMessage.msg = msg
      this.saveMessage.showError = true
    },
    // 打开机构银行选择
    doOpenChooseOrg(item) {
      this.dialog = item
      this.firstShowOrgChoose = true
      this.showOrgChoose = true
    },
    // 打开落地银行选择
    doOpenGroundBank(item) {
      this.dialog = item
      this.firstShowGroundBank = true
      this.showGroundBank = true
    },
    // 选择落地行
    doChooseGroundBank(item) {
      this.$emit('chooseGroundBank', item)
    },
    // 选择机构
    doChooseOrg(item) {
      this.$emit('chooseOrgBank', item)
    },
    openCamera(item) {
      this.dialog = item
      this.showBankCamera = true
    },
    doAnalysisImage(data, fileId) {
      this.$emit('analysisImage', data, fileId)
    },
    cancelConfirm() {
      this.$emit('cancelConfirm')
    },
    clickConfirm() {
      this.$emit('clickConfirm')
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .grey-line {
    @include setBorderBottom(#E5E6E7);
  }
</style>
