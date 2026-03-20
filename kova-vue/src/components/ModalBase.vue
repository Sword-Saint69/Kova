<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-box">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits(['close'])
</script>

<style>
/* Overlay fades */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }

/* Box scales in/out */
.modal-enter-active .modal-box {
  transition: transform 0.3s var(--ease-out), opacity 0.25s ease;
}
.modal-leave-active .modal-box {
  transition: transform 0.2s var(--ease-in), opacity 0.2s ease;
}
.modal-enter-from .modal-box { transform: scale(0.92); opacity: 0; }
.modal-leave-to  .modal-box  { transform: scale(0.95); opacity: 0; }

.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
}
.modal-box {
  background: #111; border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 18px; padding: 28px; max-width: 480px; width: 90%;
}
</style>
