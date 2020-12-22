/**
 * function: mixinLabel
 * author  : wq
 * update  : 2018/11/26 15:40
 */
export default {
  props: {
    required: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 1000
    },
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: Number,
      default: 330
    },
    hasTips: {
      type: Boolean,
      default: false
    },
    hasCheckbox: {
      type: Number,
      default: 0
    },
    hasCamera: {
      type: Boolean,
      default: false
    },
    hasChoose: {
      type: Boolean,
      default: false
    },
    hasOtherInput: {
      type: Boolean,
      default: false
    },
    values: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    clickEnclosure(...args) {
      this.$emit('clickEnclosure', ...args)
    }
  }
}