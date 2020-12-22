/**
 * function: mixinTaskBaseHead
 * author  : wq
 * update  : 2018/11/30 10:07
 */
export default {
  props: {
    title: {
      type: String,
      default: '信息录入'
    },
    tabs: {
      type: Array,
      default: () => ([])
    },
    isOrder: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    clickHeadBtn(...args) {
      this.$emit('clickHeadBtn', ...args)
    }
  }
}
