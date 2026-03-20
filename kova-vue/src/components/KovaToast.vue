<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast">
        <div class="toast-dot" />
        <span class="toast-text">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({ message: String, visible: Boolean })
const emit  = defineEmits(['dismiss'])

watch(() => props.visible, (v) => {
  if (v) setTimeout(() => emit('dismiss'), 2600)
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #111;
  border: 0.5px solid rgba(160,236,6,0.25);
  border-radius: 12px;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  white-space: nowrap;
  pointer-events: none;
}
.toast-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #a0ec06;
  flex-shrink: 0;
}
.toast-text {
  font-size: 13px;
  color: #f0ede8;
  font-family: 'DM Sans', sans-serif;
}

/* Toast slide up/down */
.toast-enter-active {
  transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out);
}
.toast-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
