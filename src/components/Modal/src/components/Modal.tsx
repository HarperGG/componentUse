import { NModal } from 'naive-ui'
import { defineComponent, toRefs, unref, useAttrs } from 'vue'
import { basicProps } from '../props'
import { extendSlots } from '@/utils/helper/tsxHelper'

export default defineComponent({
  name: 'Modal',
  inheritAttrs: false,
  props: basicProps,
  emits: ['on-update:show'],
  setup(props, { slots, emit }) {
    const { show, draggable, destroyOnClose } = toRefs(props)
    const attrs = useAttrs()

    const onUpdate = (value: boolean) => {
      emit('on-update:show', value)
    }

    return () => {
      const propsData = { ...unref(attrs), ...props, 'on-update:show': onUpdate } as Recordable
      return <NModal {...propsData} v-slots={propsData.content ?? extendSlots(slots)}></NModal>
    }
  }
})
