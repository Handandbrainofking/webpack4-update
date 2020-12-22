<template>
   <DTab class="tab-contain-wrap" :page-height="1580" style="margin-top: 20px">
      <DTabPage title="要件列表"><DocList/></DTabPage>
      <DTabPage title="外借记录"><BorrowList/></DTabPage>
    </DTab>
</template>

<script>
import DocList from '@/page/important-doc/components/doc-list.vue'
import BorrowList from '@/page/important-doc/components/borrow-list.vue'

export default {
  name: 'important-doc-list',
  components: { DocList, BorrowList }
}
</script>
