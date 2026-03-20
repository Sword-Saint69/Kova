<template>
  <!-- ANIMATION: Navbar shrinks + blurs harder after 80px scroll -->
  <nav class="kova-nav" :class="{ scrolled: isScrolled }">
    <div class="nav-inner" :class="{ scrolled: isScrolled }">
      <div class="flex items-center gap-[10px]">
        <img src="/logo-full.png" alt="Mark" class="nav-logo" :class="{ scrolled: isScrolled }"
             style="object-position: 0% 50%;">
        <span class="font-headline font-black text-[22px] text-[#a0ec06]"></span>
      </div>

      <!-- ANIMATION 5: Sliding underline follows active link -->
      <div class="hidden md:flex gap-8 items-center cursor-pointer">
        <a
          v-for="link in links"
          :key="link.id"
          class="nav-link font-body text-sm tracking-tight cursor-pointer"
          :class="{ 'is-active': activeLink === link.id }"
          @click.prevent="handleNavClick(link.id)"
        >{{ link.label }}</a>
      </div>

      <!-- ANIMATION 6: Get Started shimmer -->
      <button class="btn-get-started" @click="router.push('/login')">
        Get Started <span class="material-symbols-outlined" style="font-size:15px;vertical-align:middle;">arrow_forward</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const links = [
  { id: 'features',     label: 'Features' },
  { id: 'dashboard',    label: 'Dashboard' },
  { id: 'how-it-works', label: 'How it Works' },
  { id: 'pricing',      label: 'Pricing' },
];

const activeLink = ref('features');
const isScrolled = ref(false);

function handleScroll() {
  isScrolled.value = window.scrollY > 80;
}

function handleNavClick(id) {
  activeLink.value = id;
  const el = document.getElementById(id);
  if (el) {
    const offsetPosition = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
/* ANIMATION: Navbar shrink — height + blur intensify after 80px scroll */
.kova-nav {
  position: fixed; top: 0; width: 100%; z-index: 50;
  background: rgba(10,10,10,0);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 0.5px solid rgba(255,255,255,0);
  /* Smooth all properties */
  transition:
    background 300ms ease,
    backdrop-filter 300ms ease,
    border-color 300ms ease,
    box-shadow 300ms ease;
}
.kova-nav.scrolled {
  background: rgba(10,10,10,0.85);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-bottom-color: rgba(255,255,255,0.06);
  box-shadow: 0 1px 0 rgba(255,255,255,0.04);
}

.nav-inner {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 32px;
  max-width: 1280px; margin: 0 auto;
  transition: padding 300ms cubic-bezier(0.16,1,0.3,1);
}
.nav-inner.scrolled { padding: 10px 32px; }

.nav-logo {
  height: 60px; width: 100px; object-fit: cover; object-position: 0% 50%;
  transition: height 300ms cubic-bezier(0.16,1,0.3,1),
              width 300ms cubic-bezier(0.16,1,0.3,1);
}
.nav-logo.scrolled { height: 40px; width: 68px; }

/* ANIMATION 5 — Sliding underline */
.nav-link {
  position: relative; color: rgba(173,170,170,0.85); padding-bottom: 4px;
  transition: color 200ms ease;
  text-decoration: none;
}
.nav-link::after {
  content: '';
  position: absolute; bottom: -2px; left: 0; right: 0;
  height: 2px; background: #a0ec06; border-radius: 99px;
  transform: scaleX(0); transform-origin: left center;
  transition: transform 220ms cubic-bezier(0.34,1.56,0.64,1);
}
.nav-link:hover { color: #f0ede8; }
.nav-link.is-active { color: #a0ec06; font-weight: 700; }
.nav-link.is-active::after { transform: scaleX(1); }

/* ANIMATION 6 — Get Started shimmer sweep */
.btn-get-started {
  position: relative; overflow: hidden;
  background: #a0ec06; color: #0a0a0a;
  font-weight: 600; font-size: 14px; padding: 0 20px; height: 36px;
  border-radius: 99px; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 4px;
  transition: transform 150ms ease;
}
.btn-get-started:active { transform: scale(0.95); }
.btn-get-started::before {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  transform: skewX(-20deg); transition: left 0s;
}
.btn-get-started:hover::before { left: 160%; transition: left 550ms ease; }
</style>
