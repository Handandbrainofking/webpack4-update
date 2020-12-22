<!--日历 预约信息-->
<template>
  <wxc-popup :show="todoInfoShow" @wxcPopupOverlayClicked="closeTodoInfo" pos="right" width="2240">
    <div class="calendar-background" :style="formStyle">
      <div class="todoinfo-background">
        <div class="todoinfo-return row">
          <div class="btn-back" @click="doBack()">
            <d-image src="/image/arrow-left.png" width="40" height="40"></d-image>
            <text class="return-text">返回</text>
          </div>
        </div>
        <div class="todoinfo-content">
          <text class="jbyy-text">基本信息</text>
          <div class="todoinfo-jbxx-small row">
            <read-info
              class="info-each"
              label="订单编号"
              :content="basicInfo.applyNo"
              :size="30"
              :width="713"
            ></read-info>
            <read-info
              class="info-each"
              label="产品名称"
              :content="basicInfo.productName"
              :size="30"
              :width="713"
            ></read-info>
            <read-info
              class="info-each"
              label="客户姓名"
              :content="basicInfo.sellerName"
              :size="30"
              :width="713"
            ></read-info>
            <read-info
              class="info-each"
              label="身份证号"
              :content="basicInfo.idCardNo"
              :size="30"
              :width="713"
            ></read-info>
            <read-info
              class="info-each"
              label="客户联系方式"
              :content="basicInfo.phone"
              :size="30"
              :width="713"
            ></read-info>
            <read-info
              class="info-each"
              label="渠道经理"
              :content="basicInfo.salesUserName"
              :size="30"
              :width="713"
            ></read-info>
            <read-info
              class="info-each"
              label="渠道经理联系方式"
              :content="basicInfo.salesPhone"
              :size="30"
              :width="713"
            ></read-info>
            <read-info
              class="info-each"
              label="渠道联系人"
              :content="basicInfo.contact"
              :size="30"
              :width="713"
            ></read-info>
            <read-info
              class="info-each"
              label="渠道联系方式"
              :content="basicInfo.channelPhone"
              :size="30"
              :width="713"
            ></read-info>
          </div>
          <div class="black-dashed"></div>
          <div class="todoinfo-yyxx">
            <text class="jbyy-text">预约信息</text>
            <div class="todoinfo-yyjd row">
              <div class="yyjd">
                <text class="pre-text">预约节点</text>
              </div>
              <text class="appoint-matter">{{appointInfo.matterName}}</text>

              <div class="yyjd">
                <text class="pre-text">预约人</text>
              </div>
              <text class="appoint-user">{{appointInfo.appointUserName}}</text>
            </div>
            <div class="todoinfo-yyjd row">
              <div class="yyjd">
                <text class="pre-text">预约时间</text>
              </div>
              <date-time-picker
                :datetime="appointInfo.appointDateTime"
                @input="appointInfo.appointDateTime=$event"
                class="appoint-input"
              ></date-time-picker>
            </div>
            <div class="todoinfo-yyjd row">
              <div class="yyjd">
                <text class="pre-text">预约地点</text>
              </div>
              <div :class="['item', 'row']" @click="doOpenHouseArea()">
                <text
                  :class="['btn-choose','appoint-areaName-text']"
                >{{appointInfo.appointAreaName}}</text>
              </div>
              <input class="appoint-input" v-model="appointInfo.appointAddress">
            </div>
            <div class="mark-tip-wrap">
              <text class="mark-tip">{{ remarkInputCount }}/200</text>
            </div>
            <div class="row">
              <div class="yyjd">
                <text class="pre-text">备注</text>
              </div>
              <textarea rows="5" class="mark" :maxlength="200" v-model="appointInfo.remark" @input="doInputMark" @keyboard="onKeyboard($event, '-450px')"></textarea>
            </div>
            <div class="footer">
              <div class="btn-save" @click="saveAppointment">
                <text class="btn-save-text">确定</text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <task-choose-dialog
        v-if="dialogInfo"
        dialog-title="预约区域"
        :dialog-top="208"
        :body-list="dialogList"
        :head-list="headList"
        @doSureChooseDialog="doSureChooseDialog"
        @doCancelChooseDialog="doCancelChooseDialog"
      ></task-choose-dialog>
    </div>
  </wxc-popup>
</template>

<script>
import ReadInfo from '../task/components/common/read_info.vue'
import WxcPopup from '@/components/wxc/popup.vue'
import DateTimePicker from '@/components/dropdown/pickdatetime'
import utils from '@/utils/dialog'
import minxinForm from '@/mixins/form'
import { mapActions, mapState } from 'vuex'
import { native_eventStatistic } from '@/utils/deal_native'
import TaskChooseDialog from '@/page/task/components/common/choose_dialog.vue'

