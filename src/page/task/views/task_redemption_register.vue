<!--赎楼登记-->

<template>
  <div class="down-house-view" style="width:2400px">
    <task-base-view 
       ref="task-base-view"
       :info="info"
       :apply-no="applyNo"
       :matter-key="matterKey"
       :product-code="productCode"
       :show-footer-btn="showBtns"
       :bottom-btns="bottomBtns"
       :has-upload="true"
       :is-title-array-config="false"
       @input="changeValue"
       @clickBottomBtn="doClickBtn"
       @chooseGroundBank="doChooseGroundBank"
       @analysisImage="doAnalysisImage">
    </task-base-view> 
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { RedemptionRegisterItem } from '@/page/task/config'
import MixinNextMatter from '../mixins/mixinNextMatter'
import textareaDialog from '@/components/dialog/textarea-dialog.vue'
import { IndexJs } from '@/router/defined';

export default {
  name: 'task_redemption_register',
  statistics: 'taskRedemptionRegister|跟单详情-赎楼登记',
  extends: ExtendTaskBaseView,
  mixins: [MixinNextMatter],
  components:{
    textareaDialog
  },
  data() {
    return {
      info: RedemptionRegisterItem,
      requestParams: ['applyOrder', 'oriLoan', 'ransomFloor', 'orderMatterRecordList','isrMixed','feeSummary'],
      showView: false,
      dialogTitle:"驳回意见",
      dialogRequired:true,
      rejectSubmit:false,
      dialogValue:'',
      showChildren: true,
    }
  },
  computed: {
    ...mapGetters(['isrMixed','feeSummary', 'orderMatterRecordList']),
  },
  methods: {
    initOtherData(data) {
      var dataItem = data ||  this.dataItem

      const info = this.info || []
      // 初始化修改赎楼状态
      const ransomFlagItem = this.findItemByNameBlock(info, 'ransomFlag')
      this.doChangeRedemptionStatus(ransomFlagItem.value, ransomFlagItem.sortIndex)
      this.showView = true      

      //买付保（有赎楼）、买付保（有赎楼）-担保 产品：买家支付赎楼款项和当前时间【超过】放款有效期  显示驳回按钮
      if(dataItem.feeSummary.randomPayMode === 'buyerPay' && dataItem.isrMixed.endTime 
      && (dataItem.isrMixed.endTime < (new Date()).getTime() || dataItem.isrMixed.startTime > (new Date()).getTime() ) ){
        this.bottomBtns=["保存","驳回"]
        this.rejectSubmit=true
        this.info.forEach((item)=>{
          if(item.key==="nodeRemark"){
            item.label='驳回原因'
          }
          //必填项设置为只读非必填
          if(item.required){
            item.required = false
            item.readonly = true
          } 
        })
      }else{
        this.bottomBtns=["保存","提交"]
      }
    },
    // 更改传递的值
    changeValue(key, idx, item, value) {
      const _value = item.value
      const info = this.info
      if (_value !== value) {
        this.valueChanged = true
        if (key === 'ransomFlag') {
          this.doChangeRedemptionStatus(value, idx)
        }
        this.$set(info, idx, Object.assign({}, item, { value, changed: true }))
      }
    },
    // 切换赎楼状态
    doChangeRedemptionStatus(value, idx) {
      const info = this.info
      info[idx + 1].hidden = info[idx + 2].hidden = (value !== 'N')
      info[idx + 3].hidden = info[idx + 4].hidden = info[idx + 5].hidden= info[idx + 6].hidden = (value !== 'Y')
    },
    // 重写点击提交按钮 赎楼登记需要赎楼成功才进行下一个事项办理预约
    doCommit(func) {
      return this.doBaseCommit(func).then(data => {
        if(this.rejectSubmit){

          //跳转待办页面
          this.jump(IndexJs,true,true,{type:0});
          return
        }
        // 填写预计抵押时间后需要生成待办事项
        const info = this.info || []
        const ransomFlagItem = this.findItemByNameBlock(info, 'ransomFlag')
        if (ransomFlagItem.value === 'Y') {
          const bookMatterKeyItem = this.findItemByNameBlock(info, 'nextMatterKey')
          const bookMatterTimeItem = this.findItemByNameBlock(info, 'nextHandleTime')
          const matterItem = this.getItemByName(bookMatterKeyItem.list, bookMatterKeyItem.value)
          var requestData = {
              applyNo: this.applyNo,
              matterKey: matterItem.key,
              matterName: matterItem.name,
              appointTime: bookMatterTimeItem.value,
              currentIsNextMatter: true,
              appointAddress: '',
              remark: ''
          }
          //预约下一个事项
          this.requestApi.order_book({
            data: requestData,
            success: () => {
              this.$emit('upDateTaskId')
            },
            error: () => {
              this.$emit('upDateTaskId')
            }
          })
        } else {
          this.$emit('upDateTaskId')
        }
      })
    },
    //驳回按钮
    doReject(func){
       //驳回操作
      this.info.action = 'REJECT'
      this.info.destination = 'SendLoanCommand'
      return this.doCommit(); 
    }
  }
}
</script>
