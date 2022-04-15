import { NButton, NSpace } from 'naive-ui'
import { computed, CSSProperties, defineComponent, unref } from 'vue'
import { basicProps } from '../props'

export default defineComponent({
  name: 'ModalFooter',
  props: basicProps,
  emits: ['ok', 'cancel'],
  setup(props, { slots, emit }) {
    function handleOk(e: Event) {
      emit('ok', e)
    }

    function handleCancel(e: Event) {
      emit('cancel', e)
    }
    const footerContainerStyle = computed(
      (): CSSProperties => {
        return {
          padding: '28px 0',
          borderTop: '1px solid var(--n-border-color)',
          width: '100%'
        }
      }
    )
    return () => {
      const {
        cancelText,
        okText,
        showCancelBtn,
        cancelButtonProps,
        okButtonProps,
        showOkBtn,
        okType,
        confirmLoading
      } = props
      return (
        <NSpace style={unref(footerContainerStyle)} justify="end">
          {slots?.insertFooter?.()}
          {showCancelBtn ? (
            <NButton {...cancelButtonProps} disabled={confirmLoading} onClick={handleCancel}>
              {cancelText}
            </NButton>
          ) : null}
          {slots?.centerFooter?.()}
          {showOkBtn ? (
            <NButton
              {...okButtonProps}
              disabled={confirmLoading}
              loading={confirmLoading}
              onClick={handleOk}
              type={okType}
            >
              {okText}
            </NButton>
          ) : null}
          {slots?.appendFooter?.()}
        </NSpace>
      )
    }
  }
})