export default {
  name: 'todoInfo',
   mixins: [minxinForm],
  components: {
    ReadInfo,
    WxcPopup,
    DateTimePicker,
    TaskChooseDialog
  },
  data() {
    return {
      todoInfoShow: true,
      bookOrder: {
        title: '预约信息',
        info: {
          name: '',
          kind: ''
        },
        markNum: 0,
        saveData: {}
      },
      appointAreaNameDefaultValue: '请选择区域',
      appointInfo: {},
      basicInfo: {
        applyNo: '',
        channelPhone: '',
        contact: '',
        productId: '',
        productName: '',
        salesPhone: '',
        salesUserId: '',
        salesUserName: '',
        sellerName: ''
      },
      dialogInfo: false,
      dialogList: null,
      headList: [
        {
          name: '区域',
          key: 'name'
        },
        {
          name: '城市',
          key: 'cityName'
        }
      ]
    }
  },
  computed: {
    ...mapState('calendar', ['currentItem']),
    remarkInputCount() {
      let remark = (this.appointInfo || {}).remark
      return (remark || '').length
    }
  },
  created() {
    this.appointInfo = { ...this.currentItem }
    this.appointInfo.remark = this.appointInfo.remark || ''
    this.appointInfo.appointAddress = this.appointInfo.appointAddress || ''
    this.getOrderBasicInfo(this.appointInfo.applyNo).then(res => {
      this.basicInfo = res
    })

    this.getAppointment({ applyNo: this.appointInfo.applyNo, matterKey: this.appointInfo.matterKey }).then(res => {
      this.$set(this.appointInfo, 'appointUserName', res.appointUserName)
      this.appointInfo.appointAreaName = res.appointAreaName || this.appointAreaNameDefaultValue
      this.appointInfo.appointUserId = res.appointUserId
    })
    this.appointInfo.appointAreaName = this.appointInfo.appointAreaName || this.appointAreaNameDefaultValue
  },
  methods: {
    ...mapActions('calendar', ['getOrderBasicInfo', 'updateAppointment', 'getAppointment']),
    // doBack() {
    //   this.$router.back()
    // },
    doInputMark(e) {
      const value = e.value
      if ((this.bookOrder.markNum = value.length) > 200) {
        this.bookOrder.markNum = 200
        e.value = value.substring(0, 200)
      }
    },
    assert(val, tip) {
      if (!val) {
        throw new Error(tip)
      }
    },
    saveAppointment() {
      try {
        native_eventStatistic('calendarTodoSave', '待办预约修改（todoInfo.vue）')
        this.assert(this.appointInfo.matterName, '预约事项不能为空!')
        this.assert(this.appointInfo.appointDateTime, '预约时间不能为空!')
        this.assert(this.appointInfo.appointAddress.length <= 100, '预约地点不能超过100个字')
        this.assert(this.appointInfo.remark.length <= 200, '备注不能超过200个字')
        this.updateAppointment({
          applyNo: this.appointInfo.applyNo,
          matterKey: this.appointInfo.matterKey,
          matterName: this.appointInfo.matterName,
          appointTime: this.appointInfo.appointDateTime,
          appointAreaName: this.appointInfo.appointAreaName === this.appointAreaNameDefaultValue ? '':this.appointInfo.appointAreaName,
          appointAddress: this.appointInfo.appointAddress,
          remark: this.appointInfo.remark
        }).then(() => {
          utils.toast('保存成功!')
          setTimeout(() => this.doBack(), 500) //返回
        })
      } catch (e) {
        utils.toast(e.message)
      }
    },
    //打开房产区域
    doOpenHouseArea(title) {
      let that = this
      this.requestApi.order_info({
        data: {
          applyNo: this.appointInfo.applyNo,
          relationKey: 'applyOrder'
        },
        success: data => {
          let companyCode = data.applyOrder.branchId
          this.requestApi.company_area_list({
            method: 'GET',
            data: 'companyCode=' + companyCode,
            success: data => {
              that.dialogList = data
              that.dialogInfo = true
            }
          })
        }
      })
    },
    doSureChooseDialog(e) {
      if (e) {
        this.appointInfo.appointAreaCode = e.id
        this.appointInfo.appointAreaName = e.name
      }
      this.valueChanged = true
      this.dialogInfo = false
    },
    doCancelChooseDialog() {
      this.dialogInfo = false
    },
    closeTodoInfo() {
      this.$emit('closeTodoInfo', false)
    },
    doBack() {
      this.$emit('closeTodoInfo', false)
    }
  }
}
</script>

<style src="./calendarcss.css"></style>
<style lang="sass" type="text/scss"  scoped>
	@import '../../css/common';
  .btn-choose {
    background-color: $color_back;
    color: $color_white;
    height: 72px;
    line-height: 72px;
    width: 150px;
    text-align: center;
    border-radius: 4px;
    margin-left: 20px;
  }

  .btn-font {
    font-size: $font_normal;
  }
    .return-text{
        font-size:38px;
        color:black;
    }
    .appoint-input {
        width: 520px;
        height: 72px;

        font-size: 34px;
        color: #030606;
        padding: 0 19px;

        border-width: 2px;
        border-style: solid;
        border-color: #CACCCF;
        border-radius: 4px;
    }

    .appoint-matter{
        width: 520px;
        font-size: 34px;
        color: #02B3B4;
    }

    .appoint-user{
        font-size: 34px;
        color: #030606;
    }

    .footer{
        margin-top: 140px;
        padding: 36px 240px 36px 1500px;

        box-shadow: 0 -2px 2px 0 rgba(0,0,0,0.10);
    }

    .btn-save{
        width: 480px;
        height: 82px;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(to right,#02B3B4,#1ABC9C);
    }

    .btn-save-text{
        font-size: 38px;
        color: #ffffff;
    }

    .btn-back{
        height: 100px;
        width: 160px;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding-left:20px;
    }

    .btn-back:active{
        transition: background-color 0.2s;
        transition: border-radius 0.2s;
        background-color: #EBF0F6;
        border-radius: 0px;
    }
   .appoint-areaName-text {
    width: 200px;
    height: 72px;
    font-size: 34px;
    text-align: center;
    color: #FFFFFF;
    background-color: $color_back;
    border-radius: 4px;
    margin-left: 15px;
  }


</style>