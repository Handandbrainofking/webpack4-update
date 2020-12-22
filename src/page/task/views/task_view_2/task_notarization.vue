<!-- 公证 -->
<template>
  <task-base-view
     ref="task-base-view"
     :show-children="showChildren"
     :info="info"
     :apply-no="applyNo"
     :matter-key="matterKey"
     :product-code="productCode"
     :show-footer-btn="showBtns"
     :bottom-btns="bottomBtns"
     :is-title-array-config="isTitleArrayConfig"
     @input="changeValue"
     @clickEnclosure="clickEnclosure"
     @clickBottomBtn="doClickBtn"
     @chooseGroundBank="doChooseGroundBank"
     @chooseOrgBank="doChooseOrg"
     @analysisImage="doAnalysisImage">
    <div
       style="width: 2406px; padding-top: 15px;"
       slot="slot-card-item"
       slot-scope="item">
      <d-add-list
         :list="filterList"
         :height="376"
         :can-edit-server="false"
         :server-list-has-color="false"
         server-title-symbol="principalNames"
         title="委托事项">
        <task-notarization-item
           slot-scope="cardItem"
           :ref="`valid-card-item-${cardItem.listItem.idx}`"
           :data-item="cardItem.listItem"
           :customer-list="customerList"
           :notarial-office-list="notarialOfficeList"
           @changeValue="innerChangeValue"></task-notarization-item>
      </d-add-list>
    </div>
  </task-base-view>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import { NotarizationItem } from '@/page/task/config'
import TaskNotarizationItem from './notarizationItem.vue'
import Dialog from '@/utils/dialog'

export default {
  name: 'taskNotarization', // 委托公证
  statistics: 'taskNotarization|跟单详情-委托公证',
  extends: ExtendTaskBaseView,
  components: {
    TaskBaseView,
    TaskNotarizationItem
  },
  mixins: [MixinTaskIndex],
  data() {
    return {
      info: NotarizationItem,
      bottomBtns: ['提交'],
      requestParams: ['applyOrder', 'customerRelList', 'orderMatterRecordList', 'notarizationInfoList'],
      notarialOfficeList: [],
      showChildren: false
    }
  },
  computed: {
    ...mapGetters(['customerRelList']),
    filterList() {
      const orderInfo = this.$store.state.orderInfo || {}
      return orderInfo.notarizationInfoList || []
    },
    customerList() {
      const customerRelList = this.customerRelList || []
      return customerRelList.map(item => ({
        key: item.customer.name,
        name: item.customer.name,
        idType: item.customer.idCardType,
        idNo: item.customer.idCardNo,
        role: item.role
      }))
    }
  },
  methods: {
    afterCreated() {
      this.productType = this.getProductType(this.productCode)
      Promise.all([
        this.requestOrderInfo(this.applyNo),
        this.getNotaryList()
      ]).then(data => {
        this.initData()
        this.initOtherData()
      })
    },
    initOtherData() {
      this.bottomBtns = ['提交']

      this.showChildren = true
    },
    // 获取公证处信息列表
    getNotaryList() {
      return new Promise(resolve => {
        this.requestApi.notary_info({
          success: data => {
            this.notarialOfficeList = (data || []).map(item => ({
              key: item.partnerName,
              name: item.partnerName
            }))
            resolve(data)
          }
        })
      })
    },
    // 字段校验
    doValidate(bool) {
      let resultInfo = this.validBaseData(bool)
      if (resultInfo === false) {
        return false
      }

      if(!bool){ //返回按钮触发的
      	return true;
      }
      else {
        const childrenValidate = this.validateChildren(bool)
        if (childrenValidate === false) {
          return false
        }
        let existChild = true
        if (childrenValidate === true) {
          existChild = false
        }
        if (resultInfo === true) {
          return childrenValidate
        }
        else if (typeof resultInfo === 'object') {
          if (!existChild) {
            return this.dealSaveDataObjectToArray(resultInfo)
          }
          else {
            return this.deepAssignObject(this.dealSaveDataObjectToArray(resultInfo), childrenValidate)
          }
        }
        return childrenValidate
      }
    },
    doBaseCommit(func) {
      const info = this.doValidate(true)
      if (info === false) {
        return new Promise(resolve => {
          resolve();
        })
      }
      // 处理请求数据
      if (info === true) {
        if (typeof func === 'function') {
          func(true)
        }
        else {
          Dialog.toast('没有修改数据，无需提交！')
        }
      } else {
        return this.saveRequest(info, result => {
          return result && this.dealSubmitInfo(true, info, func)
        }, true)
          .then((data, data1, data2) => {
          })
      }
    }
  }
}
</script>
