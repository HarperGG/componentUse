import { createLocalStorage, createSessionStorage } from './index'
import { DEFAULT_CACHE_TIME } from '@/settings/encryptionSetting'
import { Memory } from './memory'
import { ProjectConfig, tabProp, managaerItem, AccessKeyItem } from '@/types/config'
import {
  APP_LOCAL_CACHE_KEY,
  APP_SESSION_CACHE_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  LOGIN,
  PROJ_CFG_KEY,
  ACTIVE_HEADER_TAB,
  ACTIVE_APP_TAB,
  ACTIVE_LOG_TAB,
  APP_NAME,
  MANAGER_KEY,
  MANAGER_LIST,
  INIT_USER_INFO,
  ACCESSKEY_INFO
} from '@/enums/cacheEnum'
import { UserInfo } from '@/store/types'
import { toRaw } from 'vue'

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined
  [USER_INFO_KEY]: UserInfo
  [LOGIN]: boolean
  [PROJ_CFG_KEY]: ProjectConfig
  [ACTIVE_HEADER_TAB]: tabProp
  [ACTIVE_APP_TAB]: tabProp
  [ACTIVE_LOG_TAB]: tabProp
  [APP_NAME]: string
  [MANAGER_KEY]: string[]
  [MANAGER_LIST]: any
  [INIT_USER_INFO]: UserInfo
  [ACCESSKEY_INFO]: AccessKeyItem
}

type LocalStore = BasicStore

type SessionStore = BasicStore

export type BasicKeys = keyof BasicStore
type LocalKeys = keyof LocalStore
type SessionKeys = keyof SessionStore

const local = createLocalStorage()
const session = createSessionStorage()
const localMemory = new Memory(DEFAULT_CACHE_TIME)
const sessionMemory = new Memory(DEFAULT_CACHE_TIME)

function initPersistentMemory() {
  const localCache = local.get(APP_LOCAL_CACHE_KEY)
  const sessionCache = session.get(APP_SESSION_CACHE_KEY)
  localCache && localMemory.resetCache(localCache)
  sessionCache && sessionMemory.resetCache(sessionCache)
}
export class Persistent {
  static getLocal<T>(key: LocalKeys): T {
    return localMemory.get(key)?.value
  }
  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
    localMemory.set(key, toRaw(value))
    immediate && local.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
  }
  static removeLocal(key: LocalKeys, immediate = false): void {
    localMemory.remove(key)
    immediate && local.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
  }
  static clearLocal(immediate = false): void {
    localMemory.clear()
    immediate && local.clear()
  }

  static getSession<T>(key: SessionKeys) {
    return sessionMemory.get(key)?.value as Nullable<T>
  }

  static setSession(key: SessionKeys, value: SessionStore[SessionKeys], immediate = false): void {
    sessionMemory.set(key, toRaw(value))
    immediate && session.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
  }

  static removeSession(key: SessionKeys, immediate = false): void {
    sessionMemory.remove(key)
    immediate && session.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
  }
  static clearSession(immediate = false): void {
    sessionMemory.clear()
    immediate && session.clear()
  }

  static clearAll(immediate = false) {
    sessionMemory.clear()
    localMemory.clear()
    if (immediate) {
      local.clear()
      session.clear()
    }
  }
}

function storageChange(e: any) {
  const { key, newValue, oldValue } = e

  if (!key) {
    Persistent.clearAll()
    return
  }

  if (!!newValue && !!oldValue) {
    if (APP_LOCAL_CACHE_KEY === key) {
      Persistent.clearLocal()
    }
    if (APP_SESSION_CACHE_KEY === key) {
      Persistent.clearSession()
    }
  }
}

window.addEventListener('storage', storageChange)

initPersistentMemory()
