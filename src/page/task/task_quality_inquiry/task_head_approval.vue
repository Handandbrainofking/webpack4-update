<!--
	作者：jun-rong@tom.com
	时间：2018-08-21
	描述：总部审批结果
-->
<template>
  <d-layout kind="column" text-align="initial" vertical-align="initial">
    <list class="list">
      <cell
        class="cell"
        v-for="(item,i) in headApprovalList"
        :key="`approval-list-${item.taskKey}-${i}`"
      >
        <div class="apply-info-title" @click="doClickTitle(item, i)">
          <text class="apply-info-title-text">{{i+1}}. {{item.taskName}}</text>
          <text class="apply-info-title-time">{{formatDate(item.updateTime)}}</text>
          <bui-image
            src="/image/arrow-down.png"
            width="32"
            height="20"
            :ref="`title-image-${item.taskKey}-${i}`"
          ></bui-image>
        </div>
        <div
          class="enclosure-content"
          :style="{height: item.show ? '' : '1px'}"
          :ref="`enclosure-${i}`"
        >
          <div
            v-for="(tItem, idx) in item.children"
            :class="['list-item', idx !== item.children.length -1 && 'list-item-mit']"
            :key="`approval-list-${item.taskKey}-${i}-${idx}`"
          >
            <div class="item">
              <text class="label">操作时间</text>
              <text
                class="value"
              >{{ formatDate(tItem.createTime) }} —— {{ formatDate(tItem.completeTime) }}</text>
            </div>
            <div class="item">
              <text class="label">待执行人</text>
              <text class="value">{{ tItem.qualfiedNames }}</text>
            </div>
            <div class="item">
              <text class="label">执行人</text>
              <text class="value">{{ tItem.auditorName }}</text>
            </div>
            <div class="item">
              <text class="label">处理状态</text>
              <text class="value">{{ getStatusName(tItem.status) || tItem.statusVal }}</text>
            </div>
            <div class="item">
              <text class="label">备注意见</text>
              <text class="value">{{ tItem.opinion }}</text>
            </div>
          </div>
        </div>
        <div
          :class="['line-wrap', i === 0 ? 'line-first' : i === headApprovalList.length -1 ? 'line-last' : '']"
        >
          <div
            :class="['line-round', i === 0 ? 'line-round-first' : '', item.done ? 'line-round-over' : 'line-round-ing']"
          ></div>
        </div>
        <div class="bottom-line" v-if="i !== headApprovalList.length - 1"></div>
      </cell>
    </list>
  </d-layout>
</template>

<script>
import { ApprovalStatus } from '../../../config'

