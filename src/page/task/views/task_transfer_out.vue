<!--过户出件-->
<script>
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { TransferOutItem } from '@/page/task/config'
import MixinNextMatter from '../mixins/mixinNextMatter'

export default {
  name: 'task_transfer_out',
  statistics: 'taskTransferOut|跟单详情-过户出件',
  extends: ExtendTaskBaseView,
  mixins: [MixinNextMatter],
  data() {
    return {
      info: TransferOutItem,
      requestParams: ['applyOrder', 'houseTransfer', 'orderMatterRecordList']
    }
  }
}
</script>
