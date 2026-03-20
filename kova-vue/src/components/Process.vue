<template>
  <section class="max-w-7xl mx-auto px-8 py-24" ref="sectionEl">
    <div class="mb-16 reveal-item" :class="{ visible: isVisible }">
      <!-- ANIMATION 21: Eyebrow slides in from left, text reveals right -->
      <h2 class="text-on-surface-variant text-xs font-bold tracking-[0.3em] mb-4 uppercase eyebrow-slide">Process</h2>
      <h3 class="text-[44px] font-headline font-[900] italic leading-tight title-reveal">How it works.</h3>
    </div>

    <div class="steps-grid">
      <!-- ANIMATION 24: Step 1 fades in + connector draws -->
      <div
        v-for="(step, idx) in steps"
        :key="idx"
        class="step-item"
        :class="{ visible: isVisible }"
        :style="{ '--step-delay': `${idx * 150}ms` }"
      >
        <!-- Connector line between steps -->
        <svg v-if="idx < steps.length - 1" class="connector" :class="{ drawn: isVisible }" viewBox="0 0 100 2">
          <line x1="0" y1="1" x2="100" y2="1" stroke="rgba(160,236,6,0.2)" stroke-width="1"
                stroke-dasharray="100" :stroke-dashoffset="isVisible ? 0 : 100"
                style="transition: stroke-dashoffset 600ms ease var(--step-delay, 0ms)" />
        </svg>

        <div class="space-y-4">
          <span :class="['step-num font-headline italic font-black', idx === 1 ? 'text-primary' : 'text-surface-container-highest']">
            {{ step.num }}
          </span>
          <h4 class="text-xl font-bold">{{ step.title }}</h4>
          <p class="text-on-surface-variant text-[14px] font-light leading-[1.65]" v-html="step.body"></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const steps = [
  { num: '01', title: 'Define the Metric.', body: 'Every ritual begins with a variable.<br/>Coding hours, pages read, or morning sprints.' },
  { num: '02', title: 'The Daily Commit.', body: 'Commit progress in seconds via CLI.<br/>We handle the high-fidelity density mapping.' },
  { num: '03', title: 'Refine & Review.', body: 'Export into a high-fidelity monograph.<br/>A visual testament to your obsession with growth.' },
];

const sectionEl = ref(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    isVisible.value = true;
  }, { threshold: 0.25 });
  if (sectionEl.value) observer.observe(sectionEl.value);
});
</script>

<style scoped>
/* ANIMATION 21 — Eyebrow slides from left */
.eyebrow-slide {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 400ms ease, transform 400ms var(--ease-out, cubic-bezier(0.16,1,0.3,1));
}
.reveal-item.visible .eyebrow-slide {
  opacity: 1; transform: translateX(0);
}

/* Title reveals */
.title-reveal {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 500ms ease 100ms, transform 500ms var(--ease-out, cubic-bezier(0.16,1,0.3,1)) 100ms;
}
.reveal-item.visible .title-reveal {
  opacity: 1; transform: translateY(0);
}

/* ANIMATION 24 — Steps stagger + connector draw */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  position: relative;
}

.step-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms ease var(--step-delay, 0ms),
              transform 500ms var(--ease-out, cubic-bezier(0.16,1,0.3,1)) var(--step-delay, 0ms);
}
.step-item.visible {
  opacity: 1; transform: translateY(0);
}

.step-num {
  font-size: 72px;
  display: block;
}

.connector {
  position: absolute;
  top: 36px;
  width: 80%;
  left: 110%;
  overflow: visible;
}

@media (max-width: 768px) {
  .steps-grid { grid-template-columns: 1fr; }
  .connector { display: none; }
}
</style>
