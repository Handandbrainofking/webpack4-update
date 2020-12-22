<template>
    <div class="d-row">
        <slot></slot>
    </div>
</template>
<script>
  export default{

  }
</script>
<style lang="scss" scoped>
    .d-row{
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
</style>