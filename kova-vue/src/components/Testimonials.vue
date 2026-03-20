<script setup>
import { computed } from 'vue';

const testimonials = [
  {
    quote: '"KoVA turned my chaotic coding schedule into a visual masterpiece. It\'s the GitHub of my whole life."',
    name: 'Marcus Thorne',
    role: 'Senior Dev, Linear',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLBb47hMMLgistY_a3dM1ceG1YT9lLrF2zUS6RJ8WXyTTdE3b8EMT2VtYgs3e8XYoc0wZdV9nrzrLWTBBXOvq8P3AU5rAZcqkdTbRCEfj613ZcgRD4i6bUxJdfpelQ8AHCR530Dnu7eIfXnrFjOpCA8Msw_3WQbQGChUD7BEjliu3A-uCleAmrBGaMLcTMg6j-EFD2TSt39z2xr4MgL3RIES5-VnrUEmPIn5vhehfMhNCViXwtkbUgYKVx00kVTd7clTqFyvles7fb'
  },
  {
    quote: '"The editorial design is what hooked me. Tracking habits no longer feels like admin—it feels like art."',
    name: 'Elena Rossi',
    role: 'Art Director',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY_blVyuj8U2sFhwkt4EK017z5T2yrVcncZrrpRA7jyY7afFzJZCLLtO6wBcGNhXBnScUfZ7TQtOS4I-v8ekFOy9hxb8vRHj3bp-j8Y2jHFR0fazngTMLR0Jwao4GOZ65ohhZaRyN37XvsFMQSNHb-95hLSH0aJPfhK03HcO5-PYC0mDj9OJGB6IZBo5E804xGaQG3t3jVlxWShiadx10YNRp_8aDaft8_Ibj_eepW8610SEiEqOwnu-_YvCiRvjeqTPaADKky_FzH'
  },
  {
    quote: '"Unapologetically premium. Finally a tool that matches the intensity of my focus."',
    name: 'Julian Vane',
    role: 'Founder, Void',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvhY7Z6ewLGkDdH2lgv8p4FxBpScsNij_QGmEVX7E53rCYfQf56ODmMZ-4R92nfaEMf6vCM817S4GVhzCcsbPH2pHzfQs6l82qBleGplPxaXb2R_bvj_DsQuvtBVtxOi8cl3D6EvvYZbQ7VzflO3oghhX8RKpACfFTcsn-xi4KUCf5VpNdQT8OxTcvmGmwdi1f49UgfYqqO9YV6k3tKLHiTo-PmqAwvXXTfmFi-9qx9z0Z_O1s2wxzH328NPv-7mOoYsWPoC-7yaks'
  }
];

const getGridCells = () => {
  const result = [];
  for (let i = 0; i < 24; i++) {
    const level = Math.floor(Math.random() * 6);
    const color = level === 0 ? 'rgba(255,255,255,0.05)' : `rgba(160,236,6,${level * 0.2})`;
    result.push({ id: i, color });
  }
  return result;
};
</script>

<template>
  <section class="max-w-7xl mx-auto px-8 py-24 bg-surface-container-lowest rounded-3xl mb-24">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div 
        v-for="(t, idx) in testimonials" 
        :key="idx"
        class="bg-surface-container-low p-8 rounded-2xl space-y-6 border border-white/5"
      >
        <div class="grid grid-cols-8 grid-rows-3 gap-1 w-fit">
          <div 
            v-for="cell in getGridCells()" 
            :key="cell.id"
            class="w-3 h-3 rounded-[1px]"
            :style="{ backgroundColor: cell.color }"
          ></div>
        </div>
        <p class="text-lg italic font-medium leading-snug">{{ t.quote }}</p>
        <div class="flex items-center gap-4">
          <img alt="" class="w-10 h-10 rounded-full grayscale" :src="t.avatar"/>
          <div>
            <p class="text-sm font-bold">{{ t.name }}</p>
            <p class="text-xs text-on-surface-variant">{{ t.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
