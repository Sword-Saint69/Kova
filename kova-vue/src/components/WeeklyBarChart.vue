<template>
  <div class="chart-wrap">
    <div
      v-for="(val, i) in data"
      :key="i"
      class="bar-track"
    >
      <div
        class="bar-fill"
        :style="{
          transform: `scaleY(${val / max})`,
          transitionDelay: (i * 40) + 'ms'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ data: number[] }>()
const max   = Math.max(...props.data, 1) // prevent / 0
// Using pure CSS transitions with staggered delay for entrance
</script>

<style scoped>
.chart-wrap {
  display: flex; align-items: flex-end; gap: 6px;
  height: 120px;
}
.bar-track {
  flex: 1; height: 100%;
  background: rgba(255,255,255,0.03);
  border-radius: 4px; overflow: hidden;
  position: relative;
}
.bar-fill {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 100%; background: #a0ec06;
  border-radius: 4px;
  transform-origin: bottom;
  /* Start collapsed */
  animation: bar-grow 0.6s var(--ease-out) both;
}

@keyframes bar-grow {
  from { transform: scaleY(0); }
  /* 'to' state is handled by inline style */
}
</style>
