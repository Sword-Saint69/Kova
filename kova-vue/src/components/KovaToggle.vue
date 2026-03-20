<template>
  <button
    class="toggle-track"
    :class="{ 'is-on': modelValue }"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div class="toggle-thumb" :class="{ 'is-on': modelValue }" />
  </button>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; label?: string }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
/* ANIMATION 7 — Toggle: spring slide + thumb scale + color flood */
.toggle-track {
  width: 44px; height: 24px;
  border-radius: 99px;
  background: #303030;
  border: none; cursor: pointer;
  padding: 0 3px;
  display: flex; align-items: center;
  transition: background-color 200ms ease;
  position: relative;
  overflow: hidden;
}

/* Color flood on enable */
.toggle-track::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 99px;
  background: #a0ec06;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle-track.is-on::after {
  transform: scaleX(1);
}

.toggle-thumb {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: white;
  position: relative;
  z-index: 2;
  /* Spring slide with overshoot */
  transition: transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1),
              width 120ms ease;
}

/* Scale thumb slightly on press feel */
.toggle-track:active .toggle-thumb {
  width: 20px;
}

.toggle-thumb.is-on {
  transform: translateX(20px);
}
</style>
