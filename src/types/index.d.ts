declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare type EmitType = (event: any, ...args: any[]) => void
