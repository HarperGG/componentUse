import { cacheCipher } from '@/settings/encryptionSetting'

import { AesEncryption, EncryptionParams } from '@/utils/factory/cipher'
import { isNullOrUndef } from '@/utils/is'
export interface CreateStorageParams extends EncryptionParams {
  storage: Storage
  timeout?: Nullable<number>
  hasEncrypt?: boolean
}

export const createStorage = ({
  storage = sessionStorage,
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = false
}: Partial<CreateStorageParams> = {}) => {
  if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!')
  }
  const encryption = new AesEncryption({ key, iv })

  const WebStorage = class WebStorage {
    private storage: Storage
    private encryption: AesEncryption
    private hasEncrypt: boolean

    constructor() {
      this.storage = storage
      this.encryption = encryption
      this.hasEncrypt = hasEncrypt
    }

    set(storageKey: string, value: any, expire: number | null = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: !isNullOrUndef(expire) ? new Date().getTime() + expire * 1000 : null
      })
      const stringifyData = this.hasEncrypt ? this.encryption.encryptByAES(stringData) : stringData
      this.storage.setItem(storageKey, stringifyData)
    }
    get(storageKey: string, defaultVal: any = null): any {
      const val = this.storage.getItem(storageKey)
      if (!val) return defaultVal
      try {
        const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val
        const data = JSON.parse(decVal)
        const { value, expire } = data
        if (isNullOrUndef(expire) || expire >= new Date().getTime()) {
          return value
        }
        this.remove(storageKey)
      } catch (err) {
        return defaultVal
      }
    }
    remove(storageKey: string) {
      this.storage.removeItem(storageKey)
    }
    clear(): void {
      this.storage.clear()
    }
  }
  return new WebStorage()
}
