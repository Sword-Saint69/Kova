<template>
  <button
    :type="type"
    class="auth-btn relative flex items-center justify-center gap-2 overflow-hidden outline-none select-none transition-colors"
    :class="[
      `auth-btn--${variant}`,
      { 'is-pressing': isPressing, 'is-loading': loading, 'is-success': success },
      customClass
    ]"
    ref="btnEl"
    @mousedown="handlePressStart"
    @mouseup="handlePressEnd"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="handleClick"
    :style="magneticStyle"
  >
    <!-- Background element for Shimmer Sweep -->
    <div v-if="variant === 'primary'" class="btn-shimmer pointer-events-none"></div>
    
    <!-- Ghost button border trace (SVG) -->
    <svg v-if="variant === 'ghost'" class="absolute inset-0 w-full h-full pointer-events-none rounded-xl" preserveAspectRatio="none">
       <rect class="border-trace" x="0" y="0" width="100%" height="100%" rx="12"></rect>
    </svg>

    <!-- Content Slot -->
    <div class="relative z-10 flex items-center justify-center gap-2 transform transition-transform duration-300" :class="{ 'translate-y-[150%] opacity-0': loading || success }">
      <slot name="icon">
        <!-- 27. Google button icon bounce: the outer element uses group-hover to bounce the SVG -->
      </slot>
      <slot>{{ text }}</slot>
    </div>

    <!-- 23. Loading State -->
    <div class="absolute inset-0 z-10 flex items-center justify-center gap-2 transition-transform duration-300" :class="loading ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0'">
      <span class="spinner"></span> <span class="text-[13px] font-bold">{{ loadingText }}</span>
    </div>

    <!-- 24. Success State -->
    <div class="absolute inset-0 z-10 flex items-center justify-center gap-2 transition-transform duration-300" :class="(success && !loading) ? 'translate-y-0 opacity-100 scale-110' : '-translate-y-[150%] opacity-0'">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5L20 7" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="text-[14px] font-bold text-[#0a0a0a]">Success!</span>
    </div>

    <!-- 26. Particle Burst -->
    <div v-if="bursting" class="absolute inset-0 pointer-events-none z-0">
      <div v-for="i in 8" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  text: { type: String, default: '' },
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // 'primary' or 'ghost'
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Loading...' },
  success: { type: Boolean, default: false },
  magnetic: { type: Boolean, default: false }, // true for primary, false normally
  customClass: { type: String, default: 'w-full h-[52px] mt-2' }
});

const emit = defineEmits(['click']);

const btnEl = ref(null);
const isPressing = ref(false);
const bursting = ref(false);

// 25. Magnetic hover physics
const mx = ref(0);
const my = ref(0);
const isHovering = ref(false);

const magneticStyle = computed(() => {
  if (!props.magnetic || !isHovering.value) return { transform: 'translate(0,0)' };
  // Gentle magnetic pull: max 8px translation
  return { 
    transform: `translate(${mx.value * 8}px, ${my.value * 8}px)`,
    transition: 'transform 0.1s ease-out'
  };
});

function handleMouseMove(e) {
  if (!props.magnetic || !btnEl.value) return;
  isHovering.value = true;
  const rect = btnEl.value.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  // Normalize between -1 and 1
  mx.value = x / (rect.width / 2);
  my.value = y / (rect.height / 2);
}

function handleMouseLeave() {
  isPressing.value = false;
  isHovering.value = false;
  mx.value = 0;
  my.value = 0;
}

// 21. CTA spring press
function handlePressStart() {
  if (props.loading || props.success) return;
  isPressing.value = true;
}

function handlePressEnd() {
  if (props.loading || props.success) return;
  isPressing.value = false;
}

function handleClick(e) {
  if (props.loading || props.success) {
    e.preventDefault();
    return;
  }
  
  // 26. Fire particles if primary submit
  if (props.type === 'submit' && props.variant === 'primary') {
    fireParticles();
  }
  
  emit('click', e);
}

function fireParticles() {
  bursting.value = true;
  setTimeout(() => { bursting.value = false; }, 800);
}

function getParticleStyle(i) {
  const angle = (i / 8) * Math.PI * 2;
  const distance = 40 + Math.random() * 20;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;
  return {
    '--tx': `${tx}px`,
    '--ty': `${ty}px`,
    animationDelay: `${Math.random() * 0.1}s`
  };
}
</script>

<style scoped>
/* Base Button Styles */
.auth-btn {
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  /* 21. Spring press transition */
  transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms ease;
  will-change: transform;
}
.auth-btn.is-pressing {
  transform: scale(0.95) !important;
}

/* Primary Variant */
.auth-btn--primary {
  background: #a0ec06;
  color: #0a0a0a;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 0 24px rgba(160,236,6,0.12);
}
.auth-btn--primary:hover:not(.is-loading):not(.is-success) {
  background: #b8f520;
}
.auth-btn--primary.is-loading {
  background: #7ca811;
  box-shadow: none;
  cursor: wait;
}
.auth-btn--primary.is-success {
  background: #a0ec06;
  box-shadow: 0 0 40px rgba(160,236,6,0.3);
  animation: pulse-success 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes pulse-success {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 22. Shimmer sweep on hover (Primary) */
.btn-shimmer {
  position: absolute;
  top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
  transform: skewX(-25deg);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.auth-btn--primary:hover:not(.is-loading) .btn-shimmer {
  opacity: 1;
  animation: shimmer-swipe 1.2s infinite ease-in-out;
}
@keyframes shimmer-swipe {
  0% { left: -100%; }
  100% { left: 200%; }
}

/* Ghost Variant */
.auth-btn--ghost {
  background: #181818;
  border: 1px solid transparent; /* Replaced by svg trace */
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  font-weight: 500;
}
.auth-btn--ghost:hover {
  background: rgba(255,255,255,0.05);
}
/* Base ghost border */
.auth-btn--ghost::before {
  content: '';
  position: absolute; inset: 0;
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: inherit;
  pointer-events: none;
}

/* 28. Ghost button border trace */
.border-trace {
  fill: none;
  stroke: #a0ec06;
  stroke-width: 2;
  stroke-dasharray: 60 400;
  stroke-dashoffset: 460;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.87, 0, 0.13, 1), opacity 0.3s;
  opacity: 0;
}
.auth-btn--ghost:hover .border-trace {
  opacity: 1;
  stroke-dashoffset: 0;
}

/* Loading Spinner */
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(10,10,10,0.3);
  border-top-color: #0a0a0a;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 26. Particle Burst */
.particle {
  position: absolute;
  top: 50%; left: 50%;
  width: 5px; height: 5px;
  background: #a0ec06;
  border-radius: 50%;
  opacity: 0;
  animation: particle-fly 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes particle-fly {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
}

/* 27. Google button icon bounce: Provided via global/utility scoped down */
::v-deep(:slotted(svg)) {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.auth-btn--ghost:hover ::v-deep(:slotted(svg)) {
  transform: translateY(-2px) scale(1.05); /* Bounce up on hover */
}
</style>
