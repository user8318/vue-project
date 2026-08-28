<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Add } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '新增',
  type: 'info',
})
</script>
<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><Add /></n-icon>
    </template>
    {{ props.label }}
  </n-button>
</template>
