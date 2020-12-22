<!--
  function: 处理关联产品的单元项
  author  : wq
  update  : 2018/6/2 18:03
-->
<template>
  <div class="wrapper">
    <pick-view
       class="item"
       ref="pick-view-wrap"
       :dataItem="item"
       v-for="(item, idx) in info"
       :key="`form-key-${idx}`"
       @changeValue="changeValue(idx, item,  ...arguments)"></pick-view>
    <div class="header-row">
          <div class="col-association" v-if="approveShow">
            <div class="mark-row">
                <text class="mark-title">是否先审批</text>
                <text class="title-mark" >*</text>
            </div>
              <div class="mark-content">
                <bui-radio class="select" :button-list="approveList" :index="defaultIndex" @ButtonChoose="buttonChoose"></bui-radio>
              </div>
          </div>
          <div class="col-association" v-if="loanShow">
            <div class="mark-row">
                <text class="mark-title">预计借款金额</text>
                <text class="title-mark">*</text>
            </div>

              <div class="mark-content">
                <money-input class="input-content" placeholder= "请输入预计借款金额" v-model="borrowingAmount"></money-input>
              </div>
          </div>
          <div class="col-association" v-if="insureShow">
            <div class="mark-row">
                <text class="mark-title">申请保险金额</text>
                <text class="title-mark" >*</text>
            </div>
            <div >
              <money-input class="input-content" placeholder= "请输入申请保险金额" v-model="guaranteeAmount"></money-input>
            </div>
        </div>
    </div>
    <div class="header-row" v-if="showBorrowerType">
        <div class="col-association">
          <div class="mark-row">
                <text class="mark-title">原贷款机构</text>
                <text class="title-mark" >*</text>
            </div>
              <div class="mark-content" style="flex-direction:row;">
                <text class="content" style="width:520px;line-height:72px;" >{{dataItem.oriLoanBankName}}</text>
                <text class="btn-commit" @click="oriLoanChoose">请选择</text>
              </div>         
        </div>
        <div class="col-association">
          <div class="mark-content">
            <pick-view class="item" :dataItem="borrowerTypePickData" @changeValue="borrowerTypeChange(...arguments)"></pick-view>
          </div>         
        </div>
    </div>
    
   <div class="shade" @click="doStop" v-if="showShade"></div>

    <task-choose-org
       v-if="firstShowOrgChoose"
       title="原贷款机构"
       v-model="showOrgChoose"
       no-show-city="true"
       @doChooseOrg="doChooseOrg"></task-choose-org>
  </div>
</template>

<script>
import TaskChooseOrg from '@/page/task/components/common/choose_org.vue'
import PickView from '@/components/labelvalue/pick.vue'
import BuiRadio from '@/components/form/radio.vue'
import MoneyInput from '@/components/money/moneyInput.vue'
import DCol from '@/core/Layout/DCol'
import DRow from '@/core/Layout/DRow'
import { Dist_List_Get, DISC_ASSOCIATE_TYPE, ProductKindList,DISC_ACCOUNT_TYPE} from '@/config'
import { native_logMessage } from '@/utils/deal_native'
import Dialog from '@/utils/dialog'

