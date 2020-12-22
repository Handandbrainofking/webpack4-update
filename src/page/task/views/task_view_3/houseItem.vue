<!--
  function: houseItem 可能存在两个逻辑问题，一个是选择产证类型的判断，是土地证的第一个，另一个是这个自己写的产证没有带入房产证列表
  author  : wq
  update  : 2019/1/24 11:30
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
     @input="changeValue"></task-base-view>
</template>

<script>
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { RequirementsHouseItem } from '@/page/task/config'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import { HOUSE_LAND_CERT_FLAG, Dist_List_Get } from '@/config'

export default {
  name: 'houseList',
  components: {
    TaskBaseView
  },
  mixins: [MixinTaskViewIndex, MixinTaskIndex],
  props: {
    dataItem: {
      type: Object,
      default: () => ({})
    },
    houseList: {
      type: Array
    },
    landCertList: {
      type: Array
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
      info: this.deepCopy(RequirementsHouseItem)
    }
  },
  methods: {
    afterCreated() {
      const dataItem = this.dataItem || {}
      const info = this.info
      const cardTypeItem = this.findItemByNameBlock(info, 'cardType')
      cardTypeItem.list = Dist_List_Get(HOUSE_LAND_CERT_FLAG)
      const isServer = dataItem.isServer
      this.initData()
      if (isServer) {
        this.$set(dataItem, 'height', 376)
        info.forEach(item => {
          if (item.key === 'cardType') {
            item.value = this.getKeyByName(item.list, item.value, 'key', 'name')
          }
          item.type = 'text'
          item.hasChoose = false
          item.hasBorder = false
        })
      }
    },
    changeValue(key, idx, item, value, ...args) {
      const _value = item.value
      const info = this.info
      if (_value !== value) {
        this.valueChanged = true
        if (key === 'cardType') {
          this.chooseHouseType(idx, value, item, ...args)
        }
        if (Array.isArray(key) && key.length === 2) {
          this.$set(info, idx, Object.assign({}, item, { values: [value, name], value, changed: true }))
        } else {
          this.$set(info, idx, Object.assign({}, item, { value, changed: true }))
        }
      }
    },
    // 选择产证类型
    chooseHouseType(idx, value, item) {
      const info = this.info
      const accountNoItem = this.findItemByNameBlock(info, 'accountNo')
      const houseItem = this.getItemByName(this.houseList, value, 'certType')
      if (houseItem) {
        accountNoItem.value = houseItem.houseCertNo
      }
      else if (value === '02' && (this.landCertList[0] || {}).landParcelNo) {
        accountNoItem.value = this.landCertList[0].landParcelNo
      }
      accountNoItem.changed = true
    },
    doValidate(bool) {
      if (!this.showBtns || this.dataItem.isServer) {
        return true
      }
      const info = this.info
      if (info.map(item => item.value).join('') === '') {
        return true
      }
      let resultInfo = this.validBaseData(bool, true, '房产证' + this.dataItem.sortIdx + ': ')
      if (resultInfo === false) {
        return false
      }
      else if (resultInfo === true) {
        return true
      }
      else if (typeof resultInfo === 'object') {
        const obj = {
          projectAccountList: Object.assign({}, resultInfo, { accountType: this.accountType })
        }
        return this.dealSaveDataObjectToArray(obj)
      }
      return true
    }
  }
}
</script>
