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

/* Page transition CSS */
.page-enter-active {
  transition: opacity 0.32s var(--ease-out),
              transform 0.32s var(--ease-out);
}
.page-leave-active {
  transition: opacity 0.22s var(--ease-in),
              transform 0.22s var(--ease-in);
}
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to   { opacity: 0; transform: translateY(-6px); }
</style>
