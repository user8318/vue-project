<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Search } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '查询',
  type: 'info',
})
</script>
<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><Search /></n-icon>
    </template>
    {{ props.label }}
  </n-button>
</template>
