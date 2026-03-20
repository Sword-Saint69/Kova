<template>
  <span ref="el" class="streak-num">{{ displayed }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ value: number }>()
const el        = ref<HTMLElement | null>(null)
const displayed = ref(0)

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function runCounter() {
  const duration  = Math.min(props.value * 22, 1200) // ms, max 1.2s
  const startTime = performance.now()

  function tick(now: number) {
    const elapsed  = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased    = easeOutCubic(progress)

    displayed.value = Math.round(props.value * eased)

    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      // Pop animation when counter finishes
      if (el.value) {
        el.value.style.animation = 'number-pop 0.3s var(--ease-spring)'
        setTimeout(() => {
          if (el.value) el.value.style.animation = ''
        }, 300)
      }
    }
  }

  requestAnimationFrame(tick)
}

onMounted(() => {
  // Only start when element is visible
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    // Small delay so the tile has faded in first
    setTimeout(runCounter, 200)
  }, { threshold: 0.5 })

  if (el.value) observer.observe(el.value)
})
</script>

<style scoped>
.streak-num {
  font-family: 'Bodoni Moda', serif;
  font-weight: 900;
  font-size: 72px;
  color: #0a0a0a;
  line-height: 1;
  display: block;
}
</style>
