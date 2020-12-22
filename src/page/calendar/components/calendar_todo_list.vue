<template>
  <wxc-popup  popup-color="rgb(255, 255, 255)"
              :show="todoListShow"
              @wxcPopupOverlayClicked="closeTodoList"
              pos="right"
              :width="1600">
              <div class="popup-box column">
                <div class="popup-title">
                  <text class="popup-text">{{ clickdate }}</text>
                </div>
                <list>
                  <cell v-for="dayTodoItem in datetodoevery" :key="dayTodoItem.dayTodoKey" @click="toItemInfo(dayTodoItem)">
                    <div :class="borderStyle(dayTodoItem, 'popup-todolist', 'row', 'yellow-border')">
                      <div class="popup-time flex1">
                        <text :class="nodeStyle(dayTodoItem, 'popup-time-text', 'fontweight3')">{{ dayTodoItem.appointTime }}</text>
                      </div>
                      <div class="flex1" v-if="choosedStaffs.idList.length > 1">
                        <text :class="nodeStyle(dayTodoItem, 'popup-name-text', 'fontweight3')">{{ dayTodoItem.handleUserName }}</text>
                      </div>
                      <div class="flex1">
                        <text :class="nodeStyle(dayTodoItem, 'popup-thing-text', 'fontweight3')">{{ handleMatterNameByType(dayTodoItem.matterKey, dayTodoItem.matterName) }}</text>
                      </div>
                      <div class="popup-name flex1">
                        <text :class="nodeStyle(dayTodoItem, 'popup-name-text', 'fontweight3')">{{ dayTodoItem.sellerName }}</text>
                      </div>
                      <div class="popup-name flex1">
                        <text :class="nodeStyle(dayTodoItem, 'popup-name-text', 'fontweight3')">{{ dayTodoItem.productName }}</text>
                      </div>
                    </div>
                  </cell>
                </list>
              </div>
  </wxc-popup>
</template>

<script>
import WxcPopup from "@/components/wxc/popup.vue";
// TODO 引入未使用
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  components: {
    WxcPopup
  },
  props: {
    clickdate: {
      type: String,
      default: ''
    },
    datetodoevery: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      todoListShow: true,
    }
  },
  computed: {
    ...mapState('calendar', ['choosedStaffs'])
  },
  methods: {
    handleMatterNameByType(matterKey, matterName) {
      if(matterKey.split('other').length > 1) {
        return matterName.slice(0, 4) + '...'
      }else {
        return matterName
      }
    },
    borderStyle(node, ...extClass) {
      let result = extClass;
      if (node.expireDays > 0 && node.isOngoing) {
        result.push('red-border-done');
      }
      if (node.isFinished) {
        result.push(node.isFinished ? 'yellow-border-done' : 'not-delete');
      }
      return result;
    },
    nodeStyle(node, ...extClass) {
      let result = extClass;
      if (node.expireDays > 0 && node.isOngoing) {
        result.push('expired-text');
      }
      if (node.isFinished) {
        result.push(node.isFinished ? 'has-delete' : 'not-delete');
      }
      return result;
    },
    toItemInfo(item) {
      this.$emit('appointmentClick', false, false, item)
    },
    closeTodoList() {
      this.$emit('closeTodoList', false)
    }
  }
}
</script>

<style src="../calendarcss.css"></style>
<!-- // TODO 空语句块不要引入，增加解析 -->
<style lang="scss" scoped>
</style>
