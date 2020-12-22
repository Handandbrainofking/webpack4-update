<template>
  <input
     :type="type"
     :disabled="disabled"
     :maxlength="maxlength"
     :placeholder="placeholder"
     v-model="innerValue"
     @input="doInput"
     @change="doChange" />
</template>
<script>
import { InputValidator } from '@/utils/validator'

export default {
  props: {
    valid: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: 'text'
    },
    type: {
      type: [Number, String],
      default: 0
    },
    disabled: {
      type: [Boolean, undefined, null],
      default: false
    },
    maxlength: {
      type: [String, Number, undefined, null],
      default: undefined
    },
    placeholder: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      innerValue: '',
      oldValue: ''
    }
  },
  created() {
    this.oldValue = this.innerValue = this.value;
  },
  watch: {
    value() {
      if (this.oldValue !== this.value) {
        this.oldValue = this.innerValue = this.value;
      }
    }
  },
  methods: {
    doInput(e) {
      let value = e.value;
      value = InputValidator.valid(value, ...(this.valid.split(',')));
      if (value !== this.value) {
        this.$emit('input', {
          value
        })
      }
    },
    doChange(e) {
      let value = e.value;
      value = InputValidator.valid(value, ...(this.valid.split(',')));
      this.innerValue = value;
      if (value !== this.value) {
        this.$emit('input', {
          value
        })
      }
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  @import '../labelvalue/input';
</style>
