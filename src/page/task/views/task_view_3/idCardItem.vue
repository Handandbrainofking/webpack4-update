<!--
  function: IdCardItem
  author  : wq
  update  : 2019/1/24 11:47
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
     @change="changeName"
     @input="changeValue">
  </task-base-view>
</template>

<script>
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { RequirementsIdCardItem } from '@/page/task/config'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import { RELATION_TYPE_JY, RELATION_TYPE_NJY, Dist_List_Get } from '@/config'

export default {
  name: 'idCardItem',
  components: {
    TaskBaseView
  },
  mixins: [MixinTaskViewIndex, MixinTaskIndex],
  props: {
    dataItem: {
      type: Object,
      default: () => ({})
    },
    personList: {
      type: Array,
      default: () => ([])
    },
    applyNo: {
      type: String
    },
    applyOrder: {
      type: Object
    },
    accountType: {
      type: String
    }
  },
  data() {
    return {
      info: this.deepCopy(RequirementsIdCardItem)
    }
  },
  methods: {
    afterCreated() {
      const dataItem = this.dataItem || {}
      const info = this.info
      const productCode = this.productCode
      const accountNameItem = this.findItemByNameBlock(info, 'accountName')
      const personList = accountNameItem.list = this.personList
      const cardTypeItem = this.findItemByNameBlock(info, 'cardType')
      const isServer = dataItem.isServer
      if (this.isDealProduct(productCode)) {
        cardTypeItem.list = Dist_List_Get(RELATION_TYPE_JY)
      } else {
        cardTypeItem.list = Dist_List_Get(RELATION_TYPE_NJY)
      }
      this.initData()
      if (isServer) {
        info.forEach(item => {
          if (item.key === 'cardType') {
            // 从客户列表里面获取客户数据
            const accountNoItem = this.findItemByNameBlock(info, 'accountNo')
            const personItem = this.getItemByName(personList, accountNoItem.value, 'accountNo')
            item.value = this.getKeyByName(item.list, personItem.relation, 'key', 'name')
          }
          item.type = 'text'
          item.hasChoose = false
          item.hasBorder = false
        })
      }
    },
    changeName(key, idx, item, selectItem) {
      if (key === 'accountName') {
        this.valueChanged = true
        this.chooseCustomer(idx, selectItem, item)
      }
    },
    changeValue(key, idx, item, value, ...args) {
      const _value = item.value
      const info = this.info
      if (_value !== value) {
        this.valueChanged = true
        if (Array.isArray(key) && key.length === 2) {
          this.$set(info, idx, Object.assign({}, item, { values: [value, name], value, changed: true }))
        } else {
          this.$set(info, idx, Object.assign({}, item, { value, changed: true }))
        }
      }
    },
    // 选择客户姓名
    chooseCustomer(idx, selectItem, item) {
      const info = this.info
      const accountNoItem = this.findItemByNameBlock(info, 'accountNo')
      const cardTypeItem = this.findItemByNameBlock(info, 'cardType')
      accountNoItem.value = selectItem.accountNo
      accountNoItem.changed = true
      cardTypeItem.value = this.getKeyByName(cardTypeItem.list, selectItem.relation, 'key', 'name')
      cardTypeItem.changed = true
      this.$nextTick(() => {
        console.log(info)
      })
    },
    doValidate(bool) {
      if (!this.showBtns || this.dataItem.isServer) {
        return true
      }
      const info = this.info
      if (info.map(item => item.value).join('') === '') {
        return true
      }
      let resultInfo = this.validBaseData(bool, true, '身份证' + this.dataItem.sortIdx + ': ')
      if (resultInfo === false) {
        return false
      }
      else if (resultInfo === true) {
        return true
      }
      else if (typeof resultInfo === 'object') {
        const obj = {
          projectAccountList: Object.assign({}, resultInfo, { accountType: this.accountType, cardType: 'CER' })
        }
        return this.dealSaveDataObjectToArray(obj)
      }
      return true
    }
  }
}
</script>
