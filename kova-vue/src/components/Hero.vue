<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

/* ─── Social proof counter ─── */
const counterEl = ref(null);
const displayed = ref(2350);

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function runSocialCounter() {
  const from = 2350, to = 2400, duration = 1200;
  const startTime = performance.now();
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    displayed.value = Math.round(from + (to - from) * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(tick);
  }
  setTimeout(() => requestAnimationFrame(tick), 300);
}

/* ─── Hero stat "32" bloom ─── */
const statEl = ref(null);
const statDisplayed = ref(0);
const statLocked = ref(false);
function runStatBloom() {
  const target = 32, duration = 800;
  const startTime = performance.now();
  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    statDisplayed.value = Math.round(target * easeOutCubic(t));
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      statDisplayed.value = 32;
      statLocked.value = true; // lock permanently after bloom finishes
    }
  }
  requestAnimationFrame(tick);
}

onMounted(() => {
  // Social counter observer
  const obs1 = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    obs1.disconnect();
    runSocialCounter();
  }, { threshold: 0.5 });
  if (counterEl.value) obs1.observe(counterEl.value);

  // Stat bloom observer
  const obs2 = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    obs2.disconnect();
    setTimeout(runStatBloom, 150);
  }, { threshold: 0.5 });
  if (statEl.value) obs2.observe(statEl.value);

  // ANIMATION: Scroll-jacked stat + parallax
  window.addEventListener('scroll', onHeroScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onHeroScroll);
});

// CTA spring press
const pressing = ref(false);
function onPress()   { pressing.value = true;  }
function onRelease() { pressing.value = false; }

/* ─── ANIMATION: Scroll-jacked stat + Parallax layers ─── */
const heroEl = ref(null);
const parallaxHeadline = ref(0);
const parallaxStat = ref(0); // once we hit 32, stop going back

function onHeroScroll() {
  const scrollY = window.scrollY;
  const heroH   = window.innerHeight;

  // Parallax: only while hero is in view
  if (scrollY <= heroH * 1.2) {
    parallaxHeadline.value = scrollY * 0.35;
    parallaxStat.value     = scrollY * 0.15;
  }

  // Scroll-jacked stat: counts up as you scroll, locks at 32 — never goes back
  if (!statLocked.value) {
    const progress = Math.min(scrollY / (heroH * 0.4), 1);
    statDisplayed.value = Math.round(32 * progress);
    if (statDisplayed.value >= 32) {
      statDisplayed.value = 32;
      statLocked.value = true; // permanently locked
    }
  }
}

/* ─── Mini heatmap cells ─── */
const colors = {
  empty: '#181818', level1: '#085041', level2: '#0F6E56',
  level3: '#1D9E75', level4: '#5DCAA5', level5: '#a0ec06'
};
const miniCells = computed(() => {
  const result = [];
  for (let i = 0; i < 12 * 7; i++) {
    const col = Math.floor(i / 7);
    let level = 0;
    const r = Math.random();
    if      (col <= 3)  level = r < 0.8 ? 0 : 1;
    else if (col <= 7)  level = r < 0.25 ? 1 : r < 0.55 ? 2 : 3;
    else                level = r < 0.3  ? 3 : r < 0.65 ? 4 : 5;
    result.push({ id: i, col, color: level === 0 ? colors.empty : colors[`level${level}`] });
  }
  return result;
});
</script>

