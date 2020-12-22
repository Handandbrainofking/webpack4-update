<!--
  function: index
  author  : wq
  update  : 2018/11/2 16:17
-->
<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
    <d-search>
      <d-search-tags tags="明细|0,进度|1" v-model="currentPage" @change="onTagChanged" slot="before"></d-search-tags>
      <d-search-input v-model="params.queryKeyword" @search="doSearch" placeholder="订单编号/客户姓名/跟单人"></d-search-input>
    </d-search>
    <DTab ref="d-tab-set" :defined-head="true" :tabInitIndex="currentPage" :page-height="1380" :page-width="2180"
      :tabStyles="{height: 0}">
      <DTabPage title="明细">
        <UndoOrderListDetail ref="component-view-0" :params="params" :applyNoAhead="applyNo" @changeTotalNumber="changeTotalNumber" />
      </DTabPage>
      <DTabPage title="进度">
        <UndoOrderListSummary ref="component-view-1" :params="params" :applyNoAhead="applyNo" />
      </DTabPage>
    </DTab>
  </d-layout>
</template>

<script>
import UndoOrderListDetail from './comps/undoOrderListDetail.vue'
import UndoOrderListSummary from './comps/undoOrderListSummary.vue' // 汇总
import { native_eventStatistic } from '@/utils/deal_native'
import { DetailList } from '@/config/index'

export default {
  name: 'UndoOrderListIndex',
  components: {
    UndoOrderListDetail,
    UndoOrderListSummary
  },
  data() {
    return {
      currentPage: 0,
      tabs: DetailList,
      searchValue: '',
      searchPickIndex: '',
      showCondition: false,
      params: {
        isOver: false,
        queryKeyword: '',
        productId: ''
      },
      params_0: {
        orderBy: 'createTime',
        orderType: 'desc'
      },
      params_1: {}
    }
  },
  mounted() {
    this.params_0 = { ...this.params, ...this.params_0 }
    this.params_1 = { ...this.params, ...this.params_1 }
    this.onTagChanged(this.currentPage)
    this.clearParams(true)
  },
  methods: {
    // 切换明细汇总
    onTagChanged(tag) {
      // 处理切换tab
      this.params = this[`params_${tag}`]
      const $ref = this.$refs['d-tab-set']
      $ref.setPage(tag, null, false)
      this.doSearch()
    },
    changeTotalNumber(val) {
      this.$emit('changeTotalNumber', val)
    },
    doInput(type, value) {
      this.searchValue = value
    },
    // 搜索
    doSearch() {
      native_eventStatistic('UndoOrderListIndex', '未完成订单-搜索（undoOrderListIndex.vue）')
      this.$nextTick(() => {
        let $ref = this.$refs['component-view-' + this.currentPage]
        if (Array.isArray($ref)) {
          $ref = $ref[0]
        }
        typeof $ref.doSearch === 'function' && $ref.doSearch()
      })
    }
  }
}
</script>
