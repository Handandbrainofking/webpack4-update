/**
 * function: 保存提交相关处理
 * author  : wq
 * update  : 2018/11/28 12:40
 */
import Dialog from '@/utils/dialog'
import { DEFINE_GET_LOCATION, native_common_events, native_logMessage } from '@/utils/deal_native'
import { ProductKindList } from '@/config'

export default {
  data() {
    return {
      operatorLocationX: '0',
      operatorLocationY: '0',
      operatorAddress: ''
    }
  },
  created() {
    native_common_events(DEFINE_GET_LOCATION)
      .then(data => {
        data = this.toJSON(data)
        this.operatorLocationX = data.longitude
        this.operatorLocationY = data.latitude
        this.operatorAddress = data.address
      })
  },
  methods: {
    // 获取TaskBaseView
    getBaseView() {
      let $ref = this.$refs['task-base-view']
      if (Array.isArray($ref)) {
        $ref = $ref[0]
      }
      return $ref
    },
    // 获取订单信息
    requestOrderInfo(applyNo, force) {
      const requestUrl = (force && 'forceRequestOrderInfo') || 'requestOrderInfo'
      return this.$store.dispatch(requestUrl, {
        applyNo,
        relationKey: this.requestParams.join(',')
      }).then(data => {
        if (typeof this.getOrderInfoResult === 'function') {
          this.getOrderInfoResult(data)
        }
        return data
      })
    },
    // 保存订单信息
    saveRequest(info, func, hiddenSuccessTip, hiddenErrorTip) {
      // 处理掉tailReleaseNodeName字段，后台不需要
      if (info && info.isrMixed && info.isrMixed.length > 0) {
        for (var i = 0; i < info.isrMixed.length; i++) {
          var item = info.isrMixed[i]
          item.tailReleaseNodeName && delete item.tailReleaseNodeName
        }
      }
      return this.$store.dispatch('saveOrderInfo', {data: info})
        .then(data => {
          this.clearSaveMark()
          if (!hiddenSuccessTip) {
            const $ref = this.getBaseView()
            if ($ref) {
              $ref.doSaveSuccess()
            }
          }
          try {
            // 更新traceItem里面的nodeRemark
            if (info.orderMatterRecordList[0].nodeRemark !== undefined) {
              this.traceItem.nodeRemark = info.orderMatterRecordList[0].nodeRemark
            }
          } catch (e) {}
          typeof this.resetInfo === 'function' && this.resetInfo()
          if (typeof this.uploadCameraImage === 'function') {
            this.uploadCameraImage(data)
          }
          this.showChildren = false
          return this.requestOrderInfo(this.applyNo, true).then(data => {
            this.showChildren = true
            typeof func === 'function' && func(true)
            return data
          })
        })
        .catch(({msg, code, obj}) => {
          if (!hiddenErrorTip) {
            const $ref = this.getBaseView()
            if ($ref) {
              $ref.doSaveError(msg)
            }
          }
          if (typeof func === 'function') {
            func(false, msg, code, obj)
          }
          throw new Error(msg)
        })
    },
    // 提交订单信息
    submitOrderInfo(params, info, func) {
      return this.$store.dispatch('submitOrderInfo', params)
        .then(data => {
          if (typeof func === 'function') {
            func()
          } else {
            const $ref = this.getBaseView()
            if(data === 'error'){
              return;
            }
            if ($ref) {
              $ref.doCommitSuccess()
            }
            this.$emit('upDateTaskId')
          }
        })
    },
    // 点击下面的按钮
    doClickBtn(idx, item, e) {
      var clickFunResult = undefined;
      switch (item) {
        case '终止':
          typeof this.doStopBtn === 'function' && this.doStopBtn()
          break
        case '保存':
          e.btnClickStatus = true;
          clickFunResult = typeof this.doSave === 'function' && this.doSave()
          break
        case '提交':
          e.btnClickStatus = true;
          clickFunResult = typeof this.doCommit === 'function' && this.doCommit()
          break
        case '审核通过':
          e.btnClickStatus = true;  
          clickFunResult = typeof this.doManCheckAgree === 'function' && this.doManCheckAgree()
          break
        case '驳回':
          e.btnClickStatus = true;  
          clickFunResult = typeof this.doReject === 'function' && this.doReject()
          break
        default:
          break
      }
      if(typeof clickFunResult === 'object'){
        clickFunResult.then(()=>{
          e.btnClickStatus = false;
        },(reason)=>{
          e.btnClickStatus = false;
        })
      }else if(clickFunResult != undefined){
        e.btnClickStatus = false;
      }
    },
    // 终止业务
    doStopBtn() {
      const $ref = this.getBaseView()
      if ($ref) {
        $ref.doStopTask()
      }
    },
    // 保存页面操作
    doSave(func, hiddenSuccessTip, hiddenErrorTip) {
      let info = true
      if (typeof this.doValidate === 'function') {
        info = this.doValidate()
      }
      if (info === false) {
        if (typeof func === 'function') {
          func(false, '')
        }
        return false
      }
      else if (info === true) {
        if (typeof func === 'function') {
          func(true)
        }
        else {
          Dialog.toast('没有修改数据，无需保存！')
        }
        return false
      }
      else if (info) {
        return this.saveRequest(info, func, hiddenSuccessTip, hiddenErrorTip)
      }
    },
    doBaseCommit(func) {
      let info = true
      if (typeof this.doValidate === 'function') {
        info = this.doValidate(true)
      }
      if (info === false) {
        return new Promise(resolve => {
          resolve();
        })
      }
      // 处理请求数据
      if (info === true) {
        return this.dealSubmitInfo(true, info, func)
      } else {
        return this.saveRequest(info, null, true)
          .then(data => {
            return this.dealSubmitInfo(true, info, func)
          })
      }
    },
    // 点击提交按钮
    doCommit(func) {
      return this.doBaseCommit(func)
    },
    // 获取备注信息
    getMarkInfo(_mark, _info) {
      let mark = _mark || this.traceItem.nodeRemark
      if (mark) {
        return mark
      }
      // 如果备注信息在info里面, 则从info里面获取 由于保存的时候将备注信息放到traceItem里面了，后面的可以不要
      try {
        const info = this.dealInfoCompatibleArray()
        const nodeRemarkItem = this.findItemByNameBlock(info, 'nodeRemark')
        if (nodeRemarkItem.value !== undefined) {
          mark = nodeRemarkItem.value || mark
        }
      } catch (e) {
        // 如果备注信息不在info里面，而mark信息存在修改，则可以从info中获取到
        try {
          if (_info.orderMatterRecordList[0].nodeRemark !== undefined) {
            mark = _info.orderMatterRecordList[0].nodeRemark
          }
        } catch (e) {
          // 如果不在info中并且改变保存了暂时不做处理（本来需要从orderMatterRecordList里面进行获取，但后期会将这个获取去掉，可以保存成功的时候直接将事项的数据修改掉）
        }
      }
      return mark
    },
    // 保存完数据需要将一些保存参数清空，防止来回的保存
    clearSaveMark() {
      const info = this.info
      if (Array.isArray(info)) {
        if (this.valueChanged === true) {
          this.valueChanged = false
        }
        if (typeof this.dealInfoCompatibleArray === 'function') {
          this.dealInfoCompatibleArray().forEach(item => {
            if (item.changed === true) {
              item.changed = false
              delete item.changed
            }
          })
        }
      }
    },
    // 处理提交参数
    dealSubmitInfo(bool, info, func, _mark) {
      if (bool) {
        let mark = this.getMarkInfo(_mark, info)
        if (!this.traceItem || !this.traceItem.relateId) {
          // 当前任务ID为空
          native_logMessage('任务编号不能为空，真是让人头大。。')
          for (var i = 0; i < this.$store.state.orderTraceList.length; i++) {
            var item = this.$store.state.orderTraceList[i]
            if (item.isHaveHandleRight === '1' && item.formKey === this.matterKey) {
              this.traceItem = item
              break
            }
          }
          native_logMessage('当前任务编号=' + this.traceItem.relateId)
        }
        const paramData = {
          applyNo: this.applyNo,
          opinion: mark,
          taskId: this.traceItem.relateId,
          operatorLocationX: this.operatorLocationX,
          operatorLocationY: this.operatorLocationY,
          operatorAddress: this.operatorAddress
        }
        const pageInfo = this.dealInfoCompatibleArray()
        if(pageInfo && pageInfo.action){
          paramData.action = pageInfo.action
        }
        if(pageInfo && pageInfo.destination){
          paramData.destination = pageInfo.destination
        }
        return this.submitOrderInfo(paramData, info, func)
      }
      return new Promise(resolve => {
      })
    },
    // 审核通过
    doManCheckAgree() {
      this.showChildren = false
      return this.$store.dispatch('manCheckAgree', {applyNo: this.applyNo, operateType: 'agree'})
        .then(result => {
          this.doManCheckAgreeResult(result)
          this.requestOrderInfo(this.applyNo, true).then(data => {
            this.showChildren = true
            return data
          })
        })
    },
    orderReleaseSuccess() {
      setTimeout(this.jump('/index.js'), 3000)
    }
  }
}
