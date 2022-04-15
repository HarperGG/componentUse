<template>
  <div>
    <NButton style="margin: 100px 100px;" size="large" @click="handleOpen"> Modal</NButton>
    <NButton @click="handleOpenTest"> ModalTest</NButton>
    <TestModal @register="registerModal"></TestModal>
    <n-modal v-model:show="showRef">
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
        <NScrollbar ref="wrapperRef" style="max-height: 200px">
          <NSpin ref="spinRef" show="loading">
            <n-input v-model:value="value" type="text" placeholder="基本的 Input" />
            <n-input v-model:value="value" type="textarea" placeholder="基本的 Textarea" />
            <n-input v-model:value="value" type="text" placeholder="基本的 Input" />
            <n-input v-model:value="value" type="textarea" placeholder="基本的 Textarea" />
            <n-input v-model:value="value" type="text" placeholder="基本的 Input" />
            <n-input v-model:value="value" type="textarea" placeholder="基本的 Textarea" />
          </NSpin>
        </NScrollbar>
        <template #footer>
          尾部
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
<script lang="ts" setup>
import TestModal from './TestModal.vue'
import { useModal } from './Modal'
import { NButton } from 'naive-ui'
import { ref } from 'vue'

const [registerModal, { openModal }] = useModal()

const showRef = ref(false)

function handleOpen() {
  openModal()
}
function handleSuccess() {
  console.log('handleSuccess')
}
function handleOpenTest() {
  showRef.value = true
}
</script>
