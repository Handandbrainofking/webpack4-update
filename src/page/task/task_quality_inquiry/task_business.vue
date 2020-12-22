<template>
  <layout kind="column" text-align="initial" vertical-align="initial">
    <list loadmoreoffset="2" class="list">
      <cell
         class="body-list"
         append="tree"
         :key="`table-cell-${item.customerNo}`"
         v-for="(item, idx) in bodyList" :index="idx">
        <div class="item-wrap">
          <text class="item">{{ item.customer.name }}</text>
          <text class="item">{{ getRelation(item.role,item.relation) }}</text>
          <text class="item">{{ getMainLoaner(item.isActualBorrowerName) }}</text>
          <text class="item">{{ getApplyLoaner(item.isProposer) }}</text>
          <text class="item summary">{{ '身份证 ' + item.customer.idCardNo }}</text>
          <div class="item detail-item row">
            <text class="detail-text detail-check text-load" v-if="item.customerNo === business.customerNo && item.firstPageEntry">查询中</text>
            <text class="detail-text detail-check"  v-else @click="queryBusinessInfo(item)">查询</text>
            <text class="detail-text" @click="doAddBusinessInfo(item)">添加</text>
          </div>
        </div>
        <div v-if="item.customerNo === business.customerNo" class="business-list-wrap">
          <div v-for="itm in business.list" :key="`business-item-${itm.id}`" class="item-wrap business-item-wrap">
            <div class="item row flex-start flex2">
              <text class="business-item-label">工作单位</text>
              <text class="business-item-value">{{ itm.companyName }}</text>
            </div>
            <div class="item row flex-start flex2">
              <text class="business-item-label">自雇状态</text>
              <text class="business-item-value">{{ getSelfEmployed(itm.isSelfEmployed) }}</text>
            </div>
            <div class="item row flex-start">
              <text class="business-item-value">{{ formatDate(itm.operateTime, 'YYYY-MM-DD hh:mm:ss') }}</text>
            </div>
            <div class="item detail-item row flex01" @click="doDetailBusinessInfo(itm)">
              <text class="detail">详情</text>
              <d-image src="/image/icon_detail.png" width="56" height="40"></d-image>
            </div>
          </div>
        </div>
      </cell>
    </list>
    <wxc-dialog
       v-if="showAddBusiness"
       :show="showAddBusiness"
       :definedBtn="true"
       width="1600"
       top="400"
       @wxcDialogConfirmBtnClicked="doBusinessSure"
       @wxcDialogCancelBtnClicked="doBusinessCancel">
      <div slot="title" class="business-title-wrap">
        <text class="business-title">工商信息查询</text>
        <div @click="doBusinessCancel" class="order-title-close">
          <text class="order-title-text">×</text>
        </div>
      </div>
      <div slot="content" class="business-content">
        <div class="business-base-info">
          <text class="label">客户姓名：</text>
          <text class="value">{{ chooseItem.customer.name }}</text>
        </div>
        <div class="business-base-info" v-for="(nameItem, nameIndex) in companyNameList"  :key="nameIndex">
          <text class="label">工作单位：</text>
          <input class="value input" v-model="nameItem.name" placeholder="请输入客户工作单位" />
          <div class="icon-minus" v-if="companyNameList.length > 1" @click="companyMinus(nameIndex)">
            <d-image src="/image/button-minus.png" width="36px" height="36px"></d-image>
          </div>
          <div class="icon-add" v-if="nameIndex === 0" @click="companyAdd(nameIndex)">
              <d-image src="/image/button-add.png" width="36px" height="36px"></d-image>
          </div>
        </div>
        <div class="btn-wrap">
          <text class="btn btn-cancel" @click="doBusinessCancel">取消</text>
          <text class="btn btn-sure" @click="doBusinessSure">确认</text>
        </div>
      </div>
    </wxc-dialog>
    <wxc-popup
       :show="showBusinessDetail"
       @wxcPopupOverlayClicked="closeBusinessDetail"
       ref="popup-overlay-wrap"
       pos="right"
       width="2200">
      <div class="demo-content">
        <div class="doBack">
          <back-head :beforeBack="doBack" :title-width="1760" :back-title="company.name"></back-head>
        </div>
        <d-table
           class="table-wrap"
           :load_refresh="false"
           :load_more="false"
           :head-list="popupHeadList"
           :body-list="popupBodyList"
           :no-data="noData"
           :cell-key="popIdKey"
        ></d-table>
      </div>
    </wxc-popup>
  </layout>
</template>

<script>
import WxcDialog from '@/components/dialog/dialog.vue'
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import Dialog from '@/utils/dialog'
import PageLoaderMixins from '@/mixins/page'
import {formatDate} from "@/store/common/utils";
import {
  Dist_List_Get,
  DISC_SELLER_SHIP_TYPE,
  DISC_BUYER_SHIP_TYPE,
  DISC_CUSTOMER_SHIP_TYPE,
  DISC_INCOME_TYPE,
  ProductKindList
} from '@/config'

