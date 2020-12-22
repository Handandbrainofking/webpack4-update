<template>
  <div class="calendar-background column">
    <CalendarTitle  :currentMonth="currentMonth" :isWeekCalendar="true"
                    @changeCalendarType="changeCalendarType"
                    @prevMonth="prevWeek"
                    @nextMonth="nextWeek"
                    @chooseStaff="openStaffList"></CalendarTitle>
    <WeekCalendar ref="calendar" :year="thisYear" :month="thisMonth" :day="thisDay" :appointments ="calendarData" :staffList="choosedStaffs.idList"
                  @timeClick="clickMore"
                  @nextWeek="nextWeek"
                  @prevWeek="prevWeek"
                  @updated="updateDisplay"
                  @appointmentClick="toTodoInfo"></WeekCalendar>
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
// TODO 引入未使用
const modal = weex.requireModule("modal");
import { CalendarPage } from "../../router/defined";
import { mapActions, mapMutations, mapState } from "vuex";
import {native_eventStatistic,native_logMessage} from '@/utils/deal_native';
import CalendarTitle from "@/page/calendar/components/calendar_title.vue";
import WeekCalendar from "./components/WeekCalendar";
import StaffList from "@/page/calendar/components/choose_staff.vue";
import CalendarTodoList from "@/page/calendar/components/calendar_todo_list.vue";
import TodoInfo from "@/page/calendar/todoInfo.vue";

export default {
  name: "calender",
  statistics: 'weekCalender|周日历',
  components: {
    CalendarTitle,
    WeekCalendar,
    StaffList,
    CalendarTodoList,
    TodoInfo
  },
  data() {
    return {
      datetodoevery: [],
      clickdate: "",
      thisYear: 2018,
      thisMonth: 5,
      thisDay: 23,
      ifDelete: "b",
      currentMonth: "",
      calendarData: [],
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
    ...mapState("calendar", [
      "selectedYear",
      "selectedMonth",
      "selectedDay",
      "selectedDate",
      "choosedStaffs"
    ])
  },
  methods: {
    ...mapActions("calendar", ["getCalendarData", "getWeekCalendarData"]),
    ...mapMutations("calendar", [
      "setCurrent",
      "setCurrentDate",
      "clearCurrentDate"
    ]),
    /**
     * 初始化日历的状态
     */
    initView() {
      //初始化当前日历的状态
      var today = new Date();
      this.thisYear = this.selectedYear || today.getFullYear();
      this.thisMonth = this.selectedMonth || today.getMonth();
      this.thisDay = this.selectedDate || today.getDate();
      this.clearCurrentDate();
    },
    /**
     * 显示上一周
     */
    prevWeek() {
      if (this.isCurrentWeek()) {
        return;
      } else {
        native_eventStatistic('preWeek','周日历-上一周（weekCalendar.vue）');
        this.thisDay = this.thisDay - 7;
      }
    },
    isCurrentWeek(){
      var today = new Date();
      return this.thisYear == today.getFullYear() &&  this.thisMonth === today.getMonth() && this.thisDay === today.getDate();
    },
    /**
     * 显示下一周
     */
    nextWeek() {
      native_eventStatistic('nextWeek','周日历-下一周（weekCalendar.vue）');
      this.thisDay = this.thisDay + 7;
    },
    /**
     * 切换到月日历模式
     */
    changeCalendarType() {
      native_eventStatistic('toMonthCalendar','周日历-月日历（weekCalendar.vue）');
      this.$router.push(CalendarPage);
    },
    /**
     * 把时间转换成键值
     * @param {date} 日期对象
     * @returns 格式为 YYYYMMDD (如：20180809) 的字符串
     */
    dayKey(date) {
      return (
        date.getFullYear() * 10000 +
        (date.getMonth() + 1) * 100 +
        date.getDate()
      );
    },
    /**
     * 将键值转找成date
     * @param {key} 格式为 YYYYMMDD (如：20180809) 的键值字符串
     * @returns Date 返回日期
     */
    keyDay(key) {
      key = "" + key;
      key = key.replace(/(\d{4})(\d{2})(\d{2})/, "$1/$2/$3");
      return new Date(key);
    },
    /**
     * 刷新显示，下一周，上一周，初始化显示等等
     */
    updateDisplay({ from, to, year, month, day }) {
      this.currentMonth = `${year}-${month + 1}-${day}`;
      this.thisYear = year;
      this.thisMonth = month;
      this.thisDay = day;
      this.getWeekCalendarData({
        userIds: this.choosedStaffs.idList,
        //获取当前日历的待办，并把待办合并到日历中。
        startDate: from,
        endDate: to ////这个API有边界问题，不包含结尾时间
      }).then(data => {
        this.calendarData = data
        //  提交到百度统计
        this.commitStastics()
      });
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
    clickMore(key, time) {
      if(time.length === 1) {
        time = '0' + time
      }
      this.datetodoevery = this.calendarData[key + time].dayContent || [];
      let month = Math.floor((key % 10000) / 100);
      let day = key % 100;
      this.clickdate = month + "月" + day + "日" + time + "时";
      this.openTodoList()
    },
    /**
     * 跳转到待办编辑页面
     */
    toTodoInfo(key, time, items) {
      if(time.length === 1) {
        time = '0' + time
      }
      let item = items || this.calendarData[key + time].dayContent[0]
      //过去任务仅显示，不可点击查看
      if (item.isOngoing) {
        this.setCurrent(item);
        this.setCurrentDate(
          new Date(this.thisYear, this.thisMonth, this.thisDay)
        );
        native_eventStatistic('toTodoInfoWeek','周日历-待办预约编辑（weekCalendar.vue）');
        this.openTodoInfo()
      }
    }
  }
};
</script>

<style src="./calendarcss.css"></style>
<style lang="scss" scoped>
</style>
