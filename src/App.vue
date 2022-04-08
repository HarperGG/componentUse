<script lang="ts" setup>
import { ref } from 'vue'
import { zhCN } from 'naive-ui'
import HelloWorld from '@/components/HelloWorld.vue'

const theme = ref(null)
const namespace = ref('test')
const themeOverrides = {}
</script>

<template>
  <n-config-provider
    id="app"
    :theme="theme"
    :locale="zhCN"
    :theme-overrides="themeOverrides"
    :class="[namespace]"
  >
    <n-dialog-provider>
      <n-message-provider>
        <n-loading-bar-provider>
          <HelloWorld />
        </n-loading-bar-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
