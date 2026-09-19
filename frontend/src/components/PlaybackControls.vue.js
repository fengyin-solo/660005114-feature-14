/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useSignalStore } from '../store/signal';
const store = useSignalStore();
// slider 0 = 起点（未播放）；k = 已放到第 k 片
const sliderValue = computed(() => (store.isReplaying ? store.playIndex + 1 : 0));
function onSeek(v) {
    const value = Array.isArray(v) ? v[0] : v;
    store.seekSlice(value - 1);
}
function formatTooltip(v) {
    if (!store.result || v === 0)
        return '起点';
    const row = store.result.waterfall[v - 1];
    return `第 ${v} 片 · t=${row?.time.toFixed(3) ?? '-'}s`;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['time-info']} */ ;
/** @type {__VLS_StyleScopedClasses['state-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['state-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['state-tag']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel playback-card" },
    ...{ class: ({ disabled: !__VLS_ctx.store.result }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "playback-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "title" },
});
if (__VLS_ctx.store.result) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "time-info" },
    });
    (__VLS_ctx.store.isReplaying ? __VLS_ctx.store.playIndex + 1 : 0);
    (__VLS_ctx.store.totalSlices);
    (__VLS_ctx.store.currentTime.toFixed(3));
    if (__VLS_ctx.store.playbackState === 'playing') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "state-tag playing" },
        });
    }
    else if (__VLS_ctx.store.playbackState === 'paused') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "state-tag paused" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "state-tag idle" },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "time-info muted" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "playback-body" },
});
const __VLS_0 = {}.ElButtonGroup;
/** @type {[typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.store.playbackState === 'playing' ? 'warning' : 'primary'),
    disabled: (!__VLS_ctx.store.result),
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.store.playbackState === 'playing' ? 'warning' : 'primary'),
    disabled: (!__VLS_ctx.store.result),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (...[$event]) => {
        __VLS_ctx.store.togglePlay();
    }
};
__VLS_7.slots.default;
(__VLS_ctx.store.playbackState === 'playing' ? '⏸ 暂停' : '▶ 播放');
var __VLS_7;
const __VLS_12 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.store.result || (!__VLS_ctx.store.isReplaying && __VLS_ctx.store.playbackState === 'idle')),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.store.result || (!__VLS_ctx.store.isReplaying && __VLS_ctx.store.playbackState === 'idle')),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onClick: (...[$event]) => {
        __VLS_ctx.store.nextSlice();
    }
};
__VLS_15.slots.default;
var __VLS_15;
const __VLS_20 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.store.result || !__VLS_ctx.store.isReplaying),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.store.result || !__VLS_ctx.store.isReplaying),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onClick: (...[$event]) => {
        __VLS_ctx.store.resetPlayback();
    }
};
__VLS_23.slots.default;
var __VLS_23;
var __VLS_3;
const __VLS_28 = {}.ElSlider;
/** @type {[typeof __VLS_components.ElSlider, typeof __VLS_components.elSlider, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ 'onInput': {} },
    ...{ class: "timeline-slider" },
    modelValue: (__VLS_ctx.sliderValue),
    min: (0),
    max: (__VLS_ctx.store.totalSlices),
    step: (1),
    disabled: (!__VLS_ctx.store.result),
    formatTooltip: (__VLS_ctx.formatTooltip),
}));
const __VLS_30 = __VLS_29({
    ...{ 'onInput': {} },
    ...{ class: "timeline-slider" },
    modelValue: (__VLS_ctx.sliderValue),
    min: (0),
    max: (__VLS_ctx.store.totalSlices),
    step: (1),
    disabled: (!__VLS_ctx.store.result),
    formatTooltip: (__VLS_ctx.formatTooltip),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    onInput: (__VLS_ctx.onSeek)
};
var __VLS_31;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['playback-card']} */ ;
/** @type {__VLS_StyleScopedClasses['playback-head']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['time-info']} */ ;
/** @type {__VLS_StyleScopedClasses['state-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['playing']} */ ;
/** @type {__VLS_StyleScopedClasses['state-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['paused']} */ ;
/** @type {__VLS_StyleScopedClasses['state-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['idle']} */ ;
/** @type {__VLS_StyleScopedClasses['time-info']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['playback-body']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-slider']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            store: store,
            sliderValue: sliderValue,
            onSeek: onSeek,
            formatTooltip: formatTooltip,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
