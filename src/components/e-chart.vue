<script setup lang="ts">
import * as echarts from 'echarts'
const chartRef = useTemplateRef('chartRef')
let chart: echarts.ECharts
const setOption = (option: echarts.EChartsOption, notMerge: boolean = false) => {
  if (!chart) chart = echarts.init(chartRef.value)
  chart.setOption(option, notMerge)
}
const onResize = () => {
  if (chart) chart.resize()
}
onMounted(() => {
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (chart) chart.dispose()
})
defineExpose({
  setOption,
})
</script>

<template><div ref="chartRef"></div></template>
