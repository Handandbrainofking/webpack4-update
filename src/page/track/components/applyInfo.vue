<!--
字段显示规则

参考 "字段显示说明整理.csv" /FieldDisplayDesc.json
-->


<template>

        <scroller class="apply-info">
            <div class="apply-section">
                <div class="section-header">
                    <text class="apply-info-title-text">基本信息</text>
                </div>
                <div class="apply-fields">
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('applyNo')" label="订单编号" :content="applyInfo.applyNo"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('buyerName')" label="买方姓名" :content="applyInfo.buyerName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('sellerNameAJ')" label="卖方姓名" :content="applyInfo.sellerName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('sellerName')" label="客户姓名" :content="applyInfo.sellerName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('idCardNo')" label="证件号码" :content="applyInfo.idCardNo"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('phone')" label="客户联系方式" :content="applyInfo.phone"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('productName')" label="产品名称" :content="applyInfo.productName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('tailReleaseNode')" label="放款节点" :content="applyInfo.tailReleaseNode|dict(DISC_LOAN_NODE_QL)"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('newLoanType')" label="贷款类型" :content="applyInfo.borrowerType|dict(DISC_ACCOUNT_TYPE)"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('newLoanBankName')" label="新贷款银行" :lines="clacLines('newLoanBankName')" :content="applyInfo.newLoanBankName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('applyStatus')" label="订单状态" :content="applyInfo.applyStatus|dict(DISC_ORDER_STATUS)"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('houseArea')" label="房产区域"  :lines="clacLines('houseArea')" :content="applyInfo.houseArea"></read-info>                  
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('houseAddress')" label="房产地址" :lines="clacLines('houseAddress')" :content="applyInfo.houseAddress"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('landExpiry')" label="房产年限" :content="applyInfo.houseLimitYear"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('preUseAmountDate')" label="预计用款时间" :content="applyInfo.preUseAmountDate|date('YYYY-MM-DD')" :edit="fromUser=='track'" @editclick="editAmountDate"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('businessSum')" label="借款金额（元）" :content="applyInfo.businessSum|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('guaranteeAmount')" label="（申请）保险金额（元）" :content="applyInfo.guaranteeAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('salesUserName')" label="渠道经理" :content="applyInfo.salesUserName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('salesUserTel')" label="渠道经理联系方式" :content="applyInfo.salesUserTel"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('channelName')" label="渠道名称" :lines="clacLines('channelName')" :content="applyInfo.channelName"></read-info>  
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('contact')" label="渠道联系人" :lines="clacLines('contact')" :content="applyInfo.contact"></read-info>                                     
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('channelPhone')" label="渠道联系方式"  :content="applyInfo.channelPhone"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('partnerBankName')" label="合作机构" :lines="clacLines('partnerInsuranceName')" :content="applyInfo.partnerInsuranceName"></read-info>         
                </div>
            </div>
            <div  class="apply-section" v-if="showInsureInfo">
                <div class="section-header">
                    <text class="apply-info-title-text">保险信息</text>
                </div>
                <div class="apply-fields" v-for="item in insurancePolicyList" :key="item.applyNo">
                    <read-info v-bind="fieldProps" label="保单名称" :content="item.policyName"></read-info>
                    <read-info v-bind="fieldProps" label="保单号" :content="item.policyNo"></read-info>
                    <read-info v-bind="fieldProps" label="保险金额" :content="item.insuranceAmount|money"></read-info>
                    <read-info v-bind="fieldProps" label="保费" :content="item.premiumAmount|money"></read-info>
                    <read-info v-bind="fieldProps" label="保单开始日期" :content="item.policyStart|date('YYYY-MM-DD')"></read-info>
                    <read-info v-bind="fieldProps" label="保单终止日期" :content="item.policyEnd|date('YYYY-MM-DD')"></read-info>
                    <read-info v-bind="fieldProps" label="保险费率" :content="item.premiumRate"></read-info>
                </div>
            </div>
            <div  class="apply-section" v-if="showLoanInfo" :style="backgroundStyle('Loan')">
                <div class="section-header">
                    <text class="apply-info-title-text">新贷款信息</text>
                </div>
                <div class="apply-fields">
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('thirdPayee')" label="新贷款借款人" :content="applyInfo.thirdPayee"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('newLoanType2')"  label="新贷款借款人类型" :content="applyInfo.borrowerType|dict(DISC_ACCOUNT_TYPE)"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('newLoanBankName2')"  label="新贷款机构" :lines="clacLines('newLoanBankName')" :content="applyInfo.newLoanBankName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('bizLoanAmount')" label="商业贷款金额(元)" :content="applyInfo.totalLoanAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('totalLoanAmount')" label="贷款金额合计(元)" :content="applyInfo.totalLoanAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('revolvingCreditFlag')" label="循环授信贷款" :content="getName(applyInfo.revolvingCreditFlag, ConfirmType)"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('applyWithdrawAmount')" label="申请提款金额（元）" :content="applyInfo.applyWithdrawAmount|money"></read-info>
                </div>
            </div>
            <div class="apply-section"  v-if="showDealInfo" :style="backgroundStyle('Deal')">
                <div class="section-header">
                    <text class="apply-info-title-text">成交信息</text>
                </div>
                <div class="apply-fields">
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('buyerName2')" label="买方姓名" :content="applyInfo.buyerName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('buyerCertId')" label="证件号码" :content="applyInfo.buyerCertId"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('buyerTel')" label="联系方式" :content="applyInfo.buyerTel"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('tradingPrice')" label="成交价（元）" :content="applyInfo.tradingPrice|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('earnestMoney')" label="定金（元）" :content="applyInfo.earnestMoney|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('tailAmount')" label="尾款（元）" :content="applyInfo.tailAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('downPaymentAmount')" label="首付款（元）" :content="applyInfo.downPaymentAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('loanOffer')" label="贷款申报价（元）" :content="applyInfo.loanOffer|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('transferOffer')" label="过户申报价（元）" :content="applyInfo.transferOffer|money"></read-info>
                </div>
            </div>
            <div class="apply-section"  v-if="showRedeemInfo"  :style="backgroundStyle('Redeem')">
                <div class="section-header">
                    <text class="apply-info-title-text">赎楼信息</text>
                </div>
                <div class="apply-fields">
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('busiDeductPrincipalBalance')" label="商贷本金余额（元）" :content="applyInfo.busiDeductPrincipalBalance|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('ownFundAmount')" label="客户自有资金（元）" :content="applyInfo.ownFundAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('ransomBorrowAmount')" label="赎楼金额（元）" :content="applyInfo.ransomBorrowAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('tailAmount')" label="尾款金额（元）" :content="applyInfo.tailAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('oriLoanBankName')" label="原贷款机构"  :lines="clacLines('oriLoanBankName')"  :content="applyInfo.oriLoanBankName"></read-info>
                </div>
            </div>
            <div class="apply-section"  v-if="showRansomLoanInfo"  :style="backgroundStyle('RansomLoan')">
                <div class="section-header">
                    <text class="apply-info-title-text">赎楼贷款信息</text>
                </div>
                <div class="apply-fields">
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('sellerName')" label="（赎楼）借款人姓名" :content="applyInfo.sellerName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('idCardNo')" label="（赎楼）身份证号码" :content="applyInfo.idCardNo"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('borrowContNo')" label="（赎楼）借款合同编号" :content="applyInfo.borrowContNo"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('preRansomBorrowAmount')" label="预计（赎楼）贷款金额（元）" :content="applyInfo.preRansomBorrowAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('ransomBorrowAmount')" label="实际（赎楼）贷款金额（元）" :content="applyInfo.ransomBorrowAmount|money"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('loanRate')" label="（赎楼）贷款利率（%）" :content="applyInfo.loanRate"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('loanTerms')" label="（赎楼）贷款期数（月）" :content="applyInfo.loanTerms"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('repayMethod')" label="（赎楼）还款方式" :content="applyInfo.repayMethod|dict(RANSOM_REPAY_TYPE)"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('newLoanBankName2')" label="（赎楼）贷款银行" :lines="clacLines('newLoanBankName2')" :content="applyInfo.newLoanBankName"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('bankUser')" label="（赎楼）银行联系人" :content="applyInfo.bankUser"></read-info>
                    <read-info v-bind="fieldProps" v-if="checkIsDisplay('bankPhone')" label="（赎楼）联系方式" :content="applyInfo.bankPhone"></read-info>
                </div>
            </div>
 
            <div class="apply-section"  v-if="showRelatesInfo" :style="backgroundStyle('Relates')">
                <div class="section-header">
                    <text class="apply-info-title-text">关联信息</text>
                </div>
                <div class="apply-fields" v-for="item in relatesInfo" :key="item.applyNo">
                    <read-info v-bind="fieldProps" label="关联订单号" :content="item.applyNo"></read-info>
                    <read-info v-bind="fieldProps" label="产品名称" :content="item.productName"></read-info>
                </div>

                <div class="apply-fields" v-if="!relatesInfo || relatesInfo.length===0">                    
                    <text class="label-read empty-releate-tip">无关联信息</text>
                </div>
            </div>

            <div class="apply-section"  v-if="showOrderKeyInfo"  :style="backgroundStyle('OrderKey')">
                <div class="section-header">
                    <text class="apply-info-title-text">关键信息</text>
                </div>
                <div class="apply-fields">
                    <finish-tag class="finish-tag" tagText="核心资料齐全" :finishFlag="orderKeyInfo.coreMaterial"></finish-tag>
                    <finish-tag class="finish-tag" tagText="录入完成资料齐全" :finishFlag="orderKeyInfo.inputInfoCompleteMaterial"></finish-tag>
                    <finish-tag class="finish-tag" tagText="费率登记已完成" :finishFlag="orderKeyInfo.costMark"></finish-tag>
                    <finish-tag class="finish-tag" tagText="其他事项已完成" :finishFlag="orderKeyInfo.otherMatter"></finish-tag>
                    <read-info v-bind="fieldProps" label="风险等级" :content="orderKeyInfo.riskLevel|dict(DISC_RISK_LEVEL)"></read-info>
                    <read-info v-bind="fieldProps" label="是否加急" :content="filterBoolDisplayText(orderKeyInfo.priority)"></read-info>
                    <read-info v-bind="fieldProps" label="是否先审批" :content="filterBoolDisplayText(orderKeyInfo.manCheckFirst)"></read-info>
                    <read-info v-bind="{width: 2250, contentWidth: 0}" label="情况说明/申诉意见">
                      <text style="width: 1900px">{{ orderKeyInfo.investigateRemark || '-' }}</text>
                    </read-info>
                </div>
            </div>

            <div class="footer-section"></div>
        </scroller>
