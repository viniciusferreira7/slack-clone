import dayjs from 'dayjs'

export function isToday(date: Date | string) {
  return dayjs(date).isSame(dayjs(), 'day')
}
