<!-- 自动审批信息 -->
<template>
   <d-layout kind="column" text-align="initial" vertical-align="initial" style="z-index: 9999;background-color: white;">
    <d-table
       :head-list="headList"
       :body-list="getBodyList"
       :no-data="noData"
    ></d-table>
    <task-order-info v-model="showOrderInfo" :orderId="applyNo"></task-order-info>
  </d-layout>
</template>
<script>
import {
  ProductKindList,
  HouseKeptType,
  RANSOM_LOAN_TYPE,
  Dist_List_Get
} from '@/config/index'
import PageLoaderMixins from '@/mixins/page'
import { native_eventStatistic } from '@/utils/deal_native'
import { mapGetters } from 'vuex'


export default {
  name: '',
  mixins: [PageLoaderMixins],
  components: {
  },
  data() {
    return {
    		load_more:false,
    		noData:false,
      	headList: [
	        { title: '序号', width: 1, key: "num" },
	        { title: '规则名称', width: 3, key: 'ruleName' },
	        { title: '命中详情', width: 4, key: 'hitMessage' },
	        { title: '命中时间', width: 2, key: item => {
            			return this.formatDate(item['createTime'], 'YYYY-MM-DD hh:mm')
          		}
	        }
	    ],
      	requestParams: ["hitRuleList"]
    }
  },
  computed: {
  	...mapGetters(['hitRuleList']),
   	getBodyList(){
// 		this.load_more =
		this.noData = this.hitRuleList && this.hitRuleList.length>0 ? false :true;
   		this.hitRuleList && this.hitRuleList.forEach((item,index) =>{
   			item.num = ++index;
   		})
   		return this.hitRuleList || [];
   	}
  },
  created(){

  },
  methods: {
    
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  .interview-attention-box {
    flex-direction: column;
    flex: 1;
    @include setPadding($normal_gap_bottom, $normal_gap_left)
  }

  .interview-attention-head {
    @include setPaddingH();
    margin-bottom: 20px;
    box-shadow: 0 2px 0 0 #D9D9D9;
    height: 80px;
  }

  .head-title {
    font-size: $font_normal;
    color: $color_nav;
  }
</style>
