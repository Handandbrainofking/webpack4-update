import { formatDate, http } from '@/store/common/utils'

export default {
  state: {
    currentItem: {},
    selectedYear: 0,
    selectedMonth: 0,
    selectedDay: 0,
    selectedDate: 0,
    staffListState: [],
    choosedStaffs: {
      idList: [],
      nameList: [],
      describe: ''
    }
  },
  mutations: {
    setCurrent(state, item) {
      state.currentItem = item
    },
    setCurrentDate(state, date) {
      state.selectedYear = date.getFullYear()
      state.selectedMonth = date.getMonth()
      state.selectedDay = date.getDay()
      state.selectedDate = date.getDate()
    },
    clearCurrentDate(state) {
      state.selectedYear = 0
      state.selectedMonth = 0
      state.selectedDay = 0
      state.selectedDate = 0
    },
    setChoosedStaffs(state, choosedStaffsList) {
      state.choosedStaffs.idList = choosedStaffsList.idList
      state.choosedStaffs.nameList = choosedStaffsList.nameList
      state.choosedStaffs.describe = choosedStaffsList.describe
    },
    setStaffListState(state, staffList) {
      state.staffListState = staffList
    }
  },
  actions: {
    getCalendarData(store, { userIds, startDate, endDate }) {
      return http
        .post('/bpmsx/order/appoint/v2/getMyAppointMatters', {
          userIds,
          startTime: formatDate(startDate, 'YYYY-MM-DD'),
          endTime: formatDate(endDate, 'YYYY-MM-DD')
        })
        .then(appointments => {
          // 取得当天的时间戳，用于判断事项是否为过期事项
          let today = new Date()
          let dateValue = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          ).valueOf()

          // 把已完成的排到后面
          // appointments = appointments.sort(x=>x.status);

          // 格式化数据，添加dayKey
          let keyedAppointments = appointments.map(item => {
            let timeSpanStart = Number(formatDate(item.appointTime, 'hh'))
            let padLeft = val =>
              ('' + val).length === 1 ? '0' + val : '' + val

            return {
              dayKey: Number(formatDate(item.appointTime, 'YYYYMMDD')),
              dayContent: {
                dayTodoKey: item.applyNo,
                appointTimeRange: `${padLeft(timeSpanStart)}:00 - ${padLeft(
                  timeSpanStart + 1
                )}:00`,
                sellerName: item.sellerName,
                salesUserName: item.salesUserName,
                appointAddress: item.appointAddress,
                productName: item.productName,
                handleUserName: item.handleUserName,
                matterName: item.matterName,
                matterKey: item.matterKey,
                applyNo: item.applyNo,
                isExpired: item.appointTime < dateValue,
                isDeleted: Number(item.status) === 2,
                isFinished: Number(item.status) === 1,
                isOngoing: Number(item.status) === 0,
                appointTime: formatDate(item.appointTime, 'hh:mm'),
                appointDateTime: formatDate(
                  item.appointTime,
                  'YYYY-MM-DD hh:mm'
                ),
                expireDays:
                  (dateValue -
                    new Date(
                      formatDate(item.appointTime, 'YYYY/MM/DD')
                    ).valueOf()) /
                  24 /
                  3600 /
                  1000, // 计算超期天数
                remark: item.remark
              }
            }
          })

          // 把数据变成字典的形式，更方便于的显示
          let appointmentsDict = {}
          for (let item of keyedAppointments) {
            if (!appointmentsDict[item.dayKey]) {
              appointmentsDict[item.dayKey] = {
                dayKey: item.dayKey,
                dayContent: []
              }
            }
            appointmentsDict[item.dayKey].dayContent.push(item.dayContent)
          }

          // 统一把已完成事项排序到未尾
          for (let key in appointmentsDict) {
            if (appointmentsDict.hasOwnProperty(key)) {
              let day = appointmentsDict[key]
              day.dayContent = (day.dayContent || []).sort(
                (itemA, itemB) => itemA.isFinished - itemB.isFinished
              )
            }
          }
          return appointmentsDict
        })
    },
    getWeekCalendarData(store, { userIds, startDate, endDate }) {
      return http
        .post('/bpmsx/order/appoint/v2/getMyAppointMatters', {
          userIds,
          startTime: formatDate(startDate, 'YYYY-MM-DD'),
          endTime: formatDate(endDate, 'YYYY-MM-DD')
        })
        .then(appointments => {
          // 取得当天的时间戳，用于判断事项是否为过期事项
          let today = new Date()
          let dateValue = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          ).valueOf()

          // 把已完成的排到后面
          // appointments = appointments.sort(x=>x.status);

          // 格式化数据，添加dayKey
          let keyedAppointments = appointments.map(item => {
            let timeSpanStart = Number(formatDate(item.appointTime, 'hh'))
            let padLeft = val =>
              ('' + val).length === 1 ? '0' + val : '' + val

            return {
              dayKey: Number(formatDate(item.appointTime, 'YYYYMMDDhh')),
              dayContent: {
                dayTodoKey: item.applyNo,
                appointTimeRange: `${padLeft(timeSpanStart)}:00 - ${padLeft(
                  timeSpanStart + 1
                )}:00`,
                sellerName: item.sellerName,
                salesUserName: item.salesUserName,
                handleUserName: item.handleUserName,
                appointAddress: item.appointAddress,
                productName: item.productName,
                matterName: item.matterName,
                matterKey: item.matterKey,
                applyNo: item.applyNo,
                isExpired: item.appointTime < dateValue,
                isDeleted: Number(item.status) === 2,
                isFinished: Number(item.status) === 1,
                isOngoing: Number(item.status) === 0,
                appointTime: formatDate(item.appointTime, 'hh:mm'),
                appointDateTime: formatDate(
                  item.appointTime,
                  'YYYY-MM-DD hh:mm'
                ),
                expireDays:
                  (dateValue -
                    new Date(
                      formatDate(item.appointTime, 'YYYY/MM/DD')
                    ).valueOf()) /
                  24 /
                  3600 /
                  1000, // 计算超期天数
                remark: item.remark
              }
            }
          })

          // 把数据变成字典的形式，更方便于的显示
          let appointmentsDict = {}
          for (let item of keyedAppointments) {
            if (!appointmentsDict[item.dayKey]) {
              appointmentsDict[item.dayKey] = {
                dayKey: item.dayKey,
                dayContent: []
              }
            }
            appointmentsDict[item.dayKey].dayContent.push(item.dayContent)
          }

          // 统一把已完成事项排序到未尾
          for (let key in appointmentsDict) {
            if (appointmentsDict.hasOwnProperty(key)) {
              let day = appointmentsDict[key]
              day.dayContent = (day.dayContent || []).sort(
                (itemA, itemB) => itemA.isFinished - itemB.isFinished
              )
            }
          }
          return appointmentsDict
        })
    },
    getOrderBasicInfo(store, applyNo) {
      return http.post(
        '/bpmsx/order/handle/v1/getApplyOrderTitleInfoByApplyNo',
        { applyNo }
      )
    },
    getAppointment(store, { applyNo, matterKey }) {
      return http.post('/bpmsx/order/appoint/v1/get', { applyNo, matterKey })
    },
    updateAppointment(store, data) {
      return http.post('/bpmsx/order/appoint/v1/appointSave', data)
    }
  },
  namespaced: true
}
