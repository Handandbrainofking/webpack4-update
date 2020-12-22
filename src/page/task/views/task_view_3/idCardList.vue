<!--
  function: idCardList
  author  : wq
  update  : 2019/1/24 11:29
-->
<template>
  <task-base-view
     ref="task-base-view"
     :info="info"
     :apply-no="applyNo"
     :product-code="productCode"
     :show-footer-btn="true"
     :bottom-btns="[]"
     :has-upload="false"
     :has-head="false"
     :show-children="true"
     @input="changeValue"
     @clickEnclosure="clickEnclosure"
     @chooseGroundBank="doChooseGroundBank">
    <d-add-list
       slot="slot-idcard-item" slot-scope="slotIdCardItem"
       style="height: 1000px"
       title="身份证"
       server-title-symbol="accountName"
       :can-edit-server="false"
       :server-list-has-color="false"
       :list="filterList"
       :height="280"
       :add-first-edit="true">
      <id-card-item
         :applyNo="applyNo"
         :applyOrder="applyOrder"
         slot-scope="cardItem"
         :show-btns="showBtns"
         :ref="`valid-idCard-item-${cardItem.listItem.idx}`"
         :person-list="personList"
         :accountType="accountType"
         :data-item="cardItem.listItem"
      ></id-card-item>
    </d-add-list>
  </task-base-view>
</template>

<script>
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'
import IdCardItem from './idCardItem.vue'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { RequirementsIdCardList } from '@/page/task/config'
import Dialog from '@/utils/dialog'

export default {
  name: 'idCardList',
  components: {
    IdCardItem,
    TaskBaseView
  },
  mixins: [MixinTaskIndex, MixinTaskViewIndex],
  props: {
    applyNo: {
      type: String
    },
    showBtns: {
      type: Boolean
    },
    applyOrder: {
      type: Object
    }
  },
  data() {
    return {
      requestParams: ['projectAccountList', 'customerRelList', 'applyOrderExtend'],
      accountType: 'SFZ',
      filterList: [],
      info: RequirementsIdCardList,
      personList: [],
      dataItem: {}
    }
  },
  methods: {
    afterCreated() {
      // 获取账户信息
      const applyNo = this.applyNo
      this.$store.dispatch('requestOrderInfo', {
        applyNo,
        relationKey: this.requestParams.join(',')
      }).then(data => {
        const list = data.projectAccountList || []
        const tmpList = []
        this.personList = data.customerRelList.map(item => ({
          key: item.customer.name,
          name: item.customer.name,
          accountNo: item.customer.idCardNo,
          relation: item.relation
        }))
        if (list.length > 0) {
          list.forEach((item, index) => {
            if (item.accountType === this.accountType) {
              tmpList.push(item)
            }
          })
          this.filterList = tmpList
        }
        this.dataItem = data.applyOrderExtend || {}
        this.initData()
      })
    },
    doValidate(bool) {
      if (!this.showBtns) {
        return true
      }
      const info = this.info
      let parentEmpty = false
      let resultInfo = {}
      /**
       * 这个地方原则上应该和房产证一样，上面的两个选项都是只读的，不做校验，如果这样，这个方法可以去掉和银行卡一样
       */
      if (info.map(item => item.value).join('') === '') {
        parentEmpty = true
      }
      if (!parentEmpty) {
        resultInfo = this.validBaseData(bool, true, '身份证' + ': ')
        if (resultInfo === false) {
          return false
        }
      }
      const childrenValidate = this.validateChildren(bool)
      if (childrenValidate === false) {
        return false
      }
      if (parentEmpty) {
        if (childrenValidate === true) {
          return true
        } else {
          Dialog.toast('身份证' + ': ' + '请选择是否符合身份证免托管政策和是否申请身份证免托管')
          return false
        }
      }
      let existChild = true
      if (childrenValidate === true) {
        existChild = false
      }
      if (resultInfo === true) {
        return childrenValidate
      }
      else if (typeof resultInfo === 'object') {
        const obj = {
          applyOrderExtend: resultInfo
        }
        if (!existChild) {
          return this.dealSaveDataObjectToArray(obj)
        }
        else {
          return this.deepAssignObject(this.dealSaveDataObjectToArray(obj), childrenValidate)
        }
      }
      return true
    }
  }
}
</script>
