<template>
    <scroller class="summary-scroller">
        <div class="part">
          <text class="title">基本信息</text>
          <d-row class="row-read">
            <d-col :span="1"><read-info label="报告时间" :content="summaryList.queryDate || '-'"></read-info></d-col>              
            <d-col :span="1"><read-info label="姓名" :content="summaryList.name || '-'"></read-info></d-col>
            <d-col :span="1"><read-info label="证件类型" :content="summaryList.idCardType || '-'"></read-info></d-col>     
          </d-row>
          <d-row class="row-name">
            <d-col :span="1"><read-info label="证件号码" :content="summaryList.idCardNo || '-'"></read-info></d-col>
          </d-row>
        </div>
        <div class="part">
          <text class="title">查询次数</text>
          <d-row  class="row-read">
            <d-col :span="1"><read-info label="近三个月查询次数" :content="summaryList.threeMonthQueryTimes || '-'"></read-info></d-col>   
          </d-row>        
        </div>
        <div class="part">
          <text class="title">负债统计</text>
          <d-row  class="row-title">
            <d-col :span="1"><read-label label="到期信用类贷款本金余额"></read-label></d-col>            
            <d-col :span="1"><read-label label="到期担保本金余额"></read-label></d-col>
            <d-col :span="1"><read-label label="信用卡透支金额"></read-label></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="load-text">{{ summaryList.creditLoanAmount || '-' }}</text></d-col>
            <d-col :span="1" class="load-content" ><text class="load-text">{{ summaryList.guaranteeAmount || '-' }}</text></d-col>
            <d-col :span="1" class="load-content" ><text class="load-text">{{ summaryList.cardUseAmount + summaryList.stdCardUseAmount || '-' }}</text></d-col>
          </d-row>
          <d-row class="row-title">
            <d-col :span="1"><read-label label="负债合计"></read-label></d-col>
            <d-col :span="1"><read-label label="近6个月信用卡平均使用额度"></read-label></d-col>
            <d-col :span="1"></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content" ><text class="load-text">{{ summaryList.creditLoanAmount + summaryList.guaranteeAmount + summaryList.cardUseAmount + summaryList.stdCardUseAmount  || '-' }}</text></d-col>
            <d-col :span="1" class="load-content" ><text class="load-text">{{ summaryList.cardLatest6mUseDavgAmount + summaryList.stdCardLatest6mUseDavgAmount || '-' }}</text></d-col>
            <d-col :span="1"></d-col>
          </d-row>
        </div>
        <div class="part">
          <text class="title">逾期情况</text>
          <d-row class="row-title">
            <d-col :span="1"><read-label label="当前逾期"></read-label></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.curOverdue || '-' }}</text></d-col>
          </d-row>
          <d-row class="row-title">
            <d-col :span="1"><read-label label="近6个月M1逾期>1次"></read-label></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.m1OnceOf6mOverdue || '-' }}</text></d-col>
          </d-row>
          <d-row class="row-title">
            <d-col :span="1"><read-label label="近6个月M1逾期>2次"></read-label></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.m1TwiceOf6mOverdue || '-' }}</text></d-col>
          </d-row>
          <d-row class="row-title">
            <d-col :span="1"><read-label label="近6个月M1逾期>3次"></read-label></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.m1ThirdOf6mOverdue || '-' }}</text></d-col>
          </d-row>
           <d-row class="row-title">
            <d-col :span="1"><read-label label="近12个月M1逾期>1次"></read-label></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.m1ThirdOf12mOverdue || '-' }}</text></d-col>
          </d-row>
          <d-row class="row-title">
            <d-col :span="1"><read-label label="近1个月M2逾期>1次"></read-label></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.m2Of1mOverdue || '-' }}</text></d-col>
          </d-row>
           <d-row class="row-title">
            <d-col :span="1"><read-label label="近12个月M2逾期>1次"></read-label></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.m2Of12mOverdue || '-' }}</text></d-col>
          </d-row>
          <d-row class="row-title">
            <d-col :span="1"><read-label label="近24个月M1逾期>1次"></read-label></d-col>
          </d-row>
          <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.m1Of24mOverdue || '-' }}</text></d-col>
          </d-row>
           <d-row class="row-title">
            <d-col :span="1"><read-label label="近12个月M4逾期>1次"></read-label></d-col>
          </d-row>
           <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.m4Of12mOverdue || '-' }}</text></d-col>
          </d-row>
           <d-row class="row-title">
            <d-col :span="1"><read-label label="近24个月M4逾期>1次"></read-label></d-col>
          </d-row>
           <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.m4Of24mOverdue || '-' }}</text></d-col>
          </d-row>
          <d-row class="row-title">
            <d-col :span="1"><read-label label="半年逾期次数总和"></read-label></d-col>
          </d-row>
           <d-row class="row-content">
            <d-col :span="1" class="load-content"><text class="read-content">{{ summaryList.overduleTimesIn6m || '-' }}</text></d-col>
          </d-row>
        </div>  
        <div class="part">
          <text class="title">贷款信息</text>
          <div class="row-read">
            <d-row>
              <d-col :span="1"><read-info label="到期信用类贷款统计" :content="summaryList.loanNum || '-'"></read-info></d-col>
              <d-col :span="1"><read-info label="到期信用类贷款本金余额" :content="summaryList.creditLoanAmount || '-'"></read-info></d-col>
              <d-col :span="1"><read-info label="近三个月内新增小贷" :content="summaryList.smallLoanCompyNmaes || '-'"></read-info></d-col>
            </d-row>
            <d-row>
              <d-col :span="1"><read-info label="贷款账户状态异常" :content="summaryList.loanAccountError || '-'"></read-info></d-col>
              <d-col :span="1"><read-info label="贷款五级分类状态异常" :content="summaryList.loanClass5Error || '-'"></read-info></d-col>
              <d-col :span="1"><read-info label="贷款到期但本金余额不为0" :content="summaryList.loanBalanceError || '-'"></read-info></d-col>
            </d-row>
          </div>

        </div> 
        <div class="part">
          <text class="title">贷记卡信息</text>
          <div class="row-read">
              <d-row>
                <d-col :span="1"><read-info label="贷记卡数量统计" :content="summaryList.cardNum || '-'"></read-info></d-col>
                <d-col :span="1"><read-info label="贷记卡已用额度" :content="summaryList.cardUseAmount || '-'"></read-info></d-col>
                <d-col :span="1"><read-info label="近6个月贷记卡平均使用额度" :content="summaryList.cardLatest6mUseDavgAmount || '-'"></read-info></d-col>         
              </d-row>          
              <d-row>
                <d-col :span="1"><read-info label="贷记卡授信额度统计" :content="summaryList.cardLimitAmount || '-'"></read-info></d-col>
                <d-col :span="1"><read-info label="贷记卡账户状态异常" :content="summaryList.cardAccountError || '-'"></read-info></d-col>
                <d-col :span="1"></d-col>
              </d-row>
          </div>

        </div> 
        <div class="part">
          <text class="title">准贷记卡信息</text>
          <div class="row-read">
              <d-row>
                <d-col :span="1"><read-info label="准贷记卡数量统计" :content="summaryList.stdCardNum || '-'"></read-info></d-col>
                <d-col :span="1"><read-info label="准贷记卡已用额度" :content="summaryList.stdCardUseAmount || '-'"></read-info></d-col>
                <d-col :span="1"><read-info label="近6个月准贷记卡平均使用额度" :content="summaryList.stdCardLatest6mUseDavgAmount || '-'"></read-info></d-col> 
              </d-row>          
              <d-row>
                <d-col :span="1"><read-info label="准贷记卡授信额度统计" :content="summaryList.stdCardAccountError || '-'"></read-info></d-col> 
                <d-col :span="1"><read-info label="准贷记卡账户状态异常" :content="summaryList.stdCardLimitAmount || '-'"></read-info></d-col> 
                <d-col :span="1"></d-col>
              </d-row>
          </div>
        </div> 
        <div class="part">
          <text class="title">担保信息</text>
          <d-row class="row-read">
            <d-col :span="1"><read-info label="对外担保数量" :content="summaryList.guaranteeNum || '-'"></read-info></d-col> 
            <d-col :span="1"><read-info label="到期担保本金余额" :content="summaryList.guaranteeAmount || '-'"></read-info></d-col>   
            <d-col :span="1"><read-info label="五级分类状态异常" :content="summaryList.guaranteeClass5Error || '-'"></read-info></d-col>   
          </d-row>  
        </div>
          
    </scroller>
         