</template>

<script>
import ReadInfo from '../../task/components/common/read_info.vue'
import FinishTag from '../../task/components/common/finish_tag.vue'
import DisplayInfo from '../FieldDisplayDesc'
import Dialog from '@/utils/dialog'
const picker = weex.requireModule('picker') 


import {
  InterviewListKind,
  ProductKindList,
  Dist_List_Get,
  DISC_ACCOUNT_TYPE,
  ConfirmType,
  DISC_LOAN_NODE_QL,
  DISC_ORDER_STATUS,
  DISC_RISK_LEVEL,
  RANSOM_REPAY_TYPE
} from '@/config'
export default {
  name: 'applyinfo',
  props: {
    applyNo: {
      type: String
    },
    fieldWidth: {
      type: Number
    },
    fromUser: {
      type: String
    }
  },
  components: {
    ReadInfo,
    FinishTag
  },
  beforeMount() {
    const applyNo = this.applyNo
    this.getApplyInfo(applyNo)
    this.getinsurancePolicyList(applyNo)
    this.getRelatesInfo(applyNo)
    this.getOrderKeyInfo(applyNo)
  },
  data() {
    return {
      DISC_ACCOUNT_TYPE,
      DISC_LOAN_NODE_QL,
      DISC_ORDER_STATUS,
      RANSOM_REPAY_TYPE,
      DISC_RISK_LEVEL,
      ConfirmType,
      applyInfo: {},
      insurancePolicyList: [],
      relatesInfo: [],
      orderKeyInfo: {}
    }
  },
  created() {
  	this.getHistoryApproval();
  },
  computed: {
    productType() {
      let order = this.applyInfo || {}
      return order.productId || ''
    },
    fieldProps() {
      let contentWidth = this.fieldWidth - 230
      contentWidth = contentWidth < 430 ? 430 : contentWidth
      return {
        width: this.fieldWidth,
        contentWidth
      }
    },

    showLoanInfo() {
      return this.has(DisplayInfo.Sections.Loan, this.productType)
    },
    showInsureInfo() {
      return this.has(DisplayInfo.Sections.Insure, this.productType)
    },
    showDealInfo() {
      return this.has(DisplayInfo.Sections.Deal, this.productType)
    },
    showRedeemInfo() {
      return this.has(DisplayInfo.Sections.Redeem, this.productType)
    },
    showRelatesInfo() {
      return this.has(DisplayInfo.Sections.Relates, this.productType)
    },
    showRansomLoanInfo() {
      return this.has(DisplayInfo.Sections.RansomLoan, this.productType)
    },
    showOrderKeyInfo() {
      return this.has(DisplayInfo.Sections.OrderKey, this.productType)
    }
  },
  methods: {
    getName(key, list) {
      for(let i in list) {
        if(list[i].key === key) {
          return list[i].name
        }
      }
    },
    //取得订单信息
    getApplyInfo(applyNo) {
      this.requestApi.order_detail({
        method: 'GET',
        data: 'applyNo=' + applyNo,
        success: data => {
          this.applyInfo = data
        }
      })
    },
    //取得保费信息
    getinsurancePolicyList(applyNo = '') { // TODO:LCL 单元测试没有覆盖
      this.requestApi.order_info({
        data: {
          applyNo,
          relationKey: 'insurancePolicyList'
        },
        success: data => {
          let insurancePolicy = data && data.insurancePolicyVOList
          this.insurancePolicyList = insurancePolicy && insurancePolicy.length > 0 ?  insurancePolicy : [{}]
        }
      })
    },
    //取得关联信息
    getRelatesInfo(applyNo) {
      this.requestApi.product_list({
        data: {
          applyNo
        },
        success: data => {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].applyNo == applyNo) {
                data.splice(i, 1)
              }
            }
          }
          this.relatesInfo = data
        }
      })
    },
    getOrderKeyInfo(applyNo) {
      this.requestApi.order_key_info({
        data: {
          applyNo
        },
        success: data => {
          this.orderKeyInfo = data
        }
      })
    },
    //是否显示 字段
    checkIsDisplay(field) {
      return this.has(DisplayInfo[this.productType], field)
    },
    has(arr = [], item = '') {
      return Array.prototype.indexOf.call(arr, item) !== -1
    },
    backgroundStyle(section) {
      let sections = ['Loan','Insure', 'Deal', 'Redeem', 'RansomLoan', 'Relates', 'OrderKey'].filter(section => {
        return this.has(DisplayInfo.Sections[section], this.productType)
      })

      let isEven = (sections.indexOf(section) + 3) % 2 //检查是否为偶数行，第一行不算，第二行的下标是0，所以（0+3）%2是1代表偶数行
      return { backgroundColor: isEven ? '#FBFBFB' : '#FFFFFF' }
    },
    clacLines(field, size = 14) {
      let val = this.applyInfo[field] || ' '
      return Math.ceil(val.length / size)
    },
    
    editAmountDate(content) {
      const dataPicker = Object.create(picker)
      dataPicker.pickDate( // TODO:lcl 尽量不要直接调用组件的方法，这样会破坏组件的独立性，而且组件存在重构
        {
          value: content   || this.formatDate((new Date()).getTime(),'YYYY-MM-DD'),
          min: this.formatDate((new Date()).getTime(),'YYYY-MM-DD')
        },
        event => { // TODO:lcl 建议另起个 onAmountDateChanged 处理方法
          if (event.result === 'success') {
            this.applyInfo.preUseAmountDate = event.data
            //请求接口，修改时间
            // 修改  产品费用信息
            this.requestApi.order_info_save({
              data: {
                data: {
                  feeSummary: [
                    {
                      preUseAmountDate: this.applyInfo.preUseAmountDate,
                      applyNo: this.applyInfo.applyNo
                    }
                  ]
                }
              },
              success: data => {
                Dialog.toast('修改预计用款时间成功！')
              }
            })
          }
        }
      )
    },
    //获取操作记录
    getHistoryApproval(){
	    	this.requestApi.history_approval({
	          method: "GET",
	          data: {
	            applyNo: this.applyNo,
	          },
	          success: data => { //TODO:lcl * HTTP操作和数据加工是两个行为，应该分成两个函数，如 getHistoryApproval, processHistoryApproval
	          	//判断所有的发送放款指令都是agree状态时才不能修改预计用款时间
              this.processHistoryApproval(data)	          	
	          }
	        });
    },
    processHistoryApproval(data) {
      var SendLoanCommandArr = [];
      data.forEach(function(item,index){
        if(item.taskKey === 'SendLoanCommand'){
          SendLoanCommandArr.push(item);
        }
      });
      if(SendLoanCommandArr.length == 0){
        return;
      }
      var sendLoadStatus = true;
      for(var i=0;i<SendLoanCommandArr.length;i++){
        var item = SendLoanCommandArr[i];
        //只要发送放款指令有一个不是同意状态，那么都可以修改预计用款时间
        if(item.status != 'agree'){
          sendLoadStatus = false; 
          break;
        }
      }
      if(sendLoadStatus){
        this.fromUser = ''; 
      }
    },
    filterBoolDisplayText(info) {//TODO * 已处理:lcl 方法命名应该更有意义，如 filterBoolDisplayText
      if(info === false) {
        return '否'
      }else if(info == true) {
        return '是'
      }else {
        return ''
      }
    }
  }
}
</script>

<style src="../trackcss.css" scoped>
</style>

<style lang="scss" scoped>
@import '../../../css/common';

.apply-info {
  flex: 1;
  padding-right: 10px;
  padding-left: 10px;
}

.empty-releate-tip {
  padding-left: 17px;
  font-size: 30px;
  color: #677475;
}

.apply-section {
  padding-bottom: 10px;
  padding-left: 30px;
}

.section-header {
  height: 90px;
  align-items: flex-start;
  justify-content: center;
}

.apply-fields {
  flex-wrap: wrap;
  flex-direction: row;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 90px;
}

.footer-section {
  height: 40px;
  width: 100px;
}

.finish-tag {
  margin-bottom: 20px;
  width: 500px
}
</style>

