<template>
  <div class="msg-detail-box">
    <back-head></back-head>
    <d-layout class="detail-title" vertical-align="bottom" :full-parent="false">
      <div>
        <text class="title">{{ msgTitle }}</text>
        <text class="time">时间： {{ msgTime }}</text>
      </div>
      <d-layout text-align="right" v-if="!isArticle">
        <text class="detail-click" @click="msgContentClick">点击查看单据信息</text>
      </d-layout>
    </d-layout>
    <div v-if="!isArticle" class="detail-contain">
      <text class="detail">{{ msgDetail.msgContent }}</text>
    </div>
    <ddWeb v-else style="padding-left: 60px; width: 2440px; height: 1226px" :src="htmlPath"></ddWeb>
  </div>
</template>

<script>
import BackHead from '@/components/back/head.vue'
import { IndexJs } from '@/router/defined'
import { native_eventStatistic, native_logMessage } from '@/utils/deal_native'
import { MessageKeyConfig } from './msg-list-cps/jumpConfig'

export default {
  name: 'message-detail',
  statistics: 'messageDetail|消息-消息详情',
  components: {
    BackHead
  },
  data() {
    return {
      msgDetail: {},
      htmlPath: null
    }
  },
  computed: {
    isArticle() {
      return !this.msgDetail.msgContent
    },
    msgTitle() {
      return this.isArticle ? this.msgDetail.msgTitle : '消息内容'
    },
    msgTime() {
      return this.formatDate(Number(this.msgDetail.sendTime))
    }
  },
  created() {
    this.msgDetail.id = this.getPageParams('id')
    this.msgDetail.msgContent = decodeURIComponent(this.getPageParams('msgContent'))
    this.msgDetail.sendTime = this.getPageParams('sendTime')
    this.msgDetail.applyNo = this.getPageParams('applyNo')
    this.msgDetail.messageKey = this.getPageParams('messageKey')
    this.msgDetail.tplKey = this.getPageParams('tplKey')
    this.msgDetail.msgTitle = this.getPageParams('msgTitle')
    this.requestMessage(this.msgDetail.id)
  },
  methods: {
    requestMessage(msgId) {
      //公告
      if (this.msgDetail.tplKey === 'BU_SYS_NOTICE_push_ts_msg') {
        this.requestApi.get_notice_detail({
          method: 'GET',
          data: {
            dingMsgId: msgId
          },
          success: data => {
            native_logMessage('msg detail ==== ' + JSON.stringify(data))
            this.htmlPath = data.path
          }
        })
      }

      this.requestApi.message_set_status({
        data: {
          operateType: 'read',
          messageList: [msgId]
        }
      })
    },
    msgContentClick() {
      native_eventStatistic('messageDetailContent', '消息详情-单据信息（message-detail.vue）')
      this.jump(
        IndexJs,
        true,
        true,
        {
          type: MessageKeyConfig[this.msgDetail.messageKey].index,
          applyNo: MessageKeyConfig[this.msgDetail.messageKey].jump && this.msgDetail.applyNo
        }
      )
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .detail-title {
    height: 174px;
    padding-top: 30px;
    padding-left: $normal_gap_root_column;
    padding-right: $normal_gap_root_column;
    margin-left: 20px;
    border-top-color: #EBEBEB;
    border-top-width: 2px;
    border-bottom-color: #EBEBEB;
    border-bottom-width: 2px;
    padding-bottom: 30px;
  }

  .title {
    color: $color_nav;
    font-size: $font_head;
    lines: 1;
  }

  .kind {
    margin-top: 40px;
    color: $color_enclosure;
    font-size: $font_normal;
  }

  .time {
    margin-top: 20px;
    color: $color_enclosure;
    font-size: $font_normal;
  }

  .detail-padding {
    padding-left: $normal_gap_root_column;
  }

  .detail-contain {
    margin-top: 65px;
    padding-left: $normal_gap_root_column;
  }

  .detail {
    color: $color_nav;
    font-size: $font_nav;
    line-height: 50px;
  }

  .detail-click {
    color: blue;
    font-size: 34px;
  }

</style>
