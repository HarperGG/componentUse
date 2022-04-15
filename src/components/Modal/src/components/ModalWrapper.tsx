import { NScrollbar, NSpin, SpinProps } from 'naive-ui'
import {
  defineComponent,
  ref,
  PropType,
  CSSProperties,
  computed,
  unref,
  nextTick,
  onMounted
} from 'vue'

export default defineComponent({
  name: 'ModalWrapper',
  inheritAttrs: false,
  props: {
    loading: { type: Boolean },
    minHeight: { type: Number, default: 0 },
    height: { type: Number },
    show: { type: Boolean },
    spinProps: { type: Object as PropType<Omit<SpinProps, 'show'>> }
  },
  setup(props) {
    const wrapperRef = ref<HTMLDivElement | null>(null)
    const spinRef = ref(null)

    const spinStyle = computed(
      (): CSSProperties => {
        return {
          minHeight: `${props.minHeight}px`,
          maxHeight: `${props.height}px`
        }
      }
    )
    const scrollbarStyle = computed(
      (): CSSProperties => {
        return {
          maxHeight: `${props.height}px`,
          paddingRight: '10px'
        }
      }
    )
    async function scrollTop() {
      nextTick(() => {
        const wrapperRefDom = unref(wrapperRef)
        if (!wrapperRefDom) return
        ;(wrapperRefDom as any)?.scrollTo?.(0)
      })
    }

    async function setModalHeight() {
      if (!props.show) return
      const wrapperRefDom = unref(wrapperRef)
      if (!wrapperRefDom) return
      const bodyDom = wrapperRefDom.$el.parentElement.parentElement.parentElement
      if (!bodyDom) return
      bodyDom.style.padding = '0'
    }

    onMounted(() => {
      setModalHeight()
    })
    return {
      scrollTop,
      wrapperRef,
      spinRef,
      spinStyle,
      scrollbarStyle
    }
  },
  render() {
    const { spinStyle, loading, spinProps, scrollbarStyle, $slots } = this
    return (
      <NSpin ref="spinRef" style={spinStyle} show={loading} {...spinProps}>
        <NScrollbar style={scrollbarStyle} ref="wrapperRef" v-slots={$slots} />
      </NSpin>
    )
  }
})
