<template>
  <button
    class="toggle-track"
    :class="{ 'is-on': modelValue }"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div class="toggle-thumb" />
  </button>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; label?: string }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.toggle-track {
  width: 44px; height: 24px;
  border-radius: 99px;
  background: #303030;
  border: none; cursor: pointer;
  padding: 0 3px;
  display: flex; align-items: center;
  /* Track color slides between off/on */
  transition: background-color 180ms ease;
}
.toggle-track.is-on { background: #a0ec06; }

.toggle-thumb {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: white;
  /* cubic-bezier(0.34, 1.56, 0.64, 1) = spring with overshoot */
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.is-on .toggle-thumb { transform: translateX(20px); }
</style>
