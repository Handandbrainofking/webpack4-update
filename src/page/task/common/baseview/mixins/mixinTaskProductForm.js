/**
 * function: mixinTaskBaseHead
 * author  : wq
 * update  : 2018/11/30 10:07
 */
import { DEFINE_HIDDEN_KEYBORAD, native_common_events } from '@/utils/deal_native'

export default {
  props: {
    applyNo: {
      type: String,
      default: ''
    },
    productCode: {
      type: String
    },
    matterKey: {
      type: String
    },
    info: {
      type: Array,
      default: () => ([])
    },
    stopEdit: {
      type: Boolean,
      default: false
    },
    hasUpload: {
      type: Boolean,
      default: true
    },
    isTitleArrayConfig: {
      type: Boolean,
      default: false
    },
    showChildren: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: -1
    }
  },
  methods: {
    input(...args) {
      this.$emit('input', ...args)
    },
    change(...args) {
      this.$emit('change', ...args)
    },
    clickEnclosure(...args) {
      this.$emit('clickEnclosure', ...args)
    },
    closeBoard() {
      native_common_events(DEFINE_HIDDEN_KEYBORAD)
    },
    stopClick() {}
  }
}
