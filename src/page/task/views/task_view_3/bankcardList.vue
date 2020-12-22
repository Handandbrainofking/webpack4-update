<!--
  function: 银行卡信息列表
  author  : wq
  update  : 2019/1/24 11:29
-->
<template>
  <d-add-list
     :list="filterList"
     :height="280"
     :add-first-edit="true"
     :can-edit-server="false"
     :server-list-has-color="false"
     server-title-symbol="accountName"
     title="银行卡">
    <bankcard-item
       :applyNo="applyNo"
       :applyOrder="applyOrder"
       slot-scope="cardItem"
       :show-btns="showBtns"
       :ref="`valid-bankcard-item-${cardItem.listItem.idx}`"
       :account-list="accountList"
       :accountType="accountType"
       :data-item="cardItem.listItem"
    ></bankcard-item>
  </d-add-list>
</template>

<script>
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import BankcardItem from './bankcardItem.vue'

export default {
  name: 'bankCardList',
  components: {
    BankcardItem
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
      requestParams: ['projectAccountList', 'accountList'],
      accountType: 'YHK',
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
