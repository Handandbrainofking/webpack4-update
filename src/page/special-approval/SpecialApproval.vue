<template>
  <DTab class="special-approval-main" :page-height="1580" @wxcTabPageCurrentTabSelected="onChange">
    <DTabPage title="发起申请" class="start-tab-page">
      <StartApproval @created="onApprovalCreated" />
    </DTabPage>
    <DTabPage title="我的特批待办" :show="true" :show-counter="true" :count="userTotal">
      <ApprovalList type="user" />
    </DTabPage>
    <DTabPage title="特批订单">
      <ApprovalList type="org" />
    </DTabPage>
  </DTab>
</template>

<script>
import StartApproval from './views/StartApproval.vue'
import ApprovalList from './views/ApprovalList'
import { mapState } from 'vuex'

export default {
  name: 'special-approval',
  components: { StartApproval, ApprovalList },
  provide() {
    const self = this
    return {
      registerEvent(name, handler) {
        self.$on(name, handler)
      }
    }
  },
  computed: {
    ...mapState('SpecialApprove', ['userTotal'])
  },
  mounted() {
    this.$nextTick(() => this.$emit('inited'))
  },
  methods: {
    onApprovalCreated() {
      this.$emit('created') // 刷新列表
    },
    showPage(page) {
      if (page === 1) {
        this.$emit('show', 'user')
      } else if (page === 2) {
        this.$emit('show', 'org')
      } else {
        this.$emit('show', 'edit')
      }
    },
    onChange(e) {
      this.showPage(e.page)
    }
  }
}
</script>

<style lang="scss">
.special-approval-main {
  margin-top: 20px;
  flex: 1;
  background-color: #ffffff;
}
</style>