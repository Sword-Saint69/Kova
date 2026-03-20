<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="isVisible" class="toast-card">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#a0ec06" fill-opacity="0.2"/>
          <path d="M5 8l2 2 4-4" stroke="#a0ec06" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'
const { isVisible, message } = useToast()
</script>

<style scoped>
.toast-card {
  position: fixed; bottom: 32px; left: 50%;
  transform: translateX(-50%);
  background: #181818;
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 99px;
  padding: 10px 16px;
  display: flex; align-items: center; gap: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 500;
  color: #f0ede8; z-index: 1000;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.toast-enter-active {
  transition: opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out);
}
.toast-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}
.toast-enter-from { opacity: 0; transform: translate(-50%, 16px); }
.toast-leave-to   { opacity: 0; transform: translate(-50%, 10px); }
</style>
