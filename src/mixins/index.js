import { native_logMessage } from '../utils/deal_native'
import { DealProductCode, NoDealProductCode, CashProductCode, InsuranceProductCode, ProductKindList, Dist_List_Get } from '@/config'

const compareObj = function (a, b) {
  if (a === b) {
    return true
  }
  if (a === undefined || a === null) {
    return false
  }
  if (typeof a === 'object' && typeof b === 'object' && JSON.stringify(a) === JSON.stringify(b)) {
    return true
  }
  return false
}

export default {
  methods: {
    getDict(name) {
      const dictItems = Dist_List_Get(name) || []
      return dictItems
    },
    getDictItem(name, key) {
      const dictItems = this.getDict(name)
      const result = dictItems.find(item => item.key === key) || {}
      return result || {}
    },
    // 对象比较
    compareObj(...args) {
      return compareObj(...args)
    },
    filterListData(data, filter) {
      const needData = filter || []
      const tdata = data || []
      return tdata.map((item) => {
        const list = []
        let i = 0
        while (i < needData.length) {
          list.push(item[needData[i++]])
        }
        return list
      })
    },

    // 获取对象的值，如果对象是字符串，则直接返回字符串
    getValue(obj, key = 'key') {
      if (!obj) {
        return ''
      }
      if (typeof obj === 'string') {
        return obj
      } else {
        return obj[key]
      }
    },

    // 获取数据值对应的key值， 注意内容是完全匹配，调用的时候需要注意字符串和数字
    filterKey(obj, value) {
      const _obj = obj || {}
      for (let i in _obj) {
        if (obj[i] === value) {
          return i
        }
      }
      return null
    },

    // 从数组中根据key获取对应的位置
    getIndexByKeyFromArray(arr, key, name = 'key') {
      if (!key && key !== 0 && key !== false) {
        return -1
      }
      for (let i in arr) {
        if (arr[i][name] === key) {
          return Number(i)
        }
      }
      return -1
    },
    // 获取bool值的对应的index
    getIndexByBool(bool) {
      if (typeof bool !== 'boolean') {
        return 0
      }
      return 1 - bool
    },
    // 获取数组中的key通过查询name
    getKeyByName(arr, key, name = 'name', keyName = 'key') {
      let tmp
      for (let i in arr) {
        tmp = this.getValue(arr[i], name)
        if (tmp === key) {
          return this.getValue(arr[i], keyName)
        }
      }
      return ''
    },
    getItemByName(arr, key, name = 'key') {
      let tmp
      for (let i in arr) {
        tmp = this.getValue(arr[i], name)
        if (tmp === key) {
          return arr[i]
        }
      }
      return null
    },
    // 在config列表中寻找某一个名称的数据对象
    findItemByNameBlock(list, name, block) {
      list = list || []
      for (let i = 0, len = list.length; i < len; i++) {
        if (compareObj(list[i].key, name)) {
          if (!block || list[i].block === block) {
            return list[i]
          }
        }
      }
      return {}
    },
    deepCopy(data) {
      const tdata = data
      let obj
      if (typeof tdata !== 'object') {
        return tdata
      }
      if (tdata === null) {
        return tdata
      }
      if (Object.prototype.toString.call(tdata) === '[object Array]') {
        obj = []
        for (let i in tdata) {
          obj.push(this.deepCopy(tdata[i]))
        }
      } else {
        obj = {}
        for (let i in tdata) {
          if (tdata.hasOwnProperty(i)) {
            obj[i] = (this.deepCopy(tdata[i]))
          }
        }
      }
      return obj
    },
    toJSON(obj) {
      return (typeof obj === 'string' && JSON.parse(obj)) || obj || {}
    },
    formatDate(_date, format = 'YYYY-MM-DD hh:mm') {
      let dateObj = null
      if (_date) {
        // eslint-disable-next-line
        if (Number(_date) == _date) {
          dateObj = new Date(_date)
        } else {
          return _date
        }
      } else {
        return ''
      }
      var date = {
        'M+': dateObj.getMonth() + 1,
        'd+': dateObj.getDate(),
        'D+': dateObj.getDate(),
        'h+': dateObj.getHours(),
        'm+': dateObj.getMinutes(),
        's+': dateObj.getSeconds(),
        'q+': Math.floor((dateObj.getMonth() + 3) / 3),
        'S+': dateObj.getMilliseconds()
      }
      if (/(y+|Y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in date) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1
            ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
        }
      }
      return format
    },
    // 判断当前月份所属季度并返回该季度开始日期和结束日期 返回日期格式是'YYYY-MM-DD'
    getSeasonByMonth() {
      let season = {}
      let today = new Date()
      let thisYear = today.getFullYear()
      let thisMonth = today.getMonth()
      if (thisMonth < 3) {
        season.startTime = thisYear + '-01-01'
        season.endTime = thisYear + '-03-31'
      } else if (thisMonth < 6) {
        season.startTime = thisYear + '-04-01'
        season.endTime = thisYear + '-06-30'
      } else if (thisMonth < 9) {
        season.startTime = thisYear + '-07-01'
        season.endTime = thisYear + '-09-30'
      } else {
        season.startTime = thisYear + '-10-01'
        season.endTime = thisYear + '-12-31'
      }
      return season
    },
    // 判断产品的交易类型
    isDealProduct(productCode) {
      const item = ProductKindList[productCode]
      return item.kind % 2 === 1
    },
    // 判断产品的現金類型
    isInsuranceProduct(productCode) {
      const item = ProductKindList[productCode]
      return item.kind > 20
    },
    // 判断是否及时贷产品
    isJsdProduct(productCode) {
      const item = ProductKindList[productCode]
      return [5, 6, 7, 8].indexOf(item.index) > -1
    },
    getDealProductCode() {
      return DealProductCode
    },
    getNoDealProductCode() {
      return NoDealProductCode
    },
    getCashProductCode() {
      return CashProductCode
    },
    getInsuranceProductCode() {
      return InsuranceProductCode
    },
    getProductType(productCode) {
      const item = ProductKindList[productCode]
      return Math.pow(2, item.index)
    },
    isEmpty(data) {
      if (data === null || data === undefined || data === '') {
        return true
      }
      return false
    },
    extend(target = {}, source = {}) {
      return {...target, ...source}
    },
    /**
     * 输出原生的消息
     * @param  {...any} args logs
     */
    nativeLog(...args) {
      if (!this.isNative()) return
      const messages = ['web message : ', ...args]
      native_logMessage(messages.join(' '), 'info')
    },
    isNative() {
      return WXEnvironment.platform !== 'Web'
    }
  }
}
