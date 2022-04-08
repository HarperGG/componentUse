import { getServerAddress } from '@/hooks/setting/useServerSetting'
import { AxiosTransform, CreateAxiosOptions } from './Axios'
import { AxiosResponse } from 'axios'
import { deepMerge, authenticateUser } from '@/utils'
import { VAxios } from './Axios'
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum'
import { RequestOptions, Result } from '@/types/axios'
import { isString } from '@/utils/is'
import { formatRequestDate, joinTimestamp, setObjToUrlParams } from './helper'
import { checkStatus } from './checkStatus'
import { checkError } from './checkError'
import { ApiCodeEnum } from '@/enums/httpEnum'

const apiAddress = getServerAddress()

const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse } = options

    if (isReturnNativeResponse) {
      return res
    }

    if (!isTransformResponse) {
      return res.data
    }

    const { data } = res
    if (!data) {
      throw new Error('api Request Failed')
    }
    const hasSuccess = data && Reflect.has(data, 'bearerToken') && Reflect.has(data, 'uid')
    if (hasSuccess) return data
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = false, urlPrefix } = options

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data
          config.params = params
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 允许注入cookie
    config.withCredentials = true

    // 请求之前处理config
    // const token = getToken()
    // if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
    //   // jwt token
    //   ;(config as Recordable).headers.Authorization = options.authenticationScheme
    //     ? `${options.authenticationScheme} ${token}`
    //     : token
    // }
    return config
  },
  responseInterceptorsCatch: (error: any) => {
    const { response, code, message } = error || {}
    const msg: string = response?.data?.error?.message ?? ''
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = ApiCodeEnum.apiTimeoutMessage
      }
      if (err?.includes('Network Error')) {
        errMessage = ApiCodeEnum.networkExceptionMsg
      }
      if (errMessage) {
        window.$message?.error(errMessage)
        return Promise.reject(error)
      }
      // if (code !== 0 || code !== 1) {
      //   window.$message?.error(msg)
      // }
    } catch (error) {
      throw new Error((error as unknown) as string)
    }
    checkStatus(error?.response?.status, msg)
    checkError(error?.response?.status, error?.response?.data)
    return Promise.reject(error)
  }
}

export function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 60 * 1000,
        headers: {
          'Content-Type': ContentTypeEnum.JSON
        },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: false,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型, 暂时只是 message, dialog类型暂时没开发
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: apiAddress.backend,
          urlPrefix: apiAddress.urlPrefix,
          //  是否加入时间戳
          joinTime: false,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true
        }
      },
      opt || {}
    )
  )
}

export const defHttp = createAxios()
