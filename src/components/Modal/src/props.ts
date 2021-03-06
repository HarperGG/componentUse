import { MaybeArray } from 'naive-ui/lib/_utils'
import { CSSProperties, VNodeChild } from 'vue'
import { ButtonProps } from 'naive-ui'

export const modalProps = {
  show: { type: Boolean },
  scrollTop: { type: Boolean, default: true },
  height: { type: Number },
  minHeight: { type: Number },
  // open drag
  draggable: { type: Boolean, default: false },
  centered: { type: Boolean },
  cancelText: { type: String, default: 'cancel' },
  okText: { type: String, default: 'confirm' },
  actionText: { type: String, default: '确定' },

  destroyOnClose: { type: Boolean },
  confirmLoading: { type: Boolean },
  showCancelBtn: { type: Boolean, default: true },
  cancelButtonProps: Object as PropType<ButtonProps>,
  showOkBtn: { type: Boolean, default: true },
  okType: { type: String as PropType<ButtonType>, default: 'primary' },
  okButtonProps: Object as PropType<ButtonProps>
}

export const basicProps = Object.assign({}, modalProps, {
  show: Boolean,
  unstableShowMask: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  preset: String as PropType<'confirm' | 'dialog' | 'card'>,
  to: [String, Object] as PropType<string | HTMLElement>,
  displayDirective: {
    type: String as PropType<'if' | 'show'>,
    default: 'if'
  },
  transformOrigin: {
    type: String as PropType<'center' | 'mouse'>,
    default: 'center'
  },
  zIndex: Number,
  autoFocus: {
    type: Boolean,
    default: false
  },
  trapFocus: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  title: String,
  contentStyle: [Object, String] as PropType<CSSProperties | string>,
  headerStyle: [Object, String] as PropType<CSSProperties | string>,
  footerStyle: [Object, String] as PropType<CSSProperties | string>,
  embedded: Boolean,
  segmented: {
    type: [Boolean, Object] as PropType<boolean | Segmented>,
    default: false
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large' | 'huge'>,
    default: 'medium'
  },
  bordered: {
    type: Boolean,
    default: true
  },
  // 默认打开关闭功能
  closable: {
    type: Boolean,
    default: true
  },
  hoverable: Boolean,
  role: String,
  icon: Function as PropType<() => VNodeChild>,
  type: {
    type: String as PropType<'info' | 'success' | 'warning' | 'error' | 'default'>,
    default: 'default'
  },
  negativeText: String,
  positiveText: String,
  content: [String, Function] as PropType<string | (() => VNodeChild)>,
  action: Function as PropType<() => VNodeChild>,
  showIcon: {
    type: Boolean,
    default: true
  },
  loading: Boolean,
  iconPlacement: String as PropType<IconPlacement>,
  onClose: [Function, Array] as PropType<MaybeArray<() => void>>,
  // events
  onEsc: Function as PropType<() => void>,
  'onUpdate:show': [Function, Array] as PropType<MaybeArray<(value: boolean) => void>>,
  onUpdateShow: [Function, Array] as PropType<MaybeArray<(value: boolean) => void>>,
  onAfterEnter: Function as PropType<() => void>,
  onBeforeLeave: Function as PropType<() => void>,
  onAfterLeave: Function as PropType<() => void>,
  onPositiveClick: Function as PropType<() => Promise<boolean> | boolean | any>,
  onNegativeClick: Function as PropType<() => Promise<boolean> | boolean | any>,
  onMaskClick: Function as PropType<(e: MouseEvent) => void>
})

export interface Segmented {
  content?: boolean | 'soft'
  footer?: boolean | 'soft'
  action?: boolean | 'soft'
}

export type IconPlacement = 'left' | 'top'

export type ButtonType =
  | 'default'
  | 'tertiary'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
