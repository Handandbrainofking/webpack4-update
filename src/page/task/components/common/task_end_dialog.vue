<template>
  <wxc-dialog
     v-if="value"
     :show="true"
     :definedBtn="true"
     width="1600"
     top="200">
    <dialog-head slot="title" title="业务终止" @clickClose="doCancel"></dialog-head>
    <d-layout slot='content' class="end-content" kind="column" text-align="initial" vertical-align="initial" :full-parent="false">
      <d-layout class="reason-content" text-align="initial" vertical-align="initial">
        <d-form v-model="endReason" label="终止原因" type="pick" placeholder="请选择" :label-width="284" :width="1580" :list="endReasonList" :index="-1" :disabled="true" @input="doInput">
          <d-form slot="other-tip" v-model="subReason" :label-width="0" type="pick" placeholder="请选择" :width="600" :list="subReasonList" :index="-1" :disabled="true" @closeBoard="closeBoard"></d-form>
        </d-form>
       <d-form v-if="secondReason === '其他'" type="mark" label="备注" placeholder="请输入其他原因" :maxlength="200" :width="1600" :label-width="284" v-model="marknode"></d-form>
      </d-layout>
      <footer-button :btns="bottomBtns" @clickBtn="doClickBottomBtn"></footer-button>
    </d-layout>
  </wxc-dialog>
</template>

<script>
import Dialog from '@/utils/dialog'
import WxcDialog from '@/components/dialog/dialog.vue'
import DialogHead from '@/components/dialog/comp/dialogHead.vue'
import FooterButton from '@/page/task/components/task_footer_button.vue'
import { DEFINE_HIDDEN_KEYBORAD, native_common_events } from '@/utils/deal_native'
import { mapGetters } from 'vuex'

const productKeyName = (list = []) => {
  if (!Array.isArray(list)) {
    return []
  }
  return list.map((item, index) => ({
    key: index,
    name: item
  }))
}
const mainReasonList = productKeyName(['风险拒单', '客户退单', '变更产品', '人工操作失误', '进件渠道退单'])
const typeReasonList = [
  productKeyName([
    '卖方资质--诉讼信息不符合准入',
    '卖方资质--征信不符合准入',
    '卖方资质--负债不符合准入',
    '卖方资质--申请主体不符合准入',
    '买方资质--买方贷款未获批复',
    '交易标的--房产被查封',
    '交易标的--房屋产权不符合准入',
    '交易背景--关联交易',
    '交易背景--虚假交易',
    '其他'
  ]),
  productKeyName([
    '产品费用高',
    '办理时效长',
    '办理流程繁琐',
    '不愿意托管身份证',
    '不愿意做公证委托',
    '不愿意托管要件',
    '不愿意做资金监管',
    '公司品牌知名度低',
    '买卖双方一方不配合办理',
    '买卖双方一方无购房/卖房资格',
    '房产交易不成功',
    '客户已无资金需求',
    '客户自筹',
    '其他'
  ]),
  productKeyName([
    '--'
  ]),
  productKeyName([
    '订单创建错误',
    '订单重复发起',
    '关联错误',
    '其他'
  ]),
  productKeyName([
    '--'
  ])  
]

export default {
  name: 'task_end_dialog',
  components: {
    WxcDialog,
    DialogHead,
    FooterButton
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    applyNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bottomBtns: ['取消', '提交'],
      marknode: '',
      endReason: -1,
      subReason: -1,
      firstReason: '',
      secondReason: '',
      endReasonList: mainReasonList,
      subReasonList: []
    }
  },
  computed:{
    ...mapGetters(['isWeBank']),
  },
  watch: {
    endReason(value) {
      this.firstReason = this.getValue(this.endReasonList[value] || '', 'name')
      this.subReason = -1
      this.subReasonList = typeReasonList[value]
    },
    subReason(value) {
      this.secondReason = this.getValue(this.subReasonList[value] || '', 'name')
    }
  },
  mounted() {
    // 微众类型添加 房产证地址与实际不符
    if(this.isWeBank){
      const key = this.endReasonList.length
      this.endReasonList.push({
        key,
        name:'房产证地址与实际不符'
      })

      typeReasonList.push(productKeyName(['--' ]))
    }
  },
  methods: {
    doClickBottomBtn(idx, item) {
      switch (item) {
        case '取消':
          this.doCancel()
          break
        case '提交':
          this.doCommit()
          break
        default:
          break
      }
    },
    doCommit() {
      const {
        firstReason, secondReason, marknode, applyNo
      } = this
      if (!firstReason) {
        Dialog.toast('请选择第一终止原因')
      } else if (!secondReason) {
        Dialog.toast('请选择第二终止原因')
      } else if (secondReason === '其他' && !marknode) {
        Dialog.toast('请输入其他原因')
      } else {
        this.requestApi.interview_stop({
          data: {
            applyNo: applyNo,
            endReason: firstReason,
            subReason: secondReason,
            otherEndReason: marknode
          },
          success: (data) => {
            Dialog.toast('业务终止成功')
            this.$emit('input', false)
            this.firstReason = ''
            this.secondReason = ''
            this.marknode = ''
            this.back(true)
          }
        })
      }
    },
    doCancel() {
      this.$emit('input', false)
    },
    closeBoard() {
      native_common_events(DEFINE_HIDDEN_KEYBORAD)
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .end-content {
    height: 780px;
  }

  .reason-content {
    width: 1600px;
    margin-top: 40px;
    flex-wrap: wrap;
  }
</style>
