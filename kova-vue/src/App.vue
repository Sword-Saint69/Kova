<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Hero from './components/Hero.vue';
import BentoGrid from './components/BentoGrid.vue';
import DashboardMockup from './components/DashboardMockup.vue';
import Process from './components/Process.vue';
import Testimonials from './components/Testimonials.vue';
import Pricing from './components/Pricing.vue';
import CtaBanner from './components/CtaBanner.vue';
import Footer from './components/Footer.vue';
import ScrollProgress from './components/ScrollProgress.vue';

// ANIMATION: Color scheme shift — background bleeds #0a0a0a → deep navy on scroll past hero
const bgColor = ref('#0a0a0a');

// ANIMATION: Section velocity snapping — sections magnetize on fast scroll
let lastScrollY = 0;
let lastScrollTime = Date.now();
let snapTimeout = null;
const sections = ['hero-section', 'features', 'dashboard', 'how-it-works', 'pricing'];

function lerp(a, b, t) { return a + (b - a) * t; }

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return { r, g, b };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2,'0')).join('');
}

function onScroll() {
  const scrollY = window.scrollY;
  const heroHeight = window.innerHeight;

  // -- Color shift --
  const progress = Math.min(scrollY / heroHeight, 1);
  const from = hexToRgb('#0a0a0a');
  const to   = hexToRgb('#040d1a'); // deep navy
  bgColor.value = rgbToHex({
    r: lerp(from.r, to.r, progress),
    g: lerp(from.g, to.g, progress),
    b: lerp(from.b, to.b, progress),
  });

  // -- Velocity snapping --
  const now = Date.now();
  const dt = now - lastScrollTime;
  const velocity = Math.abs(scrollY - lastScrollY) / (dt || 1);
  lastScrollY = scrollY;
  lastScrollTime = now;

  if (velocity > 2.5) {
    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      // Find which section is closest to viewport center
      let closest = null;
      let minDist = Infinity;
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top);
        if (dist < minDist) { minDist = dist; closest = el; }
      });
      if (closest && minDist < window.innerHeight * 0.6) {
        closest.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  }
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  clearTimeout(snapTimeout);
});
</script>

<template>
  <div
    class="min-h-screen text-on-surface font-body selection:bg-primary/25 overflow-x-hidden"
    :style="{ backgroundColor: bgColor, transition: 'background-color 60ms linear' }"
  >
    <!-- ANIMATION: Page scroll progress lime bar -->
    <ScrollProgress />

    <!-- ANIMATION: Route transitions — slide + fade out-in -->
    <Navbar />

    <Transition name="page" mode="out-in" appear>
      <main class="shrink-0">
        <Hero id="hero-section" />
        <BentoGrid id="features" />
        <DashboardMockup id="dashboard" />
        <Process id="how-it-works" />
        <Testimonials />
        <Pricing id="pricing" />
        <CtaBanner />
      </main>
    </Transition>

    <Footer />
  </div>
</template>

<style>
/* Global styles are in style.css */

/* ANIMATION 1 — Route page transitions slide + fade */
.page-enter-active {
  transition: opacity 350ms var(--ease-out, cubic-bezier(0.16,1,0.3,1)),
              transform 350ms var(--ease-out, cubic-bezier(0.16,1,0.3,1));
}
.page-leave-active {
  transition: opacity 200ms ease-in,
              transform 200ms ease-in;
}
.page-enter-from { opacity: 0; transform: translateY(14px); }
.page-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>
