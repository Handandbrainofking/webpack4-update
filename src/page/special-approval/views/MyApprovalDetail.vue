<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial" :style="formStyle">
    <scroller class="flex1">
      <div class="default-approval shadow" v-for="(singleApproval, idx) in approvalList" :key="singleApproval.procInstId">
        <div :class="['title', 'align-center', singleApproval.show ? 'blue' : 'white']" @click="showThisApproval(idx, singleApproval.procInstId)">
          <div>
            <text class="title-text">风险特批</text>
            <text class="time-text">发起时间:{{formatDate(singleApproval.time)}}</text>
          </div>
          <div class="row align-center">
            <text class="move-text">{{singleApproval.show ? '收起' : '展开'}}</text>
            <d-image src="/image/arrow-down.png" width="24" height="16" :ref="`title-image-${singleApproval.procInstId}`"></d-image>
          </div>
        </div>
        <div v-if="singleApproval.show" class="approval-content">
          <div v-for="(node, i) in singleApproval.nodes" :key="node" class="node-content">
            <div class="row align-center">
              <text :class="taskNameStyle(node.status)">{{showTaskName(node.status)}}</text>
              <text class="time-text">{{formatDate(node.completeTime) || formatDate(node.createTime)}}</text>
            </div>
            <div>
              <div class="item">
                <text class="label">处理人</text>
                <text class="value">{{ node.auditorName || '-' }}</text>
              </div>
              <div class="item">
                <text class="label">审批意见</text>
                <text class="value">{{ node.opinion || '-' }}</text>
              </div>
            </div>
            <div :class="['line-wrap', i === singleApproval.nodes.length -1 ? 'line-last' : '']">
              <div :class="lineRoundStyle(i, node.status)"></div>
            </div>
            <div class="bottom-line"></div>
          </div>
        </div>
        <div class="supplement" v-if="(idx===0)&&showSupplementButton">
          <d-form type="pick" label="审批人" :label-width="ui.labelWidth" :height="ui.height" :input-width="ui.width" :required="true"
                 :list="handleUsers" v-model="approveUser" :index="0" placeholder="请选择审批人" pick-title="请选择" :style="inputStyle"/>
          <d-form type="textarea" label="补充说明" :label-width="ui.labelWidth" :width="1260" :required="true" :maxlength="300"
                :height="250" v-model="approveRemark" placeholder="请输入补充说明" @keyboard="onKeyboard($event, '-500px')"/>
        </div>
      </div>
    </scroller>
    <div v-if="showSupplementButton" class="supplement-height row align-center justify-center">
      <div @click="submitSupplement" class="supplement-button justify-center"><text class="supplement-button-text">提交</text></div>
    </div>
  </d-layout>
</template>

<script>
import Dialog from '@/utils/dialog'
import minxin from '@/mixins/index'
import minxinForm from '@/mixins/form'
import { mapActions, mapGetters } from 'vuex'

