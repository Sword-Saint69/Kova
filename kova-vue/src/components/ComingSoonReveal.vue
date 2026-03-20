<template>
  <!-- "Coming Soon" section that un-blurs content on scroll-in -->
  <div ref="wrapEl" class="coming-soon-wrap">
    <!-- Blurred content backdrop -->
    <div class="blur-layer" :class="{ revealed: isRevealed }">
      <slot />
    </div>

    <!-- Frosted overlay that dissolves -->
    <Transition name="frost">
      <div v-if="!isRevealed" class="frost-overlay">
        <div class="frost-inner">
          <span class="frost-icon">🔒</span>
          <p class="frost-title">Coming Soon</p>
          <p class="frost-body">{{ label }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineProps({ label: { type: String, default: 'This feature is on the way.' } });

const wrapEl = ref(null);
const isRevealed = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    setTimeout(() => { isRevealed.value = true; }, 200);
  }, { threshold: 0.4 });
  if (wrapEl.value) observer.observe(wrapEl.value);
});
</script>

<style scoped>
.coming-soon-wrap {
  position: relative; overflow: hidden; border-radius: 18px;
}
/* ANIMATION: Blur collapses when revealed */
.blur-layer {
  filter: blur(14px);
  transition: filter 700ms cubic-bezier(0.16,1,0.3,1);
  pointer-events: none;
  user-select: none;
}
.blur-layer.revealed {
  filter: blur(0);
  pointer-events: auto;
  user-select: auto;
}

/* Frost overlay fades out */
.frost-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(10,10,10,0.55);
  backdrop-filter: blur(4px);
  z-index: 2;
}
.frost-inner {
  text-align: center; padding: 24px;
}
.frost-icon { font-size: 32px; display: block; margin-bottom: 10px; }
.frost-title {
  font-family: 'Bodoni Moda', serif; font-weight: 900; font-style: italic;
  font-size: 24px; color: #f0ede8; margin-bottom: 6px;
}
.frost-body { font-size: 13px; color: rgba(240,237,232,0.45); }

/* Frost transition */
.frost-enter-active { transition: opacity 400ms ease, backdrop-filter 400ms ease; }
.frost-leave-active { transition: opacity 600ms ease, backdrop-filter 600ms ease; }
.frost-enter-from, .frost-leave-to { opacity: 0; }
</style>
