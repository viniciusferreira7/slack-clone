import dayjs from 'dayjs'

export function isYesterday(date: Date | string) {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
}
