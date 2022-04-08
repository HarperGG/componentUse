export function isNull(val: unknown): val is null {
  return val === null
}
export function isUndef(val: unknown): val is undefined {
  return val === undefined
}
export function isNullOrUndef(val: unknown): val is null | undefined {
  return isNull(val) || isUndef(val)
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

export function isBoolean(val: any): val is boolean {
  return is(val, 'Boolean')
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}
