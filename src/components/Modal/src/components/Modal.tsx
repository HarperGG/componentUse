import { NModal } from 'naive-ui'
import { defineComponent, toRefs, unref } from 'vue'
import { basicProps } from '../props'
import { useModalDragMove } from '../hooks/useModalDrag'
import { useAttrs } from '@/hooks/core/useAttrs'
import { getSlot } from '@/utils/vue/resolve-slot'

export default defineComponent({
  name: 'Modal',
  inheritAttrs: false,
  props: basicProps,
  emits: ['cancel'],
  setup(props, { slots, emit }) {
    const { show, draggable, destroyOnClose } = toRefs(props)
    const attrs = useAttrs()
    useModalDragMove({
      visible: show,
      destroyOnClose,
      draggable
    })

    const onCancel = (e: Event) => {
      emit('cancel', e)
    }

    return () => {
      const propsData = { ...unref(attrs), ...props, onCancel } as Recordable
      return <NModal {...propsData}>{getSlot(slots)}</NModal>
    }
  }
})
