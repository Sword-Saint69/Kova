<template>
  <section 
    class="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-16 left-panel-enter"
    @mousemove="handleMouseMove"
    @click="handleRipple"
    ref="panelEl"
  >
    <!-- 7. Lime noise grain -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay">
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.63  0 0 0 0 0.92  0 0 0 0 0.02  0 0 0 1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)"/>
      </svg>
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
    ></div>

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
      <!-- 8. Step indicator fill -->
      <div class="flex items-center gap-2">
        <div class="h-1.5 w-10 bg-white/20 rounded-full relative overflow-hidden">
             <div class="absolute inset-y-0 left-0 bg-primary w-full step-fill" style="--delay: 800ms"></div>
        </div>
        <div class="h-1.5 w-10 bg-white/20 rounded-full relative overflow-hidden">
             <div class="absolute inset-y-0 left-0 bg-primary w-full step-fill" :style="{ '--delay': step === 2 ? '1000ms' : '0ms', transform: step === 2 ? '' : 'translateX(-100%)' }"></div>
             <!-- For register, step 2 is empty. For login, step 2 fills. -->
             <div v-if="step === 1" class="absolute inset-y-0 left-0 bg-primary w-full" style="transform: translateX(-100%)"></div>
        </div>
        <div class="h-2 w-2 bg-white/20 rounded-full"></div>
      </div>
      <p class="text-[10px] font-body uppercase tracking-widest text-white/30 font-medium delay-fade" style="--delay: 900ms;">
        Account <span class="mx-1 opacity-40">·</span> Habits <span class="mx-1 opacity-40">·</span> Profile
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    step: {
        type: Number,
        default: 1
    }
});

const panelEl = ref(null);
const mouseX = ref(0);
const mouseY = ref(0);
const ripples = ref([]);
let rippleId = 0;

function handleMouseMove(e) {
  if (!panelEl.value) return;
  const rect = panelEl.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left - (rect.width / 2);
  mouseY.value = e.clientY - rect.top - (rect.height / 2);
}

function handleRipple(e) {
  if (!panelEl.value) return;
  const rect = panelEl.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const id = rippleId++;
  ripples.value.push({ id, x, y });
  
  // Remove ripple after animation completes
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id);
  }, 1000);
}

</script>

<style scoped>
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
  animation: fade-up-glitch 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) forwards;
}

/* 3. Headline glitch reveal (incorporated into the fade-up) */
@keyframes fade-up-glitch {
  0% { transform: translateY(110%); opacity: 0; clip-path: inset(100% 0 0 0); }
  40% { transform: translateY(0); opacity: 1; clip-path: inset(0 0 50% 0); transform: translateX(-4px); }
  60% { clip-path: inset(50% 0 0 0); transform: translateX(2px); }
  80% { clip-path: inset(0 0 0 0); transform: translateX(-1px); }
  100% { transform: translateY(0) translateX(0); opacity: 1; clip-path: inset(0 0 0 0); }
}

/* 9. "data point." lime glow pulse */
.glow-pulse {
  animation: fade-up-glitch 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) forwards,
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

/* 8. Step indicator fill */
.step-fill {
  transform: translateX(-100%);
  animation: progress-fill 0.8s cubic-bezier(0.87, 0, 0.13, 1) var(--delay) forwards;
}
@keyframes progress-fill {
  to { transform: translateX(0); }
}

</style>
