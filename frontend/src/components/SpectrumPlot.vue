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
  if (!instance) return
  let { frequencies, magnitudes } = store.visibleSpectrum
  // 静态全信号 FFT 只取正半轴，与回放频谱使用同一频率轴
  if (!store.isReplaying && store.result) {
    const n = frequencies.length
    const halfN = Math.floor(n / 2)
    frequencies = frequencies.slice(halfN)
    magnitudes = magnitudes.slice(halfN)
  }
  const data: [number, number][] = []
  for (let i = 0; i < frequencies.length; i++) {
    data.push([frequencies[i], magnitudes[i]])
  }
  instance.setOption({
    backgroundColor: 'transparent',
    grid: { left: 50, right: 15, top: 15, bottom: 35 },
    // 频率轴固定 0 ~ fs/2，保证回放推进时横轴不跳变
    xAxis: { type: 'value', min: 0, max: (store.result?.sampleRate ?? 1000) / 2, name: '频率 (Hz)', nameLocation: 'middle', nameGap: 25, axisLabel: { color: '#8899aa' } },
    yAxis: { type: 'value', name: '幅度 (dB)', nameLocation: 'middle', nameGap: 40, axisLabel: { color: '#8899aa' }, scale: true },
    series: [{
      type: 'line', data, symbol: 'none', lineStyle: { color: '#42a5f5', width: 1.5 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(66,165,245,0.4)' }, { offset: 1, color: 'rgba(66,165,245,0.02)' }]) }
    }],
    animation: false
  }, true)
}

onMounted(() => {
  if (chart.value) { instance = echarts.init(chart.value); update() }
})
watch(() => store.visibleSpectrum, update)
onUnmounted(() => { instance?.dispose() })
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel h3 { margin-bottom:8px; color:#90caf9; font-size:14px }
.chart { width:100%; height:280px }
</style>
