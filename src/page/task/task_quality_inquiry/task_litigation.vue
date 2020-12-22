<template>
  <d-layout kind="column"
    text-align="initial"
    vertical-align="initial">
    <list loadmoreoffset="2"
      class="list">
      <cell class="body-list"
        append="tree"
        :key="`table-cell-${item.customerNo}`"
        v-for="(item) in bodyList">
        <text class="item">{{ item.customer.name }}</text>
        <text class="item">{{ getRelation(item.role, item.relation) }}</text>
        <text class="item">{{ getMainLoaner(item) }}</text>
        <text class="item">{{ getApplyLoaner(item.isProposer) }}</text>
        <text class="item">{{ getCertType(item.customer.idCardType) }}</text>
        <text class="item">{{ item.customer.idCardNo }}</text>
        <div class="item row detail-item"
          @click="doDetailCheck(item)">
          <text class="detail">详情</text>
          <d-image src="/image/icon_detail.png"
            width="56"
            height="40"></d-image>
        </div>
      </cell>
    </list>
    <wxc-popup :show="showLitigationDetail"
      @wxcPopupOverlayClicked="closeLitigationDetails"
      ref="popup-overlay-wrap"
      pos="right"
      width="2200">
      <div class="popup-content">
        <div class="doBack">
          <back-head :beforeBack="doBack"
            :title-width="titleWidth"
            back-title="诉讼信息"></back-head>
        </div>
        <scroller class="popup-scroll">

          <div class="litigation-popup">
            <text class="litigation-popup-title">个人诉讼（单篇）</text>
            <div v-if="litigation.one.length > 0">
              <div class="litigation-popup-gap"
                v-for="(itm, idx) in litigation.one"
                :key="`litigation-article-one-${idx}`">
                <text class="litigation-popup-content">{{itm.content}}</text>
              </div>
            </div>
            <text class="no-data"
              v-else>暂无数据</text>
          </div>
          <div>
            <text class="litigation-popup-title">个人诉讼（全篇）</text>
            <div class="litigation-popup-gap"
              v-for="(value, key) in litigation.all"
              :key="`litigation-article-all-${key}`">
              <text class="litigation-popup-content">{{keySet}}</text>
              <div v-if="((value||{}).lawxinInfo || []).length > 0">
                <div :class="[(index !== value.lawxinInfo.length -1) && 'litigation-popup-content']"
                  v-for="(item, index) in value.lawxinInfo"
                  :key="`litigation-article-all-${key}-${index}`">
                  <high-light :keySet="keySet" :dataString="item.content || ''"></high-light>
                </div>
              </div>
              <text class="no-data"
                v-else>暂无数据</text>
            </div>
          </div>
          <div>
            <text class="litigation-popup-title">第三方数据</text>
            <div v-if="litigation.third.length > 0">
              <div class="litigation-popup-gap"
                v-for="(itm, idx) in litigation.third"
                :key="`litigation-article-third-${idx}`">
                <text class="litigation-popup-content">{{itm.ruleName}}</text>
                <div v-for="(item, index) in itm.details"
                  :key="`litigation-article-third-${idx}-${index}`">
                  <div v-for="(value, key) in item"
                    :key="`litigation-article-item-${key}`">
                    <div v-if="'string' === typeof value">
                      <text :class="['litigation-popup-content','litigation-popup-indent2']">{{key}}: {{value}}</text>
                    </div>
                    <div v-else>
                      <text :class="['litigation-popup-content','litigation-popup-indent2']">{{key}}</text>
                      <text :class="['litigation-popup-content','litigation-popup-indent4']"
                        v-for="(value1, key1) in item"
                        :key="`litigation-article-third-${idx}-${index}-${key1}`">
                        {{key1}}: {{value1}}</text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <text class="no-data"
              v-else>暂无数据</text>
          </div>
        </scroller>
      </div>
    </wxc-popup>
  </d-layout>
</template>

<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import HighLight from './high_light.vue'
import {
  Dist_List_Get,
  DISC_CERT_TYPE,
  DISC_SELLER_SHIP_TYPE,
  DISC_BUYER_SHIP_TYPE,
  DISC_CUSTOMER_SHIP_TYPE,
  ProductKindList
} from '@/config'

