<template>
  <div class="message-list-box">
    <d-search>
      <d-layout text-align="initial" :full-parent="false" slot="before">
        <text
           :class="['btn-delete',disabledBtn && 'btn-delete-disabled' ]"
           @click="doDelete"
        >删除</text>
        <text
           :class="['btn-read', disabledBtn  && 'btn-read-disabled']"
           @click="doRead"
        >标为已读</text>
      </d-layout>
      <d-search-input
         v-model="params.queryKeyword"
         @search="doSearch"
         placeholder="主题"></d-search-input>
    </d-search>
    <d-table
       class="body-list-wrap"
       :cell-key="rowKey"
       :no-data="noData"
       empty-icon="/image/no_message.png"
       empty-text="暂无消息"
       :enable-load-more="false"
       :headList="headList"
       :body-height="100"
       :bodyList="bodyList"
       @loadMore="loadMore"
       @loadFresh="refreshPage">
      <msg-list-head
         slot="DTableHead"
         slot-scope="headData"
         :checked="allChecked"
         @changeCheck="checkAll"></msg-list-head>
      <msg-list-item
         slot="DTableBody" slot-scope="bodyData" :style="bodyData.cellStyle"
         :index="bodyData.index" :item="bodyData.item"
         @changeCheck="checkItem"
         @clickItem="clickItem"></msg-list-item>
    </d-table>
    <d-paging
       v-if="totalPage > 0" :currPage="currentPage" :totalPage="totalPage" :totalNum="totalNum"
       :pageSize="perNum" @doSkipPage="doSkipPage" @change="changePage"></d-paging>
  </div>
</template>

