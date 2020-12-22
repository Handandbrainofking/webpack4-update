<template>
  <wxc-popup
    :show="staffListShow"
    @wxcPopupOverlayClicked="closeStaffList"
    pos="right"
    width="1400">
    <back-head back-title="查看人员" :beforeBack="backClick"></back-head>
    <div class="choose-title">
      <div class="staff-title-part">
        <text class="staff-title-text">人员选择</text>
        <text class="staff-num-text">{{choosedNum}}/{{staffList.length}}</text>
      </div>
      <div class="reset-button"><text class="reset-button-text" @click="resetChooseStaffs">重置</text></div>
    </div>
    <scroller style="height: 1270px">
      <div class="staff-part">
        <div @click="chooseAllStaffs" :class="[allChooseButton ? 'choosed-staff' : 'unchoosed-staff']">
          <text :class="[allChooseButton ? 'choosed-staff-text' : 'unchoosed-staff-text']">全选</text>
          <div v-if="allChooseButton" class="choosed-triangle"></div>
          <div v-if="allChooseButton" class="rotate-image"><d-image src="/image/toast_success.png" width="18" height="14"></d-image></div>
        </div>
        <div v-for="(staff, idx) in staffList" :key="staff.id" @click="chooseThisStaff(idx)" :class="[staff.choose ? 'choosed-staff' : 'unchoosed-staff']">
          <text :class="[staff.choose ? 'choosed-staff-text' : 'unchoosed-staff-text']">{{staff.fullname}}</text>
          <div v-if="staff.choose" class="choosed-triangle"></div>
          <div v-if="staff.choose" class="rotate-image"><d-image src="/image/toast_success.png" width="18" height="14"></d-image></div>
        </div>
      </div>
    </scroller>
    <div class="bottom-part">
      <div class="ensure-button"><text class="ensure-text" @click="ensureChooseStaffs">确定</text></div>
    </div>
  </wxc-popup>
</template>

<script>
import WxcPopup from '@/components/wxc/popup.vue'
import BackHead from '@/components/back/head.vue'
import loginApi from '@/utils/login'
import { mapMutations, mapState } from 'vuex'
import { native_eventStatistic } from '@/utils/deal_native'

