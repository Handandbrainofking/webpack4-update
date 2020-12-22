<template>
  <wxc-popup
     v-if="showOrgChoose"
     ref="popup-overlay-wrap"
     :overlayCfg="{hasAnimation: false}"
     :show="true"
     @wxcPopupOverlayClicked="doClosePopupOrg"
     pos="right"
     width="1600">
    <back-head :back-title="title" :beforeBack="doBack"></back-head>
    <d-layout class="search-wrap" text-align="center" :full-parent="false">
      <d-form :width="720" :label-width="150" label="机构名称" placeholder="请输入机构名称" v-model="params.bankName"
                  type="search" @search="doSearchOrgList"></d-form>
    </d-layout>
    <d-table
       :load_refresh="load_refresh"
       :load_more="load_more"
       :head-list="headList"
       :body-list="bodyList"
       :no-data="noData"
       :cell-key="idKey"
       @clickCell="doClickListItem"
       @loadMore="loadMore"
       @loadFresh="loadFresh"></d-table>
  </wxc-popup>
</template>

<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import WxcCommonCityPick from '@/components/pick/city.vue'
import PageLoaderMixins from '@/mixins/page'

export default {
  name: 'task_choose_org',
  components: {
    WxcPopup,
    BackHead,
    WxcCommonCityPick
  },
  model: {
    prop: 'showOrgChoose',
    event: 'closeOrgChoose'
  },
  mixins: [PageLoaderMixins],
  props: {
    productId: {
      type: String,
      default: ''
    },
    showOrgChoose: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    chooseValue: {
      type: String,
      default: ''
    },
    capitalCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      requestListKey: 'org_list',
      headList: [
        {
          title: '机构名称',
          width: 1,
          key: 'name'
        }
      ],
      bodyList: [],
      currentPage: 1,
      perNum: 20
    }
  },
  computed: {
    params() {
      return {
        productId: this.productId,
        queryFlag: 'bank',
        queryCondition: '',
        capitalCode: this.capitalCode
      }
    }
  },
  created() { 
    this.doSearchOrgList()
  },
  methods: {
  		params() {
      return {
        productId: this.productId,
        queryFlag: 'bank',
        queryCondition: '',
        capitalCode: this.capitalCode
       }
    },
    doClosePopupOrg() {
      this.$emit('closeOrgChoose', false)
    },
    countrySelect() {
      this.city.show = true
    },
    // 返回关闭popup
    doBack() {
      this.$refs['popup-overlay-wrap'].hide()
    },
    // 选择机构
    doClickListItem(index, item) {
      this.doBack()
      this.$emit('doChooseOrg', item)
    },
    // 搜索机构
    doSearchOrgList() {
    		this.params = {
        productId: this.productId,
        queryFlag: 'bank',
        queryCondition: '',
        capitalCode: this.capitalCode
      };
      this.requestList()
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .search-wrap {
    @include setPadding($normal_gap_root_column, $biggest_gap_left);
  }
</style>
