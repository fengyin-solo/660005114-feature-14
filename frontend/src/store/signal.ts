import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { AnalysisResult, WaterfallRow, ConstellationPoint } from '@/types'

export type PlaybackState = 'idle' | 'playing' | 'paused'

const SLICE_INTERVAL = 450 // ms per time slice

export const useSignalStore = defineStore('signal', () => {
  const loading = ref(false)
  const result = ref<AnalysisResult | null>(null)
  const activeView = ref('spectrum')

  // ---- timeline playback ----
  // playIndex: 已播放到的时间片序号；-1 表示尚未开始（回到起点，展示完整结果）
  const playIndex = ref(-1)
  const playbackState = ref<PlaybackState>('idle')
  let timer: ReturnType<typeof setTimeout> | null = null

  const totalSlices = computed(() => result.value?.waterfall.length ?? 0)
  const atLastSlice = computed(() => playIndex.value === totalSlices.value - 1)
  const isReplaying = computed(() => playIndex.value >= 0)

  function clearTimer() {
    if (timer !== null) { clearTimeout(timer); timer = null }
  }

  function scheduleNext() {
    clearTimer()
    timer = setTimeout(() => {
      if (playIndex.value >= totalSlices.value - 1) {
        // 放完一轮：回到起点、停止，等待下一次“播放”重新开始
        resetPlayback()
        return
      }
      playIndex.value += 1
      scheduleNext()
    }, SLICE_INTERVAL)
  }

  function play() {
    if (!result.value || totalSlices.value === 0) return
    if (playbackState.value === 'playing') return
    // 在最后一片（或任意暂停位）点播放：若已到末尾则从头再来一轮
    if (playIndex.value >= totalSlices.value - 1) playIndex.value = -1
    playbackState.value = 'playing'
    playIndex.value = Math.min(playIndex.value + 1, totalSlices.value - 1)
    scheduleNext()
  }

  function pause() {
    if (playbackState.value !== 'playing') return
    playbackState.value = 'paused'
    clearTimer()
  }

  function togglePlay() {
    playbackState.value === 'playing' ? pause() : play()
  }

  function nextSlice() {
    if (!result.value || totalSlices.value === 0) return
    const wasPlaying = playbackState.value === 'playing'
    clearTimer()
    playbackState.value = 'paused'
    if (playIndex.value >= totalSlices.value - 1) {
      // 已在末尾：回到起点
      resetPlayback()
    } else {
      playIndex.value += 1
      if (wasPlaying) { playbackState.value = 'playing'; scheduleNext() }
    }
  }

  function resetPlayback() {
    clearTimer()
    playIndex.value = -1
    playbackState.value = 'idle'
  }

  // 拖动进度条定位到指定时间片（0-based）；停在该位置
  function seekSlice(index: number) {
    if (!result.value || totalSlices.value === 0) return
    clearTimer()
    playIndex.value = Math.max(-1, Math.min(index, totalSlices.value - 1))
    playbackState.value = playIndex.value < 0 ? 'idle' : 'paused'
  }

  const currentSlice = computed<WaterfallRow | null>(() =>
    isReplaying.value && result.value ? result.value.waterfall[playIndex.value] ?? null : null
  )

  const currentTime = computed(() => currentSlice.value?.time ?? 0)

  async function analyze(params: { modulation: string; samples: number; snr: number }) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/generate', params)
      // 中途切换参数：停止当前回放并回到初始状态
      resetPlayback()
      result.value = data
    } finally { loading.value = false }
  }

  async function importCSV(formData: FormData) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      resetPlayback()
      result.value = data
    } finally { loading.value = false }
  }

  // ---- 按回放进度派生三块图表的数据 ----

  // 瀑布图：回放中只显示已播放的片，未播放的片留空
  const visibleWaterfall = computed<{ row: WaterfallRow; active: boolean }[]>(() => {
    if (!result.value) return []
    return result.value.waterfall.map((row, idx) => ({
      row,
      active: isReplaying.value && idx <= playIndex.value
    }))
  })

  // 频谱：静态时为全信号 FFT；回放中为“截至当前片”的平均功率谱（dB 域平均），
  // 随时间片逐段逼近最终谱，放完后与全信号谱保持同一频率轴
  const visibleSpectrum = computed<{ frequencies: number[]; magnitudes: number[] }>(() => {
    const res = result.value
    if (!res) return { frequencies: [], magnitudes: [] }
    if (!isReplaying.value) return res.spectrum
    const shown = res.waterfall.slice(0, playIndex.value + 1)
    if (!shown.length) return { frequencies: [], magnitudes: [] }
    const bins = shown[0].values.length
    const half = Math.floor(bins / 2) // 正半轴（含 0 Hz）
    const acc = new Array<number>(bins).fill(0)
    for (const w of shown) {
      const v = w.values
      for (let k = 0; k < bins; k++) acc[k] += v[k] ?? 0
    }
    const frequencies: number[] = []
    const magnitudes: number[] = []
    for (let k = half; k < bins; k++) {
      frequencies.push(shown[0].frequencies[k])
      magnitudes.push(acc[k] / shown.length)
    }
    return { frequencies, magnitudes }
  })

  // 星座图：按原始采样序号过滤，只显示当前时间片之前（含）的点
  const visibleConstellation = computed<ConstellationPoint[]>(() => {
    const res = result.value
    if (!res) return []
    if (!isReplaying.value) return res.constellation
    const seg = res.sampleCount / res.waterfall.length
    const maxIndex = (playIndex.value + 1) * seg - 1
    return res.constellation.filter(p => p.index <= maxIndex)
  })

  return {
    loading, result, activeView,
    // playback state
    playIndex, playbackState, totalSlices, atLastSlice, isReplaying,
    currentSlice, currentTime,
    play, pause, togglePlay, nextSlice, resetPlayback, seekSlice,
    // derived chart data
    visibleWaterfall, visibleSpectrum, visibleConstellation,
    analyze, importCSV
  }
})
