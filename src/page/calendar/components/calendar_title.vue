<template>
  <div class="calendar-title row">
    <div class="row" @click="changeCalendarType">
      <div :class="[isWeekCalendar ? 'choosed-calendar-type' : 'unchoosed-calendar-type']">
        <text :class="[isWeekCalendar ? 'choosed-calendar-type-text' : 'unchoosed-calendar-type-text']">周日历</text>
      </div>
      <div :class="[isWeekCalendar ? 'unchoosed-calendar-type' : 'choosed-calendar-type']">
        <text :class="[isWeekCalendar ? 'unchoosed-calendar-type-text' : 'choosed-calendar-type-text']">月日历</text>
      </div>
    </div>
    <div class="row center">
      <div class="pre-next-month" :style="prevBtnStyle()" @click="prevMonth">
        <d-image src="/image/arrow-left-focus.png" width="40" height="40"></d-image>
      </div>
      <text class="calendar-header-text">{{handleDate}}</text>
      <div class="pre-next-month" @click="nextMonth">
        <d-image src="/image/arrow-right-focus.png" width="40" height="40"></d-image>
      </div>
    </div>
    <div class="find-staff-width">
      <div class="row center find-staff" v-if="isYYZG">
        <text class="title-part">查看人员</text>
        <text class="choose-staff-part">{{choosedStaffs.describe||user.fullname}}{{choosedStaffs.nameList.length||1}}人</text>
        <div @click="chooseStaff"><d-image src="/image/icon-search.png" width="100" height="60"></d-image></div>
      </div>
    </div>
  </div>
</template>

<script>
import loginApi from '@/utils/login'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  props: {
    isWeekCalendar: {
      type: Boolean,
      default: true
    },
    currentMonth: {
      type: String,
      default: '2019年3月'
    }
  },
  created() {
    this.user = loginApi.getLoginData()
    this.$eventHub.$on('BroadcastChangedOrganization', this.resetStaffList)
  },
  data() {
    return {
      user: {}
    }
  },
  methods: {
    ...mapMutations('calendar', ['setChoosedStaffs', 'setStaffListState']),
    resetStaffList() {
      this.setChoosedStaffs({ idList: [this.user.id], nameList: [this.user.fullname], describe: this.user.fullname })
      this.setStaffListState([this.user.id])
    },
    changeCalendarType() {
      this.$emit('changeCalendarType')
    },
    prevMonth() {
      this.$emit('prevMonth')
    },
    nextMonth() {
      this.$emit('nextMonth')
    },
    chooseStaff() {
      this.$emit('chooseStaff')
    },
    isCurentMonth() {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth() + 1
      let monthYearTitle = year + '-' + month
      return monthYearTitle === this.currentMonth
    },
    isCurrentWeek() {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth() + 1
      let day = today.getDate()
      let monthYearTitle = year + '-' + month + '-' + day
      return monthYearTitle === this.currentMonth
    },
    prevBtnStyle() {
      if (this.isWeekCalendar) {
        if (this.isCurrentWeek()) {
          return { opacity: 0.3 }
        } else {
          return { opacity: 1 }
        }
      } else {
        if (this.isCurentMonth()) {
          return { opacity: 0.3 }
        } else {
          return { opacity: 1 }
        }
      }
    }
  },
  beforeDestroy() {
    this.$eventHub.$off('BroadcastChangedOrganization', this.resetStaffList)
  },
  computed: {
    ...mapGetters(['isYYZG']),
    ...mapState('calendar', ['choosedStaffs']),
    handleDate: function() {
      let dateArray = this.currentMonth.split('-')
      return dateArray[0] + '年' + dateArray[1] + '月'
    }
  }
}
</script>

<style src="../calendarcss.css"></style>
<style lang="scss" scoped>
.center {
  align-items: center;
}
.find-staff-width {
  width: 708px;
}
.find-staff {
  justify-content: flex-end;
}
.calendar-title {
  width: 2220px;
  height: 120px;
  border-radius: 4px;
  background-color: #ffffff;
  justify-content: space-between;
  align-items: center;
  padding-right: 60px;
  padding-left: 60px;
}
.choosed-calendar-type {
  width: 160px;
  height: 48px;
  border-width: 2px;
  border-style: solid;
  border-color: #62bfc2;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: #62bfc2;
}
.choosed-calendar-type-text {
  color: #ffffff;
  font-size: 30px;
}
.unchoosed-calendar-type {
  width: 160px;
  height: 48px;
  border-width: 2px;
  border-style: solid;
  border-color: #62bfc2;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.unchoosed-calendar-type-text {
  color: #62bfc2;
  font-size: 30px;
}
.pre-next-month {
  width: 120px;
  height: 100px;
  align-items: center;
  justify-content: center;
}
.pre-next-month:active {
  transition: background-color 0.2s;
  transition: border-radius 0.2s;
  background-color: #ebf0f6;
  border-radius: 0px;
}
.title-part {
  font-size: 30px;
  color: #21363d;
}
.choose-staff-part {
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #e5f7f7;
  border-radius: 4px;
  font-size: 28px;
  color: #02b3b4;
}
</style>
