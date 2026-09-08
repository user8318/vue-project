<script setup lang="ts">
import type { UploadFileInfo, UploadOnFinish } from 'naive-ui'
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
const emit = defineEmits(['finish', 'error'])
const fileList = ref<UploadFileInfo[]>([])
const onFinish: UploadOnFinish = ({ event }) => {
  nMessage.success('上传成功')
  fileList.value = []
  const xhr = event?.target as XMLHttpRequest | null
  const responseText = xhr?.responseText
  let response = xhr?.response
  if (responseText) {
    try {
      response = JSON.parse(responseText)
    } catch {
      response = responseText
    }
  }
  emit('finish', response)
}
const onError = () => {
  nMessage.error('上传失败')
  fileList.value = []
}
</script>

<template>
  <n-upload
    v-model:file-list="fileList"
    :action="url"
    :headers
    :data
    @finish="onFinish"
    @error="onError"
    :accept
    :showFileList
  >
    <n-button v-bind="props">
      <template #icon>
        <n-icon><CloudUpload /></n-icon>
      </template>
      {{ label }}
    </n-button>
  </n-upload>
</template>