export default {
  mixins: [PageLoaderMixins],
  components: {
    WxcDialog,
    WxcPopup,
    BackHead
  },
  data() {
    return {
      applyNo: '',
      bodyList: [],
      business: {
        customerNo: '',
        list: []
      },
      showAddBusiness: false,
      showBusinessDetail: false,
      chooseItem: {
        customer: {}
      },
      companyName: '',
      companyNameList: [{
        name: ''
      }],
      company: {
        name: '',
        companyDetail: ''
      },
      popIdKey: 'no',
      popupHeadList: [
        {
          title: '序号',
          width: 1,
          key: 'no'
        },
        {
          title: '公司名称',
          width: 1,
          key: 'exactCompanyName'
        },
        {
          title: '法人',
          width: 1,
          key: 'legalPersonName'
        },
        {
          title: '股东',
          width: 1,
          key: 'investor'
        }
      ],
      popupBodyList: []
    }
  },
  beforeMount() {
    this.applyNo = this.getPageParams('applyNo')
    this.requestList()
  },
  methods: {
    // 请求客户列表
    requestList() {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: 'customerRelList'
        },
        success: data => {
          this.bodyList = data.customerRelList || []
        }
      })
    },
    // 请求工商信息列表或者单条详情
    requestBusinessInfo(customerNo, func, id) {
      this.requestApi.business_info({
        method: 'GET',
        data: {
          applyNo: this.applyNo,
          id,
          customerNo
        },
        success: data => {
          'function' === typeof func && func(data)
        }
      })
    },
    // 添加工商信息
    requestAddBusinessInfo(customerNo, companyNameList, func) {
      this.requestApi.business_add({
        data: {
          applyNo: this.applyNo,
          customerNo,
          companyNameList
        },
        success: data => {
          'function' === typeof func && func(data)
        }
      })
    },
    //增加工作单位列表
    companyAdd(nameIndex){
      if(this.companyNameList.length >2){
        Dialog.toast('单次最多增加三个工作单位')
        return
      } else {
        this.companyNameList.push({name: ''})
      }
    },
    //删除工作单位列表
    companyMinus(nameIndex){
      this.companyNameList.splice(nameIndex, 1)
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
      if (this.applyNo.substring(2, 3) === 'S') {
        //保险类
        desc = '投保人'
      }
      if (item === 'Y') {
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
    // 获取收入来源
    getIncomeType(key) {
      return this.getKeyByName(Dist_List_Get(DISC_INCOME_TYPE), (key || '').toString(), 'key', 'name')
    },
    //获取自雇方式
    getSelfEmployed(key) {
      if (key === 'Y') {
        return '自雇'
      } else {
        return '非自雇'
      }
    },

    doAddBusinessInfo(item) {
      this.chooseItem = item
      this.showAddBusiness = true
    },

    // 打开查询界面
    doBusinessSure() {
      if (this.companyNameList.length === 0) {
        Dialog.toast('请输入客户工作单位')
        return
      }
      let companyNameList = []
      for(let i in this.companyNameList) {
         if(this.companyNameList[i].name) {
           companyNameList.push(this.companyNameList[i].name)
         }
      }
      this.requestAddBusinessInfo(this.chooseItem.customerNo, companyNameList, data => {
        this.showAddBusiness = false
        this.companyNameList = [{name: ''}]
        // 添加了多个工作单位，展示第一个的详情
        this.company.name = data[0].companyName
        this.getDetailBodyList(data[0].queryResult)
        this.showBusinessDetail = true
        this.queryBusinessInfo(this.chooseItem)
      })
    },
    // 关闭查询界面
    doBusinessCancel() {
      this.companyNameList = [{name: ''}]
      this.showAddBusiness = false
    },
    queryBusinessInfo(item) {
      item.firstPageEntry = true
      this.requestBusinessInfo(item.customerNo, data => {
        let employer = false
        for(let ditem of data) {
          if(item.customer.employer && ditem.companyName === item.customer.employer) {
            employer = true
          }
        }
        if(!employer && item.customer.employer) {            
          this.requestAddBusinessInfo(item.customerNo, [item.customer.employer], adata => {
            data.push(adata[0])
            this.business.customerNo = item.customerNo
            this.business.list = data || []
          })
        } else {
            this.business.customerNo = item.customerNo
            this.business.list = data || []
        }

      })
    },

    doDetailBusinessInfo(item) {
      let that = this
      this.requestBusinessInfo(
        item.customerNo,
        data => {
          const tdata = (data && data[0]) || {}
          that.company.name = item.companyName
          that.popupBodyList = (
            (('string' === typeof tdata.queryResult && JSON.parse(tdata.queryResult)) || tdata.queryResult || {})
              .companyDetails || []
          ).map((item, index) => Object.assign({}, item, { no: index + 1 }))
          if (that.popupBodyList.length < 1) {
            that.noData = true
          }
          that.showBusinessDetail = true
        },
        item.id
      )
    },
    getDetailBodyList(queryResult){
      this.popupBodyList = (
          (('string' === typeof queryResult && JSON.parse(queryResult)) || queryResult || {})
              .companyDetails || []
          ).map((item, index) => Object.assign({}, item, { no: index + 1 }))
          if (this.popupBodyList.length < 1) {
            this.noData = true
          }
    },

    closeBusinessDetail() {
      this.showBusinessDetail = false
    },
    doBack() {
      this.$refs['popup-overlay-wrap'].hide()
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  @import './task_cell_common';
</style>
