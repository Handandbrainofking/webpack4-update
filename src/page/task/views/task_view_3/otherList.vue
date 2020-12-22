<!--
  function: otherList
  author  : wq
  update  : 2019/1/24 11:30
-->
<template>
  <d-add-list
     :list="filterList"
     :height="680"
     :add-first-edit="true"
     :can-edit-server="false"
     :server-list-has-color="false"
     server-title-symbol="accountName"
     title="其他证件">
    <other-item
       :applyNo="applyNo"
       :applyOrder="applyOrder"
       slot-scope="cardItem"
       :show-btns="showBtns"
       :ref="`valid-other-item-${cardItem.listItem.idx}`"
       :accountType="accountType"
       :data-item="cardItem.listItem"
    ></other-item>
  </d-add-list>
</template>

<script>
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import OtherItem from './otherItem.vue'

export default {
  name: 'otherList',
  components: {
    OtherItem
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
      requestParams: ['projectAccountList'],
      accountType: 'QT',
      filterList: [],
      accountList: []
    }
  },
  created() {
    // 获取账户信息
    const applyNo = this.applyNo
    this.$store.dispatch('requestOrderInfo', {
      applyNo,
      relationKey: this.requestParams.join(',')
    }).then(data => {
      const list = data.projectAccountList || []
      const tmpList = []
      this.accountList = data.accountList || []
      if (list.length > 0) {
        list.forEach((item, index) => {
          if (item.accountType === this.accountType) {
            tmpList.push(item)
          }
        })
        this.filterList = tmpList
      }
    })
  }
}
</script>
