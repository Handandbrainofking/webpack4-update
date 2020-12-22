<!--注销抵押-->
<script>
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { CancelMortgageItem } from '@/page/task/config'
import MixinNextMatter from '../mixins/mixinNextMatter'

export default {
  name: 'task_logout_mortgage',
  statistics: 'taskLogoutMortgage|跟单详情-注销抵押',
  extends: ExtendTaskBaseView,
  mixins: [MixinNextMatter],
  data() {
    return {
      info: CancelMortgageItem,
      requestParams: ['applyOrder', 'houseTransfer', 'orderMatterRecordList']
    }
  },
  methods: {
    beforeDealNextMatter() {
      const info = this.info || []
      const item = this.findItemByNameBlock(info, 'nextMatterKey')
      const productCode = this.productCode
      if (this.isDealProduct(productCode)) {
        item.defaultValue = 'TransferIn'
      } else {
        item.defaultValue = 'MortgagePass'
      }
    }
  }
}
</script>
