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
  const visible = store.visibleWaterfall
  if (!visible.length) return
  ctx.fillStyle = '#0d1520'; ctx.fillRect(0, 0, W, H)
  const rowH = H / visible.length
  visible.forEach(({ row, active }, r) => {
    if (!active) return // 尚未播放的时间片保持空白
    const vals = row.values, n = vals.length
    if (!n) return
    // 全片使用全局正半轴，与频谱图对齐
    const half = Math.floor(n / 2)
    const shown = vals.slice(half)
    const valsMin = Math.min(...shown), valsMax = Math.max(...shown)
    const vRange = valsMax - valsMin || 1
    for (let i = 0; i < shown.length; i++) {
      const t = (shown[i] - valsMin) / vRange
      const rv = Math.round(t * 200)
      const gv = Math.round(t * 100 + (1-t) * 50)
      const bv = Math.round((1-t) * 200 + 30)
      ctx.fillStyle = `rgb(${rv},${gv},${bv})`
      ctx.fillRect(i * W / shown.length, r * rowH, W / shown.length + 1, rowH + 1)
    }
  })
  // 高亮当前播放片
  if (store.isReplaying) {
    const r = store.playIndex
    ctx.strokeStyle = '#ffd54f'; ctx.lineWidth = 2
    ctx.strokeRect(1, r * rowH + 1, W - 2, rowH - 2)
    // 播放进度指示线
    ctx.fillStyle = 'rgba(255,213,79,0.85)'
    ctx.fillRect(0, (r + 1) * rowH - 1, W, 2)
  }
}

onMounted(draw)
watch(() => store.visibleWaterfall, draw, { deep: true })
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel h3 { margin-bottom:8px; color:#90caf9; font-size:14px }
.waterfall-canvas { display:block; width:100%; border-radius:4px }
</style>
