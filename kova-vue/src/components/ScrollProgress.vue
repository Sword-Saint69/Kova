<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);

function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
}

onMounted(() => window.addEventListener('scroll', updateProgress, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', updateProgress));
</script>

<template>
  <!-- ANIMATION: Thin lime progress line at top of viewport -->
  <div class="scroll-progress-track">
    <div class="scroll-progress-fill" :style="{ width: progress + '%' }" />
  </div>
</template>

<style scoped>
.scroll-progress-track {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: transparent;
  z-index: 9999;
  pointer-events: none;
}
.scroll-progress-fill {
  height: 100%;
  background: #a0ec06;
  box-shadow: 0 0 8px rgba(160, 236, 6, 0.6);
  transition: width 80ms linear;
  border-radius: 0 2px 2px 0;
}
</style>
