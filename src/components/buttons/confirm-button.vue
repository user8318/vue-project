<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Checkmark } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '确认',
  type: 'info',
})
</script>
<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><Checkmark /></n-icon>
    </template>
    {{ props.label }}
  </n-button>
</template>
