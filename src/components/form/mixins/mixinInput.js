/**
 * function: mixinInput
 * author  : wq
 * update  : 2018/11/26 15:40
 */
export default {
  props: {
    type: {
      type: String,
      default: 'input'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 72
    },
    inputWidth: {
      type: Number,
      default: 520
    },
    maxlength: {
      type: Number,
      default: 999
    },
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: 34
    },
    index: {
      type: Number,
      default: -1
    },
    list: {
      type: Array,
      default: () => ([])
    },
    pickTitle: {
      type: String,
      default: '请选择'
    },
    valid: {
      type: String,
      default: ''
    },
    hasBorder: {
      type: Boolean,
      default: true
    },
    pickHeight: {
      type: [Number, String],
      default: 500
    },
    // 时间是否从选择今日后的
    min: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    input(...args) {
      this.$emit('input', ...args)
    }
  }
}