<template>
  <DTab ref="tabset" :page-height="1580" style="margin-top: 20px">
    <DTabPage title="公告" :show-counter="true" :count="`未读 ${unAnnounceNumber}`">
      <AnnounceList @refreshAnnounceTotal="refreshAnnounceTotal"/>
    </DTabPage>
    <DTabPage title="消息" :show-counter="true" :count="`未读 ${unreadNewsNumber}`">
      <NewsList @refreshNewsTotal="refreshNewsTotal"/>
    </DTabPage>
  </DTab>
</template>

<script>
import AnnounceList from './announce-list.vue'
import NewsList from './news-list.vue'

export default {
  name: 'message-doc-list',
  components: {AnnounceList, NewsList},
  data() {
    return {
      unAnnounceNumber: '0',
      unreadNewsNumber: '0'
    }
  },
  mounted() {
    const tabIndex = 1 - (1 - this.getPageParams('index', true))
    //weex返回主界面时 有报错，这里延时处理
    setTimeout(()=>{
      this.$nextTick(() => {
        this.$refs.tabset.setPage(tabIndex || 0)
      })
    },100)
    this.setAnnounceNumber()
    this.setNewsNumber()
  },
  methods: {
    refreshAnnounceTotal() {
      this.setAnnounceNumber()
    },
    refreshNewsTotal() {
      this.setNewsNumber()
    },
    setAnnounceNumber() {
      this.requestApi.get_message_total({
        data: {hasRead: false, msgType: 'NOTICE'},
        success: data => {
          if (data && typeof(data) === 'number') {
            this.unAnnounceNumber = data
          }
        }
      })
    },
    setNewsNumber() {
      this.requestApi.get_message_total({
        data: {hasRead: false, msgType: 'NORMAL'},
        success: data => {
          if (data && typeof(data) === 'number') {
            this.unreadNewsNumber = data
          }
        }
      })
    }
  }
}
</script>
