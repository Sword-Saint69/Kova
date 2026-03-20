<script setup>
import { ref, computed, onMounted } from 'vue';

const pulseCells = computed(() => {
  const cols = 36, rows = 7, result = [];
  for (let i = 0; i < cols; i++) {
    const colCells = [];
    for (let j = 0; j < rows; j++) {
      const opacity = Math.random() > 0.3 ? (Math.floor(Math.random() * 5) + 1) * 20 : 5;
      colCells.push({ id: `${i}-${j}`, opacity });
    }
    result.push({ id: i, cells: colCells });
  }
  return result;
});

// Interactive Deep Work checkbox
const deepWorkDone = ref(false);
const completionPct = ref(88);
let pctRaf = null;

function toggleDeepWork() {
  deepWorkDone.value = !deepWorkDone.value;
  const target = deepWorkDone.value ? 100 : 88;
  const start = completionPct.value;
  const duration = 600;
  const startTime = performance.now();
  cancelAnimationFrame(pctRaf);
  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    completionPct.value = Math.round(start + (target - start) * ease);
    if (t < 1) pctRaf = requestAnimationFrame(tick);
  }
  pctRaf = requestAnimationFrame(tick);
}

// ANIMATION 20: Dashboard slides up from below on scroll-in
const mockupEl = ref(null);
const isVisible = ref(false);

// ANIMATION 12: 3D perspective tilt on mouse position
const tiltX = ref(0);
const tiltY = ref(0);

function onMouseMove(e) {
  const el = mockupEl.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);
  tiltX.value = dy * -4; // rotateX
  tiltY.value = dx * 4;  // rotateY
}
function onMouseLeave() {
  tiltX.value = 0;
  tiltY.value = 0;
}

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    isVisible.value = true;
  }, { threshold: 0.15 });
  if (mockupEl.value) observer.observe(mockupEl.value);
});
</script>

<template>
  <section class="max-w-7xl mx-auto px-8 py-24">
    <!-- ANIMATION 12: 3D perspective tilt follows mouse -->
    <div
      class="relative group mockup-reveal tilt-card"
      :class="{ visible: isVisible }"
      ref="mockupEl"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      :style="{
        transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: tiltX === 0 && tiltY === 0 ? 'transform 600ms cubic-bezier(0.16,1,0.3,1)' : 'transform 80ms ease'
      }"
    >
      <div class="absolute inset-0 bg-primary/10 rounded-3xl blur-[120px] pointer-events-none" style="box-shadow: 0 0 120px rgba(160,236,6,0.07);"></div>
      <div class="relative bg-surface-container-low rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <!-- Browser Chrome -->
        <div class="h-[36px] bg-[#0f0f0f] border-b border-white/5 flex items-center px-4 gap-4">
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          </div>
          <div class="flex-1 max-w-md mx-auto">
            <div class="bg-white/5 rounded-md h-5 flex items-center px-3 text-[10px] text-white/30 font-medium tracking-tight">
              kova.app/dashboard
            </div>
          </div>
        </div>
        <!-- Mockup Content -->
        <div class="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 bg-surface-container-lowest">
          <!-- Dashboard Sidebar -->
          <div class="md:col-span-3 space-y-6">
            <div class="space-y-3">
              <p class="text-[10px] uppercase tracking-widest text-white/40 font-bold">Habits</p>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-surface-container-high rounded-lg">
                  <span class="text-sm line-through text-white/30">Morning Sprint</span>
                  <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-surface-container-high rounded-lg">
                  <span class="text-sm line-through text-white/30">Read 20 Pages</span>
                  <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
                </div>
                <!-- Deep Work row — interactive checkbox -->
                <div
                  class="flex items-center justify-between p-3 rounded-lg cursor-pointer deep-work-row"
                  :class="deepWorkDone ? 'bg-primary/10' : 'bg-surface-container-high'"
                  @click="toggleDeepWork"
                >
                  <span
                    class="text-sm transition-all duration-300"
                    :class="deepWorkDone ? 'line-through text-white/30' : 'text-white/70'"
                  >Deep Work Session</span>
                  <div
                    class="check-box"
                    :class="{ 'check-box--done': deepWorkDone }"
                  >
                    <svg v-if="deepWorkDone" width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#0a0a0a" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round" class="check-path"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Dashboard Main -->
          <div class="md:col-span-9 space-y-6">
            <div class="bg-surface-container-high p-6 rounded-xl border border-white/5 overflow-hidden">
              <div class="flex justify-between items-end mb-6">
                <div>
                  <p class="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Consistency Overview</p>
                  <h4 class="text-2xl font-headline italic font-bold">Productivity Pulse</h4>
                </div>
                <div class="text-right">
                  <p class="text-3xl font-headline font-black text-primary transition-all duration-300">
                    {{ completionPct }}%
                  </p>
                  <p class="text-[10px] text-white/40 font-bold">AVG. COMPLETION</p>
                </div>
              </div>
              <div class="flex gap-1.5 overflow-hidden">
                <div 
                  v-for="col in pulseCells" 
                  :key="col.id" 
                  class="flex-1 flex flex-col gap-1.5"
                >
                  <div 
                    v-for="cell in col.cells" 
                    :key="cell.id"
                    class="aspect-square rounded-[2px] w-full transition-all duration-500"
                    :style="{ backgroundColor: cell.opacity > 5 ? `rgba(160,236,6, ${cell.opacity/100})` : 'rgba(255,255,255,0.05)' }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="bg-surface-container-high p-6 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-white/40 font-bold uppercase tracking-widest">Active Streak</p>
                  <p class="text-4xl font-headline font-black italic">14 Days</p>
                </div>
                <span class="material-symbols-outlined text-primary text-4xl">local_fire_department</span>
              </div>
              <div class="bg-surface-container-high p-6 rounded-xl border border-white/5">
                <p class="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-4">Upcoming</p>
                <div class="h-8 bg-white/5 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style>
/* ANIMATION 20 — Dashboard mockup slides up from below */
.mockup-reveal {
  opacity: 0;
  transform: translateY(48px);
  transition: opacity 700ms cubic-bezier(0.16,1,0.3,1),
              transform 700ms cubic-bezier(0.16,1,0.3,1);
}
.mockup-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
