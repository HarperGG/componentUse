<template>
  <div :class="getClass">
    <template v-if="canFullscreen">
      <NTooltip v-if="fullScreen" title="restore" placement="bottom">
        <ScanOutline role="full" @click="handleFullScreen" />
      </NTooltip>
      <NTooltip v-else title="maximize" placement="bottom">
        <ScanOutline role="close" @click="handleFullScreen" />
      </NTooltip>
    </template>
    <NTooltip title="close" placement="bottom">
      <Close @click="handleCancel" />
    </NTooltip>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { ScanOutline, Close } from '@vicons/ionicons5'
import { NTooltip } from 'naive-ui'

export default defineComponent({
  name: 'ModalClose',
  components: { ScanOutline, Close, NTooltip },
  props: {
    canFullscreen: { type: Boolean, default: true },
    fullScreen: { type: Boolean }
  },
  emits: ['cancel', 'fullscreen'],
  setup(props, { emit }) {
    const prefixCls = 'basic-modal-close'

    const getClass = computed(() => {
      return [
        prefixCls,
        `${prefixCls}--custom`,
        {
          [`${prefixCls}--can-full`]: props.canFullscreen
        }
      ]
    })

    function handleCancel(e: Event) {
      emit('cancel', e)
    }

    function handleFullScreen(e: Event) {
      e?.stopPropagation()
      e?.preventDefault()
      emit('fullscreen')
    }

    return {
      getClass,
      prefixCls,
      handleCancel,
      handleFullScreen
    }
  }
})
</script>
<style lang="scss">
.basic-modal-close {
  display: flex;
  align-items: center;
  height: 95%;

  > span {
    margin-left: 48px;
    font-size: 16px;
  }

  &--can-full {
    > span {
      margin-left: 12px;
    }
  }

  &:not(&--can-full) {
    > span:nth-child(1) {
      &:hover {
        font-weight: 700;
      }
    }
  }

  & span:nth-child(1) {
    display: inline-block;
    padding: 10px;

    &:hover {
      color: $primaryColor;
    }
  }

  & span:last-child {
    &:hover {
      color: $primaryColor;
    }
  }
}
</style>
