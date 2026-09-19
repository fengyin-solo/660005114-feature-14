import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import type { AnalysisResult } from '@/types'

const REPLAY_INTERVAL_MS = 200

export const useSignalStore = defineStore('signal', () => {
  const loading = ref(false)
  const result = ref<AnalysisResult | null>(null)
  const activeView = ref('spectrum')

  // ---- 时间轴回放 ----
  const replayActive = ref(false) // 回放模式开启, 图表按时间片渲染
  const replayPlaying = ref(false) // 正在自动推进
  const replaySegment = ref(0) // 已放出的时间片数量
  let replayTimer: ReturnType<typeof setInterval> | null = null

  const replayTotal = computed(() => result.value?.timeline?.magnitudes.length ?? 0)

  function clearReplayTimer() {
    if (replayTimer !== null) { clearInterval(replayTimer); replayTimer = null }
  }

  /** 停止回放并回到初始状态(完整结果视图) */
  function resetReplay() {
    clearReplayTimer()
    replayActive.value = false
    replayPlaying.value = false
    replaySegment.value = 0
  }

  /** 推进一个时间片; 放完一轮后回到起点 */
  function advanceSegment() {
    if (replaySegment.value >= replayTotal.value) { resetReplay(); return }
    replaySegment.value += 1
  }

  function startReplay() {
    if (!result.value || replayTotal.value === 0) return
    resetReplay()
    replayActive.value = true
    replayPlaying.value = true
    advanceSegment()
    replayTimer = setInterval(advanceSegment, REPLAY_INTERVAL_MS)
  }

  function pauseReplay() {
    replayPlaying.value = false
    clearReplayTimer()
  }

  function resumeReplay() {
    if (!replayActive.value) { startReplay(); return }
    replayPlaying.value = true
    clearReplayTimer()
    replayTimer = setInterval(advanceSegment, REPLAY_INTERVAL_MS)
  }

  function toggleReplay() {
    if (!replayActive.value) startReplay()
    else if (replayPlaying.value) pauseReplay()
    else resumeReplay()
  }

  /** 跳到下一段(暂停自动推进, 便于逐段查看) */
  function nextSegment() {
    if (!result.value || replayTotal.value === 0) return
    replayActive.value = true
    pauseReplay()
    advanceSegment()
  }

  /** 拖动进度条定位(暂停自动推进) */
  function scrubReplay(segment: number) {
    if (!result.value || replayTotal.value === 0) return
    replayActive.value = true
    pauseReplay()
    replaySegment.value = Math.max(0, Math.min(Math.round(segment), replayTotal.value))
  }

  // 新数据到达时终止当前回放, 回到初始状态
  watch(result, resetReplay)

  async function analyze(params: { modulation: string; samples: number; snr: number }) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/generate', params)
      result.value = data
    } finally { loading.value = false }
  }

  async function importCSV(formData: FormData) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      result.value = data
    } finally { loading.value = false }
  }

  return {
    loading, result, activeView, analyze, importCSV,
    replayActive, replayPlaying, replaySegment, replayTotal,
    startReplay, pauseReplay, resumeReplay, toggleReplay,
    nextSegment, scrubReplay, resetReplay
  }
})