</template>

<script>

import DCol from "@/core/Layout/DCol";
import DRow from "@/core/Layout/DRow";
import ReadInfo from '../../task/components/common/read_info.vue';
import ReadLabel from '../../task/components/common/read_label.vue'

export default {
    components: {
        DCol,
        DRow,
        ReadInfo,
        ReadLabel
    },
    props: {
        summaryList:{
            type: Array,
            default: []
        }
    }

}
</script>

<style>
.summary-scroller {
  width: 2200px;
  height: 1322px;
  margin-top: 40px;
  border-width: 2px;
  border-color: #DDEDF8;
  padding-left: 40px;
  padding-right: 40px;
}
.part {
  padding-top: 40px;
  padding-bottom: 60px;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #EBEBEB;
}
.row-read {
  margin-left: 120px;
  margin-top: 20px;
}
.row-name {
  margin-left: 120px;
  margin-top: 10px;
}
.row {
  flex: 1;
}
.row-title {
  margin-top: 40px;
}
.row-content {
  margin-top: 20px;
}
.title {
  font-size: 30px;
  color: #21363D;
}
.title-text {
  color: #677475;
  font-size: 30px;
}
.load-content {
  padding-left: 10px;
}
.load-text {
  font-size: 40px;
  color: #21363D;
}
.read-content {
  font-size: 30px;
  color: #21363D;
}
</style>


