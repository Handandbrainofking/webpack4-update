<!--抵押递件-->

<script>
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { MortgagePassItem } from '@/page/task/config'
import MixinNextMatter from '../mixins/mixinNextMatter'

export default {
  name: 'task_mortgage_in',
  statistics: 'taskMortgageIn|跟单详情-抵押递件',
  extends: ExtendTaskBaseView,
  mixins: [MixinNextMatter],
  data() {
    return {
      info: MortgagePassItem,
      requestParams: ['applyOrder', 'houseTransfer', 'orderMatterRecordList']
    }
  }
}
</script>
