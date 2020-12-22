<template>
    <div class="d-col" :style="layoutStyle">
        <slot></slot>
    </div>
</template>
<script>
  export default {
    props: {
      span: {
        type: Number,
        default: 24
      }
    },
    computed:{
      layoutStyle(){
        return {
          flex: this.span,
          justifyContent: this.align
        }
      },
      align:{
        type: String,
        default:'left'
      }
    }
  }
</script>
<style lang="scss" scoped>
    .d-col {
        flex-direction: row;
        justify-content: left;
        align-items: center;
    }
</style>