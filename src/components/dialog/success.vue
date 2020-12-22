<!-- CopyRight (C) 2017-2022 Alibaba Group Holding Limited. -->
<!-- Created by Tw93 on 16/11/07. -->
<!--A dialog. -->

<template>
  <d-layout v-if="showToast" text-align="center" class="container" @clickLayout="overlayClicked">
    <d-layout class="success-wrap" kind="column" :full-parent="false" text-align="center">
      <d-image width="120" height="100" src="/image/toast-icon-success.png"></d-image>
      <text class="text">{{ msg }}</text>
    </d-layout>
  </d-layout>
</template>

<style scoped>
  .container {
    width: 2560px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    /*兼容H5异常*/
    z-index: 99999;
  }
  .success-wrap {
    width: 400px;
    height: 300px;
    background-color: rgba(17,17,17,.7);
    border-radius: 10px;
  }
  .text{
    font-size: 30px;
    color: #FFFFFF;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
  }
</style>

<script>
  export default {
    props: {
      msg: {
        type: String,
        default: ""
      },
      timer: {
        type: [String, Number],
        default: 1500
      },
      showToast: {
        type: Boolean
      }
    },
    model: {
      prop: 'showToast',
      event: 'closeToast'
    },
    watch: {
      showToast(value) {
        if (value) {
          this.showTimer = setTimeout(() => {
            this.closeToast();
          }, this.timer)
        }
      }
    },
    methods: {
      overlayClicked(e) {
        this.closeToast();
      },
      closeToast() {
        this.showTimer && clearTimeout(this.showTimer)
        this.$emit("closeToast", false);
      }
    },
    beforeDestroy() {
      this.showTimer && clearTimeout(this.showTimer)
    }
  }
</script>
