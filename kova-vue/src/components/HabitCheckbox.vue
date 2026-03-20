<template>
  <div
    class="habit-row"
    :class="{ 'is-done': checked }"
    @click="toggle"
  >
    <!-- Color dot -->
    <div class="habit-dot" :style="{ background: color }" />

    <!-- Checkbox box -->
    <div class="checkbox" :class="{ checked }">
      <svg
        v-if="checked"
        width="10" height="8" viewBox="0 0 10 8" fill="none"
        class="checkmark-svg"
      >
        <path
          d="M1 4l3 3 5-6"
          stroke="#0a0a0a"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="checkmark-path"
        />
      </svg>
    </div>

    <!-- Habit name -->
    <span class="habit-name">{{ name }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ name: String, color: String })
const checked = ref(false)

function toggle() { checked.value = !checked.value }
</script>

<style scoped>
.habit-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  background: #181818;
  cursor: pointer;
  transition: background 150ms ease;
  user-select: none;
}
.habit-row:hover { background: #202020; }

.habit-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── The checkbox box ── */
.checkbox {
  width: 18px; height: 18px;
  border-radius: 5px;
  border: 1.5px solid rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* Fill and border animate on .checked */
  transition:
    background-color 120ms ease,
    border-color     120ms ease,
    transform        150ms var(--ease-spring);
}
.checkbox.checked {
  background-color: #a0ec06;
  border-color:     #a0ec06;
  /* Brief scale spring on check */
  animation: check-spring 300ms var(--ease-spring);
}

@keyframes check-spring {
  0%   { transform: scale(1);    }
  30%  { transform: scale(0.85); }
  70%  { transform: scale(1.08); }
  100% { transform: scale(1);    }
}

/* ── Checkmark SVG stroke draw ── */
.checkmark-svg { overflow: visible; }

.checkmark-path {
  stroke-dasharray:  14;
  stroke-dashoffset: 14;
  animation: stroke-draw 200ms ease forwards;
  animation-delay: 60ms;  /* starts after box fill */
}

/* ── Habit name dimming ── */
.habit-name {
  font-size: 13px;
  font-weight: 500;
  color: #f0ede8;
  flex: 1;
  transition:
    color            200ms ease,
    text-decoration  200ms ease;
}
.is-done .habit-name {
  color:              rgba(240,237,232,0.35);
  text-decoration:    line-through;
  text-decoration-color: rgba(240,237,232,0.2);
}
</style>
