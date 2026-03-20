<template>
  <div ref="gridEl" class="heatmap-wrap">
    <div
      v-for="(col, c) in cells"
      :key="c"
      class="hmap-col"
    >
      <div
        v-for="(level, r) in col"
        :key="r"
        class="hmap-cell"
        :class="{ visible: started }"
        :style="{
          background:        COLORS[level],
          border:            level === 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
          transitionDelay:   (c * 16 + r * 4) + 'ms',
          transitionDuration: '180ms',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  data: number[][]  // 2D array [col][row], values 0-5
}>()

const COLORS = ['#181818','#085041','#0F6E56','#1D9E75','#5DCAA5','#a0ec06']
const cells   = computed(() => props.data)
const started = ref(false)
const gridEl  = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    // Small delay so grid is fully painted before cascade starts
    setTimeout(() => { started.value = true }, 80)
  }, { threshold: 0.1 })

  if (gridEl.value) observer.observe(gridEl.value)
})
</script>

<style scoped>
.heatmap-wrap {
  display: flex;
  gap: 3px;
  overflow: hidden;
}
.hmap-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.hmap-cell {
  width: 11px;
  height: 11px;
  border-radius: 2px;
  flex-shrink: 0;
  /* Start invisible */
  transform: scale(0);
  opacity: 0;
  transition:
    transform var(--ease-out),
    opacity   linear;
  /* duration and delay are set inline per cell */
}
.hmap-cell.visible {
  transform: scale(1);
  opacity: 1;
}
</style>
