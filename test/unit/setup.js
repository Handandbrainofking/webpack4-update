
import './mock/console'
import './mock/weex'
import './mock/platform'
import Vue from 'vue'
import filters from '@/filters'
import StatisticsPlugin from '@/mixins/time_statistics'
import './mock/components/weex.components'
// import './mock/components/ddui.components'

// 添加字典
require('@static/dict.js')
require('@static/city.js')

Vue.use(StatisticsPlugin)
Vue.use(filters)
Vue.config.productionTip = false
