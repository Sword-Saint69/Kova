<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const added = ref(false)

const handle = () => {
  if (added.value) return
  added.value = true
  emit('add')
}
</script>

<template>
  <button
    @click="handle"
    class="add-btn"
    :class="{ 'is-added': added }"
  >
    <Transition name="add-text" mode="out-in">
      <span v-if="added" key="added" class="btn-text">
        ✓ Added
      </span>
      <span v-else key="add" class="btn-text">
        + Add
      </span>
    </Transition>
  </button>
</template>

<style scoped>
.add-btn {
  height: 28px;
  padding: 0 10px;
  border: 0.5px solid rgba(160,236,6,0.25);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(160,236,6,0.09);
  color: #a0ec06;
  font-size: 11px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  transition: background-color 0.15s ease, transform 0.1s;
}

.add-btn:not(.is-added):active {
  transform: scale(0.92);
}

.add-btn.is-added {
  background-color: rgba(160,236,6,0.14);
  cursor: default;
}

.btn-text {
  display: inline-block;
}

.add-text-enter-active,
.add-text-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.add-text-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.add-text-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
