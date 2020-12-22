<template>
  <div class="title-box">
    <text class="title">消息列表</text>
    <text class="enclosure"></text>
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
  .title-box {
    padding-left: $normal_gap_root_column;
    padding-top: $normal_gap_root_column;
    padding-bottom: $normal_gap_bottom;
    flex-direction: row;
    align-items: flex-end;
  }

  .title {
    font-size: $font_title;
    color: $color_nav;
  }

  .enclosure {
    font-size: $font_normal;
    color: $color_enclosure;
    padding-left: $normal_gap_column;
  }
</style>
