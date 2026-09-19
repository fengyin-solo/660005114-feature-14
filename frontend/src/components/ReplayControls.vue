<template>
  <div class="panel replay-bar">
    <span class="title">⏱ 时间轴回放</span>
    <el-button size="small" type="primary" :disabled="!hasData" @click="store.toggleReplay()">
      {{ playLabel }}
    </el-button>
    <el-button size="small" :disabled="!hasData" @click="store.nextSegment()">⏭ 下一段</el-button>
    <el-button size="small" :disabled="!store.replayActive" @click="store.resetReplay()">⏹ 停止</el-button>
    <el-slider
      class="scrubber"
      :model-value="store.replaySegment"
      :min="0"
      :max="store.replayTotal"
      :disabled="!hasData"
      @update:model-value="store.scrubReplay($event)"
    />
    <span class="progress-text">{{ store.replaySegment }} / {{ store.replayTotal }} 段</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSignalStore } from '../store/signal'
const store = useSignalStore()
const hasData = computed(() => store.result !== null && store.replayTotal > 0)
const playLabel = computed(() => {
  if (!store.replayActive) return '▶ 回放'
  return store.replayPlaying ? '⏸ 暂停' : '▶ 继续'
})
</script>

<style scoped>
.replay-bar { display:flex; align-items:center; gap:12px; padding:10px 16px; margin-bottom:16px; background:#1a2332; border-radius:8px; border:1px solid #2a3a4a }
.title { color:#90caf9; font-size:14px; white-space:nowrap }
.scrubber { flex:1 }
.progress-text { font-size:12px; color:#8899aa; white-space:nowrap; min-width:72px; text-align:right }
</style>
