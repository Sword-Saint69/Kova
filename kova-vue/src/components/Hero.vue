<script setup>
import { ref, onMounted } from 'vue';

const counterEl = ref(null);
const displayed = ref(2350);

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function runSocialCounter() {
  const from = 2350;
  const to = 2400;
  const duration = 1200;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    displayed.value = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }

  setTimeout(() => requestAnimationFrame(tick), 300);
}

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    runSocialCounter();
  }, { threshold: 0.5 });
  if (counterEl.value) observer.observe(counterEl.value);
});

// CTA spring press state
const pressing = ref(false);
function onPress() { pressing.value = true; }
function onRelease() { pressing.value = false; }
</script>

<template>
  <section class="hero-section relative w-full bg-[#0a0a0a] overflow-hidden">
    <div class="hero-inner relative z-10">
        <!-- Left Side -->
        <div class="hero-left">
            <div class="space-y-4">
                <span class="block text-[11px] font-medium uppercase tracking-[0.15em] text-primary/60">HABIT ENGINEERING</span>
                <h1 class="font-headline font-black leading-[0.9] tracking-tighter">
                    <span class="text-[#f0ede8] italic block text-[72px]">Your life,</span>
                    <span class="text-primary block text-[72px]">in squares.</span>
                </h1>
            </div>
            
            <div class="space-y-1 mb-10 max-w-[560px]">
                <p class="text-[16px] font-light text-on-surface-variant leading-[4]">Track every habit. See every pattern.</p>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4">
                <!-- ANIMATION 4: CTA spring scale-down on press -->
                <button
                  class="btn-start-free flex items-center gap-2"
                  :class="{ 'is-pressing': pressing }"
                  @mousedown="onPress"
                  @mouseup="onRelease"
                  @mouseleave="onRelease"
                >
                    Start for free <span class="material-symbols-outlined">arrow_forward</span>
                </button>

                <!-- ANIMATION 8: Ghost button — border color walks around on hover -->
                <button class="btn-see-profile">
                    See a live profile
                </button>
            </div>

            <!-- ANIMATION 9: Avatar stack — fan out on hover -->
            <div class="flex items-center gap-3 pt-4" ref="counterEl">
                <div class="avatar-stack">
                    <img alt="" class="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe3kCAHCETkT4YojhOPs9Ok1iyA8doQ9FGgXaT6qOspcFkJ7rY5UnATbe2NsdotPOAjDKmd4WFLHJ34ggixl7PFRkAHoQJ_xxV852h_TzZv64uPFGib5tWPppduMZYYdl8HrcyRydRV9pGdvPRDOsvT76taE6ivq3lyHH1iXhWr26X3sUSQhjvZzl7gIgDhW3MfcLY02P8OYOEu1uPfBBK8TktzBqetZjOkHpnoR-loEyl0RYs6Si37QA1tINS-LEpYh4h8u61G92f"/>
                    <img alt="" class="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBloccDxiqZRNhOr1NEtmOC8u6KWGEnsTxhQozg-R4A6Opx6IYb7Wd1_YVvBsd61CqRCn1Apo6ahJtsZ9JRr5HOZ5ppS8D3zSNg-dYxrTgBHu_BLD3GkILGnlwMf6_2Oo2MQTGi_hGnez0NQtc8lpliyN0I0oNa2yN7FRWxc2VVvPTNwM1ER3d_2mwui7O9b3YBEYvnL5TX_fBHhNkVhohKoGlsJcMg-b_geKUICmsLPljiWSuEC4UwFfnlEhxSMEJ1NSf4Gv_xXKQy"/>
                    <img alt="" class="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAiNMqSEAUGKzbMdl-oqy5Hdqz5CnnrL3CYsSis5Np-g3Lcal1ECM_REvLfP5efzjem3IktuSMKYQ9ORlCneHA0pFuUlL2exndqPXy8Ixtg1gQEw23LFWQem74MWfYQD-Sa-7jrrt0uyRH_S3i3QICIuiq21Q2hS9Ud6a1pWdKDZhakqCMu25O4VV8rXNbsZOCIQFwOiKKHnXmFoDTvFyyvqPIwfIgCnI3ZQV01uq_RzW_oqwRTAUUqHcpbnK8wu6WuRHn2LGIv6xa"/>
                </div>
                <!-- ANIMATION 14: Social proof counter increments on scroll-in -->
                <p class="text-[13px] font-body font-normal text-[#f0ede8]/45">
                    Joined by <span class="font-medium">{{ displayed.toLocaleString() }}+ builders</span>
                </p>
            </div>
        </div>

        <!-- Right Side Stats -->
        <div class="hero-right">
            <span class="stat-large">32</span>
            <span class="stat-label">day streak</span>
            
            <div class="mini-grid">
                <div v-for="(cell, idx) in miniCells" :key="idx" class="mini-cell" :style="{ backgroundColor: cell.color }"></div>
            </div>

            <div class="streak-pill">
                🔥 32 days in a row
            </div>
        </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
      <span class="text-[11px] font-light uppercase tracking-widest">Scroll to explore</span>
      <span class="material-symbols-outlined text-sm animate-bounce-subtle">keyboard_arrow_down</span>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue';

