<template>
  <wxc-popup
     v-if="showOrgChoose"
     ref="popup-overlay-wrap"
     :show="true"
     :overlayCfg="{hasAnimation: false}"
     @wxcPopupOverlayClicked="doClosePopupOrg"
     pos="right"
     width="1600">
    <back-head :back-title="title" :beforeBack="doBack"></back-head>
    <d-layout class="search-wrap" text-align="center" :full-parent="false">
      <d-form v-if="!noShowCity" :width="720" :label-width="80"  label="城市" placeholder="请选择城市" :value="city.text" :disabled="true" type="pickother" @input="countrySelect"></d-form>
      <d-form :width="720" :label-width="150"  label="机构名称" placeholder="请输入机构名称" v-model="params.bankName" type="search" @search="doSearchOrgList"></d-form>
    </d-layout>
    <d-table
       :load_refresh="load_refresh"
       :load_more="load_more"
       :head-list="headList"
       :body-list="bodyList"
       :no-data="noData"
       @clickCell="doClickListItem"
       @loadMore="loadMore"
       @loadFresh="loadFresh"
    ></d-table>
    <wxc-common-city-pick
       @doCancelChoose="doCancelChooseCity"
       @doSureChoose="doSureChooseCity"
       :province="city.province"
       :city="city.city"
       v-if="city.show"></wxc-common-city-pick>
  </wxc-popup>
</template>

<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import WxcCommonCityPick from '@/components/pick/city.vue'
import PageLoaderMixins from '@/mixins/page'
import loginApi from '@/utils/login'

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
    showOrgChoose: {
      type: Boolean,
      default: false
    },
    noShowCity: {
      type: Boolean,
      default: true
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
    }
  },
  data() {
    return {
      requestListKey: 'bank_list',
      headList: [
        {
          title: '机构名称',
          width: 1,
          key: 'bankName'
        }
      ],
      bodyList: [],
      currentPage: 1,
      perNum: 20,
      city: {
        show: false,
        province: '',
        city: '',
        text: ''
      },
      params: {
        isBranch: 'Y',
        cityNo: '',
        bankName: ''
      }
    }
  },
  created() {
    const userInfo = loginApi.getLoginData()
    if (userInfo.cityNo && userInfo.provinceCode) {
      this.city.province = userInfo.provinceCode
      this.city.city = userInfo.cityNo
      this.city.text = userInfo.provinceName + ' - ' + userInfo.cityName
      this.params.cityNo = userInfo.cityNo
      this.doSearchOrgList(true)
    }
  },
  methods: {
    doSureChooseCity(province, city) {
      // 对直辖市特殊判断(500000/310000/110000/120000)
      // 跟业务系统保持一致，只选择到市(重庆市、北京市、天津市、上海市)
      var filterProvinceCode = '500000,310000,110000,120000'
      if (filterProvinceCode.indexOf(province.key) > -1) {
        this.city.city = province.key
        this.params.cityNo = province.key
      } else {
        this.city.city = city.key
        this.params.cityNo = city.key
      }
      this.city.province = province.key
      this.city.text = province.name + ' - ' + city.name
      this.city.show = false
    },
    doCancelChooseCity() {
      this.city.show = false
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
    // 搜索机构 isForceCityNo(是否需要强制按照城市搜索)
    doSearchOrgList(isForceCityNo) {
      if (isForceCityNo !== true) {
        this.params.cityNo = this.noShowCity ? '' : this.params.cityNo
      }
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
