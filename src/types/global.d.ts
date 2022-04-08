import {
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType
} from 'vue'

declare global {
  // vue
  type PropType<T> = VuePropType<T>
  type VueNode = VNodeChild | JSX.Element

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }
  interface Fn<T = any, R = T> {
    (...arg: T[]): R
  }

  type Nullable<T> = T | null
  type Recordable<T = any> = Record<string, T>
  type TupleToUnion<T extends any[]> = T[number]
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  type Indexable<T = any> = {
    [key: string]: T
  }
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  type TimeoutHandle = ReturnType<typeof setTimeout>
  type IntervalHandle = ReturnType<typeof setInterval>

  interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  interface WheelEvent {
    path?: EventTarget[]
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  interface ViteEnv {
    VITE_PORT: number
    VITE_PUBLIC_PATH: string
    VITE_GLOB_APP_TITLE: string
    VITE_DROP_CONSOLE: boolean
    VITE_APP_LOCAL: string
    VITE_USE_IMAGEMIN: string
  }

  interface basicServer {
    backend: string
    frontend: string
    urlPrefix?: string
    sso?: string
    ssoBackend?: string
  }
  interface deployConfig {
    development?: basicServer
    production?: basicServer
    test?: basicServer
  }

  interface basicServerConfig {
    [key: string]: any
    deploy?: deployConfig
  }

  function parseInt(s: string | number, radix?: number): number

  function parseFloat(string: string | number): number

  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface IntrinsicAttributes {
      [elem: string]: any
    }
  }

  interface Window {
    // Global vue app instance
    __GRPCWEB_DEVTOOLS__?: any
    __VUE_DEVTOOLS_GLOBAL_HOOK__?: any
    login?: boolean
    $message?: import('naive-ui').MessageApi
    $loadingBar?: import('naive-ui').LoadingBarApi
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}
