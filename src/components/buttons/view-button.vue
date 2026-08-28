<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { SearchCircleOutline } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '查看',
  type: 'success',
})
</script>
<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><SearchCircleOutline /></n-icon>
    </template>
    {{ props.label }}
  </n-button>
</template>
