<template>
  <AuthLayout :step="2">
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <!-- Email -->
      <AuthInput
        v-model="form.email"
        label="Email Address"
        type="email"
        placeholder="name@domain.com"
        :error="errors.email"
        :is-valid="/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)"
        @blur="validate('email')"
        class="mb-3"
      />

      <!-- Password -->
      <div class="relative mb-6">
        <AuthInput
          v-model="form.password"
          label="Password"
          type="password"
          placeholder="••••••••"
          :error="errors.password"
          :is-valid="form.password.length >= 8"
          @blur="validate('password')"
        />
        <div class="absolute -bottom-5 right-1">
          <a href="#" class="text-[11px] text-primary/70 hover:text-primary transition-colors font-body">Forgot password?</a>
        </div>
      </div>

      <AuthButton
        type="submit"
        variant="primary"
        text="Sign in →"
        loading-text="Signing in..."
        :loading="loading"
        :success="success"
        :magnetic="true"
      />

      <div class="flex items-center gap-4 py-1">
        <div class="h-px flex-1 bg-white/8"></div>
        <span class="text-[9px] uppercase tracking-[0.25em] text-white/25 font-body font-bold whitespace-nowrap">OR CONTINUE WITH</span>
        <div class="h-px flex-1 bg-white/8"></div>
      </div>

      <AuthButton
        type="button"
        variant="ghost"
        text="Sign in with Google"
        @click="handleGoogleSignIn"
      >
        <template #icon>
          <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </template>
      </AuthButton>

      <p class="text-center text-sm text-white/35 font-light pt-1 mb-12">
        Don't have an account?
        <RouterLink to="/register" class="text-primary font-semibold ml-1 hover:underline underline-offset-4">Create one</RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>

import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { authClient } from '../utils/auth';
import AuthLayout from '../components/AuthLayout.vue';
import AuthInput from '../components/AuthInput.vue';
import AuthButton from '../components/AuthButton.vue';

const router = useRouter();
const showPassword = ref(false);
const loading = ref(false);
const success = ref(false);

const form = reactive({ email: '', password: '' });
const errors = reactive({ email: '', password: '' });

function validate(field) {
  if (field === 'email') {
    errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.';
  }
  if (field === 'password') {
    errors.password = form.password.length < 8 ? 'Password must be at least 8 characters.' : '';
  }
}

async function handleGoogleSignIn() {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
}

async function handleSubmit() {
  ['email', 'password'].forEach(validate);
  if (errors.email || errors.password) return;
  loading.value = true;
  await new Promise(r => setTimeout(r, 1200));
  loading.value = false;
  success.value = true;
  await new Promise(r => setTimeout(r, 500)); 
  router.push('/');
}
</script>

<style scoped>
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
.btn-ghost {
  background: #181818;
  border: 0.5px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  border-radius: 12px;
  cursor: pointer;
  transition: background 150ms ease;
}
.btn-ghost:hover { background: rgba(255,255,255,0.05); }
.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(10,10,10,0.3);
  border-top-color: #0a0a0a;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