const animation = weex.requireModule('animation')
export default {
  name: 'approvalDetail',
  mixins: [minxin, minxinForm],
  props: {
    applyNo: {
      type: String,
      default: ''
    },
    supplement: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      ui: {
        labelWidth: 220,
        height: 72,
        width: 520
      },
      inputStyle: {
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: '32px',
        height: '72px'
      },
      approveUser: 'YYZG',
      approveRemark: '',
      approvalList: [],
      taskId: '',
      statusList: {
        // start: '发起流程',
        // end: '结束流程',
        awaiting_check: '审批中',
        agree: '同意',
        manual_end: '拒绝',
        // abandon: '弃权',
        // retrieve: '追回',
        // skip: '跳过',
        reject: '驳回',
        plus: '补充说明'
      },
      flag: true
    }
  },
  created() {
    this.getApprovalList()
  },
  mounted() {
    this.approveUser = this.isOnlyWQG ? 'YYZG' : ''
  },
  computed: {
    ...mapGetters(['isWQG', 'isYYZG', 'isZJL', 'isYYFZR']),
    showSupplementButton: function() {
      return this.supplement && this.approvalList[0].show && this.taskId && this.flag
    },
    isOnlyWQG() {
      return this.isWQG && !this.isYYZG && !this.isZJL && !this.isYYZG
    },
    handleUsers() {
      let items = this.getDict('HandleUser')
      if (this.isOnlyWQG) {
        items = items.filter(item => item.key === 'YYZG')
      } else if (this.isYYFZR) {
        items = items.filter(item => item.key !== 'YYZG' && item.key !== 'YYFZR') // 运营负责人可以选“总经理”，“风险控制部”
      } else if (this.isYYZG) {
        items = items.filter(item => item.key !== 'YYZG') // 运营主管可以选 "运营负责人",“总经理”，“风险控制部”
      }
      return items
    }
  },
  methods: {
    getApprovalList() {
      this.requestApi.order_approval_list({
        data: {
          applyNo: this.applyNo
        },
        success: data => {
          if(data.length) {
            for(let i in data) {
              let tmpApproval = {
                procInstId: data[i].procInstId,
                time: data[i].createTime,
                nodes: [],
                show: false
              }
              this.approvalList.push(tmpApproval)
            }
          }
          this.openLatestApproval()
        }
      })
    },
    openLatestApproval() {
      this.approvalList[0].show = true
      this.getApprovalNodes(0, this.approvalList[0].procInstId)
    },
    getApprovalNodes(idx, key) {
      this.requestApi.special_approval_history({
        data: {
          instId: key
        },
        success: data => {
          if(data.length) {
            data.reverse()
            let tmpList = []
            let tmpStatus = ''
            for(let i in data) {
              if(this.statusList[data[i].status]) {
                if(tmpStatus === 'reject') {
                  if(data[i].status === 'agree') {
                    data[i].status = 'plus'
                  }
                }
                tmpStatus = data[i].status
                tmpList.push(data[i])
              }
            }
            this.approvalList[idx].nodes = tmpList || []
          }
          if(idx === 0) {
            for(let i in this.approvalList[0].nodes) {
              console.log(this.approvalList[0].nodes[i].status)
              if(this.approvalList[0].nodes[i].taskKey === 'riskSpecialApproveApply') {
                this.taskId = this.approvalList[0].nodes[i].taskId
              }
            }
          }
        }
      })
    },
    showTaskName(status) {
      return this.statusList[status] || '';
    },
    /**
     * 来源是点击补充说明，且为最新一条的点开状态才展示 “补充说明” 内容
     */
    showSupplement(item, idx) {
      if(item.show && idx === 0 && this.supplement) {
        return true
      }
      return false
    },
    showThisApproval(idx, key) {
      if(!this.approvalList[idx].nodes.length) {
        this.getApprovalNodes(idx, key)
      }
      this.animationShow(idx, key)
    },
    submitSupplement() {
      if(!this.taskId) {
        Dialog.toast('无taskId!')
        return
      }
      if(!this.approveUser) {
        Dialog.toast('请选择审批人！')
        return
      }
      if(!this.approveRemark) {
        Dialog.toast('请输入补充说明！')
        return
      }
      let data = {
        applyNo: this.applyNo,
        taskId: this.taskId,
        action: 'agree',
        opinion: this.approveRemark,
        handleUser: this.approveUser
      }
      this.requestApi.submit_supplement({
        data,
        success: data => {
          this.flag = false
          this.openLatestApproval()
        }
      })
    },
    animationShow(idx, key) {
      this.approvalList[idx].show = !this.approvalList[idx].show
      const imgEl = this.$refs['title-image-' + key][0]
      if(this.approvalList[idx].show) {
        animation.transition(
          imgEl,
          {
            styles: {
              transform: 'rotate(180deg)'
            },
            duration: 400, //ms
            timingFunction: 'ease',
            delay: 0 //ms
          },
          () => {}
        )
      } else {
        animation.transition(
          imgEl,
          {
            styles: {
              transform: 'rotate(360deg)'
            },
            duration: 400, //ms
            timingFunction: 'ease',
            delay: 0 //ms
          },
          () => {}
        )
      }
    },
    // 后台人员说 审批历史没有拒绝状态
    taskNameStyle(status) {
      let result = ['node-text', 'flex1']
      if(status === 'reject') {
        result.push('return-text')
      } else if (status === 'manual_end') {
        result.push('against-text')
      }
      return result
    },
    lineRoundStyle(id, status) {
      let result = ['line-round']
      if(status === 'agree') {
        result.push('line-round-agree')
      } else if (status === 'reject') {
        result.push('line-round-return')
      } else if (status === 'manual_end') {
        result.push('line-round-against')
      } else if (status === 'awaiting_check') {
        return result
      } else {
        result.push('line-round-over')
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  flex-direction: row;
}
.align-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.flex1 {
  flex: 1;
}
.title {
  flex-direction: row;
  height: 100px;
  padding-right: 20px;
  padding-left: 40px;
  justify-content: space-between;
}
.title-text {
  font-size: $font_normal;
  color: $color_nav;
  margin-bottom: 10px;
}
.time-text {
  font-size: 24px;
  color: #BDC3C7;
}
.move-text {
  font-size: 24px;
  color: $color_enclosure;
  margin-right: 10px;
}
.default-approval {
  margin-bottom: 32px;
  border-width: 2px;
  border-color: $color_list_border;
}
.blue {
  background-color: $color_list_title;
}
.white {
  background-color: $color_white;
}
.approval-content {
  flex: 1;
  padding-right: 40px;
  padding-left: 40px;
}
.node-content {
  padding-top: 30px;
  padding-left: 60px;
  flex-direction: column;
}
.node-text {
  font-size: $font_nav;
  color: $color_nav;
  height: 76px;
  line-height: 76px;
}
.line-wrap {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  background-color: $color_back;
  border-left-width: 9px;
  border-left-color: #ffffff;
  border-right-width: 9px;
  border-right-color: #ffffff;
  overflow: visible;
}
.line-first {
  top: 60px;
}
.line-last {
  height: 78px;
  bottom: inherit;
}
.line-round {
  margin-left: -9px;
  margin-top: 58px;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  border-width: 2px;
  border-color: $color_back;
  background-color: #ffffff;
}
.line-round-first {
  margin-top: 0px;
}
.line-round-over {
  background-color: $color_back;
}
.line-round-agree {
  background-color: $color_back;
}
.line-round-return {
  border-color: #FF9F43;
  background-color: #FF9F43;
}
.return-text {
  color: #FF9F43;
}
.line-round-against {
  border-color: #EE5253;
  background-color: #EE5253;
}
.against-text {
  color: #EE5253;
}
.line-round-ing {
  @include setBorder($color_back);
  background-color: #ffffff;
}
.bottom-line {
  padding-top: 30px;
  @include setBorderBottom(#EBEBEB, 1px);
}
.supplement {
  padding-top: 40px;
  padding-bottom: 40px;
}
.item {
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
}
.label {
  font-size: $font-normal;
  color: $color_enclosure;
  width: 155px;
  text-align: right;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 30px;
  line-height: 40px;
}
.value {
  width: 1850px;
  line-height: 40px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: $font-normal;
  color: $color_enclosure;
}
.supplement-height {
  height: 128px;
}
.supplement-button-text {
  font-size: 38px;
  color: #ffffff;
  text-align: center;
}
.supplement-button {
  width: 480px;
  height: 88px;
  background-color: #02B3B4;
  border-radius: 4px;
}
.shadow {
  box-shadow: 0 2px 0 0 #E8F3FB;
}

</style>