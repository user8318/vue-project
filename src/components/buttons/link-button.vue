<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Link } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '链接',
  type: 'success',
})
</script>
<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><Link /></n-icon>
    </template>
    {{ props.label }}
  </n-button>
</template>
