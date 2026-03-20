<template>
  <!-- ANIMATION: Magnetic button that chases cursor within radius -->
  <button
    ref="btnEl"
    class="magnetic-btn"
    :style="{ transform: `translate(${dx}px, ${dy}px)` }"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <slot />
  </button>
</template>

<script setup>
import { ref } from 'vue';

const btnEl = ref(null);
const dx = ref(0);
const dy = ref(0);

const RADIUS = 40;
const STRENGTH = 0.35;

function onMove(e) {
  const el = btnEl.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const distX = e.clientX - cx;
  const distY = e.clientY - cy;
  const dist = Math.sqrt(distX * distX + distY * distY);
  
  if (dist < RADIUS * 2) {
    dx.value = distX * STRENGTH;
    dy.value = distY * STRENGTH;
  }
}

function onLeave() {
  dx.value = 0;
  dy.value = 0;
}
</script>

<style scoped>
.magnetic-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}
</style>
