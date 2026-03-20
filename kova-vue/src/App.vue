<script setup>
import Navbar from './components/Navbar.vue';
import Hero from './components/Hero.vue';
import BentoGrid from './components/BentoGrid.vue';
import DashboardMockup from './components/DashboardMockup.vue';
import Process from './components/Process.vue';
import Testimonials from './components/Testimonials.vue';
import Pricing from './components/Pricing.vue';
import CtaBanner from './components/CtaBanner.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface font-body selection:bg-primary/25 overflow-x-hidden">
    <Navbar class="fade-down" />
    
    <Transition name="page" mode="out-in" appear>
      <main class="shrink-0">
      <Hero />
      <BentoGrid />
      <DashboardMockup />
      <Process />
      <Testimonials />
      <Pricing />
      <CtaBanner />
      </main>
    </Transition>

    <Footer />
  </div>
</template>

<style>
/* Global styles are in style.css */

/* Page transition CSS */
.page-enter-active {
  transition: opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out);
}
.page-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
