<script setup>
import Heatmap from './Heatmap.vue';
</script>

<template>
  <TransitionGroup name="stagger" tag="section" class="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-3 gap-6" appear>
    <!-- Tile 1: Visualize -->
    <div class="bg-surface-container-low p-8 rounded-2xl group overflow-hidden border border-white/5 tile-hover" :style="{ '--delay': '0ms' }" key="1">
      <h3 class="text-on-surface-variant text-xs font-bold tracking-[0.2em] mb-4 uppercase">Visualize</h3>
      <p class="text-2xl font-bold mb-2">Every day, rendered.</p>
      <p class="text-on-surface-variant text-sm mb-8 font-light">Your habits become a living grid. One year. One truth.</p>
      <div class="opacity-60 group-hover:opacity-100 transition-opacity">
        <Heatmap :rows="7" :cols="7" gap="4px" cellSize="100%" stretch />
      </div>
    </div>
    <!-- Tile 2: Build -->
    <div class="bg-primary p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden border border-primary/20 tile-hover" :style="{ '--delay': '55ms' }" key="2">
      <svg class="absolute top-4 right-4 text-on-primary-container opacity-20 w-8 h-8" fill="currentColor" viewbox="0 0 24 24">
        <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z"></path>
      </svg>
      <svg class="absolute bottom-20 left-6 text-on-primary-container opacity-20 w-6 h-6" fill="currentColor" viewbox="0 0 24 24">
        <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z"></path>
      </svg>
      <div>
        <h3 class="text-on-primary-container text-xs font-bold tracking-[0.2em] mb-4 uppercase">Build</h3>
        <div class="flex flex-col">
          <span class="text-[88px] font-headline font-[900] leading-none text-on-primary-container">32</span>
          <span class="text-on-primary-container text-[14px] font-medium uppercase tracking-wider -mt-2">days in a row</span>
        </div>
      </div>
      <p class="text-on-primary-container font-medium text-sm mt-8">Your streak. Your record.</p>
    </div>
    <!-- Tile 3: Share -->
    <div class="bg-surface-container-low p-8 rounded-2xl flex flex-col justify-between group border border-[#a0ec0633] tile-hover" :style="{ '--delay': '110ms' }" key="3">
      <div>
        <h3 class="text-on-surface-variant text-xs font-bold tracking-[0.2em] mb-4 uppercase">Share</h3>
        <p class="text-2xl font-bold mb-2">A public proof of work.</p>
        <p class="text-on-surface-variant text-sm font-light">Share your heatmap. Inspire without saying a word.</p>
      </div>
      <div class="bg-surface-container-high rounded-xl p-4 border-[0.5px] border-outline-variant/20 transform group-hover:-translate-y-2 transition-transform mt-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-sm">lock_open</span>
          </div>
          <div class="h-2 w-24 bg-surface-container-highest rounded-full"></div>
        </div>
        <div class="space-y-2">
          <div class="h-1.5 w-full bg-surface-container-highest rounded-full"></div>
          <div class="h-1.5 w-3/4 bg-surface-container-highest rounded-full"></div>
        </div>
      </div>
    </div>
  </TransitionGroup>
</template>

<style scoped>
/* Each item fades up with its stagger delay */
.stagger-enter-active {
  transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
  transition-delay: var(--delay, 0ms);
}
.stagger-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}
.stagger-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.stagger-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* When habits are added/removed, remaining tiles slide smoothly */
.stagger-move {
  transition: transform 0.35s var(--ease-out);
}
</style>
