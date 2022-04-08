import { defineAsyncComponent } from 'vue'
import { NSpin } from 'naive-ui'

interface Options {
  size?: 'small' | 'medium' | 'large' | number
  delay?: number
  timeout?: number
  loading?: boolean
  retry?: boolean
}
export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const { size = 'small', delay = 100, timeout = 30000, loading = false, retry = true } = options
  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? <NSpin size={size}></NSpin> : undefined,
    timeout,
    delay,
    onError: !retry
      ? () => {}
      : (error, retryFn, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            retryFn()
          } else {
            fail()
          }
        }
  })
}
