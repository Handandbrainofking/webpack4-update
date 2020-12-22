<template>
  <DTab :tabInitIndex="currentPage" :page-height="1480" @beforeChangePage="beforeChangePage">
    <DTabPage title="待办池" :show-counter="true" :count="personTodoTotal">
      <PersonTodoDoc :applyNo="applyNo" @changeTotalNumber="changePersonTodoTotal"/>
    </DTabPage>
    <DTabPage title="跟单池" :show-counter="true" :count="personTrackTotal">
      <PersonTrackDoc :applyNo="applyNo" @changeTotalNumber="changePersonTrackTotal"/>
    </DTabPage>
    <DTabPage title="转单池" :show-counter="true" :count="transferOrderTotal">
      <TransferOrderPool :applyNo="applyNo" @changeTotalNumber="changeTransferOrderTotal"/>
    </DTabPage>
    <DTabPage title="抢单池" :show-counter="true" :count="personRobTotal">
      <RobDoc :applyNoAhead="applyNo" @changeTotalNumber="changeRobTotal"/>
    </DTabPage>
  </DTab>
</template>

<script>
import PersonTodoDoc from '@/page/home/components/person-todo-doc.vue'
import PersonTrackDoc from '@/page/home/components/person-track-doc.vue'
import TransferOrderPool from '@/page/home/transfer-order-views/transfer-order-pool.vue'
import RobDoc from '@/page/home/views/rob-doc.vue'
import { globalUrl } from '@/utils/save-router'
// TODO 引入未使用
import RequestApi from '@/api/index'
import loginApi from '@/utils/login'

export default {
  components: {
    PersonTodoDoc,
    PersonTrackDoc,
    TransferOrderPool,
    RobDoc
  },
  data() {
    return {
      currentPage: 0,
      personTodoTotal: 0,
      personTrackTotal: 0,
      transferOrderTotal: 0,
      personRobTotal: 0,
      applyNo: ''
    }
  },
  created() {
    const getPageParams = this.getPageParams
    this.currentPage = getPageParams('type', true) || 0
    this.applyNo = getPageParams('applyNo', true)
    this.setTabListTotal()
    const $eventHub = this.$eventHub
    $eventHub.$on('BroadcastChangedOrganization', this.setTabListTotal)

    globalUrl.saveRouter(weex.config.bundleUrl.replace(/applyNo=([^&$]*&?)/i, ''))
  },
  methods: {
    // 切换Tab按钮 拦截， 处理相关事件
    beforeChangePage(e, func) {
      typeof func === 'function' && func()
    },
    changePersonTodoTotal(total) {
      this.personTodoTotal = total
    },
    changePersonTrackTotal(total) {
      this.personTrackTotal = total
    },
    changeTransferOrderTotal(total) {
      this.transferOrderTotal = total
    },
    changeRobTotal(total) {
      this.personRobTotal = total
    },
    setTabListTotal(){
      this.requestApi.home_custom_list({
        data: {
          type: 0,
          pageNumber: 1,
          pageSize: 1,
          userId: loginApi.getLoginData()['id']
        },
        success: data => {
          this.personTodoTotal = data.total
        }
      })
      this.requestApi.home_track_list_detail({
        data: {
          pageNumber: 1,
          pageSize: 1
        },
        success: data => {
          this.personTrackTotal = data.total
        }
      })
      this.requestApi.home_transfer_order({
        data: {
          pageNumber: 1,
          pageSize: 1
        },
        success: data => {
          this.transferOrderTotal = data.total
        }
      })
      this.requestApi.home_rob_doc({
        data: {
          pageNumber: 1,
          pageSize: 1
        },
        success: data => {
          this.personRobTotal = data.total
        }
      })
    }
  },
    beforeDestroy() {
    this.$eventHub.$off('BroadcastChangedOrganization', this.setTabListTotal)
  }
}
</script>
