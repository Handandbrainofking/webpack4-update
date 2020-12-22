<!--申请贷款(赎楼贷款)-->
<script>
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { ApplyLoan_AtoneItem } from '@/page/task/config'
import { mapGetters } from 'vuex'

export default {
  name: 'applyLoanRansom',
  statistics: 'applyLoanRansom|跟单详情-申请贷款（赎楼贷款）',
  extends: ExtendTaskBaseView,
  data() {
    return {
      info: ApplyLoan_AtoneItem,
      requestParams: ['applyOrder', 'newLoan', 'ransomFloor',  'orderMatterRecordList'],
      bottomBtns: ["保存", "提交"],
      capitalCode: '',
      showChildren: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'applyOrder']),
  },
  methods: {
    initOtherData() {
      const productType = this.productType
      const info = this.dealInfoCompatibleArray()
      // 处理转单控制释放
      const userInfo = this.userInfo
	    const applyOrder = this.applyOrder
	    this.bottomBtns = ['保存', '提交'];
      // 处理落地行
      if (!(productType & this.getCashProductCode())) {
        this.capitalCode = (this.applyOrder || {}).partnerBankId || ''
      }
      // 处理新贷款机构，将对应的编号换成名称
      const newLoanBankCodeItem = this.findItemByNameBlock(info, ['newLoanBankCode', 'newLoanBankName'])
      this.initOrgList(newLoanBankCodeItem.sortIndex, newLoanBankCodeItem)
      this.showChildren = true
    },
    // 点击附件，打开选择等
    clickEnclosure(key, idx, item, event) {
      if (this.compareObj(key, ['newLoanBankCode', 'newLoanBankName'])) {
        this.openLoanBankDialog(key, idx, item)
      }
    }
  }
}
</script>
