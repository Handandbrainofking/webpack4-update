<template>
  <task-base-view
     ref="task-base-view"
     :has-head="false"
     :has-upload="false"
     :apply-no="applyNo"
     :show-footer-btn="showBtns"
     :bottom-btns="footerBtn"
     :not-btns="notBtns"
     :not-btn-msg="notBtnMsg"
     @clickBottomBtn="clickBottomBtn">
    <DTab
       v-if="showTab"
       @wxcTabPageCurrentTabSelected="slidePage"
       ref="d-tab-set"
       :tabInitIndex="tabInitIndex"
       mode="bottom-short"
       :swipeChange="true"
       :isScrollTab="false"
       :page-width="tabPageWidth"
       :page-height="showBtns ? tabPageHeight : (tabPageHeight + 120)"
       :tab-styles="{ height: 120, headWrapStyle: {paddingTop: '10px'} }">
      <d-layout slot="tab-title-other" text-align="right" @clickLayout="doStop">
        <text class="btn-items" @click="doDataDetail">资料上传</text>
        <text class="btn-items" @click="doQualityQuery">资质查询</text>
        <text class="btn-items" @click="doProductAssociation">产品关联</text>
      </d-layout>
      <DTabPage
         :show="true"
         :title="item.title"
         :key="`task-tab-page-${index}`" v-for="(item, index) in tabTitles">
        <component
           :matter-key="matterKey"
           :show-btns="showBtns"
           :trace-item="traceItem"
           :title="item.title"
           :ref="`valid-tab-${index}`"
           :is="item.component"
           v-if="showChildren"
        ></component>
      </DTabPage>
    </DTab>
  </task-base-view>
</template>

<script>
import { mapGetters } from 'vuex'
import Dialog from '@/utils/dialog'
import { QualityInquiry, ProductAssociation, DataDetail } from '@/router/defined'
import { throttle } from '@/utils/utils'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'
import MixinTaskSave from '@/page/task/mixins/mixinTaskSave'
import TaskCustomerView from './views/customer.vue' // 子页面 卖方、买方
import TaskInterviewAttention from './views/attention.vue' // 子页面 面签事项
import TaskAutoApprovalInfo from './views/approval-info.vue' // 自动审批信息
import TaskHitRules from './views/hit-rules.vue' // 自动审批信息

