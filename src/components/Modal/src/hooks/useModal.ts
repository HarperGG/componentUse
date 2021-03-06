import {
  UseModalReturnType,
  ModalMethods,
  ModalProps,
  ReturnMethods,
  UseModalInnerReturnType
} from '../types/modal'
import {
  ref,
  onUnmounted,
  unref,
  getCurrentInstance,
  reactive,
  watchEffect,
  nextTick,
  toRaw
} from 'vue'
import { isFunction } from '@/utils/is'
import { isEqual } from 'lodash-es'
import { tryOnUnmounted } from '@vueuse/core'
import { computed } from 'vue'

const dataTransfer = reactive<any>({})

const visibleData = reactive<{ [key: number]: boolean }>({})

/**
 * @description: Applicable to independent modal and call outside
 */
export function useModal(): UseModalReturnType {
  const modal = ref<Nullable<ModalMethods>>(null)
  const loaded = ref<Nullable<boolean>>(false)
  const uid = ref<string>('')

  function register(modalMethod: ModalMethods, uuid: string) {
    if (!getCurrentInstance()) {
      throw new Error('useModal() can only be used inside setup() or functional components!')
    }
    uid.value = uuid
    onUnmounted(() => {
      modal.value = null
      loaded.value = false
      dataTransfer[unref(uid)] = null
    })
    if (unref(loaded) && modalMethod === unref(modal)) return

    modal.value = modalMethod
    console.log(modal)
    loaded.value = true
    modalMethod.emitVisible = (visible: boolean, uid: number) => {
      visibleData[uid] = visible
    }
  }

  const getInstance = () => {
    const instance = unref(modal)
    if (!instance) {
      throw new Error('useModal instance is undefined!')
    }
    return instance
  }

  const methods: ReturnMethods = {
    setModalProps: (props: Partial<ModalProps>): void => {
      console.log('props', props)
      getInstance()?.setModalProps(props)
    },

    getVisible: computed((): boolean => {
      return visibleData[~~unref(uid)]
    }),

    redoModalHeight: () => {
      getInstance()?.redoModalHeight?.()
    },

    openModal: <T = any>(show = true, data?: T, openOnSet = true): void => {
      console.log(getInstance())
      getInstance()?.setModalProps({
        show
      })

      if (!data) return
      const id = unref(uid)
      if (openOnSet) {
        dataTransfer[id] = null
        dataTransfer[id] = toRaw(data)
        return
      }
      const equal = isEqual(toRaw(dataTransfer[id]), toRaw(data))
      if (!equal) {
        dataTransfer[id] = toRaw(data)
      }
    },

    closeModal: () => {
      getInstance()?.setModalProps({ show: false })
    }
  }
  return [register, methods]
}

export const useModalInner = (callbackFn?: Fn): UseModalInnerReturnType => {
  const modalInstanceRef = ref<Nullable<ModalMethods>>(null)
  const currentInstance = getCurrentInstance()
  const uidRef = ref<string>('')

  const getInstance = () => {
    const instance = unref(modalInstanceRef)
    if (!instance) {
      throw new Error('useModalInner instance is undefined!')
    }
    return instance
  }

  const register = (modalInstance: ModalMethods, uuid: string) => {
    tryOnUnmounted(() => {
      modalInstanceRef.value = null
    })
    uidRef.value = uuid
    modalInstanceRef.value = modalInstance
    currentInstance?.emit('register', modalInstance, uuid)
  }

  watchEffect(() => {
    const data = dataTransfer[unref(uidRef)]
    if (!data) return
    if (!callbackFn || !isFunction(callbackFn)) return
    nextTick(() => {
      callbackFn(data)
    })
  })

  return [
    register,
    {
      changeLoading: (loading = true) => {
        getInstance()?.setModalProps({ loading })
      },
      getVisible: computed((): boolean => {
        return visibleData[~~unref(uidRef)]
      }),

      changeOkLoading: (loading = true) => {
        getInstance()?.setModalProps({ confirmLoading: loading })
      },

      closeModal: () => {
        getInstance()?.setModalProps({ show: false })
      },

      setModalProps: (props: Partial<ModalProps>) => {
        getInstance()?.setModalProps(props)
      },

      redoModalHeight: () => {
        const callRedo = getInstance()?.redoModalHeight
        callRedo && callRedo()
      }
    }
  ]
}
