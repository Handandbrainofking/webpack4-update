<template>
  <div class="calendar-content column" @swipe="onSwipe">
    <div class="calendar-weekday row">
      <div v-for="(week, weekidx) in calendar" :key="week.dayKey">
        <div
          class="row center between-line"
          :class="[isWeekend(weekidx) ? 'weekend-title-width' : 'weekday-title-width']"
        >
          <div class="margin24">
            <text class="weekday-text fontweight3">{{ week.dayValue }}</text>
          </div>
          <div :class="[currentDate === week.dayKey ? 'week-is-today' : 'week-not-today']">
            <text
              class="weekday-text-small fontweight3"
              :class="[currentDate === week.dayKey ? 'week-today-text' : 'week-not-today-text']"
            >{{ week.dayNum }}</text>
          </div>
        </div>
      </div>
    </div>
    <list class="calendar-week-todo">
      <cell class="time-row" v-for="time in timeList" :key="time">
        <div class="time-titile">
          <text class="time-text">{{time}}:00</text>
        </div>
        <div class="time-day-row" v-for="(weekTodo, weekTodoidx) in calendar" :key="weekTodo.key">
          <div class="time-day-todo-card" :class="[isWeekend(weekTodoidx) ? 'weekend-content-width' : 'weekday-content-width']" @click="cardClick(weekTodo.key, time, getAppointments(weekTodo.key, time).length)">
            <div v-for="(dayTimeTodo, dayTimeTodoIdx) in getAppointments(weekTodo.key, time)" :key="dayTimeTodo.dayTodoKey" :class="[dayTimeTodo.isDeleted ? 'week-has-delete' : 'week-not-delete']">
              <div v-if="dayTimeTodoIdx < 2" :style="borderStyle(dayTimeTodo)" :class="['week-day-todo', 'yellow-border']">
                <div class="margin-top-4">
                  <text :style="nodeStyle(dayTimeTodo, 'matter')" class="week-thing-text">{{ handleMatterNameByType(dayTimeTodo.matterKey, dayTimeTodo.matterName) }}</text>
                </div>
                <div v-if="choosedStaffs.idList.length > 1" class="margin-top-4">
                  <text :style="nodeStyle(dayTimeTodo, 'nomatter')" class="week-person-text">{{ dayTimeTodo.handleUserName }}</text>
                </div>
                <div v-if="getAppointments(weekTodo.key, time).length == 1" class="margin-top-4">
                  <text :style="nodeStyle(dayTimeTodo, 'nomatter')" class="week-product-text">{{ dayTimeTodo.productName }}</text>
                </div>
                <div v-if="choosedStaffs.idList.length == 1 || choosedStaffs.idList.length == 0 || getAppointments(weekTodo.key, time).length == 1" class="margin-top-4">
                  <text :style="nodeStyle(dayTimeTodo, 'nomatter')" class="week-person-text">{{ dayTimeTodo.sellerName }}</text>
                </div>
              </div>
            </div>
            <div class="row" v-if="getAppointments(weekTodo.key, time).length > 2">
              <div class="flex1"></div>
              <div :class="ifLaterToday(weekTodo.dayKey, 'div')"><text :class="ifLaterToday(weekTodo.dayKey, 'text')">+{{getAppointments(weekTodo.key, time).length - 2}}</text></div>
            </div>
          </div>
        </div>
      </cell>
    </list>
  </div>
</template>

<script>
import dateFormatter from "@/filters/date";
// TODO 引入未使用 按需引入
import { debug } from 'util';
import { mapActions, mapMutations, mapState } from "vuex";
const _now = new Date();
const nowTime = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate());

