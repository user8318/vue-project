<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Create } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '编辑',
  type: 'warning',
})
</script>
<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon><Create /></n-icon>
    </template>
    {{ props.label }}
  </n-button>
</template>
