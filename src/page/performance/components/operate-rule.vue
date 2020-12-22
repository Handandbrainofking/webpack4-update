<template>
  <wxc-popup
    :show="operateRuleShow"
    @wxcPopupOverlayClicked="doClosePopupRule"
    pos="right"
    width="2240">
    <back-head back-title="提奖计算规则" :beforeBack="backClick"></back-head>
    <div class="history-warpper" v-if="tData.subRuleList&&tData.subRuleList.length">
      <read-info class="com-readinfo" label="城市" :content="tData.belongCityName"></read-info>
      <read-info class="com-readinfo" label="生效日期" :content="tData.startTime|date('YYYY-MM-DD')"></read-info>
      <read-info class="com-readinfo" label="放款计件产品" :content="tData.loanProductNames" :contentWidth="2000" :width="2300"></read-info>
      <read-info class="com-readinfo" label="归档计件产品" :content="tData.pigeonholeProductNames" :contentWidth="2000" :width="2300"></read-info>
      <read-info class="com-readinfo" label="偏远地区" :content="tData.remoteAreaNames" :contentWidth="2000" :width="2300"></read-info>
      <d-table
        v-if="tData.subRuleList&&tData.subRuleList.length"
        height="1150"
        :load_refresh="false"
        :load_more="false"
        :head-list="headList"
        :body-list="bodyList"
        :no-data="noData"
        :fix-width="true"
        :fix-left-column="4"></d-table>
    </div>
    <div v-else class="no-data-content-image" :style="{ 'margin-top': 400 + 'px' }">
      <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
      <text class="no-data-text">暂无数据</text>
    </div>
  </wxc-popup>
</template>
<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import ReadInfo from '@/page/task/components/common/read_info.vue'
import loginApi from '@/utils/login'
export default {
  name: 'operate-rule',
  components: {
    WxcPopup,
    BackHead,
    ReadInfo
  },
  created() {
    this.requestProductList()
  },
  data() {
    return {
      operateRuleShow: true,
      tData: {},
      noData: false,
      headList: [
        {
          title: '序号',
          width: 100,
          key: 'num'
        },
        {
          title: '计件环节',
          width: 200,
          key: 'name'
        },
        {
          title: '标准计件A',
          width: 200,
          key: 'standardPiecework'
        },
        {
          title: '偏远计件B',
          width: 200,
          key: 'remoteAllowance'
        }
      ],
      bodyList: [],
      maxList: [],
      searchList: {}
    }
  },
  methods: {
    requestList() {
      this.requestApi.performance_rule({
        data: {
          companyCode: loginApi.getLoginData().companyCode,
          status: 'active'
        },
        success: data => {
          this.tData = data
          if(Object.keys(this.tData).length !== 0) {
            this.defeatData()
          }
        }
      })
    },
    getMaxList() {
      this.requestApi.performance_max({
        data: {
          startTime: new Date().getTime()
        },
        success: data => {
          this.maxList = data
          let maxItem = {
            num: this.bodyList.length + 1,
            name: '计件上限'
          }
          for(let j = 2; j < this.headList.length; j++) {
            for(let item of this.maxList) {
              if(item.productId === this.headList[j].key) {
                maxItem[item.productId] = item.toplimitVaule
              }
            }
          }
          for(let j = 2; j < this.headList.length; j++) {
            maxItem[this.headList[j].key] = maxItem[this.headList[j].key] || '-'
          }
          this.bodyList.push(maxItem)
        }
      })
    },
    requestProductList() {
      let pageNumber = 1
      let pageSize = 999
      this.requestApi.product_order_list({
        data: {
          pageNumber,
          pageSize
        },
        success: data => {
          data.list.map(item => {
            this.searchList[item.productId] = item.productName
          })
          this.requestList()
        }
      })
    },
    // TODO xxz 代码段太长 要抽成几个函数
    defeatData() {
      const bodyList = []
      const headList = this.headList || []
      const startIndexCutArray = []
      const endIndexCutArray = []
      const twoRowList = []
      if(this.tData.subRuleList && this.tData.subRuleList.length) {
        let flag = 0
        let itemList = this.tData.subRuleList
        for(let i = 2; i < itemList.length; i++) {
          if(itemList[i].columnType === 'product' && flag === 0) {
            headList.push({title: this.searchList[itemList[i].columnKey], width: 350, key: itemList[i].columnKey})
          }else if(itemList[i].columnType === 'other'){
            flag = 1
          }
        }
        for(let itemListIndex = 0; itemListIndex < itemList.length; itemListIndex++) {
          if(itemList[itemListIndex].columnKey === 'standardPiecework') {
            startIndexCutArray.push(itemListIndex)
            if(itemListIndex != 0) {
              endIndexCutArray.push(itemListIndex - 1)
            }
          }
        }
        endIndexCutArray.push(itemList.length)
        for(let cutIndex = 0; cutIndex < startIndexCutArray.length; cutIndex++) {
          twoRowList.push(itemList.slice(startIndexCutArray[cutIndex], endIndexCutArray[cutIndex] + 1))
        }
        for(let k = 0; k < twoRowList.length; k++) {
          let tempItem = {}
          tempItem.num = k + 1
          tempItem.name = twoRowList[k][0].linkValue
          for(let headListIndex = 2; headListIndex < headList.length; headListIndex++) {
            for(let twoItem of twoRowList[k]) {
              if(headList[headListIndex].key === twoItem.columnKey) {
                tempItem[headList[headListIndex].key] = twoItem.allowance || 0
              }
            }
          }
          bodyList.push(tempItem)
        }

      }
      let sum = {
        num: bodyList.length + 1,
        name: '合计'
      }
      for(let l = 2; l < headList.length; l++) {
        for(let item of bodyList) {
          sum[headList[l].key] = (item[headList[l].key] || 0) + sum[headList[l].key] || item[headList[l].key]
        }
      }
      bodyList.push(sum)
      this.headList = headList
      this.bodyList = bodyList
      this.getMaxList()
    },
    doClosePopupRule() {
      this.$emit('closeRuleShow', false)
    },
    backClick() {
      this.$emit('closeRuleShow', false)
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  @import '../performance.scss';

  .com-readinfo {
    margin-left: 80px;
  }

  .history-warpper {
    padding-right: 20px;
    padding-left: 20px;
  }
</style>