const animation = weex.requireModule('animation')
export default {
  name: 'apply-info-box',
  props: {
    applyNoProp: {
      type: String
    },
    filter: {
      type: [Array, undefined, null],
      default: undefined
    }
  },
  data() {
    return {
      applyNo: '',
      headApprovalList: []
    }
  },
  mounted() {
    this.applyNo = this.applyNoProp || this.getPageParams('applyNo', true)
    this.requestList()
  },
  methods: {
    requestList() {
      this.requestApi.history_approval({
        method: 'GET',
        data: {
          applyNo: this.applyNo
        },
        success: data => {
          let filterApprovalList = this.filterApprovalList(data)
          this.headApprovalList = this.dealApprovalList(filterApprovalList)
          setTimeout(() => {
            let latestItem = this.sortApprovalList()
            this.showLatestApproval(latestItem)
          }, 500)
        }
      })
    },
    filterApprovalList(interfaceData) {
      let list
      const filter = this.filter
      if (filter) {
        list = (interfaceData || []).filter(item => filter.indexOf(item.taskKey) > -1).sort((item1, item2) => {
          return filter.indexOf(item1.taskKey) - filter.indexOf(item2.taskKey)
        })
      } else {
        list = interfaceData || []
      }
      return list
    },
    dealApprovalList(untreatedApprovalList) {
      let tmp, tmpObj = {}, approvalList = []
      for (let i = 0; i < untreatedApprovalList.length; i++) {
        tmp = untreatedApprovalList[i]
        if (!tmpObj[tmp.taskKey]) {
          approvalList.push({
            taskName: tmp.taskName,
            taskKey: tmp.taskKey,
            updateTime: tmp.completeTime,
            done: tmp.status !== 'awaiting_check',
            children: [tmp]
          })
          tmpObj[tmp.taskKey] = approvalList.length - 1
        } else {
          approvalList[tmpObj[tmp.taskKey]].done = true
          approvalList[tmpObj[tmp.taskKey]].updateTime = tmp.completeTime || approvalList[tmpObj[tmp.taskKey]].updateTime
          approvalList[tmpObj[tmp.taskKey]].children.push(tmp)
        }
      }
      return approvalList
    },
    sortApprovalList() {
      let sortApprovalList = [...this.headApprovalList]
      sortApprovalList.sort(function(a, b) { return a.updateTime - b.updateTime })
      for (let i = sortApprovalList.length - 1; i >= 0; i--) {
        if (sortApprovalList[i].done) {
          return sortApprovalList[i]
        }
      }
    },
    showLatestApproval(latestItem) {
      let latestIndex = this.headApprovalList.indexOf(latestItem)
      this.doClickTitle(this.headApprovalList[latestIndex], latestIndex)
    },
    getStatusName(status) {
      return ApprovalStatus[status]
    },
    doClickTitle(item, idx) {
      const _$ref = this.$refs['title-image-' + item.taskKey + '-' + idx][0]
      const _$ref_enclosure = this.$refs['enclosure-' + idx][0]
      if (item.show) {
        animation.transition(
          _$ref,
          {
            styles: {
              transform: 'rotate(0deg)'
            },
            duration: 200, //ms
            timingFunction: 'ease',
            delay: 0 //ms
          },
          () => {}
        )
        animation.transition(
          _$ref_enclosure,
          {
            styles: {
              height: '1px'
            },
            duration: 200, //ms
            timingFunction: 'ease',
            delay: 0 //ms
          },
          () => {}
        )

        this.$set(item, 'show', null)
      } else {
        this.$set(item, 'show', true)
        animation.transition(
          _$ref,
          {
            styles: {
              transform: 'rotate(180deg)'
            },
            duration: 200, //ms
            timingFunction: 'ease',
            delay: 0 //ms
          },
          () => {}
        )
        animation.transition(
          _$ref_enclosure,
          {
            styles: {
              // height: item.children.length * 260 + "px"
            },
            duration: 200, //ms
            timingFunction: 'ease',
            delay: 0 //ms
          },
          () => {}
        )
      }
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../../css/common';

  .list {
    flex: 1;
    @include setPadding($normal_gap_bottom, $normal_gap_root_column);
  }

  .cell {
    padding-top: 30px;
    padding-left: 60px;
    flex-direction: column;
    width: 2100px;
  }

  /** 头部内容 **/
  .apply-info-title {
    flex-direction: row;
    align-items: center;
  }

  .apply-info-title-text {
    flex: 1;
    font-size: $font_nav;
    color: $color_nav;
    height: 76px;
    line-height: 76px;
  }

  .apply-info-title-time {
    @include setPaddingH($normal_gap_left);
    font-size: $font_normal;
    color: $color_enclosure;
  }

  /** 列表内容区 **/
  .enclosure-content {
    height: 1px;
    /*padding-left: 40px;*/
    overflow: hidden;
  }

  .item {
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .list-item {
    padding-top: 20px;
  }

  .list-item-mit {
    padding-bottom: 20px;
    @include setBorderBottom(#EBEBEB, 1px);
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
    flex: 1;
    line-height: 40px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: $font-normal;
    color: $color_enclosure;
  }

  /** 左边的进度 **/
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
    top: 65px;
  }

  .line-last {
    height: 85px;
    bottom: inherit;
  }

  .line-round {
    margin-left: -9px;
    margin-top: 65px;
    width: 20px;
    height: 20px;
    border-radius: 100%;
  }

  .line-round-first {
    margin-top: 0px;
  }

  .line-round-over {
    background-color: $color_back;
  }

  .line-round-ing {
    @include setBorder($color_back);
    background-color: #ffffff;
  }

  /** 底部的线 **/
  .bottom-line {
    padding-top: 30px;
    @include setBorderBottom(#EBEBEB, 1px);
  }
</style>
