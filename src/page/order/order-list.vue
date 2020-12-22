<template>
  <DTab :tabInitIndex="0" :page-height="1580" style="margin-top: 20px">
    <DTabPage title="未完成业务" :show-counter="true" :count="uncompleteTotal">
      <UndoOrderList  @changeTotalNumber="changeUncompleteTotal"/>
    </DTabPage>
    <DTabPage title="已完成业务" :show-counter="true" :count="completeTotal">
      <FinishOrderList  @changeTotalNumber="changeCompleteTotal"/>
    </DTabPage>
  </DTab>
</template>

<script>
import UndoOrderList from './components/undoOrderList/undoOrderListIndex.vue'
import FinishOrderList from './components/finish-order-list.vue'

export default {
  name: 'order_list',
  components: {
    UndoOrderList,
    FinishOrderList
  },
  data() {
    return {
      uncompleteTotal: 0,
      completeTotal: 0
    }
  },
  created() {
    this.requestApi.order_management_list({
      data: {
        isOver: true,
        pageNumber: 1,
        pageSize: 1,
      },
      success: data => {
        this.completeTotal = data.total
      }
    })
    this.getProductList()
  },
  methods: {
    changeUncompleteTotal(total) {
      this.uncompleteTotal = total
    },
    changeCompleteTotal(total) {
      this.completeTotal = total
    }
  }
}
</script>
