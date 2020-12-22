<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
    <d-search>
      <d-search-keys tags="全部|,待面签|0,待放款|1,已放款|2,进度|-1" v-model="searchPageKey" @change="searchChange"></d-search-keys>
      <d-layout text-align="right">
        <d-search-input v-model="params.queryKeyword" @search="doSearch" placeholder="订单编号/客户姓名/渠道经理"></d-search-input>
      </d-layout>
    </d-search>
    <DTab ref="tabset" :tabInitIndex="currentPage" :page-height="1270" :defined-head="true">
      <DTabPage title="明细" class="tab-page">
        <PersonTrackDocDetail ref="component-view-0" :params="params" :applyNoAhead="applyNo" :products="padProducts"
          @changeTotalNumber="changeTotalNumber" />
      </DTabPage>
      <DTabPage title="进度" class="tab-page">
        <PersonTrackDocSummary ref="component-view-1" :params="params" :applyNoAhead="applyNo" :products="padProducts" />
      </DTabPage>
    </DTab>
  </d-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PersonTrackDocDetail from './person-track-doc-detail.vue' // 明细
import PersonTrackDocSummary from './person-track-doc-summary.vue' // 进度
import { native_eventStatistic } from '@/utils/deal_native'
// TODO: 多数代码缺少注释
export default {
  name: 'person-track-doc',
  components: {
    PersonTrackDocDetail,
    PersonTrackDocSummary
  },
  props: {
    applyNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentPage: 0,
      searchPageKey: null,
      params: {
        queryKeyword: '',
        productId: '',
        orderBy: 'robTime',
        orderType: 'desc'
      },
      params_0: {
        applyStatus: [],
        queryPartType: ''
      },
      params_1: {},
      poductList: []
    }
  },
  computed:{
    ...mapState(['padProducts'])
  },
  mounted() {
    // 初始化参数
    this.params_0 = {...this.params, ...this.params_0}
    this.params_1 = {...this.params, ...this.params_1}

    this.params = Object.assign({}, this.params, this.$store.state.search.searchParams)
    // this.$store.commit('clearSearchParams')

    this.loadPadProducts()
    if (this.applyNo) {
      this.params.queryKeyword = this.applyNo
    }
    let queryPartType = this.params.queryPartType
    if (queryPartType == '' || isNaN(Number(queryPartType))) {
      queryPartType = ''
    } else {
      queryPartType = Number(queryPartType)
    }
    let tag = 0
    if (queryPartType === -1) {
      tag = 1
    }
    this[`params_${tag}`] = {...this[`params_${tag}`], ...this.params}
    this.$nextTick(() => {
      this.searchChange(queryPartType)
    })
  },
  methods: {
    ...mapActions(['loadPadProducts']),
    changeTotalNumber(total) {
      this.$emit('changeTotalNumber', total)
    },
    getProductList() {
      let pageNumber = 1
      let pageSize = 999
      let ignoreKey = 'PAD_IGNORE_PRODUCT'
      this.requestApi.product_order_list({
        data: {
          pageNumber,
          pageSize,
          ignoreKey
        },
        success: data => {
          // key name sort
          this.poductList = []
          data.list.map((item, index) => {
            let tempitem = {
              sort: index + 1,
              key: item.productId,
              name: item.productName
            }
            this.poductList.push(tempitem)
          })
        }
      })
    },
    // 搜索
    doSearch() {
      native_eventStatistic('searchPersonTrack', '跟单池-搜索（person-track-doc.vue）')
      this.$nextTick(() => {
        let $ref = this.$refs['component-view-' + this.currentPage]
        if (Array.isArray($ref)) {
          $ref = $ref[0]
        }
        typeof $ref.doSearch === 'function' && $ref.doSearch()
      })
    },
    searchChange(type) {
      let tag = 0
      if (type === -1) {
        tag = 1
      }
      this.currentPage = tag
      this.$set(this, 'params', this[`params_${tag}`])
      this.searchPageKey = type
      if (type !== -1) {
        this.params.queryPartType = '' + type
      }
      this.$refs.tabset.setPage(tag)
      this.doSearch()
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .tab-wrap {
    @include setPadding(15px);
    flex-direction: row;
    align-items: center;
  }

  .btn {
    height: $condition_height + px;
    line-height: $condition-main + px;
    padding-left: 40px;
    padding-right: 40px;
    color: $color_enclosure;
    font-size: $btn_font;
  }

  .btn-active {
    color: $btn_border_focus;
  }
  .tab-page{
    padding-left:0 !important;
  }
</style>
