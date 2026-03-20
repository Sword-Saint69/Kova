<template>
  <div
    ref="target"
    :class="['sr-wrap', { 'sr-visible': visible }]"
    :style="{ transitionDelay: delay + 'ms' }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'

withDefaults(
  defineProps<{ delay?: number }>(),
  { delay: 0 }
)

const { target, visible } = useScrollReveal()
</script>

<style scoped>
.sr-wrap {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity   0.48s var(--ease-out),
    transform 0.48s var(--ease-out);
}
.sr-wrap.sr-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