export default {
  name: 'TaskInterview',
  statistics: 'TaskInterview|跟单详情-面签',
  components: {
    TaskBaseView, TaskCustomerView, TaskInterviewAttention, TaskAutoApprovalInfo, TaskHitRules
  },
  extends: ExtendTaskBaseView,
  mixins: [MixinTaskIndex, MixinTaskSave],
  data() {
    return {
      showTab: false,
      applyNo: '',
      productCode: '',
      tabTitles: [],
      footerBtn: [],
      notBtns: [],
      notBtnMsg: '请先进行人工审核！',
      tabPageWidth: 2444,
      tabPageHeight: 1248,
      // 请求完订单信息后才显示子视图
      showChildren: false,
      showFirstApproval: false,
      isFirstApproval: false,
      updateFirstApproval: false,
      requestParams: ['customerRelList', 'applyOrder', 'isrMixed', 'feeSummary', 'oriLoan', 'applyOrderExtend', 'newLoan', 'accountList', 'dealInfo', 'orderMatterRecordList', 'houseList', 'hitRuleList', 'landCertList'],
      tabCurrentPage: 0
    }
  },
  computed: {
    ...mapGetters(['orderInfo', 'applyOrder', 'userInfo', 'customerRelList', 'applyOrderExtend', 'isWeBank']),
    hasFirstApproval() {
      return this.$store.state.hasFirstApproval
    }
  },
  watch: {
    hasFirstApproval(value) {
      this.updateFirstApproval = true
      if (value) {
        this.footerBtn = ['终止', '保存', '提交']
      } else {
        this.footerBtn = ['终止', '保存', '初审']
      }
    }
  },

  created() {
    const productType = this.productCode = this.getPageParams('productType', true)
    const applyNo = this.applyNo = this.getPageParams('applyNo', true)
    this.requestOrderInfo(applyNo).then(data => {
      this.showChildren = true
      return (this.data = data)
    })
    const titles = []
    if (this.isDealProduct(productType)) {
      titles.push({
        title: '卖方信息',
        component: TaskCustomerView
      })
      titles.push({
        title: '买方信息',
        component: TaskCustomerView
      })
    } else {
      titles.push({
        title: '客户信息',
        component: TaskCustomerView
      })
    }
    titles.push({
      title: '面签事项',
      component: TaskInterviewAttention
    })
    this.tabTitles = titles
  },
  methods: {
    handlerBottomBtn() {
      if (!this.isWeBank) {
        this.footerBtn = ['终止', '保存', '提交']
      }
    },
    handlerSwipe: throttle(function (e) {
      const ref = this.$refs['d-tab-set']
      switch (e.direction) {
        case 'left':
          typeof ref.next === 'function' && ref.next()
          break
        case 'right':
          typeof ref.prev === 'function' && ref.prev()
          break
      }
    }, 100, 250),
    // 处理提交
    doCommit(func) {
      return new Promise((resolve, reject) => {
        const info = this.doValidate(true)
        if (info === false) {
          reject()
          return
        }
        if (info === true) {
          this.creditChannel().then(creditData => {
            this.dealSubmitInfo(creditData, info, func).then(()=>{
              resolve()
            })
          })
        } else {
          this.saveRequest(info, null, true)
            .then(data => {
                this.creditChannel().then(creditData => {
                  this.dealSubmitInfo(creditData, info, func).then(data => {
                  let isApplyLoad = false
                  let isEntrustNotarial = false
                  try {
                    const applyOrderExtend = Object.assign({}, this.applyOrderExtend, info.applyOrderExtend || {})
                    isEntrustNotarial = applyOrderExtend.handleEntrustNotarial === 'N'
                    isApplyLoad = applyOrderExtend.hasNewLoanApply === 'Y' || applyOrderExtend.accompanyNewLoanApply === 'N'
                  } catch (e) {
                  }
                  if (isEntrustNotarial) {
                    this.$emit.dispatch('changeNodeInfo', {
                      taskId: this.traceItem.NotarizationTaskId,
                      deleteFlag: true
                    })
                  }
                  if (isApplyLoad) {
                    this.$emit.dispatch('changeNodeInfo', {
                      taskId: this.traceItem.ApplyLoadTaskId,
                      deleteFlag: true
                    })
                  }
                  resolve()
                })
              })
            })
        }
      })
      
    },
    // 获取征信信息
    getCreditChannel(item) {
      return this.$store.dispatch('getCreditChannel', {customerNos: [item.customerNo]})
        .then(data => {
          if (!Array.isArray(data) || data.length < 1) {
            data = [{
              tempname: item.customer.name,
              tempcredit: item.customer.creditChannel
            }]
          }
          return data
        })
    },
    // 提交前进行征信解析校验
    creditChannel() {
      let customerRelList = this.customerRelList
      const promises = []
      if (Array.isArray(customerRelList) && customerRelList.length > 0) {
        customerRelList.forEach(item => {
          if (item.customer.creditChannel !== 'offlineprint') {
            promises.push(this.getCreditChannel(item))
          }
        })
      }
      return Promise.all(promises).then(function (data) {
        let item
        for (let i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            item = (data[i] || [])[j] || {}

            if (item.tempcredit === 'offlineprint') {
              continue
            } else if (item.parseWay === 'QUERYING') {
              Dialog.toast((item.tempname || item.customerName) + '的征信查询中，当前不可提交')
              return false
            }
            else if (item.parseWay !== 'Y' && item.remark != '已存在相同任务，不可重复创建！') {
              Dialog.toast((item.tempname || item.customerName) + '的线上征信查询状态未成功，无法提交，请等待或更改查询方式')
              return false
            }
            else if (!item.parseWay) {
              Dialog.toast((item.tempname || item.customerName) + '未进行线上查询，不可提交')
              return false
            }
          }
          return true
        }
        return true
      })
    },
    // 阻止点击事件
    doStop() {
    },
    // 资料上传
    doDataDetail() {
      this.doSave(() => {
        const sellerName = ((this.data || {}).applyOrder || {}).sellerName || ''
        this.jump(DataDetail, false, true, {
          orderId: this.applyNo,
          name: encodeURIComponent(sellerName),
          productId: this.productCode
        })
      })
    },
    // 资质查询
    doQualityQuery() {
      this.doSave(() => {
        this.jump(QualityInquiry, false, true, {applyNo: this.applyNo, productId: this.productCode})
      })
    },
    // 产品关联
    doProductAssociation() {
      this.doSave(() => {
        this.jump(ProductAssociation, false, true, {applyNo: this.applyNo})
      })
    },
    // tab 切换
    slidePage({page}) {
      if (page === 0 && this.data && this.data.applyOrder.thirdpartyName === 'ZYB'
        && this.data.applyOrder.productId === 'TFB_NSL_NJY_ISR' && this.data.applyOrder.preliminaryResult === 'P') {
        this.footerBtn = this.data.isrMixed && this.data.isrMixed.manCheckResult === 'Y' ?
          ['终止', '已审核'] : ['终止', '审核通过']
      } else {
        this.handlerBottomBtn()
        if(this.isWeBank){
          this.getOrderInfoResult(this.data)
        }
      }
      this.tabCurrentPage = page
    },
    getOrderInfoResult(data) {
      this.data = data
      const isWeBank = this.isWeBank
      const isShowFirstApproval = data && data.applyOrder && (data.applyOrder.thirdpartyName === 'ZYB'
        && data.applyOrder.productId === 'TFB_NSL_NJY_ISR')

      // 这笔订单来自中原银行并且是提放保（无赎楼）产品才会展示
      if (isShowFirstApproval && data.applyOrder.preliminaryResult === 'P') {
        if (this.tabTitles[0].title !== '自动审批信息') {
          this.tabTitles.unshift({
            title: '自动审批信息',
            component: TaskAutoApprovalInfo
          })
        }
        // 人工审批
        if (data.isrMixed.manCheckResult !== 'Y') {
          this.notBtns = ['提交']
        } else {
          this.notBtns = []
        }
        if (this.tabCurrentPage === 0) {
          this.footerBtn = data.isrMixed && data.isrMixed.manCheckResult === 'Y' ?
            ['终止', '已审核'] : ['终止', '审核通过']
        }
      } else if (isWeBank) {
        /*微众也要初审*/
        if (!this.tabTitles.find(item => item.title === '命中规则')) {
          this.tabTitles.push({
            title: '命中规则',
            component: TaskHitRules
          })
        }
        this.showFirstApproval = true
        //只要预审结果 有值就可以进行提交
        if(data.applyOrder.preliminaryResult || this.hasFirstApproval){
          if (!this.hasFirstApproval) {
            this.$store.commit('setFirstApproval', true)
          }
          this.footerBtn = ['终止', '保存', '提交']
        }else{
          this.footerBtn = ['终止', '保存', '初审']
        }
      } else {
        this.handlerBottomBtn()
      }
      this.showTab = true
    },
    // 人工审核操作结果
    doManCheckAgreeResult(result) {
      if (result) {
        this.footerBtn = ['终止', '已审核']
      }
    },
    /**
     * 初审
     * 1、保存之后才能出什么
     */
    setBtnFirstTrialStatus(disabled) {
      if (disabled) {
        this.isFirstApproval = true
        if (this.notBtns.indexOf('初审') < 0) {
          this.notBtns.push('初审')
        }
      }
      else {
        this.isFirstApproval = false
        if (this.notBtns.indexOf('初审') > -1) {
          this.notBtns = this.notBtns.filter(item => item !== '初审')
        }
      }
    },
    firstTrial() {
      // 获取用户信息 根据用户信息填充的规则进行检查
      if (this.validateFirstTrial()) {
        this.setBtnFirstTrialStatus(true)

        const save = this.doSave((bool) => {
          if (bool === false) {
            this.setBtnFirstTrialStatus(false)
            return false
          }
          this.$store.dispatch('firstApproval', {
            applyNo: this.applyNo,
            currentNode: this.matterKey
          }).then(data => {
            Dialog.toast('初审完成，可在命中规则页面查看命中规则')
            this.updateFirstApproval = true
            this.setBtnFirstTrialStatus(false)
            return data
          }).catch(() => {
            this.setBtnFirstTrialStatus(false)
          })
        }, true)
        if (save === false) {
        } else {
          save.catch(() => {
            this.setBtnFirstTrialStatus(false)
          })
        }
        return save
      }
      return false;
    },
    validateFirstTrial() {
      const $refs = this.$refs
      let i
      let $ref
      for (i in $refs) {
        if (i.indexOf('valid-tab-') === 0) {
          let ref = $refs[i]
          if (Array.isArray(ref)) {
            ref = ref[0]
          }
          if (ref.title === '客户信息') {
            $ref = ref
            break
          }
        }
      }
      const $customRefs = $ref.$refs
      for (i in $customRefs) {
        if (i.indexOf('valid-customer-') === 0) {
          const info = $customRefs[i].info
          const relationItem = this.findItemByNameBlock(info, 'relation')
          if (relationItem.value === 'CQR' || relationItem.value === 'CQRPO') {
            const nameItem = this.findItemByNameBlock(info, 'name')
            const idCardTypeItem = this.findItemByNameBlock(info, 'idCardType')
            const idCardNoItem = this.findItemByNameBlock(info, 'idCardNo')
            const maritalStatusItem = this.findItemByNameBlock(info, 'maritalStatus')
            const infoArray = [nameItem, idCardTypeItem, idCardNoItem, maritalStatusItem]
            if (maritalStatusItem.value === 'MRI') {
              const otherRelationItem = this.findItemByNameBlock(info, 'otherRelation')
              infoArray.push(otherRelationItem)
            }
            const ref = $customRefs[i]
            const data = ref.validBaseData(true, false, ref.titleName + ref.dataItem.sortIdx + ': ', infoArray)
            if (data === false) {
              return false
            }
          }
        }
      }
      return true
    },
    // 点击下面的按钮
    doClickBtn(idx, item , e) {
      
      var clickFunResult = undefined;
      switch (item) {
        case '终止':
          clickFunResult = typeof this.doStopBtn === 'function' && this.doStopBtn()
          return
        case '保存':
          e.btnClickStatus = true;
          clickFunResult = typeof this.doSave === 'function' && this.doSave()
          break
        case '提交':
          e.btnClickStatus = true;
          clickFunResult = typeof this.doCommit === 'function' && this.doCommit()
          break
        case '审核通过':
          typeof this.doManCheckAgree === 'function' && this.doManCheckAgree()
          break
        case '初审':
          typeof this.firstTrial === 'function' && this.firstTrial()
          break
        default:
          break
      }
      if(typeof clickFunResult === 'object'){
        clickFunResult.then(()=>{
             e.btnClickStatus = false;
        },(reason)=>{
             e.btnClickStatus = false;
        })
      }else if(clickFunResult != undefined){
        e.btnClickStatus = false;
      }
    },
     // 重新保存订单信息
    saveRequest(info, func, hiddenSuccessTip, hiddenErrorTip) {
      // 处理掉tailReleaseNodeName字段，后台不需要
      if (info && info.isrMixed && info.isrMixed.length > 0) {
        for (var i = 0; i < info.isrMixed.length; i++) {
          var item = info.isrMixed[i]
          item.tailReleaseNodeName && delete item.tailReleaseNodeName
        }
      }
      return this.$store.dispatch('saveOrderInfo', {data: info})
        .then(data => {
          this.clearSaveMark()
          if (!hiddenSuccessTip) {
            const $ref = this.getBaseView()
            if ($ref) {
              $ref.doSaveSuccess()
            }
          }
          try {
            // 更新traceItem里面的nodeRemark
            if (info.orderMatterRecordList[0].nodeRemark !== undefined) {
              this.traceItem.nodeRemark = info.orderMatterRecordList[0].nodeRemark
            }
          } catch (e) {}
          typeof this.resetInfo === 'function' && this.resetInfo()
          if (typeof this.uploadCameraImage === 'function') {
            this.uploadCameraImage(data)
          }
          this.showChildren = false
          if (!this.isFirstApproval && !this.hasFirstApproval && this.updateFirstApproval) {
            this.$store.dispatch('updateFirstApproval', {
              applyNo: this.applyNo
            })
          }
          return this.requestOrderInfo(this.applyNo, true).then(data => {
            this.showChildren = true
            typeof func === 'function' && func(true)
            return data
          })
        })
        .catch(({msg, code, obj}) => {
          if (!hiddenErrorTip) {
            const $ref = this.getBaseView()
            if ($ref) {
              $ref.doSaveError(msg)
            }
          }
          if (typeof func === 'function') {
            func(false, msg, code, obj)
          }
          throw new Error(msg)
        })
    }
    
   
  }
}
</script>

<style lang="scss" scoped>
  .btn-items {
    width: 240px;
    height: $btn_height + px;
    line-height: $btn_line_height + px;
    border-radius: 4px;
    font-size: $font_normal;
    color: $color_back;
    background-color: $color_light_focus;
    text-align: center;
    margin-right: $btn_gap_column;
    @include setBorder($color_back);
  }
</style>
