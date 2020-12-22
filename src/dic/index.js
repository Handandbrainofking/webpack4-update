/**
 * function: 获取字典数据
 * author  : wq
 * update  : 2018/6/6 20:36
 */
import {
  DEFINE_DISC_LIST,
  DEFINE_PROVINCE_CITY,
  native_common_events,
  native_module_events,
  native_logMessage
} from '@/utils/deal_native'
// import { discArr } from '../../static/config/dict.js'
// import { ProvinceCity } from '../../static/config/city.js'

const distItem = (function () {
  const obj = {}
  return {
    setDiscItem(key, value) {
      obj[key] = value
    },
    getDiscItem(key) {
      return obj[key]
    }
  }
}())

export const getDiscList = (...args) => {
  return new Promise(function (resolve, reject) {
    if (args.length < 1) {
      throw new Error('params error')
    }
    const list = []
    const obj = {}
    let tmp, tmpValue
    for (let i in args) {
      if ((tmpValue = distItem.getDiscItem(tmp = args[i]))) {
        obj[tmp] = tmpValue
      } else {
        list.push(tmp)
      }
    }
    if (list.length > 0) {
      try {
        native_common_events(DEFINE_DISC_LIST, list).then(data => {
          let tdata = (typeof data === 'string' && JSON.parse(data)) || data || []
          if (!Array.isArray(tdata)) {
            tdata = []
          }
          for (let j in list) {
            var filterValue = tdata.filter(item => {
              let tItem = (typeof item === 'string' && JSON.parse(item)) || item || {}
              return tItem.type === list[j]
            })
            // if (!filterValue || filterValue.length === 0) {
            //   native_logMessage('当前key=' + list[j] + '  没有找到对应的数据字典，然后去本地文件中读取')
            //
            //   const locationData = discArr || []
            //
            //   filterValue = locationData.filter(item => {
            //     let tItem = (typeof item === 'string' && JSON.parse(item)) || item || {}
            //     return tItem.type === list[j]
            //   })
            //   native_logMessage('当前key=' + list[j] + '  本地文件中读取的数据是==' + JSON.stringify(filterValue))
            //
            // }
            distItem.setDiscItem(list[j],
              obj[list[j]] = filterValue.map(item => {
                let tItem = (typeof item === 'string' && JSON.parse(item)) || item || {}
                return ({
                  key: tItem.value,
                  name: tItem.label,
                  sort: tItem.sort
                })
              }).sort((item1, item2) => item1.sort - item2.sort)
            )
          }
          resolve(obj)
        })
          .catch(() => {
            native_logMessage('字典获取  异常')
            const tdata = window.discArr || []
            for (let j in list) {
              const filterValue = tdata.filter(item => {
                let tItem = (typeof item === 'string' && JSON.parse(item)) || item || {}
                return tItem.type === list[j]
              })
              distItem.setDiscItem(list[j], obj[list[j]] = filterValue.map(item => {
                let tItem = (typeof item === 'string' && JSON.parse(item)) || item || {}
                return ({
                  key: tItem.value,
                  name: tItem.label,
                  sort: tItem.sort
                })
              }).sort((item1, item2) => item1.sort - item2.sort))
            }
            resolve(obj)
          })
      } catch (e) {
        resolve(obj)
      }
    } else {
      resolve(obj)
    }
  }).catch((msg) => {
    throw new Error(msg)
  })
}

export const getDiscCity = (province = '', city = '') => {
  return new Promise(function (resolve, reject) {
    let tmpValue
    if ((tmpValue = distItem.getDiscItem('ProvinceCity'))) {
      resolve(tmpValue)
    } else {
      try {
        native_module_events(DEFINE_PROVINCE_CITY, province, city).then(data => {
          let tdata = (typeof data === 'string' && JSON.parse(data)) || data || []
          if (!Array.isArray(tdata)) {
            tdata = []
          }
          distItem.setDiscItem('ProvinceCity', tdata)
          resolve(tdata)
        }).catch(() => {
          const list = window.ProvinceCity || {}
          distItem.setDiscItem('ProvinceCity', list)
          resolve(list)
        })
      } catch (e) {
        resolve([])
      }
    }
  }).catch((msg) => {
    throw new Error(msg)
  })
}