export default {
  name: 'form_product',
  components: {
    PickView,
    BuiRadio,
    MoneyInput,
    DCol,
    DRow,
    TaskChooseOrg
  },
  props: {
    dataItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      labelList: [],
      info: [
        {
          name: 'productId',
          label: '关联产品',
          placeHolder: '请选择关联产品',
          text: '',
          index: -1,
          list: [],
          isNeed: true,
          viewType: 'pick'
        },
        {
          name: 'loanNodeCode',
          text: '',
          label: '放款节点',
          placeHolder: '请选择放款节点',
          index: -1,
          list: [],
          isNeed: true,
          viewType: 'pick'
        },
        {
          name: 'relateType',
          text: '',
          label: '关联类型',
          placeHolder: '请选择关联类型',
          index: -1,
          list: [],
          disc: DISC_ASSOCIATE_TYPE,
          isNeed: true,
          viewType: 'pick'
        },
        {
          name: 'subRelateType',
          text: '',
          label: '二级类型',
          placeHolder: '请选择二级类型',
          index: -1,
          isNeed: true,
          list: [],
          viewType: 'pick'
        }
      ],
      approveList: [
        {
          key: 'Y',
          name: '是，先审批'
        },
        {
          key: 'N',
          name: '否，先面签'
        }
      ],
      borrowerTypePickData:{
        name: 'borrowerType',
        text: '',
        label: '原贷款借款人类型',
        placeHolder: '请选择原贷款借款人类型',
        isNeed: true,
        list: [],
        disc: DISC_ACCOUNT_TYPE,
        index:-1,
        viewType: 'select'
      },
      defaultIndex: -1,
      approveShow: true,
      loanShow: false,
      insureShow: false,
      manCheckFirst: '',
      borrowingAmount: '',
      guaranteeAmount: '',
      firstShowOrgChoose:false,
      showOrgChoose:false,
      showBorrowerType:false,
      //及时贷（交易赎楼）、及时贷（非交易赎楼）、交易保（有赎楼）、提放保（有赎楼）、买付保（有赎楼）、买付保（有赎楼）-担保、交易保（两笔）—保险&担保、提放保（两笔）—保险
      //这些产品才展示原贷款机构、原贷款借款人类型 2个字段
      borrowerTypeProducts:['SLY_YSL_YJY_CSH','SLY_YSL_NJY_CSH','JYB_YSL_YJY_ISR','TFB_YSL_NJY_ISR','IMFB_YSL_YJY_ISR','DMFB_YSL_YJY_ISR',
      'ZYB_YSL_YJY_ISR','DZYB_YSL_YJY_ISR','ZYB_YSL_NJY_ISR']
    }
  },
  created() {
    const item = this.dataItem
    this.applyNo = this.getPageParams('applyNo')
    for (let i in this.info) {
      if (this.info[i].disc) {
        this.info[i].list = Dist_List_Get(this.info[i].disc)
      }
    }
    
     // 原贷款借款人类型
    this.borrowerTypePickData.list = Dist_List_Get(this.borrowerTypePickData.disc)

    if (item.isServer) {
      this.initData()
    } else {
      this.requestProductList()
    }
  },

  computed: {
    showShade() {
      return this.dataItem.isServer
    }
  },

  methods: {
    // 初始化數據
    initData() {
      const dataItem = this.dataItem || {}
      let tmp, value
      /**
       * 将info 的列表的list填充上去
       * @type {*[]}
       */
      // 产品
      this.info[0].list = [
        {
          key: dataItem.productId,
          name: dataItem.productName
        }
      ]
      // 放款节点
      this.info[1].list = [
        {
          key: dataItem.loanNodeCode,
          name: dataItem.loanNodeName
        }
      ]
      // 二级类型
      this.info[3].list = [
        {
          key: dataItem.subRelateType,
          name: dataItem.subRelateType
        }
      ]

      // 原贷款借款人类型

      this.borrowerTypePickData.list.forEach((item)=>{
        if(item.key == dataItem.borrowerType){
          this.borrowerTypePickData.initValue = item.name;
        }
      })

      for(var i=0;i<this.borrowerTypeProducts.length;i++){
        if(dataItem.productId && dataItem.productId == this.borrowerTypeProducts[i]){
          this.showBorrowerType = true;    
          break
        }
      }
      this.loanShow = dataItem.productName.slice(0, 3) == '及时贷' && true
      this.insureShow = dataItem.productName.slice(0, 3) == '买付保' && dataItem.productName.length < 15 && true
      if (dataItem.manCheckFirst == 'Y') {
        this.defaultIndex = 0
      } else if (dataItem.manCheckFirst == 'N') {
        this.defaultIndex = 1
      }
      this.manCheckFirst = dataItem.manCheckFirst || ''
      this.borrowingAmount = dataItem.borrowingAmount || ''
      this.guaranteeAmount = dataItem.guaranteeAmount || ''
      if (dataItem.productId && !dataItem.manCheckFirst) {
        this.requestApi.order_info({
          data: {
            applyNo: this.applyNo,
            relationKey: 'applyOrder'
          },
          success: data => {
            if (data.applyOrder.manCheckFirst == 'Y') {
              this.defaultIndex = 0
            } else if (data.applyOrder.manCheckFirst == 'N') {
              this.defaultIndex = 1
            }
            this.manCheckFirst = data.applyOrder.manCheckFirst || ''
          }
        })
      }
      const list = this.info || []
      list.forEach(item => {
        tmp = dataItem[item.name]
        if (undefined !== tmp && '' !== tmp) {
          item.text = tmp
          if (item.viewType === 'pick') {
            item.index = this.getIndexByKeyFromArray(item.list, tmp)
          } else if (item.viewType === 'select') {
            const idx = this.getIndexByKeyFromArray(tmp.list, tmp)
            if (idx === -1) {
              item.changed = true
              if (item.index < 0) {
                item.index = 0
              }
            } else {
              item.index = idx
            }
            item.text = this.getValue(item.list[item.index], 'key')
          }
        }
      })
    },
    // 选择机构
    doChooseOrg(item) {
      this.dataItem.oriLoanBankCode = item.bankCode;
      this.dataItem.oriLoanBankName = item.bankName;
    },
    oriLoanChoose(){
      this.firstShowOrgChoose = true;
      this.showOrgChoose = true;
    },

    // 请求关联产品信息
    requestProductList() {
      const applyNo = this.applyNo
      let that = this
      this.requestApi.associate_product_query({
        data: {
          applyNo
        },
        success: data => {
          this.info[0].list = this.setProductList((this.labelList = (data && data.relProductList) || []))
          this.requestApi.order_info({
            data: {
              applyNo: this.applyNo,
              relationKey: 'applyOrder'
            },
            success: data => {
              if (data.applyOrder.manCheckFirst == 'Y') {
                that.defaultIndex = 0
              } else if (data.applyOrder.manCheckFirst == 'N') {
                that.defaultIndex = 1
              }
              that.manCheckFirst = data.applyOrder.manCheckFirst || ''
            }
          })
        }
      })
    },

    // 请求二级类型列表
    requestTwoKindList(relateType) {
      const applyNo = this.applyNo
      this.requestApi.associate_product_query({
        data: {
          applyNo,
          relateType
        },
        success: data => {
          const tdata = (data && data['subRuleTypeList']) || []
          Vue.set(
            this.info,
            3,
            Object.assign({}, this.info[3], {
              list: tdata.map(item => ({
                name: item,
                key: item
              }))
            })
          )
        }
      })
    },
    //给原贷款借款人类型赋值
    borrowerTypeChange(key,name, item){
      this.borrowerTypePickData.text = key;
    },
    // 重写修改数据
    changeValue(idx, item, value) {
      if (this.dataItem.isServer) {
        return true
      }
      const _value = this.info[idx].text
      if (_value !== value) {
        if (idx === 0) {
          this.changeProductList(value)
        } else if (idx === 2) {
          this.changeAssociateList(value)
        }
        Vue.set(this.info, idx, Object.assign({}, item, { text: value }))
      }
    },
    // 设置产品下拉列表
    setProductList(list) {
      let i = 0,
        t = list.length
      const tmpList = []
      for (; i < t; i++) {
        if (!ProductKindList[list[i]['relevanceProductCode']]) {
          continue
        }
        tmpList.push({
          key: list[i]['relevanceProductCode'],
          name: list[i]['relevanceProductName']
        })
      }
      return tmpList
    },
    // 切换产品
    changeProductList(value) {
      native_logMessage('切换产品')
      this.info[1].text = this.info[2].text = this.info[3].text = ''
      this.borrowingAmount = this.guaranteeAmount = ''
      this.info[1].list = this.info[3].list = []
      const refs = this.$refs['pick-view-wrap']
      const func1 = refs[1] && refs[1].resetValue
      const func2 = refs[2] && refs[2].resetValue
      const func3 = refs[3] && refs[3].resetValue
      'function' === typeof func1 && func1()
      'function' === typeof func2 && func2()
      'function' === typeof func3 && func3()
      const list = this.getItemByName(this.labelList, value, 'relevanceProductCode')
      this.loanShow = list.relevanceProductName.slice(0, 3) == '及时贷' && true
      this.insureShow =
        list.relevanceProductName.slice(0, 3) == '买付保' && list.relevanceProductName.length < 15 && true
      if (list) {
        Vue.set(
          this.info,
          1,
          Object.assign({}, this.info[1], {
            list: this.setLoanNodeList(list.loanNodeList || [])
          })
        )
      } else {
        Vue.set(this.info, 1, Object.assign({}, this.info[1], { list: [] }))
      }    
      this.showBorrowerType = false;
      this.borrowerTypePickData.text = '';
      this.dataItem.oriLoanBankName = '';
      this.dataItem.oriLoanBankCode = '';
      for(var i=0;i<this.borrowerTypeProducts.length;i++){
        if(value && value == this.borrowerTypeProducts[i]){
          this.showBorrowerType = true;    
          break
        }
      }

    },

    // 设置放款节点列表
    setLoanNodeList(list) {
      let i = 0,
        t = list.length
      const tmpList = []
      for (; i < t; i++) {
        tmpList.push({
          key: list[i]['loanNodeCode'],
          name: list[i]['loanNodeName']
        })
      }
      return tmpList
    },
    // 切换关联产品
    changeAssociateList(value) {
      this.info[3].text = ''
      this.info[3].list = []
      this.requestTwoKindList(value)
    },
    // 单选
    buttonChoose(key, name, index) {
      this.manCheckFirst = key
    },
    // 验证信息
    doValidate() {
      const dataItem = this.dataItem
      if (dataItem.isServer) {
        return true
      }
      const info = this.info
      let i = 0,
        t = info.length,
        tmp
      const list = {}
      for (; i < t; i++) {
        tmp = info[i]
        if (!tmp.text) {
          Dialog.toast(tmp.placeHolder)
          return false
        }
        list[tmp.name] = tmp.text
      }
      if (this.approveShow) {
        if (!this.manCheckFirst) {
          Dialog.toast('请选择是否先审批')
          return
        } else {
          list['manCheckFirst'] = this.manCheckFirst
        }
      }
      if (this.loanShow) {
        if (!this.borrowingAmount) {
          Dialog.toast('请输入预计借款金额')
          return
        } else {
          list['borrowingAmount'] = this.borrowingAmount
        }
      }
      if (this.insureShow) {
        if (!this.guaranteeAmount) {
          Dialog.toast('请输入申请保险金额')
          return
        } else {
          list['guaranteeAmount'] = this.guaranteeAmount
        }
      }
      if (this.showBorrowerType) {
        if (!this.dataItem.oriLoanBankCode || !this.dataItem.oriLoanBankName) {
          Dialog.toast('请选择原贷款结构')
          return
        }

        if (!this.borrowerTypePickData.text || this.borrowerTypePickData.text === '') {
          Dialog.toast('请选择原贷款借款人类型')
          return
        }        
        
      }

      list['productName'] = this.getKeyByName(info[0].list, info[0].text, 'key', 'name')
      list['tailReleaseName'] = this.getKeyByName(info[1].list, info[1].text, 'key', 'name')
      list['tailReleaseNode'] = info[1].text
      list['oriLoanBankName'] = this.dataItem.oriLoanBankName
      list['oriLoanBankCode'] = this.dataItem.oriLoanBankCode
      list['borrowerType'] = this.borrowerTypePickData.text

      return list
    },
    doStop(){   
          
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  @import "../../../css/common";

  .wrapper {
    flex-direction: row;
    flex-wrap: wrap;
    @include setPaddingV(20px);
  }

  .item {
    width: 1200px;
  }

  .shade {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 2400px;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .header-row {
    width: 2400px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .col-association {
    width: 1200px;
    flex-direction: row;
    margin-top: 10px;
  }
   .mark-title {
    color: #21363D;
    font-size: 34px;
    line-height: 72px;
  }
   .title-mark {
     color: red;
     font-size: 34px;
     line-height: 72px;
   }
    .mark-row{
    width: 362px;
    justify-content: flex-end;
    flex-direction: row;
    justify-self: flex-end;
    padding-right: 20px;
    height: 72px;
  }
  .input-content {
    width: 520px;
    height: 72px;
    border-width: 2px;
    font-size: 34px;
    border-color: #CACCCF;
    border-radius: 4px;
    line-height: 70px;
    padding-left: 20px;
  }
  .margin-left {
    margin-left: 200px;
  }
  .btn-commit {
    width: 140px;
    height: 60px;
    line-height: 60px;
    margin-top:8px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(2, 179, 180, .7);
    color: $color_white;
    font-size: $btn_font;
  }
</style>
