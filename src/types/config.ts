import { RouterTransitionEnum } from '@/enums/pageEnum'

export interface GlobEnvConfig {
  VITE_GLOB_APP_TITLE: string
  VITE_PORT: number
  VITE_PUBLIC_PATH: string
  VITE_DROP_CONSOLE: boolean
  VITE_APP_LOCALE: string
  VITE_USE_IMAGEMIN?: string
  VITE_GLOB_APP_SHORT_NAME: string
}

export interface GlobConfig {
  title: string
  shortName: string
  locale: string
}

export enum CacheTypeEnum {
  SESSION,
  LOCAL
}

export interface TransitionSetting {
  enable: boolean
  basicTransition: RouterTransitionEnum
  openPageLoading: boolean
  openNProgress: boolean
}

export interface tabProp {
  name: string
  url: string
  childrenUrl?: string[]
  active: boolean
  icon?: SVGElement | string
  children?: { name: string; value: string; active: boolean }[]
  shortName?: string
  value?: string
}
export interface AccessKeyItem {
  accessID: string
  accessSecret: string
}
export interface ProjectConfig {
  permissionCacheType: CacheTypeEnum
  headerTabs: tabProp[]
  appTabs: tabProp[]
  logTabs: tabProp[]
  transitionSetting: TransitionSetting
  removeAllHttpPending: boolean
  closeMessageOnSwitch: boolean
  useOpenBackTop: boolean
  openKeepAlive: boolean
  themeColor: string
  relateAppList: Array<{
    appName: string
    url: string
    applyLink: string
    description: string
  }>
}

export interface managaerItem {
  name: string
  group: string
  Description: string
  Email: string
}
