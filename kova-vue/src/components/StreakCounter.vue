<template>
  <div ref="tileRef" class="streak-tile">
    <span class="streak-label">Current streak</span>
    <span class="streak-num">{{ displayed }}</span>
    <span class="streak-unit">days in a row</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({ value: Number })
const displayed = ref(0)
const tileRef   = ref(null)

onMounted(() => {
  // Only animate when tile is visible
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()

    const duration = Math.min(props.value * 0.022, 1.2)

    gsap.to({ n: 0 }, {
      n:        props.value,
      duration,
      ease:     'power3.out',
      onUpdate() { displayed.value = Math.round(this.targets()[0].n) },
    })
  }, { threshold: 0.5 })

  if (tileRef.value) observer.observe(tileRef.value)
})
</script>
