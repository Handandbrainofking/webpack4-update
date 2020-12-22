/**
* 首页处理
*/
<template>
  <d-layout class="main-box" text-align="initial" vertical-align="initial" :full-parent="false">
    <left-nav class="main-left"></left-nav>
    <slot>
      <router-view class="main-right"></router-view>
    </slot>
  </d-layout>
</template>

<script>
import LeftNav from '@/components/left/left.vue'

export default {
  name: 'main',
  components: {
    LeftNav
  },
  created() {
    this.clearRouter()
    // 获取搜索条件
    this.getSearchParams()
  },
  methods: {
    // 获取搜索条件
    getSearchParams() {
      const searchParams = this.getPageParams('searchParams', true)
      const allPageParams = this.getAllPageParams()
      allPageParams.searchParams = undefined
      delete allPageParams.searchParams
      if (searchParams) {
        this.$store.commit('setSearchParams', searchParams)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-box {
    width: $window_width + px;
    height: $window_height + px;
  }

  .main-left {
    width: $nav_width + px;
    height: $window_height + px;
    background-color: $nav_bg_color;
    margin-right: $normal_gap_left;
    box-shadow: 2px -10px 10px 0 #C2C2C2;
  }

  .main-right {
    flex: 1;
    padding-right: $normal_gap_left;
  }
</style>
