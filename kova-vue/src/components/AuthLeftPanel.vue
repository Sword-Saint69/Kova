<template>
  <section 
    class="flex w-full lg:w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-8 md:p-16 lg:min-h-screen left-panel-enter lg:sticky lg:top-0 h-auto lg:h-screen z-20"
    :class="{ 'mobile-collapsed': isScrolled }"
    @mousemove="handleMouseMove"
    @click="handleRipple"
    ref="panelEl"
  >
    <!-- 38. Noise grain overlay (Animated) -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.04] z-0 mix-blend-overlay noise-anim"></div>

    <!-- 35. Lime ambient blob -->
    <div class="absolute w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -top-40 -left-40 animate-blob pointer-events-none"></div>
    <div class="absolute w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full bottom-20 right-0 animate-blob-reverse pointer-events-none"></div>

    <!-- 39. Mouse-tracked light -->
    <div 
      class="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      :style="{
        background: `radial-gradient(600px circle at ${mouseX + panelWidth/2}px ${mouseY + panelHeight/2}px, rgba(160,236,6,0.08), transparent 80%)`,
        opacity: isMouseIn ? 1 : 0
      }"
    ></div>

    <!-- 37. Scanline sweep -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.03]">
      <div class="scanline"></div>
    </div>

    <!-- 1. Dot-grid parallax -->
    <div 
      class="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out z-0" 
      :style="{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(160,236,6,0.18) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        opacity: 0.18,
        transform: `translate(${mouseX * -0.02}px, ${mouseY * -0.02}px)`
      }"
    >
      <!-- 36. Grid cell highlight (Random flashes) -->
      <div v-for="h in highlights" :key="h.id" 
           class="absolute w-[2px] h-[2px] bg-primary shadow-[0_0_8px_#a0ec06] rounded-full transition-opacity duration-500"
           :style="{ left: h.x + 'px', top: h.y + 'px', opacity: h.opacity }"></div>
    </div>

    <!-- 47. Cursor trail -->
    <div v-for="p in trail" :key="p.id" 
         class="absolute w-1.5 h-1.5 bg-primary/40 rounded-full pointer-events-none z-10"
         :style="{ left: p.x + 'px', top: p.y + 'px', transform: 'scale(' + p.scale + ')', opacity: p.opacity }"></div>

    <!-- 6. Dot grid ripple effect -->
    <div 
      v-for="ripple in ripples" 
      :key="ripple.id"
      class="absolute rounded-full border border-primary/40 pointer-events-none z-0 ripple-anim"
      :style="{
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
        transform: 'translate(-50%, -50%)'
      }"
    ></div>

    <!-- 4. Watermark star slow-spin & 5. pulse breathe -->
    <div 
      class="pointer-events-none absolute z-0 star-anim" 
      style="width:380px;height:380px;background:radial-gradient(circle,#a0ec06 2px,transparent 0);background-size:44px 44px;clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);opacity:0.04;left:50%;top:50%;margin-left:-190px;margin-top:-190px;"
    ></div>

    <!-- Brand logo -->
    <div class="relative z-10">
      <img src="/logo-full.png" alt="KOVA" class="h-14 w-auto object-left object-contain" />
    </div>

    <!-- Hero headline -->
    <div class="relative z-10 max-w-xl">
      <h1 class="font-headline italic text-[80px] text-white leading-[0.92] tracking-tight">
        <!-- 2. Headline word stagger -->
        <!-- 3. Headline glitch reveal -->
        <span class="inline-block overflow-hidden align-bottom glitch-wrap pb-2">
            <span class="word-stagger inline-block" style="--delay: 100ms">Every&nbsp;</span>
        </span>
        <span class="inline-block overflow-hidden align-bottom glitch-wrap pb-2">
            <span class="word-stagger inline-block" style="--delay: 200ms">day&nbsp;</span>
        </span>
        <span class="inline-block overflow-hidden align-bottom glitch-wrap pb-2">
            <span class="word-stagger inline-block" style="--delay: 300ms">is&nbsp;</span>
        </span>
        <span class="inline-block overflow-hidden align-bottom glitch-wrap pb-2">
            <span class="word-stagger inline-block" style="--delay: 400ms">a</span>
        </span>
        <br/>
        <!-- 9. "data point." lime glow -->
        <span class="inline-block overflow-hidden align-bottom glitch-wrap pt-2">
            <span class="word-stagger text-primary not-italic font-black block mt-2 glow-pulse inline-block" style="--delay: 550ms">data point.</span>
        </span>
      </h1>
      <p class="mt-5 text-[11px] font-body font-medium tracking-[0.22em] uppercase text-primary/55 delay-fade" style="--delay: 800ms;">
        Technical Rituals for the Modern Mind
      </p>
    </div>

    <!-- Step indicators -->
    <div class="relative z-10 flex flex-col gap-3">
      <!-- 8/33. Step indicator + line fill -->
      <div class="flex items-center gap-2">
        <div class="h-1.5 w-10 bg-white/10 rounded-full relative overflow-hidden">
             <div class="absolute inset-y-0 left-0 bg-primary w-full transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]" :style="{ transform: step >= 1 ? 'translateX(0)' : 'translateX(-100%)' }"></div>
        </div>
        <div class="h-1.5 w-10 bg-white/10 rounded-full relative overflow-hidden">
             <div class="absolute inset-y-0 left-0 bg-primary w-full transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]" :style="{ transform: step >= 2 ? 'translateX(0)' : 'translateX(-100%)' }"></div>
        </div>
        <div class="h-2 w-2 rounded-full transition-colors duration-500" :class="step >= 3 ? 'bg-primary shadow-[0_0_10px_#a0ec06]' : 'bg-white/10'"></div>
      </div>
      <p class="text-[10px] font-body uppercase tracking-widest text-white/30 font-medium delay-fade" style="--delay: 900ms;">
        Account <span class="mx-1 opacity-40 transition-colors" :class="{ 'text-primary': step >= 2 }">·</span> Habits <span class="mx-1 opacity-40 transition-colors" :class="{ 'text-primary': step >= 3 }">·</span> Profile
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  step: { type: Number, default: 1 }
});

