<template>
  <div ref="ringEl" class="ring-wrap">
    <svg width="80" height="80" viewBox="0 0 80 80">
      <!-- Background track -->
      <circle
        cx="40" cy="40" r="32"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        stroke-width="8"
      />
      <!-- Animated fill arc -->
      <circle
        cx="40" cy="40" r="32"
        fill="none"
        stroke="#a0ec06"
        stroke-width="8"
        stroke-linecap="round"
        :stroke-dasharray="CIRC"
        :stroke-dashoffset="offset"
        class="ring-arc"
      />
    </svg>

    <!-- Center label -->
    <div class="ring-center">
      <span class="ring-pct">{{ displayPct }}%</span>
      <span class="ring-sub">done</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props  = defineProps<{ percentage: number }>()
const CIRC   = 2 * Math.PI * 32 // ≈ 201.06
const offset    = ref(CIRC)      // starts fully empty
const displayPct = ref(0)
const ringEl  = ref<HTMLElement | null>(null)

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function animate() {
  const duration  = 750
  const startTime = performance.now()

  function tick(now: number) {
    const t = Math.min((now - startTime) / duration, 1)
    const e = easeOutCubic(t)

    // Both the ring and the number animate together
    offset.value     = CIRC * (1 - (props.percentage / 100) * e)
    displayPct.value = Math.round(props.percentage * e)

    if (t < 1) requestAnimationFrame(tick)
  }

  // 300ms delay — tile fades in first, then ring fills
  setTimeout(() => requestAnimationFrame(tick), 300)
}

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    animate()
  }, { threshold: 0.5 })

  if (ringEl.value) observer.observe(ringEl.value)
})
</script>

<style scoped>
.ring-wrap {
  position: relative;
  width: 80px;
  height: 80px;
}
.ring-arc {
  /* Arc starts at 12 o'clock */
  transform-origin: 40px 40px;
  transform: rotate(-90deg);
  /* No CSS transition — offset is driven by rAF every frame */
}
.ring-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.ring-pct {
  font-family: 'Bodoni Moda', serif;
  font-weight: 900; font-size: 18px;
  color: #a0ec06; line-height: 1;
}
.ring-sub {
  font-size: 9px;
  color: rgba(240,237,232,0.22);
  margin-top: 2px;
}
</style>
