<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Copy } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '复制',
  type: 'info',
})
</script>
<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><Copy /></n-icon>
    </template>
    {{ props.label }}
  </n-button>
</template>
