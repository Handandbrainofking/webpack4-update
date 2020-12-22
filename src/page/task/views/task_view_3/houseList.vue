<!--
  function: houseList
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
    :show-children="true">
    <d-add-list
       slot="slot-idcard-item" slot-scope="slotIdCardItem"
       style="height: 1000px"
       title="房产证"
       server-title-symbol="accountNo"
       :list="filterList"
       :height="680"
       :add-first-edit="true"
       :can-edit-server="false"
       :server-list-has-color="false">
      <house-item
         :applyNo="applyNo"
         :applyOrder="applyOrder"
         slot-scope="cardItem"
         :show-btns="showBtns"
         :ref="`valid-house-item-${cardItem.listItem.idx}`"
         :house-list="houseList"
         :landCertList="landCertList"
         :accountType="accountType"
         :data-item="cardItem.listItem"
      ></house-item>
    </d-add-list>
  </task-base-view>
</template>

<script>
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import HouseItem from './houseItem.vue'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import { RequirementsHouseList } from '@/page/task/config'
import { ProductKindList } from '@/config'

export default {
  name: 'houseList',
  components: {
    HouseItem,
    TaskBaseView
  },
  mixins: [MixinTaskIndex],
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
      requestParams: ['projectAccountList', 'houseList', 'landCertList', 'applyOrderExtend'],
      accountType: 'FDCZ',
      productCode: '',
      info: RequirementsHouseList,
      filterList: [],
      houseList: [],
      landCertList: [],
      certificateKeep: '',
      certificateKeepLocation: ''
    }
  },
  created() {
    // 获取账户信息
    const productCode = this.productCode = this.getPageParams('productType', true)
    const applyNo = this.applyNo
    const info = this.info
    const certificateKeepItem = this.findItemByNameBlock(info, 'certificateKeep')
    const haveRansome = ProductKindList[productCode].haveRansom
    certificateKeepItem.hidden = !haveRansome
    this.$store.dispatch('requestOrderInfo', {
      applyNo,
      relationKey: this.requestParams.join(',')
    }).then(data => {
      const list = data.projectAccountList || []
      const tmpList = []
      this.houseList = data.houseList || []
      this.landCertList = data.landCertList || []
      if (list.length > 0) {
        list.forEach((item, index) => {
          if (item.accountType === this.accountType) {
            tmpList.push(item)
          }
        })
        this.filterList = tmpList
      }
      if (haveRansome) {
        this.dealLoaction(data.applyOrderExtend || {})
      }
    })
  },
  methods: {
    // 处理产证保管在
    dealLoaction(item) {
      let keepCertificate = ''
      if (item.certificateKeep === '1') {
        keepCertificate = '自留'
      } else if (item.certificateKeep === '2') {
        keepCertificate = '银行/其他机构'
      }
      if (item.certificateKeepLocation) {
        keepCertificate = item.certificateKeepLocation
      }
      const info = this.info
      const certificateKeepItem = this.findItemByNameBlock(info, 'certificateKeep')
      certificateKeepItem.value = keepCertificate || ''
    }
  }
}
</script>
