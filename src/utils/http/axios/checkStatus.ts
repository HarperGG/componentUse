import { ApiCodeEnum } from '@/enums/httpEnum'
export function checkStatus(status: number, msg: string): void {
  let errMessage = ''

  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    case 401:
      errMessage = msg || ApiCodeEnum.errMsg401
      break
    case 403:
      errMessage = ApiCodeEnum.errMsg403
      break
    // 404请求不存在
    case 404:
      errMessage = ApiCodeEnum.errMsg404
      break
    case 405:
      errMessage = ApiCodeEnum.errMsg405
      break
    case 408:
      errMessage = ApiCodeEnum.errMsg408
      break
    case 500:
      errMessage = ApiCodeEnum.errMsg500
      break
    case 501:
      errMessage = ApiCodeEnum.errMsg501
      break
    case 502:
      errMessage = ApiCodeEnum.errMsg502
      break
    case 503:
      errMessage = ApiCodeEnum.errMsg503
      break
    case 504:
      errMessage = ApiCodeEnum.errMsg504
      break
    case 505:
      errMessage = ApiCodeEnum.errMsg505
      break
    default:
  }

  if (errMessage) {
    window.$message?.error(errMessage)
  }
}
