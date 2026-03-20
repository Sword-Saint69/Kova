<template>
  <div
    class="cell-wrap"
    @mouseenter="startShow"
    @mouseleave="cancelShow"
  >
    <div
      class="cell"
      :style="{ background: color, border: level === 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none' }"
    />

    <Transition name="tooltip">
      <div v-if="show" class="tooltip">
        <p class="tooltip-date">{{ date }}</p>
        <p class="tooltip-status" :class="{ done: level > 0 }">
          {{ level > 0 ? 'Completed' : 'Not done' }}
        </p>
        <p v-if="note" class="tooltip-note">"{{ note }}"</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  date:   String,
  level:  Number,
  note:   String
})

const COLORS = ['#181818','#085041','#0F6E56','#1D9E75','#5DCAA5','#a0ec06']
const color  = COLORS[props.level]

const show    = ref(false)
let   timer

function startShow() {
  timer = setTimeout(() => { show.value = true }, 80)
}
function cancelShow() {
  clearTimeout(timer)
  show.value = false
}
</script>

<style scoped>
.cell-wrap { position: relative; }

.cell {
  width: 11px; height: 11px;
  border-radius: 2px;
  flex-shrink: 0;
  cursor: default;
  transition: transform 100ms ease;
}
.cell-wrap:hover .cell { transform: scale(1.3); }

.tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
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
.tooltip-date {
  font-size: 11px; font-weight: 500;
  color: #f0ede8; margin: 0;
  font-family: 'DM Sans', sans-serif;
}
.tooltip-status {
  font-size: 10px; margin: 2px 0 0;
  color: rgba(240,237,232,0.4);
  font-family: 'DM Sans', sans-serif;
}
.tooltip-status.done { color: #a0ec06; }
.tooltip-note {
  font-size: 10px; margin: 4px 0 0;
  color: rgba(240,237,232,0.45);
  font-style: italic;
  max-width: 130px; white-space: normal;
  font-family: 'DM Sans', sans-serif;
}

/* Tooltip appear/disappear */
.tooltip-enter-active {
  transition: opacity 0.12s var(--ease-out), transform 0.12s var(--ease-out);
}
.tooltip-leave-active {
  transition: opacity 0.1s ease-in, transform 0.1s ease-in;
}
.tooltip-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.88) translateY(4px);
}
.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.92) translateY(3px);
}
</style>
