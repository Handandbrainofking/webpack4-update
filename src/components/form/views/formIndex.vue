<!--
  function: formIndex
  author  : wq
  update  : 2018/11/27 9:31
-->
<template>
  <div :class="['input', notBorder && 'input-no-border' || '']" :style="getWrapStyle()">
    <form-text
       v-if="type === 'text'"
       v-bind="$props"
       v-on="$listeners"
    ></form-text>
    <form-pick
       v-else-if="type === 'pick' || type === 'date' || type === 'datetime'"
       v-bind="$props"
       v-on="$listeners"
    ></form-pick>
    <form-select
       v-else-if="type === 'select'"
       v-bind="$props"
       v-on="$listeners"
    ></form-select>
    <form-input
       v-else
       v-bind="$props"
       v-on="$listeners"
    ></form-input>
  </div>
</template>

<script>
import MixinFormInput from '../mixins/mixinInput'
import FormText from './formText.vue'
import FormPick from './formPick.vue'
import FormInput from './formInput.vue'
import FormSelect from './formSelect.vue'

export default {
  name: 'formIndex',
  components: {
    FormText,
    FormPick,
    FormSelect,
    FormInput
  },
  mixins: [MixinFormInput],
  computed: {
    notBorder() {
      return this.type === 'select' || !this.hasBorder
    }
  },
  methods: {
    getWrapStyle() {
      const style = {}
      const type = this.type
      if(type !== 'select') {
        style.width = `${this.inputWidth}px`
      }
      style.height = `${this.height}px`
      return style
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .input {
    @include setBorder();
    @include setPaddingH($normal_gap_left);
    flex-direction: row;
    background-color: transparent;
    color: $color_content;
    border-radius: 4px;
    font-size: $font_nav;
    margin-left: $normal_gap_left;
  }

  .input-no-border {
    @include setBorder(transparen, 0);
  }
</style>