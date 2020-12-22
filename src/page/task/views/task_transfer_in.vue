<!--过户递件-->

<script>
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { TransferInItem } from '@/page/task/config'
import MixinNextMatter from '../mixins/mixinNextMatter'

export default {
  name: 'task_transfer_in',
  statistics: 'taskTransferIn|跟单详情-过户递件',
  extends: ExtendTaskBaseView,
  mixins: [MixinNextMatter],
  data() {
    return {
      info: TransferInItem,
      requestParams: ['applyOrder', 'houseTransfer', 'orderMatterRecordList']
    }
  }
}
</script>
