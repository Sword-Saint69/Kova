<template>
  <div class="form-layout">
    <!-- Left: form -->
    <div class="form-col">
      <!-- ANIMATION 13: Search input focus — border glow expands + placeholder fades sideways -->
      <div class="input-wrap" :class="{ focused: isFocused, error: hasError }">
        <input
          v-model="habitName"
          class="name-input"
          :class="{ shaking: isShaking }"
          placeholder="Name your ritual..."
          @input="flashPreview"
          @focus="isFocused = true"
          @blur="handleBlur"
        />
        <div class="input-glow" />
      </div>
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
const isFocused   = ref(false)
const hasError    = ref(false)
const isShaking   = ref(false)

function flashPreview() {
  isFlashing.value = false
  void previewCard.value?.offsetWidth
  isFlashing.value = true
  setTimeout(() => { isFlashing.value = false }, 350)
}

function handleBlur() {
  isFocused.value = false
  // ANIMATION 15: error shake if field empty on blur
  if (!habitName.value.trim()) {
    triggerErrorShake()
  }
}

function triggerErrorShake() {
  hasError.value = true
  isShaking.value = false
  void document.body.offsetWidth // force reflow
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
    hasError.value = false
  }, 500)
}
</script>

<style scoped>
/* ANIMATION 13 — Input: border glow expands on focus */
.input-wrap {
  position: relative;
  border-radius: 4px;
  transition: filter 200ms ease;
}

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
  position: relative;
  z-index: 1;
  transition: border-bottom-color 200ms ease;
}
.name-input:focus { border-bottom-color: #a0ec06; }
.name-input::placeholder {
  color: rgba(240,237,232,0.2);
  font-style: italic;
  transition: transform 250ms ease, opacity 200ms ease;
}
.input-wrap.focused .name-input::placeholder {
  opacity: 0;
  transform: translateX(8px);
}

/* Glow line that expands from center on focus */
.input-glow {
  position: absolute;
  bottom: 0; left: 50%;
  width: 0; height: 1.5px;
  background: #a0ec06;
  filter: blur(1px);
  transform: translateX(-50%);
  transition: width 300ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 200ms ease;
  opacity: 0;
  pointer-events: none;
}
.input-wrap.focused .input-glow {
  width: 100%;
  opacity: 1;
}
.input-wrap.error .input-glow {
  background: #ff4444;
  width: 100%;
  opacity: 1;
}

/* ANIMATION 15 — Error shake */
.name-input.shaking {
  animation: input-shake 450ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes input-shake {
  0%  { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(5px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(3px); }
  75% { transform: translateX(-2px); }
  90% { transform: translateX(1px); }
  100%{ transform: translateX(0); }
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
