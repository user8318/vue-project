<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Close } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '取消',
})
</script>

<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><Close /></n-icon>
    </template>
    {{ label }}
  </n-button>
</template>
