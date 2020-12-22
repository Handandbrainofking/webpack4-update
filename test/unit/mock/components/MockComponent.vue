<template>
  <div class="jest-mock-component" v-bind="$props" v-on="$listeners"><slot/></div>
</template>

<script>
export default {
  name:'JestMockComponent'
}
</script>
