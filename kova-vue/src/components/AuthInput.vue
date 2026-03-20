<template>
  <div class="auth-input-group" :class="{ 'has-error': error, 'is-focused': isFocused, 'has-value': modelValue.length > 0 }">
    <!-- 12. Label float up & 53. Kinetic label -->
    <label class="auth-label" :class="{ 'kinetic-jiggle': isFirstFocus }">{{ label }}</label>
    
    <div class="relative w-full">
      <!-- 11. Input focus border draw -->
      <svg class="border-draw" width="100%" height="100%" preserveAspectRatio="none">
        <rect class="border-rect" x="0" y="0" width="100%" height="100%" rx="12"></rect>
      </svg>
      
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="inputType"
        :placeholder="placeholder"
        class="auth-input autofill-flash"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="checkCapsLock"
        @paste="handlePaste"
        ref="inputEl"
      />
      
      <!-- 14. Custom placeholder for slide-out animation -->
      <span class="custom-placeholder pointer-events-none">{{ placeholder }}</span>
      
      <!-- Rightside Icons -->
      <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
        <!-- 17. Field success checkmark -->
        <svg v-if="showCheckmark" class="success-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
           <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="#a0ec06" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-path"/>
        </svg>
        
        <!-- 40. Caps Lock warning -->
        <transition name="fade">
          <div v-if="isCapsLockOn && isFocused && type === 'password'" 
               class="caps-lock-badge flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-md">
            <span class="material-symbols-outlined text-[12px] text-primary">keyboard_capslock</span>
            <span class="text-[9px] uppercase font-bold tracking-tighter text-white/60">Caps Lock</span>
          </div>
        </transition>

        <!-- 34. Eye toggle spring (Passwords only) -->
        <button
          v-if="type === 'password'"
          type="button"
          class="eye-toggle text-primary/60 hover:text-primary transition-colors focus:outline-none"
          :class="{ 'spring-press': eyePressing }"
          @mousedown="eyePressing = true"
          @mouseup="toggleEye"
          @mouseleave="eyePressing = false"
        >
          <span class="material-symbols-outlined text-[18px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
        </button>
      </div>

      <!-- 41. Paste confetti container -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div v-for="c in confetti" :key="c.id" class="confetti-dot" 
             :style="{ left: c.x + 'px', top: c.y + 'px', '--tx': c.tx + 'px', '--ty': c.ty + 'px', backgroundColor: c.color }"></div>
      </div>
    </div>
    
    <div class="flex items-start justify-between mt-1.5 px-0.5">
      <!-- 16. Error message slide in -->
      <transition name="error-slide">
        <p v-if="error" class="error-msg text-[11px] text-red-400 m-0">{{ error }}</p>
      </transition>
      
      <!-- 20. Character counter -->
      <transition name="fade">
        <p v-if="isFocused && type === 'password'" class="char-count text-[10px] text-white/30 font-body m-0 ml-auto">
          {{ modelValue.length }} chars
        </p>
      </transition>
    </div>
    
    <!-- 18. Password strength bar -->
    <div v-if="type === 'password'" class="strength-meter mt-2">
       <div class="strength-bar" :style="{ width: strengthWidth, backgroundColor: strengthColor }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  isValid: { type: Boolean, default: false } // Trigger checkmark
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

const inputEl = ref(null);
const isFocused = ref(false);

const showPassword = ref(false);
const eyePressing = ref(false);
const isCapsLockOn = ref(false);
const isFirstFocus = ref(false);
const hasFocusedEver = ref(false);
const confetti = ref([]);
let confettiId = 0;

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

const showCheckmark = computed(() => props.isValid && !props.error && props.modelValue.length > 0 && props.type !== 'password');

// 40. Caps Lock Detection
function checkCapsLock(e) {
  isCapsLockOn.value = e.getModifierState('CapsLock');
}

// 41. Paste Confetti
function handlePaste(e) {
  if (props.type !== 'email' && !props.label.toLowerCase().includes('email')) return;
  const rect = inputEl.value.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  for (let i = 0; i < 15; i++) {
    const id = confettiId++;
    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 60;
    confetti.value.push({
      id,
      x: centerX,
      y: centerY,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      color: i % 2 === 0 ? '#a0ec06' : '#ffffff'
    });
    setTimeout(() => {
      confetti.value = confetti.value.filter(c => c.id !== id);
    }, 800);
  }
}

function handleFocus() {
  isFocused.value = true;
  if (!hasFocusedEver.value) {
    isFirstFocus.value = true;
    hasFocusedEver.value = true;
    setTimeout(() => { isFirstFocus.value = false; }, 800);
  }
  emit('focus');
}

function handleBlur() {
  isFocused.value = false;
  isCapsLockOn.value = false;
  emit('blur');
}

function toggleEye() {
  eyePressing.value = false;
  showPassword.value = !showPassword.value;
}

// 18. Password strength logic
const strengthScore = computed(() => {
  if (props.type !== 'password' || props.modelValue.length === 0) return 0;
  let score = 0;
  const val = props.modelValue;
  if (val.length > 5) score++;
  if (val.length > 8) score++;
  if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return Math.min(score, 3);
});

