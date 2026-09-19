<template>
  <div class="panel" style="margin-top:16px">
    <h3>🌊 瀑布图 (Spectrogram)</h3>
    <canvas ref="cvs" width="800" height="200" class="waterfall-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useSignalStore } from '../store/signal'
const store = useSignalStore()
const cvs = ref<HTMLCanvasElement>()

function draw() {
  const c = cvs.value!; const ctx = c.getContext('2d')!; const W = c.width, H = c.height
  const allRows = store.result?.waterfall || []
  ctx.fillStyle = '#0d1520'; ctx.fillRect(0, 0, W, H)
  if (!allRows.length) return
  // 回放中只绘制已放出的时间片对应的行
  const revealed = store.replayActive ? Math.min(store.replaySegment, allRows.length) : allRows.length
  const rowH = H / allRows.length
  for (let r = 0; r < revealed; r++) {
    const vals = allRows[r].values, n = vals.length
    if (!n) continue
    const valsMin = Math.min(...vals), valsMax = Math.max(...vals)
    const vRange = valsMax - valsMin || 1
    for (let i = 0; i < n; i++) {
      const t = (vals[i] - valsMin) / vRange
      const rv = Math.round(t * 200)
      const gv = Math.round(t * 100 + (1-t) * 50)
      const bv = Math.round((1-t) * 200 + 30)
      ctx.fillStyle = `rgb(${rv},${gv},${bv})`
      ctx.fillRect(i * W / n, r * rowH, W / n + 1, rowH + 1)
    }
  }
}

onMounted(draw)
watch(() => [store.result, store.replayActive, store.replaySegment], draw)
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel h3 { margin-bottom:8px; color:#90caf9; font-size:14px }
.waterfall-canvas { display:block; width:100%; border-radius:4px }
</style>