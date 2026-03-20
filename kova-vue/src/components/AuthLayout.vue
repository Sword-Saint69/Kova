<template>
  <!-- 32. Page fade enter applied dynamically on mount -->
  <main 
    class="flex min-h-screen overflow-hidden transition-all duration-700 ease-out"
    :class="mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
  >
    <!-- ─── Left Panel (Animated) ──────────────────────────────────── -->
    <AuthLeftPanel 
      :step="step" 
      class="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="mounted ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'"
    />

    <!-- ─── Right Panel ────────────────────────────────────────────── -->
    <!-- 48. Right panel tilt -> we apply tilt to a wrapper inside. -->
    <section 
      class="w-full lg:w-1/2 bg-[#111111] flex flex-col items-center justify-center p-6 md:p-12 min-h-screen transition-all duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="mounted ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'"
      style="perspective: 1000px;"
      @mousemove="handleTilt"
      @mouseleave="resetTilt"
    >
      <!-- Tilt wrapper -->
      <div class="w-full max-w-[380px] space-y-8 will-change-transform transition-transform duration-200 ease-out">
        <!-- Mobile logo -->
        <!-- 46. Logo entrance -->
        <div class="lg:hidden mb-10 overflow-hidden">
          <img src="/logo-full.png" alt="KOVA" class="h-10 w-auto object-contain transition-transform duration-700 cubic-spring translate-y-[-100%]" :class="{ 'translate-y-0': mounted }" />
        </div>

        <!-- Header block with text morph (34) -->
        <header class="space-y-1 text-center lg:text-left relative overflow-hidden h-[80px]">
          <!-- Login Header -->
          <div 
            class="absolute top-0 left-0 w-full header-morph"
            :class="step === 2 ? 'morph-active' : 'morph-inactive'"
          >
            <h2 class="text-[30px] font-headline font-light text-white leading-tight">Welcome back</h2>
            <p class="text-white/40 text-sm font-light">Sign in to your ritual workspace.</p>
          </div>
          <!-- Register Header -->
          <div 
            class="absolute top-0 left-0 w-full header-morph"
            :class="step === 1 ? 'morph-active' : 'morph-inactive'"
          >
            <h2 class="text-[30px] font-headline font-light text-white leading-tight">Create account</h2>
            <p class="text-white/40 text-sm font-light">Join the elite habit engineering community.</p>
          </div>
        </header>

        <!-- Dynamic Form Slot with Cross-Fade (30) -->
        <div class="relative min-h-[400px]">
          <transition name="form-fade" mode="out-in">
            <div :key="step" class="w-full form-wrapper">
              <slot></slot>
            </div>
          </transition>
        </div>

        <!-- 50. Success redirect wipe overlay -->
        <div 
          class="fixed inset-0 bg-primary z-50 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] pointer-events-none"
          :class="isSuccessWipe ? 'translate-y-0' : 'translate-y-full'"
        ></div>
        
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, provide } from 'vue';
import AuthLeftPanel from './AuthLeftPanel.vue';

const props = defineProps({
  step: { type: Number, required: true }
});

const mounted = ref(false);
onMounted(() => {
  // 32. Page fade enter
  setTimeout(() => { mounted.value = true; }, 50);
});

// 50. Success wipe state
const isSuccessWipe = ref(false);

// Provide a method to forms to trigger success wipe
provide('triggerSuccessWipe', () => {
  isSuccessWipe.value = true;
});
</script>

<style scoped>
/* 34. Header text morph */
.header-morph {
  transition: clip-path 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms;
}
.morph-active {
  clip-path: inset(0 0 0 0);
  transform: translateY(0);
  opacity: 1;
}
.morph-inactive {
  clip-path: inset(0 0 100% 0);
  transform: translateY(-8px);
  opacity: 0;
}

/* 30. Form cross-fade with stagger effect */
.form-fade-enter-active,
.form-fade-leave-active {
  transition: opacity 300ms ease, transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.form-fade-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.form-fade-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

/* 45 & 49. Mobile tweaks (handled via composition in AuthLeftPanel mainly, 
   but we ensure the main container allows scrolling) */
@media (max-width: 1023px) {
  main {
    flex-direction: column;
    overflow-y: auto;
  }
}

.cubic-spring {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
