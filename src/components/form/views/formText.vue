<!--
  function: formText
  author  : wq
  update  : 2018/11/26 15:51
-->
<template>
  <text class="text" :style="{fontSize: `${size}px`}">{{ value }}</text>
</template>

<script>
import MixinFormInput from '../mixins/mixinInput'
export default {
  name: 'formText',
  mixins: [MixinFormInput]
}
</script>

<style scoped>
  .text {
    lines: 1
  }
</style>
