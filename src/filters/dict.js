import * as config from '@/config'

export default function (value, type, emptyVal = '') {
  if (!type) {
    console.warn('dict filter 类型未指定')
    return emptyVal
  }

  const dictItems = config.Dist_List_Get(type)

  if (!dictItems) {
    console.warn(`dict filter 类型 ${type} 不存在`)
    return emptyVal
  }

  let dictItem = dictItems.find(x => x.key === value) || {}
  return dictItem.name || emptyVal
}
