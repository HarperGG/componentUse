<template>
  <BasicModal
    :style="bodyStyle"
    :mask-closable="false"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <n-card
      style="width: 600px"
      title="模态框"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        噢！
      </template>
      内容
      <template #footer>
        尾部
      </template>
    </n-card>
  </BasicModal>
</template>
<script lang="ts" setup>
import { BasicModal, useModalInner } from './Modal'
import { unref, ref, computed } from 'vue'
const value = ref('123')
const isUpdate = ref(true)

const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
  setModalProps({ confirmLoading: false })
})

const bodyStyle = {
  width: '600px'
}
const segmented = {
  content: 'soft',
  footer: 'soft'
} as const

function handleOk() {
  console.log(ok)
}
function onPositiveClick() {
  console.log(123)
}
function onNegativeClick() {
  console.log(1344)
}
async function handleSubmit() {
  await setModalProps({ confirmLoading: true })
  setModalProps({ loading: true })

  setTimeout(() => {
    setModalProps({ confirmLoading: false })
    setModalProps({ loading: false })
  }, 3000)
  // closeModal()
}

const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))
</script>