<script>
import { MessageDetail } from '../../router/defined'
import MsgListTitle from './msg-list-cps/title.vue'
import MsgListHead from './msg-list-cps/list-head.vue'
import MsgListItem from './msg-list-cps/list-item.vue'
import PageLoaderMixins from '@/mixins/page'
import LoginApi from '../../utils/login'
import Dialog from '../../utils/dialog'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  name: 'message-list',
  statistics: 'messageList|消息-消息列表',
  mixins: [PageLoaderMixins],
  components: {
    MsgListTitle,
    MsgListHead,
    MsgListItem
  },
  data() {
    return {
      requestListKey: 'message_list',
      headList: [],
      currentPage: 1,
      bodyList: [],
      allChecked: false,
      params: {
        msgType: 'PAD'
      },
      perNum: 12,
      checkedNum: 0,
      rowKey: 'id',
      total: 0
    }
  },
  watch: {
    total: function(val, oldVal) {
      this.$emit('changeTotalNumber', val)
    }
  },
  computed: {
    disabledBtn() {
      return this.checkedNum <= 0
    }
  },
  created() {
    LoginApi.getLastLoginUserInfo((data) => {
      var lastUserInfo = JSON.parse(data || '{}')
      this.params.phone = lastUserInfo && (lastUserInfo.phone || lastUserInfo.mobile)
      // 处理pageSize
      this.loadPageData()
    })
    this.$eventHub.$on('BroadcastChangedOrganization', this.loadPageData)
  },
  onDataLoaded(data) {
    // 提交页面加载性能统计
    this.commitStastics()
  },
  methods: {
    loadPageData() {
      const params = this.$store.state.search.searchParams
      this.params = Object.assign(this.params, params, {msgType: 'NOTICE'})
      const pageSize = this.params.pageSize
      const perNum = this.perNum
      this.perNum = pageSize || perNum
      const currentPage = this.currentPage = this.params.currentPage || 1
      this.requestList(currentPage)
    },
    checkAll() {
      native_eventStatistic('messageListCheckAll', '消息列表-全选（message-list.vue）')
      const bool = !this.allChecked
      this.allChecked = bool
      this.isActive !== bool && (this.isActive = bool)
      this.isActive = bool
      this.checkedNum = (bool && this.bodyList.length) || 0
      this.bodyList.forEach((item, index) => {
        Vue.set(item, 'checked', bool)
      })
    },
    checkItem(index) {
      native_eventStatistic('messageListCheck', '消息列表-勾选（message-list.vue）')
      const bool = !this.bodyList[index].checked
      this.$set(this.bodyList[index], 'checked', bool)
      if (bool === false) {
        this.checkedNum--
        this.allChecked && (this.allChecked = false)
      } else {
        this.checkedNum++
        if (this.bodyList.filter(item => item.checked).length === this.bodyList.length) {
          this.allChecked = true
        }
      }
    },
    setMsgStatus(type) {
      let msgIds = this.bodyList.filter(item => item.checked)

      if (msgIds.length === 0) {
        Dialog.toast('请至少选择一条消息！', 0.8)
        this.allChecked = false
        return false
      }

      if (type === 'read') {
        msgIds = msgIds.filter(item => item.hasRead !== '1')
        if (msgIds.length === 0) {
          Dialog.toast('请至少选择沒有读过的消息！', 0.8)
          this.allChecked = false
          return false
        }
      }
      this.requestApi.message_set_status({
        data: {
          operateType: type,
          messageList: msgIds.map(item => item.id)
        },
        success: data => {
          if (type === 'delete') {
            this.requestList(this.currentPage = 1)
          } else {
            msgIds.forEach(item => {
              this.$set(item, 'hasRead', '1')
            })
            this.bodyList.forEach(item => {
              if (item.checked) {
                this.$set(item, 'checked', false)
              }
            })
          }
          this.$emit('refreshAnnounceTotal')
          this.allChecked = false
          this.checkedNum = 0
        }
      })
    },
    doDelete() {
      let msgIds = this.bodyList.filter(item => item.checked)
      if (msgIds.length === 0) {
        Dialog.toast('请至少选择一条消息！', 0.8)
        this.allChecked = false
        return
      }
      Dialog.confirm(
        {
          message: '确定删除吗？'
        },
        value => {
          if (value === '确定') {
            native_eventStatistic('messageListCheckDelete', '消息列表-勾选删除（message-list.vue）')
            this.setMsgStatus('delete')
          }
        }
      )
    },
    doRead() {
      native_eventStatistic('messageListCheckRead', '消息列表-勾选标为已读（message-list.vue）')
      this.setMsgStatus('read')
    },
    doSearch() {
      this.requestList(this.currentPage = 1)
    },
    clickItem(item) {
      native_eventStatistic('messageListDetail', '消息列表-消息详情（message-list.vue）')
      this.jump(
        MessageDetail,
        false,
        true,
        {
          id: item.id,
          msgContent: item.tplKey === 'BU_SYS_NOTICE_push_ts_msg' ? '' : encodeURIComponent(item.msgContent),
          sendTime: item.sendTime,
          applyNo: item.applyNo,
          messageKey: item.tplKey,
          tplKey: item.tplKey,
          msgTitle: item.msgTitle
        },
        {
          hash_url: encodeURIComponent(this.$route.path),
          searchParams: encodeURIComponent(JSON.stringify(Object.assign({}, this.params, {
            pageSize: this.perNum,
            currentPage: this.currentPage
          })))
        }
      )
    },
    changePage(data) {
      let action = data.action
      if (action === 'first') {
        native_eventStatistic('messageListPageFirst', '消息-消息列表-首页（messge-list.vue）')
      } else if (action === 'prev') {
        native_eventStatistic('messageListPagePrev', '消息-消息列表-上一页（messge-list.vue）')
      } else {
        native_eventStatistic('messageListPageNext', '消息-消息列表-下一页（messge-list.vue）')
      }
    }
  },
  beforeDestroy() {
    this.$eventHub.$off('BroadcastChangedOrganization', this.loadPageData)
  }
}
</script>

<style lang="scss" scoped>
  .message-list-box {
    flex-direction: column;
    flex: 1;
  }
  .body-list-wrap {
    flex: 1;
  }
  .btn-search-box {
    padding-left: $normal_gap_left;
    padding-right: $normal_gap_left;
    height: 100px;
    background-color: $color_white;
  }

  .search-box {
    flex-direction: row;
    flex: 1;
    justify-content: flex-end;
    padding-right: $normal_gap_root_column;
  }

  .btn-delete {
    @include setPadding($btn_gap_top, $btn_gap_left);
    @include setBorder($color_enclosure);
    border-radius: 4px;
    color: $color_enclosure;
    font-size: $btn_font;
    opacity: 1;
  }

  .btn-delete-disabled {
    opacity: 0.6;
  }

  .btn-read {
    @include setPadding($btn_gap_top, $btn_gap_left);
    @include setBorder($color_enclosure);
    border-radius: 4px;
    color: $color_enclosure;
    font-size: $btn_font;
    margin-left: 100px;
    opacity: 1;
  }

  .btn-read-disabled {
    opacity: 0.6;
  }
</style>