export default {
  components: {
    WxcPopup,
    BackHead,
    HighLight
  },
  data() {
    return {
      applyNo: 0,
      bodyList: [],
      titleWidth: 1760,
      showLitigationDetail: false,
      keySet: '',
      chooseItem: {
        customer: {}
      },
      litigation: {
        name: '',
        one: [],
        all: {},
        third: []
      }
    }
  },
  beforeMount() {
    this.applyNo = this.getPageParams('applyNo')
    this.requestList()
  },
  methods: {
    //  请求订单信息/客户列表
    requestList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: 'customerRelList'
        },
        success: data => {
          console.log('客户信息', data)
          this.bodyList = data.customerRelList || []
        }
      })
    },
    // 请求诉讼信息
    requestLitigationDetail(customerNo, func, type = 'EVERY') {
      this.requestApi.litigation_info({
        method: 'GET',
        data: {
          applyNo: this.applyNo,
          customerNo,
          type
        },
        success: data => {
          'function' === typeof func && func(data)
        }
      })
    },
    doBack() {
      this.$refs['popup-overlay-wrap'].hide()
    },
    // 获取关系人类型
    getRelation(role, key) {
      const productType = this.getPageParams('productId', true)
      let list = Dist_List_Get(DISC_SELLER_SHIP_TYPE)
      const kindList = ProductKindList[productType].kind.toString()
      if (role === 'OWN' && kindList[kindList.length - 1] - 1) {
        list = Dist_List_Get(DISC_CUSTOMER_SHIP_TYPE)
      } else if (role === 'BUY') {
        list = Dist_List_Get(DISC_BUYER_SHIP_TYPE)
      }
      return this.getKeyByName(list, (key || '').toString(), 'key', 'name')
    },
    // 是否主借款人
    getMainLoaner(item) {
      var desc = '主借款人'
      if (item.applyNo.substring(2, 3) === 'S') {
        //保险类
        desc = '投保人'
      }
      if (item.isActualBorrowerName === 'Y') {
        return desc
      } else {
        return '非' + desc
      }
    },
    // 是否主借款人
    getApplyLoaner(bool) {
      if (bool === 'Y') {
        return '申请人'
      } else {
        return '非申请人'
      }
    },
    // 证件类型
    getCertType(key) {
      return this.getKeyByName(Dist_List_Get(DISC_CERT_TYPE), (key || '').toString(), 'key', 'name')
    },

    setClass(data, index) {
      console.log(data.length, index)
      return index !== data.length - 1 && 'litigation-popup-content'
      // return  (index !== value.lawxinInfo.length -1) && 'litigation-popup-content'
    },
    // 点击详情
    doDetailCheck(item) {
      this.requestLitigationDetail(item.customerNo, data => {
        this.chooseItem = item || {}
        let tdata = data || []
        const tdataObj = {}
        for (let i in tdata) {
          tdataObj[tdata[i].type] = tdata[i]
        }
        this.list = []
        tdata = tdataObj['ONE'] || {}
        this.litigation.name = tdata.customerName
        this.litigation.one = tdata.queryStatus == 'Y' ?
          (
            (('string' === typeof tdata.queryResult && JSON.parse(tdata.queryResult)) || tdata.queryResult || {})
              .lawxinPerOne || {}
          ).lawxinInfo || [] : tdata.queryResult && [{content: tdata.queryResult}]
        tdata = tdataObj['ALL'] || {}
        this.keySet = tdata.customerName + ',' + tdata.keySet
        this.litigation.all = tdata.queryStatus == 'Y' ?
          (('string' === typeof tdata.queryResult && JSON.parse(tdata.queryResult)) || tdata.queryResult || {})
            .lawxinPerAlls || {} : tdata.queryResult && [{content: tdata.queryResult}]
        tdata = tdataObj['THIRDPARTY'] || {}
        var thirdResult = tdata.queryStatus == 'Y' ?
        (
          ('string' === typeof tdata.queryResult && JSON.parse(tdata.queryResult)) ||
          tdata.queryResult ||
          {}
        ).result : tdata.queryResult && [{content: tdata.queryResult}]
        this.litigation.third = (thirdResult && thirdResult.ruleList) || [] 
        this.showLitigationDetail = true

        let litigationAll = []
        for (var i in this.litigation.all) {
          let item = this.litigation.all[i].lawxinInfo
          for (let j in item) {
            litigationAll.push(item[j].content || '暂无数据')
          }
        }
      })
    },
    closeLitigationDetails() {
      this.showLitigationDetail = false
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  @import '../../../css/common.scss';

  $item_height: 112px;
  .list {
    @include setPadding($normal_gap_bottom, 100px);
    flex: 1;
  }

  .body-list {
    flex-direction: row;
    align-items: center;
    height: $item_height;
    background-color: #F5F6F9;
    width: 2220px;
    @include setBorderTop(#ffffff, 24px)
  }

  .item {
    flex: 1;
    text-align: center;
    font-size: $font_normal;
    color: $color_nav;
  }

  .detail-item {
    height: $item_height;
    align-items: center;
  }

  .flex1 {
    flex: 1;
  }

  .row {
    flex-direction: row;
    justify-content: center;
  }

  .detail {
    font-size: $font_normal;
    color: $color_back;
    padding-right: $normal_text_gap;
  }

  .popup-content {
    flex-direction: column;
    flex: 1;
  }

  .popup-scroll {
    flex: 1;
  }

  .litigation-popup {
    @include setPadding($normal_gap_left, $normal_gap_bottom);
  }

  .litigation-popup-title {
    flex: 1;
    text-align: center;
    font-size: $font_head;
    line-height: 80px;
    color: $color_nav;
  }

  .no-data {
    flex: 1;
    text-align: center;
    font-size: $font_nav;
    line-height: 100px;
    color: $color_enclosure;
  }

  .litigation-popup-content {
    font-size: $font_normal;
    color: $color_nav;
    @include setPaddingH($normal_gap_left);
    line-height: 35px;
  }

  .litigation-popup-indent2 {
    @include setPaddingH($normal_gap_root_column);
  }

  .litigation-popup-indent4 {
    @include setPaddingH($bigger_gap_left);
  }

  .litigation-popup-gap {
    @include setPaddingV($normal_gap_root_column);
    @include setBorderBottom()
  }

</style>
