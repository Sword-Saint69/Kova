<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['dismiss'])

let timeout

watch(() => props.visible, (newVal) => {
  if (timeout) clearTimeout(timeout)
  if (newVal) {
    timeout = setTimeout(() => {
      emit('dismiss')
    }, 2600)
  }
})

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast-wrapper">
      <div class="toast-indicator" />
      <span class="toast-msg">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast-wrapper {
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

.toast-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #a0ec06;
  flex-shrink: 0;
}

.toast-msg {
  font-size: 13px;
  color: #f0ede8;
  font-family: 'DM Sans', sans-serif;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.toast-enter-to {
  opacity: 1;
  transform: translate(-50%, 0);
}

.toast-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
