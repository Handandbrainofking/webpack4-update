<template>
  <add-list ref="addList" :stop-edit-all="!showBtns" :list="filterList" :name="name" :height="1090"
            :stop-edit-server="true"
            @created="onCustomerCreated" @removed="removeItem">
    <face-sign slot-scope="customer" :title-name="name" :data-item="customer.listItem"
               :ref="`valid-customer-${customer.listItem.idx}`" @addCustomer="onAddCustomer"
               @customer-change="onCustomerChanged($event, customer.listItem)"></face-sign>
  </add-list>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import AddList from '@/components/other/add_list.vue'
import FaceSign from './custom-info.vue'

export default {
  name: 'customerList',
  components: {
    AddList,
    FaceSign
  },
  mixins: [MixinTaskIndex],
  props: {
    title: {
      type: String
    },
    showBtns: {
      type: Boolean,
      default: false
    },
    matterKey: {
      type: String
    },
    traceItem: {
      type: Object
    }
  },
  data() {
    return {
      filterList: []
    }
  },
  computed: {
    ...mapState(['customers']),
    ...mapGetters(['customerRelList']),
    name() {
      const title = this.title
      switch (title) {
        case '卖方信息':
          return '卖方'
        case '买方信息':
          return '买方'
        case '客户信息':
          return '客户'
      }
    }
  },
  created() {
    this.filterList = this.filterCustomer(this.customerRelList, this.name)
  },
  watch: {
    customerRelList(value) {
      const list = this.filterList
      const currentList = this.filterCustomer(value, this.name)
      if (!this.compareObj(list, currentList)) {
        this.filterList = currentList
      }
    }
  },
  methods: {
    ...mapMutations(['removeCustomer']),
    // 过滤列表
    filterCustomer(customerRelList, name) {
      const role =
        (name === '客户' && 'OWN') || ((name === '卖方' && 'OWN') || 'BUY')
      return (customerRelList || []).filter(item => item.role === role)
    },
    // 添加产权人配偶
    onAddCustomer(args) {
      const {from, callback} = args
      this.$refs.addList.doAddList(item => {
        item.customerNo = `spouse_${from.customerNo}`
        item.isSpouse = true
        item.otherRelation = from.customerNo

        item._temp = {}
        item._temp.otherRelation = from.customerNo        
        item._temp.relation = 'CQRPO'
        item._temp.customer = {
          sex: from.customer.sex === 'F' ? 'M' : 'F',
          address: from.customer.address,
          maritalStatus: from.customer.maritalStatus,
          idCardType: 'CER'
        }

        if (from.customer.customerIdentity === 'legalPerson') {
          item._temp.customer.customerIdentity = 'legalSpouse'
        } else if (from.customer.customerIdentity === 'shareholder') {
          item._temp.customer.customerIdentity = 'shareholderSpouse'
        }

        callback(item)
      })
    },
    onCustomerCreated(arg){
      const {item} = arg
      const hash = (new Date()).valueOf()
      item.customerNo = item.customerNo || `tmp_${hash}`
    },
    removeItem(item){
      this.removeCustomer(item.customerNo)
    },   
    /**
     * 当客户名称修改时，同时刷新列表
     */
    onCustomerChanged({key, value}, item) {
      if (key === 'otherRelation') {
        // 客户被引用为配偶
        let index = this.filterList.findIndex(
          x => x.customerNo === value
        )
        const ref = this.$refs[`valid-customer-${index + 1}`]
        ref.setData('otherRelation', 'value', item.customerNo)
      }
    }
  }
}
</script>
