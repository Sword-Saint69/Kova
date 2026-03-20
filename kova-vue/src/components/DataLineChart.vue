<template>
  <!-- ANIMATION: SVG line chart draws itself on scroll -->
  <div ref="chartEl" class="line-chart">
    <svg :viewBox="`0 0 ${width} ${height}`" class="chart-svg" preserveAspectRatio="none">
      <!-- Grid lines -->
      <line v-for="y in gridLines" :key="y"
            :x1="0" :y1="y" :x2="width" :y2="y"
            stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

      <!-- Background area fill (fades in after line) -->
      <defs>
        <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#a0ec06" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#a0ec06" stop-opacity="0"/>
        </linearGradient>
        <clipPath id="chart-clip-area">
          <rect :width="isVisible ? width : 0" height="100%" style="transition: width 1200ms cubic-bezier(0.16,1,0.3,1)"/>
        </clipPath>
      </defs>

      <!-- Area fill -->
      <polygon :points="areaPoints" fill="url(#area-gradient)" clip-path="url(#chart-clip-area)" />

      <!-- ANIMATION: Line draws itself via stroke-dashoffset -->
      <polyline
        :points="linePoints"
        fill="none"
        stroke="#a0ec06"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-dasharray="totalLength"
        :stroke-dashoffset="isVisible ? 0 : totalLength"
        style="transition: stroke-dashoffset 1200ms cubic-bezier(0.16,1,0.3,1)"
      />

      <!-- Dots at each data point -->
      <circle
        v-for="(pt, i) in points" :key="i"
        :cx="pt.x" :cy="pt.y" r="3"
        fill="#a0ec06"
        :style="{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 200ms ease ${i * 100 + 800}ms`
        }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{ data: number[] }>();
const chartEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const width = 400, height = 100, padX = 10, padY = 10;
const maxVal = Math.max(...props.data, 1);

const points = computed(() =>
  props.data.map((v, i) => ({
    x: padX + (i / (props.data.length - 1)) * (width - padX * 2),
    y: height - padY - (v / maxVal) * (height - padY * 2)
  }))
);

const linePoints = computed(() =>
  points.value.map(p => `${p.x},${p.y}`).join(' ')
);

const areaPoints = computed(() => {
  const pts = points.value;
  return [
    ...pts.map(p => `${p.x},${p.y}`),
    `${pts[pts.length-1].x},${height}`,
    `${pts[0].x},${height}`
  ].join(' ');
});

// Approximate total path length
const totalLength = computed(() => {
  const pts = points.value;
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i-1].x;
    const dy = pts[i].y - pts[i-1].y;
    len += Math.sqrt(dx*dx + dy*dy);
  }
  return len + 10;
});

const gridLines = computed(() => {
  const lines = [];
  for (let i = 0; i <= 4; i++) lines.push(padY + (i / 4) * (height - padY * 2));
  return lines;
});

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    setTimeout(() => { isVisible.value = true; }, 200);
  }, { threshold: 0.5 });
  if (chartEl.value) observer.observe(chartEl.value);
});
</script>

<style scoped>
.line-chart { width: 100%; }
.chart-svg  { width: 100%; height: 100px; overflow: visible; }
</style>
