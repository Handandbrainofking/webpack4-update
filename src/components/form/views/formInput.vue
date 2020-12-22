<!--
  function: formText
  author  : wq
  update  : 2018/11/26 15:51
-->
<template>
  <money-input
     class="form-input"
     v-if="type==='money'"
     v-bind="$props"
     v-on="$listeners"
  ></money-input>
  <number-input
     class="form-input"
     v-else-if="valid"
     v-bind="$props"
     v-on="$listeners"
  ></number-input>
  <input
     class="form-input"
     v-else
     v-bind="$props"
     @input="$emit('input', $event.value, $event)" />
</template>

<script>
import MixinFormInput from '../mixins/mixinInput'
import MoneyInput from './formMoneyInput.vue'
import NumberInput from './formNumberInput.vue'

export default {
  name: 'formText',
  components: {
    MoneyInput,
    NumberInput
  },
  mixins: [MixinFormInput]
}
</script>

<style lang="sass" type="text/scss" scoped>
  .form-input {
    flex-direction: row;
    flex: 1;
    align-items: center;
    background-color: transparent;
    font-size: $font_nav;
    color: $color_content;
  }
</style>
