/**
 * function: mixinTaskBaseHead
 * author  : wq
 * update  : 2018/11/30 10:07
 */
export default {
  props: {
    hasHead: {
      type: Boolean,
      default: true
    },
    showFooterBtn: {
      type: Boolean,
      default: true
    },
    bottomBtns: {
      type: Array,
      default: () => []
    },
    notBtns: {
      type: Array,
      default: () => []
    },
    notBtnMsg: {
      type: String,
      default: null
    },
    confirmSubmit: {
      type: Object,
      default: {
        show: false,
        title: '',
        content: ''
      }
    }
  }
}
