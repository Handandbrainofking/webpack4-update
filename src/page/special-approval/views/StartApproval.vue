<template>
  <div class="start-approval">
    <div class="form-body" :style="formStyle">
      <d-form type="pick" label="特批种类" :label-width="ui.labelWidth" :input-width="ui.width" :height="ui.height"
        :required="true" :list="getDict('SpecialApprovalTypes')" v-model="flowKey" placeholder="请选择特批种类" pick-title="请选择"
        :style="inputStyle" />
      <d-form type="pick" label="审批人" :label-width="ui.labelWidth" :input-width="ui.width" :height="ui.height"
        :required="true" :list="handleUsers" v-model="handleUser" :index="0" placeholder="请选择审批人" pick-title="请选择"
        :style="inputStyle" />

      <!-- 直接通过 d-form 实现这个按键界面会不断地跳动,所以这里用了特殊的开发 -->
      <div class="apply-no-selector">
        <text class="apply-no-label">特批订单</text>
        <text class="apply-no-label-required">*</text>
        <text class="apply-no" v-if="bizApply.applyNo">{{bizApply.applyNo}}</text>
        <text class="apply-no-placeholder" v-else>请选择订单</text>
        <text class="btn-choose" @click="onSelectOrder">选择</text>
      </div>

      <ApprovalOrderInfo :order="bizApply" v-if="bizApply&&bizApply.applyNo" />
      <d-form type="textarea" label="申请原因" :label-width="ui.labelWidth" :width="1260" :required="true" :maxlength="300"
        :height="346" v-model="applyReason" placeholder="请输入申请原因" @keyboard="onKeyboard($event, bizApply.applyNo?'-300px':'-200px')" />

    </div>
    <FooterButton class="footer-button" :style="{opacity:enableCommit?1:0.4}" :btns="bottomBtns" @clickBtn="doClickBottomBtn" />
    <wxc-popup popup-color="#ffffff" @wxcPopupOverlayClicked="isShowOrderList=false" :show="isShowOrderList" pos="right"
      width="2240" :overlayCfg="{hasAnimation: false}">
      <ApprovalOrderList v-if="isShowOrderList" :selected="bizApply.applyNo" @select="onOrderSelected" :show.sync="isShowOrderList" />
    </wxc-popup>
  </div>
</template>

<script>
import minxinForm from '@/mixins/form'
import WxcPopup from '@/components/wxc/popup.vue'
import ApprovalOrderList from '../components/OrderList'
import ApprovalOrderInfo from '../components/OrderInfo'
import FooterButton from '@/page/task/components/task_footer_button.vue'
import Dialog from '@/utils/dialog'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'start-approval',
  mixins: [minxinForm],
  components: { ApprovalOrderList, ApprovalOrderInfo, FooterButton, WxcPopup },
  data() {
    return {
      ui: {
        labelWidth: 216,
        height: 72,
        width: 520
      },
      inputStyle: {
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: '32px',
        height: '72px'
      },
      isShowOrderList: false,
      approveTypes: [{ key: 'riskSpecialApproveFlow', name: '特批流程' }],
      flowKey: 'riskSpecialApproveFlow',
      bizApply: {},
      handleUser: 'YYZG',
      applyReason: '',
      bottomBtns: ['提交'],
      enableCommit: true
    }
  },
  computed: {
    ...mapGetters(['isWQG', 'isYYZG', 'isZJL', 'isYYFZR']),
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
  mounted() {
    this.handleUser = this.isOnlyWQG ? 'YYZG' : ''
  },
  methods: {
    ...mapActions('SpecialApprove', ['saveCreate']),
    onSelectOrder(order) {
      this.isShowOrderList = true
    },
    onOrderSelected(order) {
      this.isShowOrderList = false
      this.bizApply = order
    },
    doClickBottomBtn(idx, item) {
      if (item === '提交') {
        this.saveForm()
      }
    },
    saveForm() {
      if (!this.enableCommit) return
      this.enableCommit = false
      if (!this.flowKey) {
        Dialog.toast('请选择特批种类')
        this.enableCommit = true
        return
      }
      if (!this.handleUser) {
        Dialog.toast('请选择审批人')
        this.enableCommit = true
        return
      }
      if (!this.bizApply || !this.bizApply.applyNo) {
        Dialog.toast('请选择特批订单')
        this.enableCommit = true
        return
      }
      if (!this.applyReason) {
        Dialog.toast('请输入申请原因')
        this.enableCommit = true
        return
      }

      const formData = {
        flowKey: this.flowKey,
        applyNo: this.bizApply.applyNo,
        handleUser: this.handleUser,
        applyReason: this.applyReason
      }

      return this.saveCreate(formData).then(() => {
        Dialog.toast('保存成功!')
        this.flowKey = 'riskSpecialApproveFlow'
        this.bizApply = {}
        this.applyNo = ''
        this.handleUser = this.isOnlyWQG ? 'YYZG' : ''
        this.applyReason = ''
        this.$nextTick(() => {
          this.$emit('created', formData)
          this.enableCommit = true
        })
      },()=>this.enableCommit = true)
    }
  }
}
</script>

<style lang="scss" scoped>
.start-approval {
  padding-top: 107px;
  flex: 1;
}

.form-body {
  flex: 1;
}

.footer-button {
  position: absolute;
  width: 2260px;
  bottom: 0;
  height: 125px;
}

.apply-no-selector {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.apply-no-label {
  color: rgb(33, 54, 61);
  font-size: 34px;
  text-align: right;
  line-height: 72px;
  width: 216px;
}

.apply-no-label-required {
  color: rgb(255, 0, 0);
  font-size: 34px;
}

.apply-no {
  width: 380px;
  padding-left: 20px;
  margin-left: 20px;
  @include setBorderTop(#cacccf, 1px);
  @include setBorderLeft(#cacccf, 1px);
  @include setBorderBottom(#cacccf, 1px);
  height: 72px;
  line-height: 72px;
}

.apply-no-placeholder {
  @extend .apply-no;
  color: #bdc3c7;
}

.btn-choose {
  width: 140px;
  height: 72px;
  border-width: 2px;
  border-style: solid;
  border-color: #02b3b4;
  background-color: #e5f7f7;
  text-align: center;
  line-height: 72px;
  color: #02b3b4;
  font-weight: 400;
  font-size: 30px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  align-self: flex-start;
}
</style>
