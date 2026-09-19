/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, onMounted } from 'vue';
import { useSignalStore } from '../store/signal';
const store = useSignalStore();
const cvs = ref();
function draw() {
    const c = cvs.value;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const visible = store.visibleWaterfall;
    if (!visible.length)
        return;
    ctx.fillStyle = '#0d1520';
    ctx.fillRect(0, 0, W, H);
    const rowH = H / visible.length;
    visible.forEach(({ row, active }, r) => {
        if (!active)
            return; // 尚未播放的时间片保持空白
        const vals = row.values, n = vals.length;
        if (!n)
            return;
        // 全片使用全局正半轴，与频谱图对齐
        const half = Math.floor(n / 2);
        const shown = vals.slice(half);
        const valsMin = Math.min(...shown), valsMax = Math.max(...shown);
        const vRange = valsMax - valsMin || 1;
        for (let i = 0; i < shown.length; i++) {
            const t = (shown[i] - valsMin) / vRange;
            const rv = Math.round(t * 200);
            const gv = Math.round(t * 100 + (1 - t) * 50);
            const bv = Math.round((1 - t) * 200 + 30);
            ctx.fillStyle = `rgb(${rv},${gv},${bv})`;
            ctx.fillRect(i * W / shown.length, r * rowH, W / shown.length + 1, rowH + 1);
        }
    });
    // 高亮当前播放片
    if (store.isReplaying) {
        const r = store.playIndex;
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, r * rowH + 1, W - 2, rowH - 2);
        // 播放进度指示线
        ctx.fillStyle = 'rgba(255,213,79,0.85)';
        ctx.fillRect(0, (r + 1) * rowH - 1, W, 2);
    }
}
onMounted(draw);
watch(() => store.visibleWaterfall, draw, { deep: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.canvas, __VLS_intrinsicElements.canvas)({
    ref: "cvs",
    width: "800",
    height: "200",
    ...{ class: "waterfall-canvas" },
});
/** @type {typeof __VLS_ctx.cvs} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['waterfall-canvas']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cvs: cvs,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
