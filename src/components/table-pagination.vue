<script setup lang="ts">
const emit = defineEmits(['query'])
class Pagination {
  itemCount: number = 0
  pageSizes: number[] = [10, 20, 50, 100]
  pageSize: number = 10
  page: number = 1
  showQuickJumper: boolean = true
  showSizePicker: boolean = true
}
const pagination = reactive(new Pagination())
const pageInfo = computed(() => ({
  pageSize: pagination.pageSize,
  pageNum: pagination.page,
}))
const pageChange = (page: number) => {
  pagination.page = page
  emit('query')
}
const pageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  emit('query')
}
const reset = () => {
  Object.assign(pagination, new Pagination())
}
defineExpose({
  pagination,
  pageInfo,
  reset,
})
</script>

<template>
  <n-pagination
    v-bind="pagination"
    @update:page="pageChange"
    @update:page-size="pageSizeChange"
    class="mt-2.5"
  />
</template>