const strengthWidth = computed(() => {
  if (props.modelValue.length === 0) return '0%';
  if (strengthScore.value === 1) return '33%';
  if (strengthScore.value === 2) return '66%';
  return '100%';
});

const strengthColor = computed(() => {
  if (strengthScore.value <= 1) return '#f87171'; // red
  if (strengthScore.value === 2) return '#fbbf24'; // yellow
  return '#a0ec06'; // lime
});

// 15. Error shake
watch(() => props.error, (newVal) => {
  if (newVal) {
    if (inputEl.value) {
      const parent = inputEl.value.closest('.auth-input-group');
      parent.classList.remove('shake');
      void parent.offsetWidth;
      parent.classList.add('shake');
    }
  }
});

</script>

<style scoped>
.auth-input-group {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 12. Label float up */
.auth-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
  margin-left: 2px;
  margin-bottom: 6px;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), color 300ms ease;
  transform-origin: left bottom;
  display: block;
}
.is-focused .auth-label {
  transform: translateY(-4px);
  color: #a0ec06;
}

/* Input Base */
.auth-input {
  width: 100%;
  background: #1a1a1a;
  border: 1px solid transparent; /* Replaced by border draw */
  border-radius: 12px;
  padding: 14px 16px;
  padding-right: 48px;
  color: white;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  position: relative;
  z-index: 1;
  /* Hide native placeholder */
}
.auth-input::placeholder { color: transparent; }

/* 13. Input glow expand */
.auth-input {
  box-shadow: 0 0 0px 0px rgba(160,236,6,0);
  transition: box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms ease;
}
.is-focused .auth-input {
  background: #111111;
  box-shadow: 0 0 0px 1px #a0ec06, 0 0 20px rgba(160,236,6,0.15);
}

/* 11. Input focus border draw */
.border-draw {
  position: absolute;
  top: 0; left: 0;
  pointer-events: none;
  border-radius: 12px;
  z-index: 2;
  overflow: visible;
}
.border-rect {
  fill: none;
  stroke: #a0ec06;
  stroke-width: 2;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  transition: stroke-dashoffset 600ms cubic-bezier(0.87, 0, 0.13, 1);
}
.is-focused .border-rect {
  stroke-dashoffset: 0;
}
/* Base border when not focused */
.auth-input {
  border: 0.5px solid rgba(255,255,255,0.07);
}
.is-focused .auth-input {
  border-color: transparent;
}
.has-error .auth-input {
  border-color: rgba(248,113,113,0.5) !important;
}

/* 14. Placeholder slide out */
.custom-placeholder {
  position: absolute;
  left: 17px;
  top: 15px;
  font-size: 14px;
  color: rgba(255,255,255,0.12);
  font-family: 'DM Sans', sans-serif;
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease;
  z-index: 5;
}
.is-focused .custom-placeholder,
.has-value .custom-placeholder {
  transform: translateX(-10px);
  opacity: 0;
}

/* 53. Kinetic label jiggle */
.kinetic-jiggle {
  animation: jiggle-playful 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes jiggle-playful {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-2px) rotate(-1deg); }
  30% { transform: translateX(3px) rotate(1deg); }
  45% { transform: translateX(-3px) rotate(-1.5deg); }
  60% { transform: translateX(2px) rotate(1deg); }
  75% { transform: translateX(-1px) rotate(-0.5deg); }
}

/* 15. Error shake */
.shake {
  animation: shake-anim 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes shake-anim {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

/* 16. Error message slide in */
.error-slide-enter-active,
.error-slide-leave-active {
  transition: opacity 300ms ease, transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 17. Field success checkmark */
.check-path {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: draw-check 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}

/* 18. Password strength bar */
.strength-meter {
  height: 3px;
  background: rgba(255,255,255,0.05);
  border-radius: 2px;
  overflow: hidden;
  position: absolute;
  bottom: -8px;
  left: 0; right: 0;
}
.strength-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 400ms cubic-bezier(0.16, 1, 0.3, 1), background-color 400ms ease;
}

/* 42. Autofill flash */
.autofill-flash:-webkit-autofill {
  animation: autofill-glow 1s ease-out;
}
@keyframes autofill-glow {
  0% { box-shadow: 0 0 0 100px #1a1a1a inset; }
  20% { box-shadow: 0 0 0 100px #a0ec0622 inset, 0 0 20px #a0ec0633; }
  100% { box-shadow: 0 0 0 100px #1a1a1a inset; }
}

/* 41. Paste Confetti */
.confetti-dot {
  position: absolute;
  width: 4px; height: 4px;
  border-radius: 50%;
  animation: confetti-drift 800ms cubic-bezier(0.1, 1, 0.3, 1) forwards;
}
@keyframes confetti-drift {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

.caps-lock-badge {
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }


/* 19. Eye toggle spring */
.eye-toggle {
  transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1), color 200ms ease;
}
.eye-toggle.spring-press {
  transform: scale(0.8);
}

/* 20. Character counter fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
