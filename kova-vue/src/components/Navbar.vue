<template>
  <nav class="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-xl no-line-rule border-none">
    <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
      <div class="flex items-center gap-[10px]">
        <img src="/logo-full.png" alt="Mark" class="h-[60px] w-[100px] object-cover object-left" style="object-position: 0% 50%;">
        <span class="font-headline font-black text-[22px] text-[#a0ec06]"></span>
      </div>

      <!-- ANIMATION 5: Nav links with animated sliding underline -->
      <div class="hidden md:flex gap-8 items-center cursor-pointer nav-links" ref="linksEl">
        <a
          v-for="link in links"
          :key="link.id"
          class="nav-link font-body text-sm tracking-tight cursor-pointer"
          :class="{ 'is-active': activeLink === link.id }"
          @click.prevent="handleNavClick(link.id)"
        >{{ link.label }}</a>
      </div>

      <!-- ANIMATION 6: Get Started — shimmer sweep on hover -->
      <button class="btn-get-started" @click.prevent>
        Get Started <span class="material-symbols-outlined" style="font-size:15px;vertical-align:middle;">arrow_forward</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const links = [
  { id: 'features',    label: 'Features' },
  { id: 'dashboard',   label: 'Dashboard' },
  { id: 'how-it-works',label: 'How it Works' },
  { id: 'pricing',     label: 'Pricing' },
];

const activeLink = ref('features');

function handleNavClick(id) {
  activeLink.value = id;
  scrollTo(id);
}

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
}
</script>

<style scoped>
/* ANIMATION 5 — Sliding underline follows active link */
.nav-link {
  position: relative;
  color: rgba(173, 170, 170, 0.85);
  padding-bottom: 4px;
  transition: color 200ms ease;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #a0ec06;
  border-radius: 99px;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-link:hover { color: #f0ede8; }
.nav-link.is-active {
  color: #a0ec06;
  font-weight: 700;
}
.nav-link.is-active::after {
  transform: scaleX(1);
}

/* ANIMATION 6 — Get Started: shimmer sweep */
.btn-get-started {
  position: relative;
  overflow: hidden;
  background: #a0ec06;
  color: #0a0a0a;
  font-weight: 600;
  font-size: 14px;
  padding: 0 20px;
  height: 36px;
  border-radius: 99px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: transform 150ms ease;
}
.btn-get-started:active { transform: scale(0.95); }

.btn-get-started::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  transform: skewX(-20deg);
  transition: left 0s;
}
.btn-get-started:hover::before {
  left: 160%;
  transition: left 550ms ease;
}
</style>
