<script setup>
import { computed } from 'vue';

const testimonials = [
  {
    quote: '"KoVA turned my chaotic coding schedule into a visual masterpiece. It\'s the GitHub of my whole life."',
    name: 'Goutham Sankar',
    role: 'Tech Lead',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg=='
  },
  {
    quote: '"The editorial design is what hooked me. Tracking habits no longer feels like admin—it feels like art."',
    name: 'Hari',
    role: 'Senior Dev',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg=='
  },
  {
    quote: '"Unapologetically premium. Finally a tool that matches the intensity of my focus."',
    name: 'Hibah',
    role: 'Design Architect',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg=='
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
