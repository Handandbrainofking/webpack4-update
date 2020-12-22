import { formatDate } from '@/store/common/utils'

export default function (date, format) {
  if (date === undefined || date === null) {
    return ''
  }
  return formatDate(date, format)
}
