<template>
  <section class="max-w-7xl mx-auto px-8 py-24" ref="sectionEl">
    <div class="mb-16 reveal-item" :class="{ visible: isVisible }">
      <h2 class="text-primary text-xs font-bold tracking-[0.3em] mb-4 uppercase">The Core Team</h2>
      <h3 class="text-[44px] font-headline font-[900] italic leading-tight">Built by Obsession.</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div 
        v-for="(member, idx) in team" 
        :key="idx" 
        class="team-member space-y-6"
        :class="{ visible: isVisible }"
        :style="{ '--member-delay': `${idx * 150}ms` }"
      >
        <div class="relative group">
          <!-- Black Placeholder Photo -->
          <div class="aspect-square bg-black rounded-2xl overflow-hidden border border-white/10 transition-transform duration-500 group-hover:scale-[1.02] shadow-2xl">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <!-- Decorative accent -->
          <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors"></div>
        </div>
        
        <div class="space-y-1">
          <p class="text-primary text-[11px] font-bold uppercase tracking-widest">{{ member.role }}</p>
          <h4 class="text-2xl font-headline font-black italic">{{ member.name }}</h4>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const team = [
  { name: 'Goutham Sankar', role: 'Tech Lead' },
  { name: 'Hari', role: 'Senior Dev' },
  { name: 'Hibah', role: 'Design Architect' }
];

const sectionEl = ref(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    isVisible.value = true;
  }, { threshold: 0.2 });
  if (sectionEl.value) observer.observe(sectionEl.value);
});
</script>

<style scoped>
.team-member {
  opacity: 0;
  transform: translateY(30px);
  transition: 
    opacity 600ms ease var(--member-delay, 0ms),
    transform 600ms var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) var(--member-delay, 0ms);
}

.team-member.visible {
  opacity: 1;
  transform: translateY(0);
}

.font-headline {
  font-family: 'Bodoni Moda', serif;
}
</style>
