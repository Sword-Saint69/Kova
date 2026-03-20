<template>
  <!-- ANIMATION: Onboarding spotlight — dim overlay + circular cutout -->
  <Teleport to="body">
    <div v-if="active" class="spotlight-overlay" @click="advance">
      <!-- SVG mask creates circular cutout -->
      <svg class="spotlight-svg">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white"/>
            <circle
              :cx="cx" :cy="cy"
              :r="radius"
              fill="black"
              class="spotlight-hole"
              :style="{ transition: holeTransition }"
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.75)" mask="url(#spotlight-mask)"/>
      </svg>

      <!-- Tooltip box below/above cutout -->
      <div class="spotlight-tooltip"
           :style="{
             left: cx + 'px',
             top: (cy + radius + 16) + 'px',
           }">
        <p class="tooltip-title">{{ currentStep?.title }}</p>
        <p class="tooltip-body">{{ currentStep?.body }}</p>
        <div class="tooltip-footer">
          <span class="step-count">{{ stepIdx + 1 }} / {{ steps.length }}</span>
          <button class="tooltip-btn" @click.stop="advance">
            {{ stepIdx < steps.length - 1 ? 'Next →' : 'Got it ✓' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  steps: {
    type: Array,
    default: () => [] // [{ selector: '.my-el', title: '', body: '' }]
  }
});

const active = ref(false);
const stepIdx = ref(0);
const cx = ref(0);
const cy = ref(0);
const radius = ref(0);
const holeTransition = ref('none');

const currentStep = computed(() => props.steps[stepIdx.value]);

function start() {
  stepIdx.value = 0;
  active.value = true;
  updateSpotlight();
}

function updateSpotlight() {
  const step = props.steps[stepIdx.value];
  if (!step) return;
  const el = document.querySelector(step.selector);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  holeTransition.value = stepIdx.value === 0 ? 'none' : 'cx 400ms ease, cy 400ms ease, r 400ms ease';
  cx.value = rect.left + rect.width / 2;
  cy.value = rect.top + rect.height / 2;
  radius.value = Math.max(rect.width, rect.height) / 2 + 20;
}

function advance() {
  if (stepIdx.value < props.steps.length - 1) {
    stepIdx.value++;
    updateSpotlight();
  } else {
    active.value = false;
  }
}

defineExpose({ start });
</script>

<style scoped>
.spotlight-overlay {
  position: fixed; inset: 0;
  z-index: 9000;
  cursor: default;
}
.spotlight-svg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
}
/* Animate the SVG circle via CSS */
.spotlight-hole {
  transition: cx 400ms cubic-bezier(0.16,1,0.3,1),
              cy 400ms cubic-bezier(0.16,1,0.3,1),
              r  300ms ease;
}
.spotlight-tooltip {
  position: absolute;
  transform: translateX(-50%);
  background: #111;
  border: 0.5px solid rgba(160,236,6,0.3);
  border-radius: 14px;
  padding: 16px 20px;
  width: 280px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  animation: tooltip-pop 200ms cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes tooltip-pop {
  from { opacity: 0; transform: translateX(-50%) scale(0.92); }
  to   { opacity: 1; transform: translateX(-50%) scale(1); }
}
.tooltip-title {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 13px; color: #f0ede8; margin-bottom: 6px;
}
.tooltip-body {
  font-size: 12px; color: rgba(240,237,232,0.6); line-height: 1.65; margin-bottom: 14px;
}
.tooltip-footer {
  display: flex; justify-content: space-between; align-items: center;
}
.step-count {
  font-size: 11px; color: rgba(240,237,232,0.35);
}
.tooltip-btn {
  background: #a0ec06; color: #0a0a0a;
  border: none; border-radius: 8px;
  padding: 5px 14px; font-weight: 700; font-size: 12px; cursor: pointer;
  transition: background 150ms ease;
}
.tooltip-btn:hover { background: #b8f520; }
</style>
