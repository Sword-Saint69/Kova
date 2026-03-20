<template>
  <div
    class="habit-row"
    :class="{
      'is-checked': checked,
      'is-shattering': isShattering,
      'is-dragging': isDragging
    }"
    draggable="true"
    @click="toggle"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="habit-dot" :style="{ background: color }" />

    <!-- Checkbox with SVG stroke draw -->
    <div class="checkbox" :class="{ checked }">
      <svg v-if="checked" width="10" height="8" viewBox="0 0 10 8" fill="none" class="check-svg">
        <path d="M1 4l3 3 5-6" stroke="#0a0a0a" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" class="check-path"/>
      </svg>
    </div>

    <span class="habit-name">{{ name }}</span>

    <!-- ANIMATION: Confetti particles on check -->
    <div class="confetti-container" aria-hidden="true">
      <div v-for="p in confetti" :key="p.id" class="confetti-dot"
           :style="{ '--dx': p.dx + 'px', '--dy': p.dy + 'px', '--r': p.r + 'deg', animationDelay: p.d + 'ms' }" />
    </div>

    <!-- ANIMATION: Shatter clip-path pieces -->
    <div v-if="isShattering" class="shatter-overlay" aria-hidden="true">
      <div v-for="s in shards" :key="s.id" class="shard" :style="s.style" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ name: string; color: string }>();
const emit    = defineEmits(['change', 'dragstart', 'dragend']);
const checked = ref(false);
const confetti = ref<any[]>([]);
const isShattering = ref(false);
const isDragging = ref(false);
const shards = ref<any[]>([]);

function launchConfetti() {
  confetti.value = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    dx: (Math.random() - 0.5) * 60,
    dy: -(20 + Math.random() * 40),
    r: (Math.random() - 0.5) * 180,
    d: Math.random() * 80
  }));
  setTimeout(() => { confetti.value = []; }, 900);
}

function triggerShatter() {
  // Generate 6 clip-path shards
  shards.value = [
    { id: 0, style: { clipPath: 'polygon(0 0, 55% 0, 30% 60%, 0 100%)',       '--tx': '-40px', '--ty': '-30px', '--tr': '-20deg' } },
    { id: 1, style: { clipPath: 'polygon(55% 0, 100% 0, 100% 50%, 40% 40%)',  '--tx': '40px',  '--ty': '-20px', '--tr': '15deg'  } },
    { id: 2, style: { clipPath: 'polygon(0 100%, 30% 60%, 50% 100%)',          '--tx': '-50px', '--ty': '30px',  '--tr': '-25deg' } },
    { id: 3, style: { clipPath: 'polygon(50% 100%, 100% 50%, 100% 100%)',      '--tx': '50px',  '--ty': '40px',  '--tr': '30deg'  } },
    { id: 4, style: { clipPath: 'polygon(30% 60%, 40% 40%, 65% 75%, 50% 100%)','--tx': '-10px', '--ty': '50px',  '--tr': '10deg'  } },
    { id: 5, style: { clipPath: 'polygon(40% 40%, 100% 50%, 65% 75%)',         '--tx': '20px',  '--ty': '30px',  '--tr': '-10deg' } },
  ];
  isShattering.value = true;
  setTimeout(() => { isShattering.value = false; shards.value = []; }, 700);
}

function toggle() {
  const wasChecked = checked.value;
  checked.value = !checked.value;
  emit('change', checked.value);

  if (checked.value) {
    launchConfetti();
  } else if (wasChecked) {
    triggerShatter();
  }
}

function onDragStart(e: DragEvent) {
  isDragging.value = true;
  emit('dragstart', e);
}
function onDragEnd(e: DragEvent) {
  isDragging.value = false;
  emit('dragend', e);
}
</script>

<style scoped>
.habit-row {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 10px;
  background: #181818; cursor: pointer;
  transition: background 150ms ease, transform 220ms cubic-bezier(0.34,1.56,0.64,1),
              box-shadow 220ms ease;
  user-select: none;
  position: relative; overflow: visible;
}
.habit-row:hover { background: #202020; }

/* ANIMATION: Drag lift — shadow + scale when actively dragging */
.habit-row.is-dragging {
  transform: scale(1.03) rotate(0.5deg);
  box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(160,236,6,0.15);
  background: #242424;
  z-index: 100;
}

.habit-dot {
  width: 8px; height: 8px;
  border-radius: 50%; flex-shrink: 0;
}
.checkbox {
  width: 18px; height: 18px; border-radius: 5px;
  border: 1.5px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background-color 120ms ease, border-color 120ms ease;
}
.checkbox.checked {
  background-color: #a0ec06; border-color: #a0ec06;
  animation: check-spring 280ms cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes check-spring {
  0%   { transform: scale(1); }
  30%  { transform: scale(0.75); }
  60%  { transform: scale(1.15); }
  80%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}

/* ANIMATION 3 — Checkmark stroke draw */
.check-path {
  stroke-dasharray: 14; stroke-dashoffset: 14;
  animation: stroke-draw 200ms cubic-bezier(0.16,1,0.3,1) 60ms forwards;
}
@keyframes stroke-draw { to { stroke-dashoffset: 0; } }

.habit-name {
  font-size: 13px; font-weight: 500; color: #f0ede8; flex: 1;
  transition: color 200ms ease;
}
.is-checked .habit-name {
  color: rgba(240,237,232,0.35);
  text-decoration: line-through;
  text-decoration-color: rgba(240,237,232,0.2);
}

/* ANIMATION: Confetti burst — lime particles explode outward */
.confetti-container {
  position: absolute; top: 50%; left: 30px;
  pointer-events: none; z-index: 10;
}
.confetti-dot {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #a0ec06;
  animation: confetti-fly 700ms cubic-bezier(0.16,1,0.3,1) both;
  box-shadow: 0 0 4px rgba(160,236,6,0.6);
}
.confetti-dot:nth-child(even) {
  background: #5DCAA5;
  border-radius: 2px;
  width: 5px; height: 5px;
}
@keyframes confetti-fly {
  0%   { opacity: 1; transform: translate(0,0) rotate(0deg) scale(1); }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--r)) scale(0.4); }
}

/* ANIMATION: Shatter — clip-path shards fly apart */
.shatter-overlay {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 5;
  border-radius: 10px; overflow: hidden;
}
.shard {
  position: absolute; inset: 0;
  background: rgba(160,236,6,0.4);
  animation: shard-fly 600ms cubic-bezier(0.4,0,1,1) forwards;
}
@keyframes shard-fly {
  0%   { opacity: 1; transform: translate(0,0) rotate(0deg); }
  100% { opacity: 0; transform: translate(var(--tx), var(--ty)) rotate(var(--tr)); }
}
</style>
