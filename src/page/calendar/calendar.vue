<template>
  <div class="calendar-background column">
    <CalendarTitle  :currentMonth="currentMonth" :isWeekCalendar="false"
                    @changeCalendarType="changeCalendarType"
                    @prevMonth="prevMonth"
                    @nextMonth="nextMonth"
                    @chooseStaff="openStaffList"></CalendarTitle>
    <calendar ref="calendar" :year="thisYear" :month="thisMonth" :appointments ="calendarData" :staffList="choosedStaffs.idList"
              @dayClick="clickMore"
              @nextMonth="nextMonth"
              @prevMonth="prevMonth"
              @updated="loadAppointments"
              @appointmentClick="toTodoInfo"></calendar>
    <StaffList  v-if="showStaffList"
                @closeStaffList="closeStaffList"></StaffList>
    <CalendarTodoList :clickdate="clickdate" :datetodoevery="datetodoevery"
                      v-if="showCalendarTodoList"
                      @closeTodoList="closeTodoList"
                      @appointmentClick="toTodoInfo"></CalendarTodoList>
    <TodoInfo v-if="showTodoInfo"
              @closeTodoInfo="closeTodoInfo"></TodoInfo>
  </div>
</template>

<script>

import { WeekCalendarPage } from "@/router/defined";
import { mapActions, mapMutations, mapState } from "vuex";
import {native_eventStatistic,native_logMessage} from '@/utils/deal_native';
import CalendarTitle from "@/page/calendar/components/calendar_title.vue";
import Calendar from "@/page/calendar/components/Calendar.vue";
import StaffList from "@/page/calendar/components/choose_staff.vue";
import CalendarTodoList from "@/page/calendar/components/calendar_todo_list.vue";
import TodoInfo from "@/page/calendar/todoInfo.vue";

export default {
  name: "calender",
  statistics: 'calender|月日历',
  components: {
    CalendarTitle,
    Calendar,
    StaffList,
    CalendarTodoList,
    TodoInfo
  },
  data() {
    return {
      calendarData: {},
      datetodoevery: [],
      clickdate: "",
      thisYear: 2018,
      thisMonth: 3,
      thisDay: 23,
      weekday: 1,
      showStaffList: false,
      showCalendarTodoList: false,
      showTodoInfo: false
    };
  },
  created() {
    this.initView();
  },
  beforeDestroy() {
    this.setCurrent(null);
  },
  computed: {
    currentMonth: function() {
      var tempCalendar = new Date(this.thisYear, this.thisMonth, 1);
      var year = tempCalendar.getFullYear();
      var month = tempCalendar.getMonth() + 1;
      var monthYearTitle = year + "-" + month;
      return monthYearTitle;
    },
    ...mapState("calendar", [
      "selectedYear",
      "selectedMonth",
      "selectedDay",
      "selectedDate",
      "choosedStaffs"
    ])
  },
  methods: {
    ...mapActions("calendar", ["getCalendarData"]),
    ...mapMutations("calendar", [
      "setCurrent",
      "setCurrentDate",
      "clearCurrentDate"
    ]),
    initView() {  // 初始化当前日历的状态
      var today = new Date();
      this.thisYear = this.selectedYear || today.getFullYear();
      this.thisMonth = this.selectedMonth || today.getMonth();
      this.thisDay = this.selectedDate || today.getDate();
      this.weekday = this.selectedDay || today.getDay();
      this.clearCurrentDate();
    },
    changeCalendarType() {  // 切换周日历-月日历
      native_eventStatistic('toWeekCalendar','月日历-周日历（calendar.vue）');
      this.$router.push(WeekCalendarPage);
    },
    isCurentMonth() { // 判断是否是当前月
      var today = new Date();
      return this.thisYear === today.getFullYear() && this.thisMonth === today.getMonth();
    },
    nextMonth(){  // 点击下一月
      native_eventStatistic('nextMonth','月日历-下一月（calendar.vue）');
      this.$refs.calendar.nextMonth()
    },
    prevMonth(){  // 点击上一月
      if(!this.isCurentMonth()){
        native_eventStatistic('preMonth','月日历-上一月（calendar.vue）');
        this.$refs.calendar.prevMonth()
      }
    },
    loadAppointments({year, month, from, to }) {  // 加载预约数据
      this.thisYear = year;
      this.thisMonth = month;
      this.getCalendarData({
        userIds: this.choosedStaffs.idList,
        startDate: from,
        endDate: to
      }).then(data => {
        this.calendarData = data;
        //  提交到百度统计
        this.commitStastics()
      });
    },
    nodeStyle(node, ...extClass) {
      let result = extClass;
      if (node.expireDays > 0) {
        result.push("expired");
      }
      if (node.isFinished) {
        result.push(node.isFinished ? "has-delete" : "not-delete");
      }
      return result;
    },
    openStaffList() {
      native_eventStatistic('chooseStaffList','运营主管打开查看人员列表（calendar.vue）');
      this.showStaffList = true
    },
    closeStaffList() {
      this.showStaffList = false
    },
    openTodoList() {
      this.showCalendarTodoList = true
    },
    closeTodoList() {
      this.showCalendarTodoList = false
    },
    openTodoInfo() {
      this.showTodoInfo = true
    },
    closeTodoInfo() {
      this.showTodoInfo = false
    },
    clickMore(key) {  // 显示指定时间的待办列表
      native_eventStatistic('calendarTodoList','月日历-待办预约列表（calendar.vue）');
      this.datetodoevery = this.calendarData[key].dayContent || [];
      let month = Math.floor((key % 10000) / 100);
      let day = key % 100;
      this.clickdate = month + "月" + day + "日";
      this.openTodoList()
    },
    toTodoInfo(key, time, items) {  // 显示待办详情
      let item = items || this.calendarData[key].dayContent[0]
      if (item.isOngoing) {
        this.setCurrent(item);
        this.setCurrentDate(new Date(this.thisYear, this.thisMonth, 1));
        native_eventStatistic('toTodoInfoMonth','月日历-待办预约编辑（calendar.vue）');
        this.openTodoInfo()
      }
    }
  }
};
</script>

<style src="./calendarcss.css"></style>