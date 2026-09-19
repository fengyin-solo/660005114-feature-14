<template>
  <div class="panel playback-card" :class="{ disabled: !store.result }">
    <div class="playback-head">
      <span class="title">⏱️ 时间轴回放</span>
      <span v-if="store.result" class="time-info">
        第 {{ store.isReplaying ? store.playIndex + 1 : 0 }} / {{ store.totalSlices }} 片
        · t = {{ store.currentTime.toFixed(3) }} s
        <span v-if="store.playbackState === 'playing'" class="state-tag playing">播放中</span>
        <span v-else-if="store.playbackState === 'paused'" class="state-tag paused">已暂停</span>
        <span v-else class="state-tag idle">就绪</span>
      </span>
      <span v-else class="time-info muted">请先生成信号数据</span>
    </div>
    <div class="playback-body">
      <el-button-group>
        <el-button :type="store.playbackState === 'playing' ? 'warning' : 'primary'"
                   :disabled="!store.result"
                   @click="store.togglePlay()">
          {{ store.playbackState === 'playing' ? '⏸ 暂停' : '▶ 播放' }}
        </el-button>
        <el-button :disabled="!store.result || (!store.isReplaying && store.playbackState === 'idle')"
                   @click="store.nextSlice()">⏭ 下一段</el-button>
        <el-button :disabled="!store.result || !store.isReplaying"
                   @click="store.resetPlayback()">⏮ 回到起点</el-button>
      </el-button-group>
      <el-slider class="timeline-slider"
                 :model-value="sliderValue"
                 :min="0" :max="store.totalSlices"
                 :step="1" :disabled="!store.result"
                 :format-tooltip="formatTooltip"
                 @input="onSeek" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSignalStore } from '../store/signal'
const store = useSignalStore()

// slider 0 = 起点（未播放）；k = 已放到第 k 片
const sliderValue = computed(() => (store.isReplaying ? store.playIndex + 1 : 0))

function onSeek(v: number | number[]) {
  const value = Array.isArray(v) ? v[0] : v
  store.seekSlice(value - 1)
}

function formatTooltip(v: number) {
  if (!store.result || v === 0) return '起点'
  const row = store.result.waterfall[v - 1]
  return `第 ${v} 片 · t=${row?.time.toFixed(3) ?? '-'}s`
}
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:12px 20px; margin-bottom:16px; border:1px solid #2a3a4a }
.panel.disabled { opacity:.65 }
.playback-head { display:flex; align-items:center; gap:12px; margin-bottom:10px }
.title { color:#90caf9; font-size:14px; font-weight:600 }
.time-info { font-size:12px; color:#b0c4d8 }
.time-info.muted { color:#667788 }
.playback-body { display:flex; align-items:center; gap:20px }
.timeline-slider { flex:1; margin:0 8px }
.state-tag { padding:1px 8px; border-radius:10px; font-size:11px; margin-left:6px }
.state-tag.playing { background:rgba(102,187,106,.2); color:#66bb6a }
.state-tag.paused { background:rgba(255,167,38,.2); color:#ffa726 }
.state-tag.idle { background:rgba(136,153,170,.2); color:#8899aa }
</style>
