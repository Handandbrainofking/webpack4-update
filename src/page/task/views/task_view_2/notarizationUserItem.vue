<!--
  function: notarizationItem
  author  : wq
  update  : 2018/12/21 10:18
-->
<template>
  <task-base-view
     ref="task-base-view"
     :info="info"
     :apply-no="applyNo"
     :product-code="productCode"
     :show-footer-btn="true"
     :bottom-btns="[]"
     :is-title-array-config="false"
     :has-upload="false"
     :has-head="false"
     :show-children="true"
     @input="changeValue"
     @clickEnclosure="clickEnclosure"
     @chooseGroundBank="doChooseGroundBank"
  ></task-base-view>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { NotarizationCustomerItem } from '@/page/task/config'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'

export default {
  name: 'notarizationItem',
  components: {
    TaskBaseView
  },
  mixins: [MixinTaskViewIndex],
  props: {
    index: {
      type: Number,
      default: 0
    },
    dataItem: {
      type: Object,
      default: () => ({})
    },
    customerList: {
      type: Array,
      default: () => ([])
    },
    isAddIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      info: this.deepCopy(NotarizationCustomerItem)
    }
  },
  computed: {
    ...mapGetters({
      applyOrder: 'applyOrder',
      'isWeBank': 'isWeBank'
    })
  },
  methods: {
    afterCreated() {
      const info = this.dealInfoCompatibleArray()
      const principalNamesItem = this.findItemByNameBlock(info, 'principalNames')
      const principalIdcardNoItem = this.findItemByNameBlock(info, 'principalIdcardNo')
      principalNamesItem.list = this.customerList
      const dataItem = this.dataItem || {}
      const isServer = dataItem.isServer
      if (isServer) {
        info.forEach(item => {
          item.type = 'text'
          item.hasChoose = false
          item.hasAdd = false
          item.hasMinute = false
          item.hasBorder = false
        })
      }
      else {
        if (this.isAddIcon) {
          principalIdcardNoItem.hasMinute = false
          principalIdcardNoItem.hasAdd = true
        }
        else {
          principalIdcardNoItem.hasAdd = false
          principalIdcardNoItem.hasMinute = true
        }
      }

      if(this.isWeBank){
        this.setData('principalIdcardNo', 'hasAdd', false)
        this.setData('principalIdcardNo', 'readonly', true)
      }

      this.initData()
    },
    changeValue(key, idx, item, value, name) {
      const info = this.info
      const _value = info[idx].value
      if (_value !== value) {
        this.valueChanged = true
        if (this.compareObj(key, 'principalNames')) {
          this.doEntrustPersonSelect(idx, value, item)
        }
        if (Array.isArray(item.key) && item.key.length === 2) {
          this.$set(info, idx, Object.assign({}, item, { value, values: [value, name], changed: true }))
        } else {
          this.$set(info, idx, Object.assign({}, item, { value, changed: true }))
        }
      }
    },
    // 点击附件，打开选择等
    clickEnclosure(key, idx, item, event) {
      if (this.compareObj(key, 'principalIdcardNo')) {
        this.doAddCustomerItem()
        this.$emit('addCustomerList', key, idx, item)
      }
    },
    // 选择客户，带入对应身份证号码
    doEntrustPersonSelect(idx, value, item) {
      const info = this.dealInfoCompatibleArray()
      const principalIdcardNoItem = this.findItemByNameBlock(info, 'principalIdcardNo')
      const list = item.list || []
      const pickItem = this.getItemByName(list, value)
      principalIdcardNoItem.value = pickItem.idNo
      this.findItemByNameBlock(info, 'principalType').value = pickItem.role;
    },
    // 添加新的委托人
    doAddCustomerItem(key, idx, item) {
      const index = this.index
      if (index === 0) {
        const info = this.doValidate(true)
        if (info !== false) {
          this.$emit('addCustomerItem', index)
        }
      }
      else {
        this.$emit('minuteCustomerItem', index)
      }
    },
    doValidate(bool) {
      const result = this.validBaseData(bool)
      if (result === false || result === true) {
        return result
      }
      return {
        notarizationInfoList: [this.info.map(item => ({
          key: item.key,
          value: item.value
        }))]
      }
    }
  }
}
</script>
