<template>
  <div class="title-wrap">
    <text class="title">{{ title }}</text>
    <text  class="btn-wrap" v-for="(item, index) in btns" @click="doClickBtn(item, index)" :key="index">{{ item.name }}</text>
    <d-image v-if="ifOrder" src="/image/icon_detail.png" width="40" height="40"></d-image>
  </div>
</template>

<script>
  export default {
    name: "task-head-common-title",
    props: {
      title: {
        type: String,
        default: ""
      },
      btns: {
        type: Array,
        default: () => []
      },
      ifOrder: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      doClickBtn(item, index) {
        this.$emit("doClickBtn", item, index);
      }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import "../../../../css/common";

  .title-wrap {
    height: 120px;
    flex-direction: row;
    align-items: center;
    padding-left: $normal_gap_column;
    padding-right: $normal_gap_column;
  }

  .title {
    font-size: $font_head;
    color: $color_nav;
    flex: 1;
  }
  .btn-wrap {
    height: $btn_height + px;
    color: $color_back;
    text-align: center;
    font-size: $font_nav;
    line-height: $btn_line_height + px;
  }

</style>
