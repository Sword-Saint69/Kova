<template>
  <div class="filter-row">
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="cat-pill"
      :class="{ active: modelValue === cat.id }"
      @click="handleClick(cat.id, $event)"
    >
      <div
        v-if="cat.color"
        class="cat-dot"
        :style="{ background: cat.color }"
      />
      {{ cat.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: { id: string; label: string; color?: string }[]
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

function handleClick(id: string, e: MouseEvent) {
  // ANIMATION 11: Ripple flood from click origin
  const btn = e.currentTarget as HTMLElement;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.cssText = `
    width: ${size}px; height: ${size}px;
    left: ${e.clientX - rect.left - size / 2}px;
    top:  ${e.clientY - rect.top  - size / 2}px;
  `;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
  emit('update:modelValue', id);
}
</script>

<style scoped>
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; }

.cat-pill {
  display: flex; align-items: center; gap: 7px;
  height: 34px; padding: 0 14px;
  border-radius: 99px;
  border: 0.5px solid rgba(255,255,255,0.13);
  background: transparent;
  color: rgba(240,237,232,0.45);
  font-size: 13px; font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  /* ANIMATION 11: smooth state transitions */
  transition:
    color 200ms ease,
    border-color 200ms ease,
    font-weight 100ms ease;
}

.cat-pill:hover {
  background: rgba(255,255,255,0.04);
  color: #f0ede8;
}
.cat-pill.active {
  background: #a0ec06;
  border-color: #a0ec06;
  color: #0a0a0a;
  font-weight: 600;
}

/* ANIMATION 11 — Ripple flood from center on click */
:global(.ripple) {
  position: absolute;
  border-radius: 50%;
  background: rgba(160, 236, 6, 0.35);
  transform: scale(0);
  animation: ripple-out 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  pointer-events: none;
}
@keyframes ripple-out {
  to { transform: scale(1); opacity: 0; }
}

.cat-dot {
  width: 6px; height: 6px;
  border-radius: 50%; flex-shrink: 0;
}
</style>
