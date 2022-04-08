import { getConfigFileName } from '@/../build/getConfigFileName'
import { GlobEnvConfig } from '@/types/config'
export function getAppEnvConfig(): Readonly<GlobEnvConfig> {
  const ENV_NAME = getConfigFileName(import.meta.env)

  const ENV = ((import.meta.env.VITE_APP_LOCALE
    ? ((import.meta.env as unknown) as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown) as GlobEnvConfig
  const {
    VITE_GLOB_APP_TITLE,
    VITE_PORT,
    VITE_PUBLIC_PATH,
    VITE_DROP_CONSOLE,
    VITE_APP_LOCALE,
    VITE_USE_IMAGEMIN,
    VITE_GLOB_APP_SHORT_NAME
  } = ENV

  return {
    VITE_GLOB_APP_TITLE,
    VITE_PORT,
    VITE_PUBLIC_PATH,
    VITE_DROP_CONSOLE,
    VITE_APP_LOCALE,
    VITE_USE_IMAGEMIN,
    VITE_GLOB_APP_SHORT_NAME
  }
}

export function getEnv(): string {
  return import.meta.env.MODE
}

export function isDevMode(): boolean {
  return import.meta.env.DEV
}

export function isProdMode(): boolean {
  return import.meta.env.PROD
}

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig()
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase()
}