export default {
  components: {
    WxcPopup,
    BackHead
  },
  created() {
    let self = loginApi.getLoginData()
    if(this.staffListState.length == 1 || this.staffListState.length == 0) {
      this.staffList.push({fullname: self.fullname, id: self.id, choose: true})
      this.requestStaffList()
    } else {
      let tStaffListState = this.deepCopy(Object.assign([], this.staffListState))
      this.staffList = tStaffListState
    }
    if(this.staffListState.length === this.choosedStaffs.idList.length && this.staffListState.length !== 1 && this.staffListState.length !== 0) {
      this.allChooseButton = true
    }
  },
  data() {
    return {
      staffListShow: true,
      staffList: [],
      allChooseButton: false
    }
  },
  computed: {
    ...mapState('calendar', [
      'staffListState',
      'choosedStaffs'
    ]),
    choosedNum: function() {  // 选中人数
      let num = 0
      for(let i in this.staffList) {
        this.staffList[i].choose && num++
      }
      return num
    }
  },
  methods: {
    ...mapMutations('calendar', [
      'setChoosedStaffs',
      'setStaffListState'
    ]),
    requestStaffList() {  // 获取组员列表
      this.requestApi.user_info({
        data: {
          rolesArray: 'WQG,WQG1,WQG2,wqg3',
          pageNo: 0,
          pageSize: 999
        },
        success: data => {
          if(data.list.length) {
            for(let i in data.list) {
              let tmpStaff = {
                fullname: data.list[i].fullname,
                id: data.list[i].id,
                choose: false
              }
              this.staffList.push(tmpStaff)
            }
          }
        }
      })
    },
    chooseThisStaff(staffIdx) { // 选中某个人
      this.staffList[staffIdx].choose = !this.staffList[staffIdx].choose
      this.allChooseButton = this.judgeIfChooseAll()
    },
    chooseAllStaffs() { // 全选
      native_eventStatistic('chooseAllStaffs','日历-运营主管全选选择人员');
      if(this.allChooseButton === true) {
        this.allChooseButton = false
        for(let i in this.staffList) {
          this.staffList[i].choose = false
        }
      } else {
        this.allChooseButton = true
        for(let i in this.staffList) {
          this.staffList[i].choose = true
        }
      }
    },
    resetChooseStaffs() { // 重置
      native_eventStatistic('resetChooseStaffs','日历-运营主管重置选择人员');
      this.allChooseButton = false
      for(let i in this.staffList) {
        this.staffList[i].choose = false
      }
      this.staffList[0].choose = true
    },
    ensureChooseStaffs() {  // 确定按钮
      native_eventStatistic('ensureChooseStaffs','日历-运营主管确定选择人员');
      let idList = []
      let nameList = []
      for(let i in this.staffList) {
        if(this.staffList[i].choose) {
          idList.push(this.staffList[i].id)
          nameList.push(this.staffList[i].fullname)
        }
      }
      let describe = this.describeNameList(nameList)
      let choosedStaffs = {
        idList,
        nameList,
        describe
      }
      let tStaffList = this.deepCopy(Object.assign([], this.staffList))
      this.setChoosedStaffs(choosedStaffs)
      this.setStaffListState(tStaffList)
      this.$emit('closeStaffList', false)
    },
    describeNameList (nameList) {
      if(nameList.length <= 3) {
        return nameList.join('、') || ''
      }else {
        return nameList[0] + '、' + nameList[1] + '、' + nameList[2] + '等'
      }
    },
    judgeIfChooseAll() {
      for(let i in this.staffList) {
        if(!this.staffList[i].choose) {
          return false
        }
      }
      return true
    },
    closeStaffList() {
      this.$emit('closeStaffList', false)
    },
    backClick() {
      this.$emit('closeStaffList', false)
    }
  }
}
</script>

<style src="../calendarcss.css"></style>
<style lang="scss" scoped>
.choose-title {
  height: 80px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 60px;
  padding-left: 60px;
}
.staff-title-part {
  flex-direction: row;
  align-items: center;
}
.staff-title-text {
  font-size: 28px;
  color: #21363D;
  margin-right: 20px;
}
.staff-num-text {
  font-size: 28px;
  color: #02B3B4
}
.reset-button {
  width: 116px;
  height: 52px;
  border-width: 2px;
  border-radius: 4px;
  border-color: #E5F7F7;
  align-items: center;
  justify-content: center;
  margin-left: 40px;
}
.reset-button-text {
  font-size: 28px;
  color: #02B3B4;
}
.staff-part-scroller {
  width: 1400px;
  height: 1290px;
}
.staff-part {
  flex-direction: row;
  flex-wrap: wrap;
  padding-right: 40px;
  padding-left: 40px;
  width: 1400px;
}
.choosed-staff {
  position: relative;
  height: 68px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 4px;
  border-color: #02B3B4;
  padding-right: 60px;
  padding-left: 60px;
  margin-right: 40px;
  margin-top: 40px;
  overflow: hidden;
}
.choosed-staff-text {
  font-size: 28px;
  color: #02B3B4;
}
.choosed-triangle {
  position: absolute;
  top: 30px;
  right: -34px;
  width: 68px;
  height: 68px;
  background-color: rgb(2, 179, 180);
  transform: rotate(-45deg);
}
.rotate-image {
  position: absolute;
  bottom: 8px;
  right: 4px;
}
.unchoosed-staff {
  height: 68px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 4px;
  border-color: #CACCCF;
  padding-right: 60px;
  padding-left: 60px;
  margin-right: 40px;
  margin-top: 40px;
}
.unchoosed-staff-text {
  font-size: 28px;
  color: #21363D;
}
.bottom-part {
  height: 128px;
  align-items: center;
  justify-content: center;
}
.ensure-button {
  width: 480px;
  height: 88px;
  background-color: #02B3B4;
  align-items: center;
  justify-content: center;
}
.ensure-text {
  font-size: 38px;
  color: #FFFFFF;
}
</style>
