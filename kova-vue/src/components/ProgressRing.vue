<template>
  <div ref="ringRef" class="ring-wrap">
    <svg width="80" height="80" viewBox="0 0 80 80">
      <!-- Track -->
      <circle
        cx="40" cy="40" r="32"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        stroke-width="8"
      />
      <!-- Animated arc -->
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

    <div class="ring-center">
      <span class="ring-pct">{{ displayed }}%</span>
      <span class="ring-sub">done</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const props  = defineProps({ percentage: Number })
const CIRC   = 2 * Math.PI * 32  // ≈ 201

const displayed = ref(0)
const offset    = ref(CIRC)       // starts empty
const ringRef   = ref(null)

function animate() {
  const proxy = { val: 0 }
  gsap.to(proxy, {
    val: props.percentage,
    duration: 0.7,
    delay: 0.3,
    ease: 'power3.out',
    onUpdate() {
      displayed.value = Math.round(proxy.val)
      offset.value = CIRC * (1 - proxy.val / 100)
    }
  })
}

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    animate()
  }, { threshold: 0.5 })

  if (ringRef.value) observer.observe(ringRef.value)
})
</script>

<style scoped>
.ring-wrap { position: relative; width: 80px; height: 80px; }

.ring-arc {
  transform-origin: 40px 40px;
  transform: rotate(-90deg);
  /* offset is bound via :stroke-dashoffset — no CSS transition needed
     because we update it every frame in rAF */
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
  font-size: 9px; color: rgba(240,237,232,0.22);
  margin-top: 2px;
}
</style>
