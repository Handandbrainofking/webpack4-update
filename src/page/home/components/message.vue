<template>
  <div class="message-box">
    <d-image
       class="image-wrap"
       src="/image/ball.png"
       width="42"
       height="32"></d-image>
    <slider class="slider" interval="3000" :auto-play="false" :index="0">
      <div class="frame" @click="msgItemClick()">
        <text class="msg-content">{{messageObject.msgTitle}}</text>
      </div>
    </slider>
  </div>
</template>

<script>
import { MessageDetail } from '@/router/defined'
import LoginApi from '@/utils/login'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: 'message',
  data() {
    return {
      messageObject: {
        msgContent: '当前用户暂时没有消息',
        flag: false
      },
      params: {}
    }
  },
  created() {
    var that = this
    LoginApi.getLastLoginUserInfo(function (data) {
      var lastLogin = JSON.parse(data || '{}')
      that.params.limit= 1
      that.handlerMsg()
    })
  },
  methods: {
    handlerMsg: function () {
      var that = this
      this.requestApi.get_top_messages({
        data: this.params,
        success(data) {
          if (data && data.length > 0) {
            that.messageObject = data[0]
          }
        }
      })
    },
    msgItemClick: function () {
      var item = this.messageObject
      if (!item.id) {
        return
      }
      native_eventStatistic('messageDetail', '消息轮播-消息详情（message.vue）')
      this.jump(
        MessageDetail,
        false,
        true,
        {
          id: item.id,
          msgContent: encodeURIComponent(item.msgContent),
          sendTime: item.sendTime,
          applyNo: item.applyNo,
          messageKey: item.tplKey,
          tplKey: item.tplKey,
          msgTitle: item.msgTitle
        },
        {hash_url: encodeURIComponent(this.$route.path)}
      )
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .image-wrap {
    margin-right: $normal_gap_column;
  }

  .message-box {
    margin-top: $normal_gap_bottom;
    margin-bottom: $normal_gap_bottom;
    flex-direction: row;
    align-items: center;
    height: $message_height;
    background-color: $message_bg_color;
    padding-left: $normal_gap_root_column;
    padding-right: $normal_gap_column;
  }

  .textStyle {
    font-size: 26px;
    padding-left: $normal_text_gap
  }

  .slider {
    flex-direction: row;
    flex: 1;
    height: $message_height;
    justify-content: flex-start;
    text-align: left;
  }

  .frame {
    flex-direction: row;
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }

  .msg-title {
    font-size: $font_normal;
    color: $color_nav;
  }

  .msg-content {
    font-size: $font_small;
    color: $color_link;
  }

</style>
