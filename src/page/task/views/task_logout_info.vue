<!--取注销材料-->
<script>
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { GetCancelMaterialItem } from '@/page/task/config'
import MixinNextMatter from '../mixins/mixinNextMatter'

export default {
  name: 'task_logout_mortgage',
  statistics: 'taskLogoutMortgage|跟单详情-取注销材料',
  extends: ExtendTaskBaseView,
  mixins: [MixinNextMatter],
  data() {
    return {
      info: GetCancelMaterialItem,
      requestParams: ['applyOrder', 'ransomFloor', 'oriLoan', 'orderMatterRecordList']
    }
  }
}
</script>
