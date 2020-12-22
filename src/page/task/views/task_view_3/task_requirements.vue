<!-- 要件托管 -->
<template>
  <task-base-view
     ref="task-base-view"
     :has-head="false"
     :has-upload="false"
     :apply-no="applyNo"
     :show-footer-btn="showBtns"
     :bottom-btns="bottomBtns"
     @clickBottomBtn="clickBottomBtn">
    <DTab
       v-if="showChildren"
       ref="d-tab-set"
       mode="bottom-short"
       :swipe-change="true"
       :isScrollTab="false"
       tabInitIndex="3"
       :page-width="tabPageWidth"
       :page-height="showBtns ? tabPageHeight : (tabPageHeight + 120)"
       :tab-styles="{ height: 120, headWrapStyle: {paddingTop: '10px'} }">
      <d-layout slot="tab-title-other" text-align="right" @clickLayout="doStop">
        <d-layout class="title-other-wrap" :full-parent="false" @clickLayout="showOrderPopup">
          <text class="btn-list-text">订单信息</text>
          <d-image src="/image/icon_detail.png" width="40" height="40"></d-image>
        </d-layout>
      </d-layout>
      <DTabPage
         :title="item.title"
         :key="`task-tab-page-${index}`" v-for="(item, index) in tabTitles">
        <component
           :ref="`valid-requirements-tab-${index}`"
           :applyOrder="applyOrder"
           :applyNo="applyNo"
           :traceItem="traceItem"
           :is="item.component"
           :show-btns="showBtns"
        ></component>
      </DTabPage>
    </DTab>
    <task-order-info v-model="isShowOrderPopup" :orderId="applyNo"></task-order-info>
  </task-base-view>
</template>

<script>
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import MixinTaskSave from '@/page/task/mixins/mixinTaskSave'
import BankCardList from './bankcardList.vue'
import IdCardList from './idCardList.vue'
import HouseList from './houseList.vue'
import OtherList from './otherList.vue'
import RemarkItem from './remark.vue'
import RadioList from './radioList.vue'
import TaskOrderInfo from '@/page/task/components/common/order-info.vue'
import loginApi from '@/utils/login'
import Dialog from '@/utils/dialog'

export default {
  name: 'taskRequirements',
  extends: ExtendTaskBaseView,
  components: {
    TaskBaseView,
    BankCardList,
    IdCardList,
    HouseList,
    OtherList,
    RemarkItem,
    RadioList,
    TaskOrderInfo
  },
  mixins: [MixinTaskIndex, MixinTaskSave],
  data() {
    return {
      bottomBtns: [ '提交'],
      showChildren: false,
      requestParams: ['applyOrder'],
      tabTitles: [
        {
          title: '银行卡',
          component: 'BankCardList'
        },
        {
          title: '身份证',
          component: 'IdCardList'
        },
        {
          title: '房产证',
          component: 'HouseList'
        },
        {
          title: '其他证件',
          component: 'OtherList'
        },
        {
          title: '备注信息',
          component: 'RemarkItem'
        },
        {
          title: '影像资料',
          component: 'RadioList'
        }
      ],
      tabPageHeight: 1228,
      tabPageWidth: 2444,
      isShowOrderPopup: false
    }
  },
  methods: {
    initOtherData() {
      const applyOrder = this.applyOrder
      const loginInfo = loginApi.getLoginData()
      if (loginInfo.id !== applyOrder.robUserId) {
        this.bottomBtns = ['提交']
      }
      this.showChildren = true
    },
    doStop() {
    },
    // 保存页面操作
    doSave(func) {
      if (typeof func === 'function') {
        func(true)
      }
    },
    doBaseCommit(func) {
      let info = true
      if (typeof this.doValidate === 'function') {
        info = this.doValidate(true)
      }
      if (info === false) {
        return new Promise(resolve => {
        })
      }
      // 处理请求数据
      if (info === true) {
        if (typeof func === 'function') {
          func()
        }
        else {
          Dialog.toast('没有修改数据，无需提交！')
        }
        return new Promise(resolve => {
          resolve(true)
        })
      } else {
        return this.saveRequest(info, null, true)
          .then(data => {
            return this.dealSubmitInfo(true, info, func, mark)
          })
      }
    },
    // 点击提交按钮
    doCommit(func) {
      return this.doBaseCommit(func).then(data => {
        if (data !== true) {

        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .title-other-wrap {
    padding-bottom: 20px;
    padding-right: 20px;
  }

  .btn-list-text {
    font-size: $font_nav;
    color: $color_back;
  }

</style>
