import { NButton, NSpace } from 'naive-ui'
import { computed, CSSProperties, defineComponent, unref } from 'vue'
import { basicProps } from '../props'

export default defineComponent({
  name: 'ModalAction',
  props: basicProps,
  emits: ['ok'],
  setup(props, { slots, emit }) {
    function handleOk(e: Event) {
      emit('ok', e)
    }
    return () => {
      const { actionText, okButtonProps, okType, confirmLoading } = props
      return (
        <NSpace justify="end">
          {slots?.insertAction?.()}
          <NButton
            {...okButtonProps}
            disabled={confirmLoading}
            size="small"
            loading={confirmLoading}
            onClick={handleOk}
            type={okType}
          >
            {actionText}
          </NButton>
          {slots?.appendAction?.()}
        </NSpace>
      )
    }
  }
})
