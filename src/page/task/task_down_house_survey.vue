<!-- 下户 -->

 
<script>
import ExtendTaskBaseView from '@/page/task/extends/extendTaskBaseView.vue'
import { DownHouseSurveyItem } from '@/page/task/config'
import { mapGetters } from 'vuex'
import TaskBaseView from '@/page/task/common/baseview/taskViewBase.vue'


export default {
  extends: ExtendTaskBaseView,
  components: {
    TaskBaseView
  },
  name: 'DownHouseSurvey', //下户
  statistics: 'DownHouseSurvey|跟单详情-下户',
  data() {
    return {
      info:DownHouseSurveyItem,
      requestParams: ['applyOrder', 'downHouseSurvey'],
      showChildren: true,
    };
  },

  computed: {
    ...mapGetters(['userInfo', 'applyOrder','isWeBank']),

  },
  props: {
     
  },
  //数据初始化
  created() {
    
  },

  methods: {
    

  }
    
}
</script>
<style lang="sass" type="text/scss" scoped>
  .down-house-view {
    flex-direction: column;
    flex: 1;
    @include setPadding($normal_gap_bottom, $normal_gap_left)
  }
</style>
