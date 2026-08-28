<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Remove } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '删除',
  type: 'error',
})
const emit = defineEmits(['delete'])
</script>
<template>
  <n-popconfirm @positive-click="emit('delete')">
    <template #trigger>
      <n-button v-bind="props">
        <template #icon>
          <n-icon><Remove /></n-icon>
        </template>
        {{ props.label }}
      </n-button>
    </template>
    是否确认{{ props.label ?? '删除' }}？
  </n-popconfirm>
</template>
