<!--抵押出件-->
<script>
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { MortgageOutItem } from '@/page/task/config'

export default {
  name: 'task_mortgage_out',
  statistics: 'taskMortgageOut|跟单详情-抵押出件',
  extends: ExtendTaskBaseView,
  data() {
    return {
      info: MortgageOutItem,
      requestParams: ['applyOrder', 'houseTransfer', 'orderMatterRecordList']
    }
  },
  methods: {
    initOtherData() {
      const productCode = this.productCode
      if (!this.isJsdProduct(productCode)) {
        const handleTime = this.findItemByNameBlock(this.info, 'nextHandleTime')
        handleTime.hidden = true
      }
      const nextMatterKeyItem = this.findItemByNameBlock(this.info, 'nextMatterKey')
      this.requestApi.get_next_matter_list({
        method: 'GET',
        data: {
          productId: productCode,
          matterKey: this.matterKey
        },
        success: (data) => {
          var matters = [];
          data.forEach(element => {
            return matters.push({key:element.nextMatterKey,name:element.nextMatterName});
          });
          nextMatterKeyItem.value = matters[0] && matters[0].key
          nextMatterKeyItem.list = matters
        }
      })
    }
  }
}
</script>
