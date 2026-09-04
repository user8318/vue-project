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
  url: '',
  data: () => ({}),
  headers: () => ({}),
})
const uploadUrl = import.meta.env.VITE_API_TEMPLATE + props.url
const fileList = ref<UploadFileInfo[]>([])
const onFinish = () => {
  nMessage.success('上传成功')
}
const onError = () => {
  nMessage.error('上传失败')
  fileList.value = []
}
</script>

<template>
  <n-upload
    v-model:file-list="fileList"
    :action="uploadUrl"
    :headers
    :data
    @finish="onFinish"
    @error="onError"
    :max="1"
    :accept
  >
    <n-button v-bind="props">
      <template #icon>
        <n-icon><CloudUpload /></n-icon>
      </template>
      {{ label }}
    </n-button>
  </n-upload>
</template>
