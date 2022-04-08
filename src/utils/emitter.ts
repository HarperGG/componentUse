export type EventType = string | symbol
export type Handler<T = any> = (event?: T) => void

export type EventHandlerList = Array<Handler>

export type EventHandlerMap = Map<EventType, EventHandlerList>

export interface Emitter {
  all: EventHandlerMap

  on<T = any>(type: EventType, handler: Handler<T>): void

  off<T = any>(type: EventType, handler: Handler<T>): void

  emit<T = any>(type: EventType, event?: T): void
  clear(): void
}
/**
 * emitter / pubsub.
 * @param {Emitter}
 * @returns {emitter}
 */

export default function emitter(events?: EventHandlerMap) {
  const $events = events || new Map()
  return {
    $events,
    on<T = any>(type: EventType, handler: Handler<T>) {
      const handlers = $events?.get(type)
      if (!handlers) return $events?.set(type, [handler])
      handlers.push(handler)
    },
    off<T = any>(type: EventType, handler: Handler<T>) {
      const handlers = $events?.get(type)
      if (handlers) handlers.splice(handlers.indexOf(handler) >>> 0, 1)
    },
    emit<T = any>(type: EventType, evt: T) {
      ;(($events?.get(type) || []) as EventHandlerList).slice().map((handler) => {
        handler(evt)
      })
    },
    clear() {
      this.$events.clear()
    }
  }
}
