<template>
  <div class="wrapper">
    <scroller class="order-progress-content-special" scroll-direction="horizontal" v-if="grabOrderShow"
              :style="contentStyle">
      <div v-for="(node, idx) in showList" :key="node.matterKey" class="order-progress-node">
        <div class="circle-content-short">
          <div class="bar-width-short" :class="[getPreLineClass(idx)]"></div>
          <div v-if="ifRepeatTodo(node)">
            <d-image src="/image/repeat-handle.png" width="40" height="40"></d-image>
          </div>
          <div v-else class="node-circle" :class="['circle-' + node.nodeState]"></div>
          <div class="bar-width-short" :class="[getNextLineClass(idx)]"></div>
        </div>
        <div class="node-content-tip">
          <text class="node-content-text-small">{{ node.matterName }}</text>
          <text v-if="ifRshowPerson(node)" class="node-name-font">{{ node.transferHandlePerson }}</text>
        </div>

      </div>
    </scroller>
    <scroller class="order-progress-content" scroll-direction="horizontal" v-if="!grabOrderShow" :style="contentStyle">
      <div v-for="(node, idx) in showList" :key="node.matterKey" class="order-progress-node">
        <div class="frame">
          <div v-if="node.nodeShow" @click="restoreDelete(idx)">
            <d-image src="/image/frame.png" width="180" height="72"></d-image>
            <text v-if="node.nodeState == 'delete'" class="in">恢复事项</text>
            <text v-if="node.nodeState == 'todo'" class="in">删除事项</text>
          </div>
        </div>
        <div class="circle-content" @longpress="longpresstest(idx)" @click="doClickMatterKey(node)">
          <div class="bar-width-long" :class="[getPreLineClass(idx)]"></div>
          <div v-if="ifRepeatTodo(node)">
            <d-image src="/image/repeat-handle.png" width="40" height="40"></d-image>
          </div>
          <div v-else class="node-circle" :class="['circle-' + node.nodeState]"></div>
          <div class="bar-width-long" :class="[getNextLineClass(idx)]"></div>
        </div>
        <div class="node-content-tip">
          <text class="node-content-text">{{ node.matterName }}</text>
          <text v-if="ifRshowPerson(node)" class="node-name-font">{{ node.transferHandlePerson }}</text>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { TestTaskInterview } from '@/router/defined'
import { native_common_events, DEFINE_DEVICES_VIBRATOR } from '@/utils/deal_native'
import { native_eventStatistic } from '@/utils/deal_native'
import { debug } from 'util';

const modal = weex.requireModule('modal');

export default {
  name: 'orderprogress',
  props: {
    showList: {
      type: Array,
      default: ''
    },
    grabOrderShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productId: '',
      orderId: '',
      repeatNodeList: ['Notarization', 'TrustAccount', 'AccountTest', 'QueryArchive']
    };
  },
  created() {
    this.productId = this.getPageParams('productId', true);
    this.orderId = this.getPageParams('applyNo', true);
  },
  computed: {
    contentStyle() {
      let itemSize = this.grabOrderShow ? 140 : 220;
      let width = itemSize * (this.showList || []).length;
      width = width > 2500 ? width : 2500;
      return { width: `${width}px` };
    }
  },
  methods: {
    doClickMatterKey(node, index) {
      native_eventStatistic('orderProgressMatterKey', '跟踪订单-节点详情（orderProgress.vue）');
      this.jump(
        TestTaskInterview,
        false,
        true,
        {
          productType: this.productId,
          nodesType: node.matterKey,
          orderId: this.orderId,
          applyNo: this.orderId
        },
        { type: 0 }
      );
    },
    ifRepeatTodo(e) {
      if (e.nodeState == 'complete') {
        if (this.repeatNodeList.indexOf(e.matterKey) > -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    ifRshowPerson(e) {
      if (e.nodeState == 'complete') {
        if (this.repeatNodeList.indexOf(e.matterKey) > -1) {
          return e.showThisPerson;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    //恢复删除事项
    restoreDelete(e) {
      if (this.showList[e].nodeState == 'todo') {
        native_eventStatistic('orderProgressDeleteMatterKey', '跟踪订单-节点删除（orderProgress.vue）');
        this.requestApi.node_state_change({
          data: {
            taskId: this.showList[e].taskId,
            deleteFlag: true
          },
          success: data => {
            this.showList[e].nodeState = 'delete';
          }
        });
      } else if (this.showList[e].nodeState == 'delete') {
        native_eventStatistic('orderProgressRestoreMatterKey', '跟踪订单-节点恢复（orderProgress.vue）');
        this.requestApi.node_state_change({
          data: {
            taskId: this.showList[e].taskId,
            deleteFlag: false
          },
          success: data => {
            this.showList[e].nodeState = 'todo';
          }
        });
      } else {
        modal.toast({ message: '当前事项不可操作', duration: 2 });
      }
      this.showList[e].nodeShow = false;
    },
    longpresstest(e) {
    		//面签和赎楼登记不能删除
      if ((this.showList[e].nodeState == 'todo' || this.showList[e].nodeState =='delete') &&
      this.showList[e].matterKey !== "Interview" && this.showList[e].matterKey !== "RandomMark") {
        for (let i in this.showList) {
          (i == e) && (Vue.set(this.showList, e, Object.assign({}, this.showList[e], { nodeShow: !this.showList[e].nodeShow })));
          (i != e) && (Vue.set(this.showList, i, Object.assign({}, this.showList[i], { nodeShow: false })));
        }
        native_common_events(DEFINE_DEVICES_VIBRATOR);
      } else {
        modal.toast({ message: '当前事项不可操作', duration: 2 });
      }
    },
    getNextLineClass(idxthis) {
      if (idxthis == this.showList.length - 1) {
        return 'bar-nothing';
      }
      if (
        this.showList[idxthis].nodeState == 'delete' ||
        this.showList[idxthis + 1].nodeState == 'delete'
      ) {
        return 'bar-delete';
      } else if (this.showList[idxthis + 1].nodeState == undefined) {
        return 'bar-white';
      } else {
        return 'bar';
      }
    },
    getPreLineClass(idxthis) {
      if (idxthis == 0) {
        return 'bar-not-see';
      }
      if (
        this.showList[idxthis - 1].nodeState == 'delete' ||
        this.showList[idxthis].nodeState == 'delete'
      ) {
        return 'bar-delete';
      } else if (this.showList[idxthis].nodeState == undefined) {
        return 'bar-white';
      } else {
        return 'bar';
      }
    }
  }
};
</script>

<style src="../trackcss.css" scoped></style>
<style scoped>
  .scroller {
    flex: 1;
    flex-direction: row;
  }

  .order-progress-node {
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .node-content-tip {
    height: 100px;
  }
  .node-name-font {
    margin-top: 5px;
    height: 40px;
    font-size: 28px;
    color: #CACCCF;
    text-align: center;
  }
  .width2500 {
    width: 2500px;
  }

  .width3500 {
    width: 3500px;
  }
</style>
