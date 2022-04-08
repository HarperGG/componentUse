import { enableStorageEncryption, DEFAULT_CACHE_TIME } from '@/settings/encryptionSetting'
import { CreateStorageParams, createStorage as create } from './storageCache'
type Options = Partial<CreateStorageParams>
const createOptions = (storage: Storage, options: Options = {}) => {
  return {
    ...options,
    storage,
    hasEncrypt: enableStorageEncryption
  }
}

export const WebStorage = create(createOptions(sessionStorage))

export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => {
  return create(createOptions(storage, options))
}

export const createSessionStorage = (options: Options = {}) => {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export const createLocalStorage = (option: Options = {}) => {
  return createStorage(localStorage, { ...option, timeout: DEFAULT_CACHE_TIME })
}

export default WebStorage
