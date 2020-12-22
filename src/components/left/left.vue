<template>
  <d-layout kind="column" :full-parent="false" vertical-align="initial">
    <div class="logo-wrap">
      <d-image src="/image/logo.png" :width="194" :height="80"></d-image>
    </div>
    <list class="list-menu">
      <cell
         @click="doSkip(item.link, index)"
         :class="['cell', index === currentIndex && 'nav-active-router']"
         :key="index" v-for="(item, index) in list">
        <d-image :src="item.image" :width="44" :height="44"></d-image>
        <text class="text">{{ item.name }}</text>
      </cell>
    </list>
    <div class="user-box" @click="doSkipUser">
      <div style="flex-direction: column;height: 88px;width: 260px;">
        <text class="text">{{currentUser.fullname}}</text>
        <text class="text_enclosure">{{currentUser.companyName}}</text>
      </div>
    </div>
    <SettingInfo v-if="isShowSetting" v-model="isShowSetting"></SettingInfo>
  </d-layout>
</template>

<style lang="scss" scoped>
  .flex1 {
    flex: 1;
  }

  .list-menu {
    width: $nav_width + px;
    height: ($window_height - 230 - 120) + px;
    background-color: #FFFFFF;
  }

  .logo-wrap {
    padding-top: 20px;
    padding-left: $normal_gap_root_column;
    padding-bottom: 130px;
  }

  .cell {
    height: 120px;
    padding-left: $normal_gap_root_column;
    flex-direction: row;
    align-items: center;
  }

  .text {
    padding-left: $normal_gap_column;
    color: $color_nav;
    font-size: $font_nav;
  }

  .text_enclosure {
    padding-left: $normal_gap_column;
    color: $color_enclosure;
    font-size: $font_normal;
    height: 44px;
  }

  .user-box {
    height: 120px;
    padding-left: 5px;
    flex-direction: row;
    align-items: center;
    background-color: #FFFFFF;
    box-shadow: 2px 10px 10px 0 #C2C2C2;
  }

  .nav-active-router {
    background-color: #EBF0F6;
    border-right-width: 6px;
    border-right-color: #02B3B4;
  }

</style>

<script>
import SettingInfo from '@/page/setting/setting_info.vue'
import { HomeMenu } from '@/config'
import loginApi from '@/utils/login'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: 'left',
  components: {
    SettingInfo
  },
  created() {
    this.currentUser = loginApi.getLoginData()
  },
  beforeMount() {
    this.doMatch()
  },
  beforeUpdate() {
    this.doMatch()
  },

  data() {
    return {
      currentUser: {},
      list: HomeMenu,
      currentIndex: 0,
      isShowSetting: false
    }
  },
  methods: {
    doMatch() {
      const menuList = this.list
      menuList.forEach((item, index) => {
        if (new RegExp(item.link.replace(/\:[^\/]+/g, '[^\\\/]*') + '$').test(this.$route.path)) {
          this.currentIndex = index
        }
      })
    },
    doSkip(link, index) {
      this.currentIndex = index
      this.jump(link)
      if (link === '/home') {
        native_eventStatistic(link, '首页')
      } else if (link === '/calendar') {
        native_eventStatistic(link, '日历')
      } else if (link === '/order_list') {
        native_eventStatistic(link, '订单管理')
      } else if (link === '/data_list') {
        native_eventStatistic(link, '资料管理')
      } else if (link === '/message_list') {
        native_eventStatistic(link, '消息')
      } else if (link === '/imp_doc_list') {
        native_eventStatistic(link, '要件管理')
      } else if (link === '/performance') {
        native_eventStatistic(link, '我的提奖')
      } else if (link === '/special-approval') {
        native_eventStatistic(link, '特批流程')
      }
    },
    doSkipUser() {
      this.isShowSetting = true
    },
    settingStatusChange(status) {
      this.isShowSetting = status
    }
  }
}
</script>
