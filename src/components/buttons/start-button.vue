<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Play } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '开始',
  type: 'info',
})
</script>

<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><Play /></n-icon>
    </template>
    {{ label }}
  </n-button>
</template>
