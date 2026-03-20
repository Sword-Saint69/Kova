<template>
  <section class="max-w-7xl mx-auto px-8 py-12" ref="sectionEl">
    <div class="bg-primary rounded-3xl p-16 md:p-24 text-center overflow-hidden relative">
      <div class="relative z-10 space-y-6">
        <!-- ANIMATION 23: CTA headline reveals word-by-word -->
        <h2 class="text-4xl md:text-6xl font-headline font-black text-[#0a0a0a] leading-tight">
          <span
            v-for="(word, idx) in words"
            :key="idx"
            class="word-reveal"
            :class="{ visible: isVisible }"
            :style="{ '--word-delay': `${idx * 60}ms` }"
          >{{ word }}&nbsp;</span>
        </h2>
        <div class="cta-actions space-y-4" :class="{ visible: isVisible }">
          <button class="px-10 py-5 bg-on-primary-container text-primary font-black rounded-2xl text-lg hover:scale-105 transition-transform shadow-2xl">
            Start your monograph →
          </button>
          <p class="text-[13px] font-light text-black/45">Free forever. No credit card required.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sectionEl = ref(null);
const isVisible = ref(false);
const words = 'Start building your habit monograph.'.split(' ');

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    isVisible.value = true;
  }, { threshold: 0.3 });
  if (sectionEl.value) observer.observe(sectionEl.value);
});
</script>

<style scoped>
/* ANIMATION 23 — Word-by-word reveal via overflow hidden + translateY */
.word-reveal {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}
.word-reveal::after {
  content: attr(data-word);
}

/* Wrap each word so it clips from below */
.word-reveal {
  opacity: 0;
  transform: translateY(110%);
  transition:
    opacity  0ms linear var(--word-delay, 0ms),
    transform 500ms cubic-bezier(0.16, 1, 0.3, 1) var(--word-delay, 0ms);
}
.word-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.cta-actions {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 500ms ease 600ms, transform 500ms ease 600ms;
}
.cta-actions.visible {
  opacity: 1; transform: translateY(0);
}
</style>
