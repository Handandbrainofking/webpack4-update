/**
* 首页处理
*/
<template>
  <d-layout kind="column" vertical-align="initial">
    <message-scroll></message-scroll>
    <tab-page v-if="isMounted"></tab-page>
  </d-layout>
</template>

<script>
import MessageScroll from './components/message.vue'
import TabPage from './components/tab-page.vue'

export default {
  name: 'home',
  components: {
    MessageScroll,
    TabPage
  },
  // TODO ESLint 方法大括号加空格
  data(){
    return {
      isMounted: false
    }
  },
  mounted(){
    // 延迟页面加载， 马止加载会导致页面切换卡顿
    this.isMounted = true
  }
}
</script>