export default {
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
  data() {
    return {
      currentDate: nowTime.valueOf(),
      _year: nowTime.getFullYear(),
      _month: nowTime.getMonth(),
      _day: nowTime.getDate(),
      calendar: {},
      weekDayAlias: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ],
      timeList: [
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20'
      ]
    };
  },
  computed: {
    ...mapState("calendar", ["choosedStaffs"])
  },
  mounted() {
    this._year = this.year;
    this._month = this.month;
    this._day = this.day;
    this.generateCalendar(this._year, this._month, this._day);
  },
  methods: {
    /**
     * 左滑下一个周，右滑上一个周
     */
    onSwipe(e) {
      if (Math.abs(e.displacementX) < 300) {
        return;
      }
      switch (e.direction) {
        case "left":
          this.$emit("nextWeek");
          break;
        case "right":
          this.$emit("prevWeek");
          break;
      }
    },
    /**
     *将年月转成字符串 (2018, 01, 01)===> '201801'
     */
    $_weekKey(year, month, day) {
      let _date = new Date(year, month, day);
      return (
        _date.getFullYear() * 10000 +
        (_date.getMonth() + 1) * 100 +
        _date.getDate()
      );
    },
    $_generateCalendar(year, month, day) {
      let result = [];
      let _date = new Date(year, month, day);
      let weekday = _date.getDay();

      for (let i = weekday; i >= weekday - 6; i--) {
        let _date = new Date(year, month, day - i);
        result.push({
          dayKey: _date.valueOf(),
          key: this.$_weekKey(year, month, day - i),
          dayNum: _date.getDate(),
          dayValue: this.weekDayAlias[_date.getDay()]
        });
      }
      return result;
    },
    generateCalendar(year, month, day) {
      let key = this.$_weekKey(year, month, day);
      this.calendar = this.$_generateCalendar(year, month, day);
      let from = dateFormatter(this.calendar[0].dayKey, "YYYY/MM/DD");
      let to = dateFormatter(
        this.calendar[6].dayKey + 24 * 3600 * 1000,
        "YYYY/MM/DD"
      ); //这个要加一天
      this.$emit("updated", {
        from,
        to,
        year: this._year,
        month: this._month,
        day: this._day
      });
    },
    getAppointments(key, time) {
      if(time.length === 1) {
        time = '0' + time
      }
      if (!this.appointments[key + time]) {
        return [];
      }
      let result = this.appointments[key + time].dayContent;
      return result;
    },
    updateDate(year, month, day) {
      let _date = new Date(year, month, day);
      this._year = _date.getFullYear();
      this._month = _date.getMonth();
      this._day = _date.getDate();
    },
    cardClick(key, time, length) {
      if(length > 1) {
        this.$emit('timeClick', key, time)
      } else if(length == 1) {
        this.$emit('appointmentClick', key, time)
      }
    },
    nodeStyle(node, section) {
      let result = {
        color: section === "matter" ? "#6525E4" : "#9368E7",
        opacity: 1
      };
      if (node.expireDays > 0 && !node.isOngoing) {
        result.color = "#9368E7";
        result.opacity = 0.6;
      } else if (node.expireDays > 0 && node.isOngoing) {
        result.color = "#EE5253";
        if(section === "nomatter") {
          result.color = "#F59798";
        }
      }
      if (node.isFinished) {
        result.textDecoration = "line-through";
        result.color = "#9368E7";
        result.opacity = 0.6;
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
        result.opacity = 0.6;
        result.backgroundColor = "#F9F7FE";
      } else if (node.expireDays > 0 && node.isOngoing) {
        result.borderLeftColor = "#EE5253";
        result.backgroundColor = "#FBF0F0";
      }
      if (node.isFinished) {
        result.borderLeftColor = "#9368E7";
        result.opacity = 0.6;
        result.backgroundColor = "#F9F7FE";
      }
      return result;
    },
    handleMatterNameByType(matterKey, matterName) {
      if (matterKey.split("other").length > 1) {
        return matterName.slice(0, 4) + "...";
      } else {
        return matterName;
      }
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
    isWeekend(idx) {
      if (idx === 0 || idx === 6) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    year(val) {
      this.updateDate(val, this._month, this._day);
      this.generateCalendar(this._year, this._month, this._day);
    },
    month(val) {
      this.updateDate(this._year, val, this._day);
      this.generateCalendar(this._year, this._month, this._day);
    },
    day(val) {
      this.updateDate(this._year, this._month, val);
      this.generateCalendar(this._year, this._month, this._day);
    },
    staffList(val) {
      this.generateCalendar(this._year, this._month, this._day);
    }
  }
};
</script>
<style src="../calendarcss.css"></style>
