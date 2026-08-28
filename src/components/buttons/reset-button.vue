<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Refresh } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '重置',
})
</script>
<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><Refresh /></n-icon>
    </template>
    {{ props.label }}
  </n-button>
</template>
