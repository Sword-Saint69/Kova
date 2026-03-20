<template>
  <div
    class="cell-wrap"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <div
      class="cell"
      :style="{
        background: COLORS[level],
        border: level === 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
      }"
    />

    <Transition name="tooltip">
      <div v-if="show" class="tooltip">
        <p class="tt-date">{{ date }}</p>
        <p class="tt-status" :class="{ done: level > 0 }">
          {{ level > 0 ? 'Completed' : 'Not done' }}
        </p>
        <p v-if="note" class="tt-note">"{{ note }}"</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  date:   string
  level:  0|1|2|3|4|5
  note?:  string
}>()

const COLORS = ['#181818','#085041','#0F6E56','#1D9E75','#5DCAA5','#a0ec06']
const show   = ref(false)
let timer:     ReturnType<typeof setTimeout>

function handleEnter() {
  // 80ms delay prevents tooltip flickering on fast mouse moves
  timer = setTimeout(() => { show.value = true }, 80)
}
function handleLeave() {
  clearTimeout(timer)
  show.value = false
}
</script>

<style scoped>
.cell-wrap { position: relative; }

.cell {
  width: 11px; height: 11px;
  border-radius: 2px; flex-shrink: 0;
  cursor: default;
  transition: transform 100ms ease;
}
.cell-wrap:hover .cell { transform: scale(1.35); }

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: calc(100% + 7px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e1e1e;
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 7px 10px;
  white-space: nowrap;
  z-index: 50;
  pointer-events: none;
  transform-origin: bottom center;
}
.tt-date {
  font-size: 11px; font-weight: 500;
  color: #f0ede8; margin: 0;
}
.tt-status {
  font-size: 10px; color: rgba(240,237,232,0.4);
  margin: 2px 0 0;
}
.tt-status.done { color: #a0ec06; }
.tt-note {
  font-size: 10px; color: rgba(240,237,232,0.45);
  font-style: italic; margin: 4px 0 0;
  max-width: 140px; white-space: normal;
}

/* Tooltip transitions */
.tooltip-enter-active {
  transition:
    opacity   0.12s var(--ease-out),
    transform 0.12s var(--ease-out);
}
.tooltip-leave-active {
  transition:
    opacity   0.1s ease-in,
    transform 0.1s ease-in;
}
.tooltip-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.85) translateY(4px);
}
.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.9) translateY(3px);
}
</style>
