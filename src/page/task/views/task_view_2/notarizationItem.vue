<!--
  function: notarizationItem
  author  : wq
  update  : 2018/12/21 10:18
-->
<template>
  <div>
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
       @chooseGroundBank="doChooseGroundBank">
      <div
         style="width: 2406px;"
         slot="slot-customer-item"
         slot-scope="infoItem">
        <notarization-user-item
           :index="idx" :is-add-icon="idx === 0" :customer-list="customerList" :data-item="item"
           :key="`customer-item-${idx}`" v-for="(item, idx) in customerItemList"
           :ref="`valid-customer-item-${idx}`"
           @addCustomerItem="addCustomerItem" @minuteCustomerItem="minuteCustomerItem"></notarization-user-item>
      </div>
      <d-form label="公证受托人" :label-width="420" placeholder="请选择公证受托人" type="input"
              :required="true" :has-border="false" slot="slot-entrust-names" slot-scope="entrustNames" v-bind="namesItem">
        <div style="flex-direction: row;width: 2400px;height: 72px;">
          <div class="btn-choose-ctn"><text class="btn-choose" @click="doChooseEntrust">选择</text></div>
          <div
             class="choose-row" :key="`entrust-text-${idx}`" v-for="(item, idx) in nameList"
             @click="doDeleteEntrustUser(idx, item)">
            <text class="btn-choose-text">{{ item.name }}</text>
            <d-image src="/image/icon-minus.png" width="20" height="20"></d-image>
          </div>
        </div>
      </d-form>
    </task-base-view>
    <task-choose-entrust
       v-if="showEntrustInfo" :choose-list="nameList"
       @doSureChooseEntrust="doSureChooseEntrust"
       @doCancelChooseEntrust="doCancelChooseEntrust"></task-choose-entrust>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import NotarizationUserItem from './notarizationUserItem.vue'
import { NotarizationCustomer } from '@/page/task/config'
import MixinTaskViewIndex from '@/page/task/mixins/mixinTaskViewIndex'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import TaskChooseEntrust from '@/page/task/components/common/choose_entrust.vue'

