<script setup>
import Navbar from '../components/Navbar.vue';
import Hero from '../components/Hero.vue';
import BentoGrid from '../components/BentoGrid.vue';
import DashboardMockup from '../components/DashboardMockup.vue';
import Process from '../components/Process.vue';
import Testimonials from '../components/Testimonials.vue';
import Pricing from '../components/Pricing.vue';
import CtaBanner from '../components/CtaBanner.vue';
import Footer from '../components/Footer.vue';
import ScrollProgress from '../components/ScrollProgress.vue';
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-on-surface font-body selection:bg-primary/25 overflow-x-hidden">
    <!-- Scroll progress lime bar -->
    <ScrollProgress />

    <Navbar />

    <!-- Route transitions — slide + fade out-in -->
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
/* Page transition — slide up + fade */
.page-enter-active {
  transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
}
.page-leave-active {
  transition: opacity 200ms ease-in,
              transform 200ms ease-in;
}
.page-enter-from { opacity: 0; transform: translateY(14px); }
.page-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>
