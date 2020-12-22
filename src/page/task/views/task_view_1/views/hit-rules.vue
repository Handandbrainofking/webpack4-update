<!--
  function: 命中规则
  author  : wq
  update  : 2019/3/19 14:13
-->
<template>
  <d-table
     :enable-load-more="false"
     :head-list="headList"
     :body-list="bodyList"
     :no-data="noData"
     cell-key="id"
     :body-height="-1"
     :empty-icon="emptyIcon"
     :empty-text="emptyText">
    <hit-rules-item
       slot="DTableBody" slot-scope="bodyData" :list="bodyData.list" :style="bodyData.cellStyle"
       :index="bodyData.index" :item="bodyData.item"></hit-rules-item>
  </d-table>
</template>

<script>
import { mapGetters } from 'vuex'
import HitRulesItem from './hit-rules-item'

export default {
  name: 'hit-rules',
  components: {
    HitRulesItem
  },
  data() {
    return {
      headList: [
        {
          title: '序号',
          width: 1,
          key: 'num'
        },
        {
          title: '规则名称',
          width: 3,
          key: 'ruleName'
        },
        {
          title: '命中详情',
          width: 4,
          key: 'hitMessage'
        },
        {
          title: '命中时间',
          width: 2,
          key: 'createTime'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['hitRuleList']),
    hasFirstApproval() {
      return this.$store.state.hasFirstApproval
    },
    bodyList() {
      const hasFirstApproval = this.hasFirstApproval
      if (!hasFirstApproval) {
        return []
      }
      const hitList = this.hitRuleList || []
      return hitList.map((item, index) => Object.assign({}, item, {num: index + 1}))
    },
    noData() {
      return this.bodyList.length <= 0
    },
    emptyText() {
      return this.hasFirstApproval ? '该订单暂无命中规则' : '暂无数据'
    },
    emptyIcon() {
      return this.hasFirstApproval ? '/image/icon-no-hit-rules.png' : '/image/icon-nodata.png'
    }
  }
}
</script>
