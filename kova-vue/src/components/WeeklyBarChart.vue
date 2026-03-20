<template>
  <div ref="chartRef" class="bar-chart">
    <div
      v-for="(val, i) in data"
      :key="i"
      class="bar-col"
    >
      <div
        class="bar"
        ref="bars"
        :class="{ today: i === todayIndex }"
        :style="{
          height: (val / max * 100) + '%',
          background: i === todayIndex ? '#a0ec06' : 'rgba(160,236,6,0.22)',
        }"
      />
      <span class="bar-label" :class="{ today: i === todayIndex }">
        {{ labels[i] }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  data:       Array,
  todayIndex: Number
})

const labels  = ['M','T','W','T','F','S','S']
const max     = computed(() => Math.max(...props.data))
const chartRef = ref(null)
const bars = ref([])

onMounted(() => {
  gsap.set(bars.value, { scaleY: 0, transformOrigin: 'bottom' })

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()

    gsap.to(bars.value, {
      scaleY: 1,
      duration: 0.45,
      ease: 'power3.out',
      stagger: 0.04,
      delay: 0.1
    })
  }, { threshold: 0.5 })

  if (chartRef.value) observer.observe(chartRef.value)
})
</script>

<style scoped>
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 72px;
}
.bar-col {
  flex: 1; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; gap: 5px;
  justify-content: flex-end;
}
.bar {
  width: 100%;
  border-radius: 3px 3px 2px 2px;
  transform-origin: bottom;
}
.bar-label {
  font-size: 9px;
  font-family: 'DM Sans', sans-serif;
  color: rgba(240,237,232,0.22);
}
.bar-label.today { color: #a0ec06; }
</style>
