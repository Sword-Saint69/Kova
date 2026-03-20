<script setup>
import { computed } from 'vue'

const props = defineProps({
  index: {
    type: Number,
    required: true
  }
})

const delayMs = computed(() => props.index * 50 + 50)
</script>

<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 14 }"
    :enter="{
      opacity: 1,
      y: 0,
      transition: {
        duration: 400,
        delay: delayMs,
        easing: [0.16, 1, 0.3, 1]
      }
    }"
  >
    <slot />
  </div>
</template>