<template>
  <section class="hero-section relative w-full bg-[#0a0a0a] overflow-hidden" ref="heroEl">
    <div class="hero-inner relative z-10">
        <!-- ANIMATION: Parallax layers — left moves at 0.35x, right at 0.15x scroll speed -->
        <!-- Left Side -->
        <div
          class="hero-left"
          :style="{ transform: `translateY(${parallaxHeadline}px)`, willChange: 'transform' }"
        >
            <!-- ANIMATION 16: Headline stagger — fade-up 80ms apart -->
            <div class="space-y-4">
                <span class="eyebrow-line block text-[11px] font-medium uppercase tracking-[0.15em] text-primary/60">HABIT ENGINEERING</span>
                <h1 class="font-headline font-black leading-[0.9] tracking-tighter">
                    <span class="headline-line-1 text-[#f0ede8] italic block text-[72px]">Your life,</span>
                    <span class="headline-line-2 text-primary block text-[72px]">in squares.</span>
                </h1>
            </div>
            
            <div class="space-y-1 mb-10 max-w-[560px]">
                <p class="subline text-[16px] font-light text-on-surface-variant leading-[4]">Track every habit. See every pattern.</p>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4">
                <!-- ANIMATION 4: CTA spring press -->
                <button
                  class="btn-start-free flex items-center gap-2"
                  :class="{ 'is-pressing': pressing }"
                  @mousedown="onPress"
                  @mouseup="onRelease"
                  @mouseleave="onRelease"
                  @click="router.push('/login')"
                >
                    Start for free <span class="material-symbols-outlined">arrow_forward</span>
                </button>
                <!-- ANIMATION 8: Ghost border walk on hover -->
                <button class="btn-see-profile">
                    See a live profile
                </button>
            </div>

            <!-- ANIMATION 9: Avatar fan out on hover -->
            <!-- ANIMATION 14: Social proof counter -->
            <div class="flex items-center gap-3 pt-4" ref="counterEl">
                <div class="avatar-stack">
                    <img alt="" class="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe3kCAHCETkT4YojhOPs9Ok1iyA8doQ9FGgXaT6qOspcFkJ7rY5UnATbe2NsdotPOAjDKmd4WFLHJ34ggixl7PFRkAHoQJ_xxV852h_TzZv64uPFGib5tWPppduMZYYdl8HrcyRydRV9pGdvPRDOsvT76taE6ivq3lyHH1iXhWr26X3sUSQhjvZzl7gIgDhW3MfcLY02P8OYOEu1uPfBBK8TktzBqetZjOkHpnoR-loEyl0RYs6Si37QA1tINS-LEpYh4h8u61G92f"/>
                    <img alt="" class="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBloccDxiqZRNhOr1NEtmOC8u6KWGEnsTxhQozg-R4A6Opx6IYb7Wd1_YVvBsd61CqRCn1Apo6ahJtsZ9JRr5HOZ5ppS8D3zSNg-dYxrTgBHu_BLD3GkILGnlwMf6_2Oo2MQTGi_hGnez0NQtc8lpliyN0I0oNa2yN7FRWxc2VVvPTNwM1ER3d_2mwui7O9b3YBEYvnL5TX_fBHhNkVhohKoGlsJcMg-b_geKUICmsLPljiWSuEC4UwFfnlEhxSMEJ1NSf4Gv_xXKQy"/>
                    <img alt="" class="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAiNMqSEAUGKzbMdl-oqy5Hdqz5CnnrL3CYsSis5Np-g3Lcal1ECM_REvLfP5efzjem3IktuSMKYQ9ORlCneHA0pFuUlL2exndqPXy8Ixtg1gQEw23LFWQem74MWfYQD-Sa-7jrrt0uyRH_S3i3QICIuiq21Q2hS9Ud6a1pWdKDZhakqCMu25O4VV8rXNbsZOCIQFwOiKKHnXmFoDTvFyyvqPIwfIgCnI3ZQV01uq_RzW_oqwRTAUUqHcpbnK8wu6WuRHn2LGIv6xa"/>
                </div>
                <p class="text-[13px] font-body font-normal text-[#f0ede8]/45">
                    Joined by <span class="font-medium">{{ displayed.toLocaleString() }}+ builders</span>
                </p>
            </div>
        </div>

        <!-- Right Side Stats -->
        <div
          class="hero-right"
          ref="statEl"
          :style="{ transform: `translateY(${parallaxStat}px)`, willChange: 'transform' }"
        >
            <!-- ANIMATION: Gradient blob — slow-morphing radial behind the stat -->
            <div class="stat-blob" aria-hidden="true"></div>

            <!-- ANIMATION 17: Stat "32" blooms from 0 on mount -->
            <span class="stat-large">{{ statDisplayed }}</span>
            <span class="stat-label">day streak</span>
            
            <!-- ANIMATION 18: Mini heatmap columns appear left-to-right via CSS delay -->
            <div class="mini-grid">
                <div
                  v-for="cell in miniCells"
                  :key="cell.id"
                  class="mini-cell"
                  :style="{
                    backgroundColor: cell.color,
                    '--col-delay': `${cell.col * 40}ms`
                  }"
                ></div>
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

/* ANIMATION 16 — Headline stagger */
.eyebrow-line {
  opacity: 0;
  transform: translateY(12px);
  animation: fade-up-in 400ms var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) 100ms forwards;
}
.headline-line-1 {
  opacity: 0;
  transform: translateY(16px);
  animation: fade-up-in 500ms var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) 220ms forwards;
}
.headline-line-2 {
  opacity: 0;
  transform: translateY(16px);
  animation: fade-up-in 500ms var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) 300ms forwards;
}
.subline {
  opacity: 0;
  transform: translateY(10px);
  animation: fade-up-in 400ms var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) 420ms forwards;
}

@keyframes fade-up-in {
  to { opacity: 1; transform: translateY(0); }
}

/* ANIMATION 10 — Gradient blob: morphing radial behind the stat */
.stat-blob {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(160,236,6,0.14) 0%, transparent 70%);
  filter: blur(40px);
  animation: blob-morph 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}
