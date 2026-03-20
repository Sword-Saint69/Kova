<template>
  <button
    class="mark-btn"
    :class="{ marked }"
    :disabled="marked"
    @click="mark"
  >
    <Transition name="mark-label" mode="out-in">
      <span v-if="!marked" key="default">Mark today ✓</span>
      <span v-else          key="done">✓ Marked for today</span>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const marked = ref(false)
function mark() { marked.value = true }
</script>

<style scoped>
.mark-btn {
  width: 100%; max-width: 280px;
  height: 52px; border-radius: 14px;
  border: 1px solid #a0ec06;
  background: #a0ec06;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px; font-weight: 600;
  color: #0a0a0a; cursor: pointer;
  transition:
    background-color 200ms ease,
    color            200ms ease,
    border-color     200ms ease,
    transform        100ms ease;
}
.mark-btn:hover:not(.marked) { transform: translateY(-1px); }
.mark-btn:active:not(.marked){ transform: scale(0.97); }
.mark-btn.marked {
  background: rgba(160,236,6,0.10);
  color: #a0ec06;
  border-color: rgba(160,236,6,0.3);
  cursor: default;
}

/* Label crossfade */
.mark-label-enter-active,
.mark-label-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.mark-label-enter-from { opacity: 0; transform: translateY(7px); }
.mark-label-leave-to   { opacity: 0; transform: translateY(-7px); }
</style>
