import { ModalProps as NaiveModalProps, ButtonProps } from 'naive-ui'
import { ComputedRef } from 'vue'

export interface BasicModalProps {
  defaultFullscreen: boolean
  confirmLoading: boolean
  okButtonProps: ButtonProps
  okType: string
  showOkBtn: boolean
  cancelButtonProps: ButtonProps
  showCancelBtn: boolean
  destroyOnClose: boolean
  canFullscreen: boolean
}
export type ModalProps = BasicModalProps & NaiveModalProps

export interface ModalWrapperProps {
  footerOffset?: number
  loading: boolean
  modalHeaderHeight: number
  modalFooterHeight: number
  minHeight: number
  height: number
  visible: boolean
  fullScreen: boolean
  useWrapper: boolean
}

export interface ModalMethods {
  setModalProps: (props: Partial<ModalProps>) => void
  emitVisible?: (visible: boolean, uid: number) => void
  redoModalHeight?: () => void
}

export type RegisterFn = (modalMethods: ModalMethods, uuid?: string) => void

export interface ReturnMethods extends ModalMethods {
  openModal: <T = any>(props?: boolean, data?: T, openOnSet?: boolean) => void
  closeModal: () => void
  getVisible?: ComputedRef<boolean>
}

export type UseModalReturnType = [RegisterFn, ReturnMethods]

export interface ReturnInnerMethods extends ModalMethods {
  closeModal: () => void
  changeLoading: (loading: boolean) => void
  changeOkLoading: (loading: boolean) => void
  getVisible?: ComputedRef<boolean>
  redoModalHeight: () => void
}

export type UseModalInnerReturnType = [RegisterFn, ReturnInnerMethods]