const panelEl = ref(null);
const panelWidth = ref(0);
const panelHeight = ref(0);
const mouseX = ref(0);
const mouseY = ref(0);
const isMouseIn = ref(false);
const ripples = ref([]);
const highlights = ref([]);
const trail = ref([]);
let rippleId = 0;
let highlightId = 0;
let trailId = 0;

function handleMouseMove(e) {
  if (!panelEl.value) return;
  isMouseIn.value = true;
  const rect = panelEl.value.getBoundingClientRect();
  panelWidth.value = rect.width;
  panelHeight.value = rect.height;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  mouseX.value = x - (rect.width / 2);
  mouseY.value = y - (rect.height / 2);

  // 47. Cursor trail
  const id = trailId++;
  trail.value.push({ id, x, y, scale: 1, opacity: 0.8 });
  if (trail.value.length > 20) trail.value.shift();
}

function updateTrail() {
  trail.value.forEach(p => {
    p.scale *= 0.85;
    p.opacity *= 0.85;
  });
  trail.value = trail.value.filter(p => p.opacity > 0.05);
  requestAnimationFrame(updateTrail);
}

// 36. Grid cell highlight logic
function triggerHighlight() {
  if (!panelEl.value) return;
  const id = highlightId++;
  // Snap to grid coordinates (bg-size 28px)
  const x = Math.floor(Math.random() * (panelWidth.value / 28)) * 28 + 1;
  const y = Math.floor(Math.random() * (panelHeight.value / 28)) * 28 + 1;
  
  highlights.value.push({ id, x, y, opacity: 1 });
  
  setTimeout(() => {
    const h = highlights.value.find(h => h.id === id);
    if (h) h.opacity = 0;
    setTimeout(() => {
      highlights.value = highlights.value.filter(h => h.id !== id);
    }, 500);
  }, 1000);

  setTimeout(triggerHighlight, 1000 + Math.random() * 2000);
}

function handleRipple(e) {
  if (!panelEl.value) return;
  const rect = panelEl.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const id = rippleId++;
  ripples.value.push({ id, x, y });
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id);
  }, 1000);
}

onMounted(() => {
  requestAnimationFrame(updateTrail);
  triggerHighlight();
});
</script>

<style scoped>
/* 38. Noise grain overlay (Animated) */
.noise-anim {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  animation: grain 1s steps(2) infinite;
}
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1%, -1%); }
  30% { transform: translate(1%, -1%); }
  50% { transform: translate(-1%, 1%); }
  70% { transform: translate(1%, 1%); }
  90% { transform: translate(-1%, -1%); }
}

/* 35. Ambient Blobs */
.animate-blob {
  animation: blob-float 15s infinite alternate ease-in-out;
}
.animate-blob-reverse {
  animation: blob-float-reverse 12s infinite alternate ease-in-out;
}
@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 40px) scale(1.1); }
}
@keyframes blob-float-reverse {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-30px, -20px) scale(1.05); }
}

/* 37. Scanline sweep */
.scanline {
  position: absolute;
  top: -100px; left: 0; right: 0;
  height: 100px;
  background: linear-gradient(to bottom, transparent, #a0ec06, transparent);
  animation: scan 8s linear infinite;
}
@keyframes scan {
  from { transform: translateY(0); }
  to { transform: translateY(120vh); }
}

/* 10. Left panel slide-in */
.left-panel-enter {
  animation: panel-slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes panel-slide-in {
  from { transform: translateX(-5%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* 4 & 5. Watermark star slow-spin & pulse breathe */
.star-anim {
  animation: star-spin 60s linear infinite, star-breathe 8s ease-in-out infinite alternate;
}
@keyframes star-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes star-breathe {
  from { transform: scale(1); opacity: 0.03; }
  to { transform: scale(1.08); opacity: 0.06; }
}

/* 6. Dot grid ripple */
.ripple-anim {
  width: 0px;
  height: 0px;
  animation: ripple-out 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes ripple-out {
  0% { width: 0px; height: 0px; opacity: 1; border-width: 2px; }
  100% { width: 400px; height: 400px; opacity: 0; border-width: 0.5px; }
}

/* 2. Headline word stagger */
.word-stagger {
  transform: translateY(110%);
  opacity: 0;
  animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) forwards;
}

/* 3. Headline clean reveal */
@keyframes fade-up {
  0% { transform: translateY(110%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* 9. "data point." lime glow pulse */
.glow-pulse {
  animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) forwards,
             text-glow-loop 4s ease-in-out var(--delay) infinite alternate;
}
@keyframes text-glow-loop {
  0% { text-shadow: 0 0 0px rgba(160,236,6,0); }
  100% { text-shadow: 0 0 20px rgba(160,236,6,0.4); }
}

/* General staggered fade for subheadings */
.delay-fade {
  opacity: 0;
  transform: translateY(10px);
  animation: simple-fade-up 0.5s ease-out var(--delay) forwards;
}
@keyframes simple-fade-up {
  to { opacity: 1; transform: translateY(0); }
}
</style>
