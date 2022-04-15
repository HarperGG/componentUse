import {
  defineComponent,
  computed,
  ref,
  watch,
  unref,
  watchEffect,
  getCurrentInstance,
  nextTick
} from 'vue'
import Modal from './components/Modal'
import ModalWrapper from './components/ModalWrapper'
import ModalFooter from './components/ModalFooter'
import ModalAction from './components/ModalAction'
import { deepMerge, extendSlots, isFunction } from '@/utils'
import { basicProps } from './props'
import { omit } from 'lodash-es'
import { ModalMethods, ModalProps } from './types/modal'

export default defineComponent({
  name: 'BasicModal',
  components: { Modal, ModalWrapper, ModalFooter, ModalAction },
  inheritAttrs: false,
  props: basicProps,
  emits: ['show-change', 'height-change', 'onUpdate:show', 'onUpdateShow', 'ok', 'register'],
  setup(props, { emit, attrs, slots }) {
    const showRef = ref(false)
    const propsRef = ref<Partial<ModalProps> | null>(null)
    const modalWrapperRef = ref<any>(null)

    const modalMethods: ModalMethods = {
      setModalProps,
      emitVisible: undefined,
      redoModalHeight: () => {
        nextTick(() => {
          if (unref(modalWrapperRef)) {
            ;(unref(modalWrapperRef) as any).setModalHeight()
          }
        })
      }
    }

    const instance = getCurrentInstance()
    if (instance) {
      emit('register', modalMethods, instance.uid)
    }

    // Custom title component: get title
    const getMergeProps = computed(
      (): Recordable => {
        return {
          ...props,
          ...(unref(propsRef) as any)
        }
      }
    )

    // modal component does not need title and origin buttons
    const getProps = computed(
      (): Recordable => {
        const opt = {
          ...unref(getMergeProps),
          show: unref(showRef),
          okButtonProps: undefined,
          cancelButtonProps: undefined,
          title: undefined
        }
        return {
          ...opt
        }
      }
    )

    const getBindValue = computed(
      (): Recordable => {
        const attr = {
          ...attrs,
          ...unref(getMergeProps),
          show: unref(showRef)
        }
        return omit(attr)
      }
    )

    const isCard = computed(() => props.preset === 'card')
    watchEffect(() => {
      showRef.value = !!props.show
    })

    // scrollTop
    watch(
      () => unref(showRef),
      (v) => {
        emit('onUpdate:show', v)
        emit('onUpdateShow', v)
        instance && modalMethods.emitVisible?.(v, instance.uid)
        nextTick(() => {
          if (props.scrollTop && v && unref(modalWrapperRef)) {
            ;(unref(modalWrapperRef) as any).scrollTop()
          }
        })
      },
      {
        immediate: false
      }
    )

    // update
    function handleUpdateShow(value: boolean) {
      if (props['onUpdate:show'] && isFunction(props['onUpdate:show'])) {
        props['onUpdate:show']
        return (showRef.value = value)
      }
      showRef.value = false
      emit('onUpdate:show', value)
      emit('onUpdateShow', value)
    }

    /**
     * @description: 设置modal参数
     */
    function setModalProps(props: Partial<ModalProps>): void {
      // Keep the last setModalProps
      propsRef.value = deepMerge(unref(propsRef) || ({} as any), props)
      if (Reflect.has(props, 'show')) {
        showRef.value = !!props.show
      }
    }

    function handleOk(e: Event) {
      emit('ok', e)
    }

    return () => {
      return (
        <Modal
          {...unref(getBindValue)}
          v-slots={extendSlots(slots, [props.preset === 'card' ? 'default' : ''])}
          on-update-show={handleUpdateShow}
        >
          {props.preset === 'card' ? (
            <ModalWrapper
              ref={modalWrapperRef}
              loading={unref(getProps).loading}
              min-height={unref(getProps).minHeight}
              show={unref(showRef)}
              {...omit(unref(getProps).wrapperProps, 'show')}
            >
              {slots?.default?.()}
            </ModalWrapper>
          ) : null}
          {props.preset === 'card' && !slots.footer ? (
            <ModalFooter
              v-slots={slots}
              {...omit(unref(getBindValue), 'style')}
              onCancel={handleUpdateShow}
              onOk={handleOk}
            />
          ) : null}
          {props.preset === 'dialog' && !slots.action ? (
            <ModalAction
              v-slots={slots}
              {...omit(unref(getBindValue), 'style')}
              onCancel={handleUpdateShow}
              onOk={handleOk}
            />
          ) : null}
        </Modal>
      )
    }
  }
})
