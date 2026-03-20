<template>
  <div class="chart-wrap" ref="chartEl">
    <div
      v-for="(val, i) in data"
      :key="i"
      class="bar-track"
    >
      <!-- ANIMATION: Bars grow from base with spring overshoot on scroll-in -->
      <div
        class="bar-fill"
        :style="{
          transform: isVisible ? `scaleY(${val / max})` : 'scaleY(0)',
          transitionDelay: isVisible ? (i * 50) + 'ms' : '0ms'
        }"
      />
      <span class="bar-label">{{ days[i] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{ data: number[] }>();
const max = Math.max(...props.data, 1);
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const chartEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    // Small delay so mount transition isn't clipped
    setTimeout(() => { isVisible.value = true; }, 80);
  }, { threshold: 0.5 });
  if (chartEl.value) observer.observe(chartEl.value);
});
</script>

<style scoped>
.chart-wrap {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 120px;
}
.bar-track {
  flex: 1;
  height: 100%;
  background: rgba(255,255,255,0.03);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* ANIMATION — Springs up with overshoot via cubic-bezier spring */
.bar-fill {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 100%;
  background: linear-gradient(to top, #a0ec06, rgba(160,236,6,0.6));
  border-radius: 4px;
  transform-origin: bottom;
  transform: scaleY(0);
  /* spring overshoot curve */
  transition: transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bar-label {
  position: absolute;
  bottom: -18px;
  width: 100%;
  text-align: center;
  font-size: 9px;
  font-family: 'DM Sans', sans-serif;
  color: rgba(240,237,232,0.3);
  font-weight: 500;
}
</style>
