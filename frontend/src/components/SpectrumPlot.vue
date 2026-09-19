<template>
  <div class="panel">
    <h3>📊 FFT频谱图</h3>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useSignalStore } from '../store/signal'
const store = useSignalStore()
const chart = ref<HTMLDivElement>()
let instance: echarts.ECharts | null = null

function update() {
  if (!instance || !store.result) return
  let frequencies: number[] = [], magnitudes: number[] = []
  if (store.replayActive) {
    // 回放中: 显示当前时间片为止的累积频谱
    if (store.replaySegment > 0) {
      frequencies = store.result.timeline.frequencies
      magnitudes = store.result.timeline.magnitudes[store.replaySegment - 1]
    }
  } else {
    frequencies = store.result.spectrum.frequencies
    magnitudes = store.result.spectrum.magnitudes
  }
  const n = frequencies.length
  const halfN = Math.floor(n / 2)
  const data = []
  for (let i = 0; i < halfN; i++) {
    data.push([frequencies[i], magnitudes[i]])
  }
  instance.setOption({
    backgroundColor: 'transparent',
    grid: { left: 50, right: 15, top: 15, bottom: 35 },
    xAxis: { type: 'value', name: '频率 (Hz)', nameLocation: 'middle', nameGap: 25, axisLabel: { color: '#8899aa' } },
    yAxis: { type: 'value', name: '幅度 (dB)', nameLocation: 'middle', nameGap: 40, axisLabel: { color: '#8899aa' } },
    series: [{
      type: 'line', data, symbol: 'none', lineStyle: { color: '#42a5f5', width: 1.5 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(66,165,245,0.4)' }, { offset: 1, color: 'rgba(66,165,245,0.02)' }]) }
    }],
    animation: false
  })
}

onMounted(() => {
  if (chart.value) { instance = echarts.init(chart.value); update() }
})
watch(() => [store.result, store.replayActive, store.replaySegment], update)
onUnmounted(() => { instance?.dispose() })
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel h3 { margin-bottom:8px; color:#90caf9; font-size:14px }
.chart { width:100%; height:280px }
</style>