@keyframes blob-morph {
  0%   { transform: scale(1)    rotate(0deg);   opacity: 0.7; border-radius: 50% 40% 60% 50%; }
  33%  { transform: scale(1.15) rotate(60deg);  opacity: 1;   border-radius: 40% 60% 50% 60%; }
  66%  { transform: scale(0.9)  rotate(120deg); opacity: 0.6; border-radius: 60% 50% 40% 50%; }
  100% { transform: scale(1)    rotate(180deg); opacity: 0.7; border-radius: 50% 40% 60% 50%; }
}

/* ANIMATION 17 — Stat bloom */
.stat-large {
  font-family: 'Bodoni Moda', serif;
  font-weight: 900;
  font-size: 120px;
  color: #a0ec06;
  line-height: 1;
  text-align: center;
  transition: none;
}
.stat-label {
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  font-size: 18px;
  color: rgba(240,237,232,0.50);
  margin-top: -8px;
  text-align: center;
}

/* ANIMATION 18 — Mini heatmap columns left-to-right stagger */
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
  opacity: 0;
  transform: scaleY(0.4);
  transform-origin: bottom;
  animation: cell-rise 280ms var(--ease-out, cubic-bezier(0.16,1,0.3,1)) var(--col-delay, 0ms) forwards;
}
@keyframes cell-rise {
  to { opacity: 1; transform: scaleY(1); }
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

/* ANIMATION 4 — CTA spring press */
.btn-start-free {
  border-radius: 10px;
  height: 52px;
  background: #a0ec06;
  color: #0a0a0a;
  font-size: 15px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  padding: 0 24px;
  border: none; cursor: pointer;
  transition: background-color 150ms ease;
}
.btn-start-free:hover { background: #b8f520; }
.btn-start-free.is-pressing {
  transform: scale(0.95);
  transition: transform 60ms ease;
}
.btn-start-free:not(.is-pressing) {
  transition: transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 150ms ease;
}

/* ANIMATION 8 — Ghost border walk */
.btn-see-profile {
  position: relative;
  border-radius: 10px;
  height: 52px;
  background: transparent;
  color: rgba(240,237,232,0.55);
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  padding: 0 20px;
  border: 0.5px solid rgba(255,255,255,0.13);
  cursor: pointer;
  overflow: hidden;
  transition: color 200ms ease, border-color 200ms ease;
}
.btn-see-profile:hover {
  color: #f0ede8;
  border-color: rgba(160,236,6,0.4);
}
.btn-see-profile::before {
  content: '';
  position: absolute;
  top: 0; left: -120%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(160,236,6,0.15), transparent);
  transform: skewX(-20deg);
}
.btn-see-profile:hover::before {
  left: 140%;
  transition: left 600ms ease;
}

/* ANIMATION 9 — Avatar fan out */
.avatar-stack { display: flex; align-items: center; }
.avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1.5px solid #a0ec06;
  object-fit: cover;
  margin-left: -8px;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.avatar:first-child { margin-left: 0; }
.avatar-stack:hover .avatar:nth-child(1) { transform: translateX(-6px); z-index: 3; }
.avatar-stack:hover .avatar:nth-child(2) { transform: translateX(0px);  z-index: 2; }
.avatar-stack:hover .avatar:nth-child(3) { transform: translateX(6px);  z-index: 1; }

/* ─── Mobile responsive ─── */
@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 48px;
    padding-top: 100px;
    padding-bottom: 80px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .hero-left {
    padding-right: 0;
    max-width: 100%;
    align-items: center;
    text-align: center;
  }
  .hero-right {
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .headline-line-1,
  .headline-line-2 {
    font-size: 52px !important;
  }
  .stat-large {
    font-size: 80px;
  }
  .stat-label {
    font-size: 15px;
  }
  .hero-left {
    align-items: flex-start;
    text-align: left;
  }
  .btn-start-free,
  .btn-see-profile {
    width: 100%;
    justify-content: center;
  }
  .flex.flex-col.sm\:flex-row {
    flex-direction: column;
  }
  .avatar-stack .avatar {
    width: 28px;
    height: 28px;
  }
  .mini-grid {
    grid-template-columns: repeat(12, 8px);
    grid-template-rows: repeat(7, 8px);
    width: 118px;
  }
  .mini-cell {
    width: 8px;
    height: 8px;
  }
  .stat-blob {
    width: 220px;
    height: 220px;
  }
  .streak-pill {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .headline-line-1,
  .headline-line-2 {
    font-size: 42px !important;
  }
  .stat-large {
    font-size: 64px;
  }
  .hero-inner {
    padding-top: 88px;
    gap: 36px;
  }
}
</style>
