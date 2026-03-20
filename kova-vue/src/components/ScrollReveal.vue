<script setup>
import { computed } from 'vue'

const props = defineProps({
  delay: {
    type: Number,
    default: 0
  }
})

// Convert Framer's second-based delay to ms for @vueuse/motion
const delayMs = computed(() => props.delay * 1000)
</script>

<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 16 }"
    :visibleOnce="{
      opacity: 1, 
      y: 0, 
      transition: {
        duration: 450,
        delay: delayMs,
        easing: [0.16, 1, 0.3, 1]
      }
    }"
  >
    <slot />
  </div>
</template>