export default {
  name: 'notarizationItem',
  components: {
    TaskBaseView, NotarizationUserItem, TaskChooseEntrust
  },
  mixins: [MixinTaskViewIndex, MixinTaskIndex],
  props: {
    dataItem: {
      type: Object,
      default: () => ({})
    },
    customerList: {
      type: Array,
      default: () => ([])
    },
    notarialOfficeList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      info: this.deepCopy(NotarizationCustomer),
      oldCustomerItemList: [],
      customerItemList: [],
      showEntrustInfo: false
    }
  },
  computed: {
    ...mapGetters({
      applyOrder: 'applyOrder'
    }),
    namesItem() {
      const info = this.dealInfoCompatibleArray()
      const entrustNamesItem = this.findItemByNameBlock(info, 'entrustNames')
      const obj = {hidden: false}
      if (!this.dataItem.isServer) {
        obj.inputWidth = 0
      }
      return Object.assign({}, entrustNamesItem, obj)
    },
    nameList() {
      const entrustNamesItem = this.namesItem
      const namesList = entrustNamesItem.value
      if (this.isEmpty(namesList)) {
        return []
      }
      return (namesList || '').split(',').map(item => ({
        key: item,
        name: item
      }))
    }
  },
  watch: {
    customerItemList(value) {
      const dataItem = this.dataItem
      const oldValue = this.oldCustomerItemList || []
      if (value.length !== oldValue.length) {
        this.oldCustomerItemList = this.deepCopy(value)
        const len = Math.max(value.length, 1)
        this.$set(dataItem, 'height', (len - 1) * 96 + 376)
      }
    }
  },
  methods: {
    afterCreated() {
      const info = this.dealInfoCompatibleArray()
      const principalNamesItem = this.findItemByNameBlock(info, 'principalNames')
      const notarialOfficeItem = this.findItemByNameBlock(info, 'notarialOffice')
      principalNamesItem.list = this.customerList
      notarialOfficeItem.list = this.notarialOfficeList
      const dataItem = this.dataItem || {}
      const isServer = dataItem.isServer
      if (isServer) {
        info.forEach(item => {
          if (item.type === 'slot' && item.key === 'slotEntrustNames') {
            item.hidden = true
            return false
          }
          if (item.key === 'entrustNames') {
            item.hidden = false
          }
          if (item.type === 'slot' && item.key === 'slotCustomerItem') {
            return false
          }
          item.type = 'text'
          item.hasChoose = false
          item.addList = false
          item.minuteList = false
          item.hasBorder = false
        })
        // 对公证时间进行格式化
        if (dataItem.prReceiveTime) {
          dataItem.prReceiveTime = this.formatDate(dataItem.prReceiveTime, 'YYYY-MM-DD')
          this.$set(dataItem, 'prReceiveTime', dataItem.prReceiveTime)
        }
      }
      const list = []
      const principalNames = (dataItem.principalNames || '').split(',')
      const principalIdcardNos = (dataItem.principalIdcardNo || '').split(',')
      principalNames.forEach((item, idx) => {
        list.push({
          isServer,
          principalNames: item,
          principalIdcardNo: principalIdcardNos[idx]
        })
      })
      this.customerItemList = list
      this.initData()
    },
    changeValue(key, idx, item, value, name) {
      const info = this.info
      const _value = info[idx].value
      if (_value !== value) {
        this.valueChanged = true
        if (this.compareObj(key, 'principalNames')) {
          this.doEntrustPersonSelect(idx, value, item)
        } else if (key === 'hasFundSupervision') {
          this.changeSupervised(value, idx, item)
        } else if (this.compareObj(key, ['saleCause', 'otherSaleCause'])) {
          this.changeSaleReason(value, idx, item)
          this.$set(info, idx, Object.assign({}, item, {value, changed: true}))
          return true
        } else if (key === 'tailPayMode') {
          this.changeAccountPayWay(value, idx, item)
        }
        if (Array.isArray(item.key) && item.key.length === 2) {
          this.$set(info, idx, Object.assign({}, item, {value, values: [value, name], changed: true}))
        } else {
          this.$set(info, idx, Object.assign({}, item, {value, changed: true}))
        }
      }
    },
    // 点击附件，打开选择等
    clickEnclosure(key, idx, item, event) {
      if (this.compareObj(key, ['openBankNo', 'openBank'])) {
        this.doOpenChooseOrg(key, idx, item)
      }
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
    // 添加委托人
    addCustomerItem(index) {
      const list = this.customerItemList
      list.splice(list.length - 1, 0, {})
    },
    // 删除委托人
    minuteCustomerItem(index) {
      const list = this.customerItemList
      list.splice(index, 1)
    },
    // 选择受托人，弹出受托人列表
    doChooseEntrust() {
      this.showEntrustInfo = true
    },
    // 受托人列表弹出框取消按钮
    doCancelChooseEntrust() {
      this.showEntrustInfo = false
    },
    // 受托人列表弹出框确定按钮
    doSureChooseEntrust(item, index) {
      const info = this.dealInfoCompatibleArray()
      this.valueChanged = true
      const entrustNamesItem = this.findItemByNameBlock(info, 'entrustNames')
      this.$set(info, entrustNamesItem.sortIndex, Object.assign({}, entrustNamesItem, {
        value: item.map(itm => itm.name).join(','),
        changed: true
      }))
      this.showEntrustInfo = false
    },
    // 删除选择的受托人
    doDeleteEntrustUser(idx, item) {
      const info = this.dealInfoCompatibleArray()
      const entrustNamesItem = this.findItemByNameBlock(info, 'entrustNames')
      const namesList = entrustNamesItem.value.split(',')
      namesList.splice(idx, 1)
      this.$set(info, entrustNamesItem.sortIndex, Object.assign({}, entrustNamesItem, {value: namesList.join(',')}))
    },
    doValidate(bool) {
      let resultInfo = this.validBaseData(bool, true)
      if (resultInfo === false) {
        return false
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
          if (!existChild) {
            return true
          }
          resultInfo = {}
        }
        if (!existChild) {
          return this.dealSaveDataObjectToArray(resultInfo)
        }
        else {
          const obj = {
            // principalType: this.dataItem.principalType || ''
          }
          childrenValidate.notarizationInfoList.forEach(item => {
            item.forEach(itm => {
              if (!obj[itm.key]) {
                obj[itm.key] = []
              }
              obj[itm.key].push(itm.value)
            })
          })
          for (let i in obj) {
            obj[i] = obj[i].join(',')
          }
          return this.dealSaveDataObjectToArray({notarizationInfoList: Object.assign(resultInfo, obj)})
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .btn-choose {
    background-color: $color_light_focus;
    color: $color_back;
    height: 72px;
    line-height: 72px;
    width: 120px;
    text-align: center;
    border-radius: 4px;
    margin-left: 20px;
    border-width: 2px;
    border-color: $color_back;
    font-size: $font_normal;
  }

  .btn-choose-text {
    color: $color_back;
    text-align: center;
    font-size: $font_normal;
    position: relative;
  }

  .btn-choose-ctn {
    margin-left: 20px;
  }

  .choose-row {
    padding-top: 15px;
    height: 72px;
    text-align: center;
    flex-direction: row;
    margin-left: 15px;
  }
</style>
