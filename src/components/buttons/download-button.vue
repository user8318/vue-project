<script setup lang="ts">
import type { BaseButtonProps } from '@/types'
import { Download } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '下载',
  type: 'primary',
  round: true,
  secondary: true,
  strong: true,
  url: '',
  data: () => ({}),
})
const downloading = ref(false)
const isLoading = computed(() => props.loading || downloading.value)
const handleDownload = useLoading(downloading)(async () => {
  await downloadFile(props.url, props.data, props.filename)
})
</script>
<template>
  <n-button v-bind="props" :loading="isLoading" @click="handleDownload">
    <template #icon>
      <n-icon><Download /></n-icon>
    </template>
    {{ props.label }}
  </n-button>
</template>
