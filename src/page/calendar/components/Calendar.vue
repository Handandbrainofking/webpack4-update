<template>
    <div :class="['calendar-content', 'column']">
      <div :class="['month-calendar-weekday', 'row']">
        <div :key="k" v-for="(week,k) in ['日', '一', '二', '三', '四', '五', '六']" :class="['between-line', isWeekend(k) ? 'month-weekend-title-width' : 'month-weekday-title-width']">
          <text class="weekday-text">{{'星期'+week}}</text>
        </div>
      </div>
      <div :class="['calendar-week', 'row']" v-for="(week, idx) in currentMonthCalendar" :key="`calendar-week-${idx}`" @swipe="onSwipe">
        <div v-for="(day, dayIdx) in week" :key="day.dayKey" @click="cardClick(day.key, getAppointments(day.key).length)" :class="['calendar-day', isWeekend(dayIdx) ? 'month-weekend-title-width' : 'month-weekday-title-width']">
          <div class="calendar-weekdate">
            <div :class="[currentDate == day.dayKey ? 'is-today' : 'not-today']">
              <text :class="['weekdate-text',currentDate == day.dayKey && 'today-text',  'fontweight3']">{{day.dayNum}}</text>
            </div>
          </div>
          <div v-for="appointment in getAppointments(day.key, 2)" :key="appointment.dayTodoKey">
            <div :style="borderStyle(appointment)" :class="['calendar-todo','row', 'flex1', 'yellow-border']">
              <div class="width120 margin-right14"><text :class="nodeStyle(appointment, 'todo-thing-text', 'fontweight3', 'overflow')">{{ handleMatterNameByType(appointment.matterKey, appointment.matterName) }}</text></div>
              <div v-if="choosedStaffs.idList.length == 1 || choosedStaffs.idList.length == 0"><text :class="nodeStyle(appointment, 'todo-thing-text', 'fontweight3', 'overflow')">{{ appointment.sellerName }}</text></div>
              <div v-if="choosedStaffs.idList.length > 1"><text :class="nodeStyle(appointment, 'todo-thing-text', 'fontweight3', 'overflow')">{{ appointment.handleUserName }}</text></div>
            </div>
          </div>
          <div class="row" v-if="getAppointments(day.key).length > 2">
            <div class="flex1"></div>
            <div :class="ifLaterToday(day.dayKey, 'div')"><text :class="ifLaterToday(day.dayKey, 'text')">+{{ getAppointments(day.key).length - 2 }}</text></div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import dateFormatter from '@/filters/date'
// TODO 引入未使用
import { mapActions, mapMutations, mapState } from "vuex";
const _now = new Date();
const nowTime = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate());

