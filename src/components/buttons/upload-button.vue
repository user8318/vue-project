<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import type { BaseButtonProps } from '@/types'
import { CloudUpload } from '@vicons/ionicons5'
const props = withDefaults(defineProps<BaseButtonProps>(), {
  label: '上传',
  type: 'primary',
  size: 'medium',
  round: true,
  secondary: true,
  strong: true,
  data: () => ({}),
  headers: () => ({}),
})
const uploadUrl = import.meta.env.VITE_API_TEMPLATE + props.url
const fileList = ref<UploadFileInfo[]>([])
const onError = () => {
  nMessage.error('上传失败')
  fileList.value = []
}
</script>
<template>
  <n-upload
    v-model:file-list="fileList"
    :action="uploadUrl"
    :headers="props.headers"
    :data="props.data"
    @finish="nMessage.success('上传成功')"
    @error="onError"
    :max="1"
    :accept="props.accept"
  >
    <n-button v-bind="props">
      <template #icon>
        <n-icon><CloudUpload /></n-icon>
      </template>
      {{ props.label }}
    </n-button>
  </n-upload>
</template>
