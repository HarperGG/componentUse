import { Fragment, isVNode, Slot, Slots, VNodeArrayChildren, VNodeChild } from 'vue'
import { isFunction } from '@/utils'

/**
 * @description:  Get slot to prevent empty error
 */
export function getSlot(slots: Slots, slot = 'default', data?: any) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}

/**
 * extends slots
 * @param slots
 * @param excludeKeys
 */
export function extendSlots(slots: Slots, excludeKeys: string[] = []) {
  const slotKeys = Object.keys(slots)

  const ret: any = {}
  slotKeys.map((key) => {
    if (excludeKeys.includes(key)) {
      return null
    }
    ret[key] = () => getSlot(slots, key)
  })
  return ret
}

export function resolveSlot(
  slot: Slot | undefined,
  fallback: () => VNodeArrayChildren
): VNodeArrayChildren {
  return (slot && ensureValidVNode(slot())) || fallback()
}

function ensureValidVNode(vnodes: VNodeArrayChildren): VNodeArrayChildren | null {
  return vnodes.some((child) => {
    if (!isVNode(child)) {
      return true
    }
    if (child.type === Comment) {
      return false
    }
    if (child.type === Fragment && !ensureValidVNode(child.children as VNodeArrayChildren)) {
      return false
    }
    return true
  })
    ? vnodes
    : null
}

export function resolveWrappedSlot(
  slot: Slot | undefined,
  wrapper: (children: VNodeArrayChildren | null) => VNodeChild
): VNodeChild {
  const children = slot && ensureValidVNode(slot())
  return wrapper(children || null)
}

export function isSlotEmpty(slot: Slot | undefined): boolean {
  return !(slot && ensureValidVNode(slot()))
}
