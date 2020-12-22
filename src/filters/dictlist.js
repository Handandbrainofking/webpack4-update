import * as config from '@/config'

export default function (type) {
  if (!type) {
    console.warn('dict filter 类型未指定')
    return []
  }

  const dictItems = config.Dist_List_Get(type)

  if (!dictItems) {
    console.warn(`dict filter 类型 ${type} 不存在`)
    return []
  }

  return dictItems
}
