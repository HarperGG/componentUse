<template>
  <Modal v-bind="getBindValue" @cancel="handleCancel">
    <template v-if="!$slots.headerExtra" #headerExtra>
      <ModalClose
        :can-fullscreen="getProps.canFullscreen"
        :full-screen="fullScreenRef"
        @cancel="handleCancel"
        @fullscreen="handleFullScreen"
      />
    </template>

    <template v-if="!$slots.footer" #footer>
      <ModalFooter v-bind="getBindValue" @ok="handleOk" @cancel="handleCancel"> </ModalFooter>
    </template>

    <ModalWrapper
      ref="modalWrapperRef"
      :use-wrapper="getProps.useWrapper"
      :full-screen="fullScreenRef"
      :loading="getProps.loading"
      :loading-tip="getProps.loadingTip"
      :min-height="getProps.minHeight"
      :height="getWrapperHeight"
      :show="showRef"
      v-bind="omit(getProps.wrapperProps, 'show', 'height', 'modalFooterHeight')"
      @ext-height="handleExtHeight"
      @height-change="handleHeightChange"
    >
      <slot></slot>
    </ModalWrapper>

    <template v-for="item in Object.keys(omit($slots, 'default'))" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Modal>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch,
  unref,
  watchEffect,
  toRef,
  getCurrentInstance,
  nextTick
} from 'vue'
import Modal from './components/Modal'
import ModalWrapper from './components/ModalWrapper.vue'
import ModalClose from './components/ModalClose.vue'
import ModalFooter from './components/ModalFooter.vue'
import { isFunction } from '@/utils/is'
import { deepMerge } from '@/utils/web/index'
import { basicProps } from './props'
import { useFullScreen } from './hooks/useModalFullScreen'
import { omit } from 'lodash-es'
import { ModalMethods, ModalProps } from './interface'

export default defineComponent({
  name: 'BasicModal',
  components: { Modal, ModalWrapper, ModalClose, ModalFooter },
  inheritAttrs: false,
  props: basicProps,
  emits: ['show-change', 'height-change', 'cancel', 'ok', 'register', 'update:show'],
  setup(props, { emit, attrs }) {
    const showRef = ref(false)
    const propsRef = ref<Partial<ModalProps> | null>(null)
    const modalWrapperRef = ref<any>(null)

    // modal   Bottom and top height
    const extHeightRef = ref(0)
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

    const { handleFullScreen, getWrapClassName, fullScreenRef } = useFullScreen({
      modalWrapperRef,
      extHeightRef,
      wrapClassName: toRef(getMergeProps.value, 'wrapClassName')
    })

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
          ...opt,
          wrapClassName: unref(getWrapClassName)
        }
      }
    )

    const getBindValue = computed(
      (): Recordable => {
        const attr = {
          ...attrs,
          ...unref(getMergeProps),
          show: unref(showRef),
          wrapClassName: unref(getWrapClassName)
        }
        if (unref(fullScreenRef)) {
          return omit(attr, ['height', 'title'])
        }
        return omit(attr, 'title')
      }
    )

    const getWrapperHeight = computed(() => {
      if (unref(fullScreenRef)) return undefined
      return unref(getProps).height
    })

    watchEffect(() => {
      showRef.value = !!props.show
      fullScreenRef.value = !!props.defaultFullscreen
    })

    // scrollTop
    watch(
      () => unref(showRef),
      (v) => {
        emit('show-change', v)
        emit('update:show', v)
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

    // 取消事件
    async function handleCancel(e: Event) {
      e?.stopPropagation()
      // // 过滤自定义关闭按钮的空白区域
      // if ((e.target as HTMLElement)?.classList?.contains(prefixCls + '-close--custom')) return;
      if (props.closeFunc && isFunction(props.closeFunc)) {
        const isClose: boolean = await props.closeFunc()
        showRef.value = !isClose
        return
      }

      showRef.value = false
      emit('cancel', e)
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
      if (Reflect.has(props, 'defaultFullscreen')) {
        fullScreenRef.value = !!props.defaultFullscreen
      }
    }

    function handleOk(e: Event) {
      emit('ok', e)
    }

    function handleHeightChange(height: string) {
      emit('height-change', height)
    }

    function handleExtHeight(height: number) {
      extHeightRef.value = height
    }

    function handleTitleDbClick(e) {
      if (!props.canFullscreen) return
      e.stopPropagation()
      handleFullScreen(e)
    }

    return {
      handleCancel,
      getBindValue,
      getProps,
      handleFullScreen,
      fullScreenRef,
      getMergeProps,
      handleOk,
      showRef,
      omit,
      modalWrapperRef,
      handleExtHeight,
      handleHeightChange,
      handleTitleDbClick,
      getWrapperHeight
    }
  }
})
</script>
