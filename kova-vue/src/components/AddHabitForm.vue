<template>
  <div class="form-layout">
    <!-- Left: form -->
    <div class="form-col">
      <input
        v-model="habitName"
        class="name-input"
        placeholder="Name your ritual..."
        @input="flashPreview"
      />
      <!-- other fields -->
    </div>

    <!-- Right: live preview -->
    <div
      ref="previewCard"
      class="preview-card"
      :class="{ flashing: isFlashing }"
    >
      <span class="preview-label">Preview — Realtime</span>
      <span class="preview-name">{{ habitName || 'Morning Meditation' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const habitName   = ref('')
const previewCard = ref<HTMLElement | null>(null)
const isFlashing  = ref(false)

function flashPreview() {
  // Remove class, force reflow, re-add = restarts animation
  isFlashing.value = false
  void previewCard.value?.offsetWidth  // force reflow
  isFlashing.value = true
  setTimeout(() => { isFlashing.value = false }, 350)
}
</script>

<style scoped>
.name-input {
  width: 100%; height: 64px;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 0;
  padding: 0 4px;
  font-family: 'Bodoni Moda', serif;
  font-weight: 700; font-style: italic;
  font-size: 28px; color: #f0ede8;
  outline: none;
  transition: border-bottom-color 200ms ease;
}
.name-input:focus { border-bottom-color: #a0ec06; }
.name-input::placeholder {
  color: rgba(240,237,232,0.2);
  font-style: italic;
}

.preview-card {
  background: #111;
  border: 0.5px solid rgba(255,255,255,0.07);
  border-radius: 18px; padding: 20px;
}
.preview-card.flashing {
  animation: border-flash 0.35s ease;
}
.preview-label {
  font-size: 10px; color: rgba(240,237,232,0.22);
  text-transform: uppercase; letter-spacing: 0.1em;
  display: block; margin-bottom: 8px;
}
.preview-name {
  font-family: 'Bodoni Moda', serif;
  font-weight: 700; font-style: italic;
  font-size: 20px; color: #f0ede8;
}
</style>