export default {
  data() {
    return {
      currentDate: nowTime.valueOf(),
      _year: nowTime.getFullYear(),
      _month: nowTime.getMonth(),
      _day: nowTime.getDate(),
      calendar: {}
    };
  },
  computed: {
    currentMonthCalendar() {
      return this.calendar[this.$_monthKey(this._year, this._month)];
    },
    ...mapState("calendar", ["choosedStaffs"])
  },
  watch: {
    staffList(val) {
      this.generateCalendar(this._year, this._month);
    }
  },
  mounted() {
    this._year = this.year;
    this._month = this.month;
    this._day = this.day;

    this.generateCalendar(this._year, this._month);
  },
  props: {
    year: {
      type: Number,
      default: nowTime.getFullYear()
    },
    month: {
      type: Number,
      default: nowTime.getMonth()
    },
    day: {
      type: Number,
      default: nowTime.getDate()
    },
    appointments: {
      type: Object,
      default: {}
    },
    staffList: {
      type: Array,
      default: []
    }
  },
  methods: {
    /**
     *将年月转成字符串 (2018, 01)===> '201801'
     */
    $_monthKey(year, month) {
      return "" + (year * 100 + month);
    },
    $_dayKey(year, month, day){
        // return year * 10000 + (month + 1) * 100 + day
        let _date = new Date(year, month, day)
        return _date.getFullYear()*10000+(_date.getMonth()+1)*100+_date.getDate();
    },
    $_prevMonth(year, month) {
      const prevYear = month === 1 ? year - 1 : year;
      const prevMonth = month === 1 ? 12 : month - 1;
      return { prevYear, prevMonth };
    },
    $_nextMonth(year, month) {
      const nextYear = month === 12 ? year + 1 : year;
      const nextMonth = month === 12 ? 1 : month + 1;
      return { nextYear, nextMonth };
    },
    /**
     * private method
     * 根据年月生成日历
     */
    $_generateCalendar(year, month) {
      //返回的日历展示的所有日期数的有序数组
      let schema = [];
      let result = [];

      //这个月的一号和最后一号
      let firstDayOfMonth = new Date(year, month, 1);
      let lastDayOfMonth = new Date(year, month + 1, 0);
      //这个月的一号和最后一号分别对应的星期数(0->7, 1->1, 2->2, 3->3, 4->4, 5->5, 6->6)和这个月的日期数
      let weekDayOfFirsDay = firstDayOfMonth.getDay();
      let weekDayOfLastDay = lastDayOfMonth.getDay();
      let thisMonthDayNum = lastDayOfMonth.getDate();
      //日历中上个月结尾（同一周）的数据显示
      for (let i = weekDayOfFirsDay; i > 0; i--) {
        let _date = new Date(year, month, 1 - i);
        let key = this.$_dayKey(_date.getFullYear(), _date.getMonth(), _date.getDate());
        let preDate = {
          key,
          dayKey: _date.valueOf(),
          dayNum: _date.getDate()
        };
        schema.push(preDate);
      }
      //日历中本月数据处理
      for (let day = 1; day <= thisMonthDayNum; day++) {
        let _date = new Date(year, month, day);
        let key = this.$_dayKey(_date.getFullYear(), _date.getMonth(), _date.getDate());
        let temp = {
          key,
          dayKey: _date.valueOf(),
          dayNum: day
        };
        schema.push(temp);
      }
      //日历中对下个月的个头（同一周）数据处理
      for (let day = 1; day <= 6 - weekDayOfLastDay; day++) {
        let _date = new Date(year, month + 1, day);
        let key = this.$_dayKey(_date.getFullYear(), _date.getMonth(), _date.getDate());
        let nextDate = {
          key,
          dayKey: _date.valueOf(),
          dayNum: _date.getDate()
        };
        schema.push(nextDate);
      }

      //把数据划成一个4*7的二维数组，按一周一个子数组的方式，方便进行展示
      for (let i = 0; i < schema.length; i++) {
        let month_index = Math.floor((i + 0.001) / 7);
        result[month_index] = result[month_index] || [];
        result[month_index].push(schema[i]);
      }
      return result;
    },
    /**
     * 根据年月生成日历，包含上一个月，下一个月
     */
    generateCalendar(year, month) {
      //生成当前的日历
      const key = this.$_monthKey(year, month);
      let calendarData = this.$_generateCalendar(year, month);
      this.$set(this.calendar, key, calendarData);

      //生成上一个月日历
      const { prevYear, prevMonth } = this.$_prevMonth(year, month);
      const prevKey = this.$_monthKey(prevYear, prevMonth);
      let prevCalendarData = this.$_generateCalendar(prevYear, prevMonth);
      this.$set(this.calendar, prevKey, prevCalendarData);

      //生成下一个月日历
      const { nextYear, nextMonth } = this.$_nextMonth(year, month);
      const nextKey = this.$_monthKey(nextYear, nextMonth);
      let nextCalendarData = this.$_generateCalendar(nextYear, nextMonth);
      this.$set(this.calendar, nextKey, nextCalendarData);

      let from =dateFormatter(calendarData[0][0].dayKey, 'YYYY/MM/DD')
      let to = dateFormatter(calendarData[4][6].dayKey + 24*3600*1000, 'YYYY/MM/DD')//这个要加一天

      this.$emit('updated', {from, to, year: this._year, month: this._month})
    },
    /**
     * 生成上一个月日历
     * @return {year, month} 更新后的年和月
     */
    prevMonth() {
      //生成上一个月日历
      const { prevYear, prevMonth } = this.$_prevMonth(this._year, this._month);
      this._year = prevYear;
      this._month = prevMonth;
      this.generateCalendar(this._year, this._month);
      return { year: this._year, month: this._month };
    },
    /**
     * 生成下一个月日历
     * @return {year, month} 更新后的年和月
     */
    nextMonth() {
      //生成上一个月日历
      const { nextYear, nextMonth } = this.$_nextMonth(this._year, this._month);
      this._year = nextYear;
      this._month = nextMonth;
      this.generateCalendar(this._year, this._month);
      return { year: this._year, month: this._month };
    },
    getAppointments(key, count = 1000) {
      if (!this.appointments[key]) {
        return [];
      }
      let result = this.appointments[key].dayContent;
      return result.slice(0, count);
    },
    /**
     * 取得日期的年部分 如：2018-01-01 ===> 2018
     */
    timeDeal(e) {
      var eshow = e.split("-");
      return eshow[0];
    },
    /**
     * 左滑下一个月，右滑上一个月
     */
    onSwipe(e){
      if(e.direction === 'left'){
        this.$emit('nextMonth')
      }else if(e.direction === 'right'){
        this.$emit('prevMonth')
      }
    },
    handleMatterNameByType(matterKey, matterName) {
      if(matterKey.split("other").length > 1) {
        return matterName.slice(0, 4) + '...'
      }else {
        return matterName
      }
    },
    cardClick(key, length) {
      if(length > 1) {
        this.$emit('dayClick', key)
      } else if(length == 1) {
        this.$emit('appointmentClick', key)
      }
    },
    nodeStyle(node, ...extClass) {
      let result = extClass;
      if (node.expireDays > 0 && !node.isOngoing) {
        result.push("expired");
      } else if (node.expireDays > 0 && node.isOngoing) {
        result.push("expired-warming");
      }
      if (node.isFinished) {
        result.push(node.isFinished ? "has-delete" : "not-delete");
      }
      return result;
    },
    ifLaterToday(day, type) {
      let result = [];
      if(type === 'div') {
        if(day < this.currentDate) {
          result.push("before-more-week");
        } else {
          result.push("more-week");
        }
      }else {
        if(day < this.currentDate) {
          result.push("before-more-week-text");
        } else {
          result.push("more-week-text");
        }
      }
      return result;
    },
    borderStyle(node) {
      let result = {
        borderLeftColor: "#9368E7",
        opacity: 1,
        backgroundColor: "#F9F7FE"
      };

      if (node.expireDays > 0 && !node.isOngoing) {
        result.borderLeftColor = "#9368E7";
        result.opacity = 1;
        result.backgroundColor = "#F9F7FE";
      } else if ( node.expireDays >0 && node.isOngoing ) {
        result.borderLeftColor = "#EE5253";
        result.backgroundColor = "#FBF0F0";
      }

      if (node.isFinished) {
        result.borderLeftColor = "#9368E7";
        result.opacity = 0.4;
      }

      return result;
    },
    isWeekend(idx) {
      if (idx === 0 || idx === 6) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style src="../calendarcss.css"></style>
<!-- // TODO 空语句块不要引入，增加解析 -->
<style scoped>
</style>
