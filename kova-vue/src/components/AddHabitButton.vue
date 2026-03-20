<template>
  <button
    class="add-btn"
    :class="{ added }"
    :disabled="added"
    @click="handle"
  >
    <Transition name="label" mode="out-in">
      <span v-if="!added" key="add">+ Add</span>
      <span v-else key="added">✓ Added</span>
    </Transition>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const emit  = defineEmits(['add'])
const added = ref(false)

function handle() {
  added.value = true
  emit('add')
}
</script>

<style scoped>
.add-btn {
  height: 28px;
  padding: 0 10px;
  border: 0.5px solid rgba(160,236,6,0.25);
  border-radius: 8px;
  background: rgba(160,236,6,0.09);
  color: #a0ec06;
  font-size: 11px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition:
    transform        150ms ease,
    background-color 150ms ease;
}
.add-btn:hover:not(.added)  { transform: scale(1.03); }
.add-btn:active:not(.added) { transform: scale(0.92); }
.add-btn.added {
  background: rgba(160,236,6,0.14);
  cursor: default;
}

/* Label crossfade */
.label-enter-active,
.label-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.label-enter-from   { opacity: 0; transform: translateY(5px); }
.label-leave-to     { opacity: 0; transform: translateY(-5px); }
</style>
