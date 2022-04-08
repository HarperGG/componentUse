import moment from 'moment'
import config from '@/../build/config'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export function formatToDateTime(
  date: moment.MomentInput = undefined,
  format = DATE_TIME_FORMAT
): string {
  return moment(date).format(format)
}
export function convertTime(time) {
  if (!time) {
    return ''
  }
  const date = new Date(new Date(time).getTime() * 1000)
  const year = date.getFullYear()
  const mounth =
    (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
  const day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/'
  const hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const minutes = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return mounth + day + year + ' ' + hour + minutes + seconds
}

export function formatToDate(date: moment.MomentInput = undefined, format = DATE_FORMAT): string {
  return moment(date).format(format)
}

export function convertToTime(time) {
  if (!time) {
    return ''
  }
  const date = new Date(new Date(time).getTime() + config.UTC * 3600 * 1000)

  const nowDate = new Date()

  const year = date.getFullYear()
  const nowyear = nowDate.getFullYear()

  const mounth =
    (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
  const day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/'
  const hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const minutes = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return mounth + day + year + ' ' + hour + minutes + seconds
}
export function time_dis(direct_time) {
  // direct_time格式为yyyy-mm-dd hh:mm:ss 指定时间
  const now_time = Date.parse(new Date()) //当前时间的时间戳
  const end_time = Date.parse(new Date(direct_time)) //指定时间的时间戳
  if (end_time < now_time) {
    //  截止时间已过
    return 'already expired'
  } else {
    //计算相差天数
    const time_dis = end_time - now_time
    const years = Math.floor(time_dis / (24 * 3600 * 1000) / 365)

    const months = Math.floor(time_dis / (24 * 3600 * 1000) / 30)
    const days = Math.floor(time_dis / (24 * 3600 * 1000) - months * 30)

    //计算出小时数
    const leave1 = time_dis % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    const leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    const leave3 = leave2 % (60 * 1000) //计算小时数后剩余的毫秒数
    const second = leave3 / 1000
    if (years > 0) {
      return 'in ' + years + ' years'
    } else if (years === 0 && months > 0) {
      return 'in ' + months + ' months'
    } else if (years === 0 && months === 0 && days > 0) {
      return 'in ' + days + ' days'
    } else if (years === 0 && months == 0 && days == 0 && hours > 0) {
      return 'in ' + hours + ' hours'
    } else if (years === 0 && months == 0 && days == 0 && hours == 0 && minutes > 0) {
      return 'in ' + minutes + ' minutes'
    } else {
      return 'in ' + second + ' second'
    }
  }
}

export function time_dis_create(time) {
  time = time.split('+')[0]
  const date = typeof time === 'number' ? new Date(time) : new Date((time || '').replace(/-/g, '/'))

  const diff = Math.abs((new Date().getTime() - date.getTime()) / 1000)
  const dayDiff = Math.floor(diff / 86400)
  const isValidDate =
    Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())
  if (!isValidDate) {
    window.console.error('不是有效日期格式')
  }
  return (
    (dayDiff === 0 &&
      ((diff < 60 && Math.floor(diff % 60) + ' seconds ago') ||
        (diff < 120 && '1 minute ago') ||
        (diff < 3600 && Math.floor(diff / 60) + ' minutes ago') ||
        (diff < 7200 && '1 hour ago') ||
        (diff < 86400 && Math.floor(diff / 3600) + ' hours ago'))) ||
    (dayDiff === 1 && '1 day ago') ||
    (dayDiff < 31 && dayDiff + ' days ago') ||
    (dayDiff < 365 && dayDiff / 30 > 0 && Math.floor(dayDiff / 30) + ' months ago') ||
    (dayDiff / 365 > 0 && Math.floor(dayDiff / 365) + ' years ago')
  )
}
