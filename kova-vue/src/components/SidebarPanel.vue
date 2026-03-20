<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOpen = defineModel({ type: Boolean, default: false });

function close() { isOpen.value = false; }

// Close on Escape
function onKey(e) { if (e.key === 'Escape') close(); }
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <!-- ANIMATION: Sidebar slides in from left with backdrop fade -->
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="isOpen" class="sidebar-backdrop" @click="close" />
    </Transition>
    <Transition name="sidebar">
      <aside v-if="isOpen" class="sidebar-panel">
        <button class="sidebar-close" @click="close" aria-label="Close">
          <span class="material-symbols-outlined">close</span>
        </button>
        <slot />
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sidebar-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 998;
}
.sidebar-panel {
  position: fixed;
  top: 0; left: 0;
  height: 100dvh;
  width: min(380px, 90vw);
  background: #0f0f0f;
  border-right: 0.5px solid rgba(255,255,255,0.08);
  z-index: 999;
  padding: 28px 24px;
  overflow-y: auto;
}
.sidebar-close {
  position: absolute; top: 16px; right: 16px;
  background: transparent; border: none;
  color: rgba(240,237,232,0.5);
  cursor: pointer;
  transition: color 150ms ease;
}
.sidebar-close:hover { color: #a0ec06; }

/* ANIMATION: Sidebar slide from left */
.sidebar-enter-active {
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
}
.sidebar-leave-active {
  transition: transform 220ms cubic-bezier(0.4, 0, 1, 1);
}
.sidebar-enter-from  { transform: translateX(-100%); }
.sidebar-leave-to    { transform: translateX(-100%); }

/* Backdrop fade */
.backdrop-enter-active { transition: opacity 250ms ease; }
.backdrop-leave-active  { transition: opacity 180ms ease; }
.backdrop-enter-from, .backdrop-leave-to { opacity: 0; }
</style>