const colors = {
  empty: '#181818',
  level1: '#085041',
  level2: '#0F6E56',
  level3: '#1D9E75',
  level4: '#5DCAA5',
  level5: '#a0ec06'
};

export default {
  setup() {
    const miniCells = computed(() => {
      const result = [];
      for (let i = 0; i < 12 * 7; i++) {
        const col = Math.floor(i / 7);
        let level = 0;
        const random = Math.random();
        
        if (col >= 0 && col <= 3) {
          level = random < 0.8 ? 0 : 1;
        } else if (col >= 4 && col <= 7) {
          if (random < 0.5) level = random < 0.5 ? 1 : 2;
          else level = random < 0.5 ? 2 : 3;
        } else if (col >= 8 && col <= 11) {
          level = random < 0.3 ? 3 : (random < 0.65 ? 4 : 5);
        }
        
        result.push({
          id: i,
          color: level === 0 ? colors.empty : colors[`level${level}`]
        });
      }
      return result;
    });
    return { miniCells };
  }
}
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-inner {
  display: grid;
  grid-template-columns: 55% 45%;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
}

.hero-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 560px;
  padding-right: 60px;
}

.hero-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding-left: 40px;
}

.stat-large {
  font-family: 'Bodoni Moda', serif;
  font-weight: 900;
  font-size: 120px;
  color: #a0ec06;
  line-height: 1;
  text-align: center;
}

.stat-label {
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  font-size: 18px;
  color: rgba(240,237,232,0.50);
  margin-top: -8px;
  text-align: center;
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(12, 10px);
  grid-template-rows: repeat(7, 10px);
  gap: 2px;
  width: 142px;
}

.mini-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.streak-pill {
  background: rgba(160,236,6,0.10);
  border: 0.5px solid rgba(160,236,6,0.25);
  border-radius: 99px;
  padding: 4px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #a0ec06;
}

/* ANIMATION 4 — CTA button spring press */
.btn-start-free {
  border-radius: 10px;
  height: 52px;
  background: #a0ec06;
  color: #0a0a0a;
  font-size: 15px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  padding: 0 24px;
  border: none;
  cursor: pointer;
  transition: transform 80ms ease, background-color 150ms ease;
}
.btn-start-free:hover { background: #b8f520; }
.btn-start-free.is-pressing {
  transform: scale(0.95);
  transition: transform 60ms ease;
}
/* Spring snap back */
.btn-start-free:not(.is-pressing) {
  transition: transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 150ms ease;
}

/* ANIMATION 8 — Ghost button border walk (conic-gradient sweep) */
.btn-see-profile {
  position: relative;
  border-radius: 10px;
  height: 52px;
  background: transparent;
  color: rgba(240,237,232,0.55);
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  padding: 0 20px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: color 200ms ease;
}
.btn-see-profile::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 11px;
  padding: 1px;
  background: rgba(255,255,255,0.13);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  transition: background 300ms ease;
}
.btn-see-profile::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  border: 0.5px solid transparent;
  background: conic-gradient(from var(--angle, 0deg), transparent 60%, rgba(160,236,6,0.7) 80%, transparent 100%) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 200ms ease;
}
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
.btn-see-profile:hover::after {
  opacity: 1;
  animation: border-spin 1.8s linear infinite;
}
.btn-see-profile:hover { color: #f0ede8; }

@keyframes border-spin {
  to { --angle: 360deg; }
}

/* ANIMATION 9 — Avatar stack fans out */
.avatar-stack {
  display: flex;
  align-items: center;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #a0ec06;
  object-fit: cover;
  margin-left: -8px;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0s;
  position: relative;
}
.avatar:first-child { margin-left: 0; }
.avatar-stack:hover .avatar:nth-child(1) { transform: translateX(-6px); z-index: 3; }
.avatar-stack:hover .avatar:nth-child(2) { transform: translateX(0px);  z-index: 2; }
.avatar-stack:hover .avatar:nth-child(3) { transform: translateX(6px);  z-index: 1; }

@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 60px;
    padding-top: 120px;
    padding-bottom: 80px;
  }
}
</style>
