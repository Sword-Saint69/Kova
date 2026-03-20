<template>
  <section class="max-w-7xl mx-auto px-8 py-24 mb-12" ref="sectionEl">
    <div class="text-center mb-16 header-block" :class="{ visible: isVisible }">
      <h3 class="text-5xl font-headline font-bold mb-4 header-title">Invest in your ritual.</h3>
      <p class="text-on-surface-variant header-sub">Simple, transparent, obsessive precision.</p>
    </div>

    <!-- ANIMATION 22: Pricing cards fly in from bottom with staggered spring delay -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <!-- Free -->
      <div class="pricing-card" :class="{ visible: isVisible }" style="--card-delay: 0ms">
        <h4 class="text-sm font-bold text-on-surface-variant tracking-widest mb-6 uppercase">Essential</h4>
        <div class="flex items-baseline gap-2 mb-8">
          <span class="text-5xl font-headline font-black italic">$0</span>
          <span class="text-on-surface-variant">/ forever</span>
        </div>
        <ul class="space-y-4 mb-10 text-sm">
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Up to 3 habits</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Standard Grid View</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Web Access</li>
        </ul>
        <button class="w-full py-4 rounded-xl border-[0.5px] border-outline-variant/30 font-bold hover:bg-surface-container-high transition-colors">Select Free</button>
      </div>

      <!-- Pro -->
      <div class="pricing-card pricing-card--pro" :class="{ visible: isVisible }" style="--card-delay: 120ms">
        <div class="popular-badge">Most Popular</div>
        <h4 class="text-sm font-bold text-primary tracking-widest mb-6 uppercase">Pro</h4>
        <div class="flex items-baseline gap-2 mb-8">
          <span class="text-[52px] font-headline font-[900] italic">$4</span>
          <span class="text-on-surface-variant">/ month</span>
        </div>
        <ul class="space-y-4 mb-10 text-sm">
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Unlimited habits</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Custom heatmap colors</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> CLI & API Integration</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Private Profiles</li>
        </ul>
        <button class="w-full py-4 rounded-xl bg-primary text-on-primary font-extrabold hover:opacity-90 transition-all">Go Pro Now</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sectionEl = ref(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    isVisible.value = true;
  }, { threshold: 0.2 });
  if (sectionEl.value) observer.observe(sectionEl.value);
});
</script>

<style scoped>
/* ANIMATION 22 — Pricing cards fly in from below with spring delay */
.pricing-card {
  background: var(--md-sys-color-surface-container-low, #1a1a1a);
  padding: 40px;
  border-radius: 16px;
  border: 0.5px solid rgba(255,255,255,0.1);
  position: relative;
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity  500ms cubic-bezier(0.16, 1, 0.3, 1) var(--card-delay, 0ms),
    transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1) var(--card-delay, 0ms);
}
.pricing-card.visible {
  opacity: 1; transform: translateY(0);
}
.pricing-card--pro {
  border-width: 2px;
  border-color: #a0ec06;
}
.popular-badge {
  position: absolute;
  top: -13px; left: 50%;
  transform: translateX(-50%);
  background: #a0ec06;
  color: #0a0a0a;
  font-size: 10px;
  font-weight: 900;
  padding: 4px 16px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Header stagger */
.header-title {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 500ms ease, transform 500ms var(--ease-out, cubic-bezier(0.16,1,0.3,1));
}
.header-sub {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 400ms ease 100ms, transform 400ms ease 100ms;
}
.header-block.visible .header-title,
.header-block.visible .header-sub {
  opacity: 1; transform: translateY(0);
}
</style>
