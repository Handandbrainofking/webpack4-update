import dateFilter from './date'
import dictFilter from './dict'
import dictListFilter from './dictlist'
import moneyFilter from './money'

function install(Vue, options) {
  Vue.filter('date', dateFilter)
  Vue.filter('dict', dictFilter)
  Vue.filter('dictlist', dictListFilter)
  Vue.filter('money', moneyFilter)
}

export default {
  install
}
