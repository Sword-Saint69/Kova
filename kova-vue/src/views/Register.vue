<template>
  <main class="flex min-h-screen overflow-hidden">

    <!-- ─── Left Panel ─────────────────────────────────────────────── -->
    <section class="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-16">
      <!-- Dot-grid background -->
      <div class="absolute inset-0 pointer-events-none" style="background-image:radial-gradient(circle at 1px 1px, rgba(160,236,6,0.18) 1px, transparent 0);background-size:28px 28px;opacity:0.18;"></div>
      <!-- Watermark star -->
      <div class="pointer-events-none absolute" style="width:380px;height:380px;background:radial-gradient(circle,#a0ec06 2px,transparent 0);background-size:44px 44px;clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);opacity:0.04;left:50%;top:50%;transform:translate(-50%,-50%);"></div>

      <!-- Brand logo -->
      <div class="relative z-10">
        <img src="/logo-full.png" alt="KOVA" class="h-14 w-auto object-left object-contain" />
      </div>

      <!-- Hero headline -->
      <div class="relative z-10 max-w-xl">
        <h1 class="font-headline italic text-[80px] text-white leading-[0.92] tracking-tight">
          Every day is a<br/>
          <span class="text-primary not-italic font-black block mt-2">data point.</span>
        </h1>
        <p class="mt-5 text-[11px] font-body font-medium tracking-[0.22em] uppercase text-primary/55">
          Technical Rituals for the Modern Mind
        </p>
      </div>

      <!-- Step indicators -->
      <div class="relative z-10 flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-10 bg-primary rounded-full"></div>
          <div class="h-2 w-2 bg-white/20 rounded-full"></div>
          <div class="h-2 w-2 bg-white/20 rounded-full"></div>
        </div>
        <p class="text-[10px] font-body uppercase tracking-widest text-white/30 font-medium">
          Account <span class="mx-1 opacity-40">·</span> Habits <span class="mx-1 opacity-40">·</span> Profile
        </p>
      </div>
    </section>

    <!-- ─── Right Panel ────────────────────────────────────────────── -->
    <section class="w-full lg:w-1/2 bg-[#111111] flex flex-col items-center justify-center p-6 md:p-12 min-h-screen">

      <!-- Mobile logo -->
      <div class="lg:hidden mb-10">
        <img src="/logo-full.png" alt="KOVA" class="h-10 w-auto object-contain" />
      </div>

      <div class="w-full max-w-[380px] space-y-8">

        <!-- Header -->
        <header class="space-y-1 text-center lg:text-left">
          <h2 class="text-[30px] font-headline font-light text-white leading-tight">Create your account</h2>
          <p class="text-white/40 text-sm font-light">Join the elite habit engineering community.</p>
        </header>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <!-- Full Name -->
          <div class="space-y-1.5">
            <label class="text-[10px] uppercase tracking-[0.22em] font-body font-medium text-white/40 ml-0.5">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="John Doe"
              class="form-input"
              :class="{ 'form-input--error': errors.name }"
              @blur="validate('name')"
            />
            <p v-if="errors.name" class="text-[11px] text-red-400 ml-0.5 mt-1">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div class="space-y-1.5">
            <label class="text-[10px] uppercase tracking-[0.22em] font-body font-medium text-white/40 ml-0.5">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="name@domain.com"
              class="form-input"
              :class="{ 'form-input--error': errors.email }"
              @blur="validate('email')"
            />
            <p v-if="errors.email" class="text-[11px] text-red-400 ml-0.5 mt-1">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label class="text-[10px] uppercase tracking-[0.22em] font-body font-medium text-white/40 ml-0.5">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="form-input pr-12"
                :class="{ 'form-input--error': errors.password }"
                @blur="validate('password')"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors"
                @click="showPassword = !showPassword"
              >
                <span class="material-symbols-outlined text-[18px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <p v-if="errors.password" class="text-[11px] text-red-400 ml-0.5 mt-1">{{ errors.password }}</p>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-primary w-full h-[52px] mt-2" :class="{ 'btn-loading': loading }">
            <span v-if="!loading">Create account →</span>
            <span v-else class="flex items-center justify-center gap-2">
              <span class="spinner"></span> Creating...
            </span>
          </button>

          <!-- Divider -->
          <div class="flex items-center gap-4 py-1">
            <div class="h-px flex-1 bg-white/8"></div>
            <span class="text-[9px] uppercase tracking-[0.25em] text-white/25 font-body font-bold whitespace-nowrap">OR CONTINUE WITH</span>
            <div class="h-px flex-1 bg-white/8"></div>
          </div>

          <!-- Google OAuth -->
          <button type="button" class="btn-ghost w-full h-[52px] flex items-center justify-center gap-3">
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <!-- Footer -->
          <p class="text-center text-sm text-white/35 font-light pt-1">
            Already have an account?
            <RouterLink to="/login" class="text-primary font-semibold ml-1 hover:underline underline-offset-4">Sign in</RouterLink>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showPassword = ref(false);
const loading = ref(false);

const form = reactive({ name: '', email: '', password: '' });
const errors = reactive({ name: '', email: '', password: '' });

function validate(field) {
  if (field === 'name') {
    errors.name = form.name.trim().length < 2 ? 'Please enter your full name.' : '';
  }
  if (field === 'email') {
    errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.';
  }
  if (field === 'password') {
    errors.password = form.password.length < 8 ? 'Password must be at least 8 characters.' : '';
  }
}

async function handleSubmit() {
  ['name', 'email', 'password'].forEach(validate);
  if (errors.name || errors.email || errors.password) return;
  loading.value = true;
  await new Promise(r => setTimeout(r, 1200)); // simulate API
  loading.value = false;
  router.push('/');
}
</script>

<style scoped>
/* Form input */
.form-input {
  width: 100%;
  background: #1a1a1a;
  border: 0.5px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 14px 16px;
  color: white;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.form-input::placeholder { color: rgba(255,255,255,0.12); }
.form-input:focus {
  border-color: #a0ec06;
  box-shadow: 0 0 0 1px #a0ec06, 0 0 14px rgba(160,236,6,0.1);
}
.form-input--error {
  border-color: rgba(248,113,113,0.5) !important;
  box-shadow: 0 0 0 1px rgba(248,113,113,0.4) !important;
}

/* Primary button */
.btn-primary {
  background: #a0ec06;
  color: #0a0a0a;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 150ms ease, transform 80ms ease;
  box-shadow: 0 0 24px rgba(160,236,6,0.12);
}
.btn-primary:hover { background: #b8f520; transform: translateY(-1px); }
.btn-primary:active { transform: scale(0.98); }
.btn-primary.btn-loading { opacity: 0.75; cursor: not-allowed; }

/* Ghost button */
.btn-ghost {
  background: #181818;
  border: 0.5px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  border-radius: 12px;
  cursor: pointer;
  transition: background 150ms ease;
}
.btn-ghost:hover { background: rgba(255,255,255,0.05); }

/* Spinner */
.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(10,10,10,0.3);
  border-top-color: #0a0a0a;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
