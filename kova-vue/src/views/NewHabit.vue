<template>
  <div class="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 bg-grain">
    <!-- TopNavBar -->
    <nav class="bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-all">
      <div class="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        <RouterLink to="/dashboard" class="text-2xl font-bold text-white tracking-tighter transition-all flex items-center gap-1">
          <span class="font-bold">K</span><span class="text-[70%] leading-none self-end pb-0.5">o</span><span class="font-bold">VA</span>
        </RouterLink>
        <div class="hidden md:flex items-center gap-2">
          <RouterLink to="/dashboard" class="text-white/60 hover:text-white px-4 py-1.5 transition-colors text-sm font-medium tracking-tight">Dashboard</RouterLink>
          <a class="text-white/60 hover:text-white px-4 py-1.5 transition-colors text-sm font-medium tracking-tight" href="#">Analytics</a>
          <RouterLink to="/profile" class="text-white/60 hover:text-white px-4 py-1.5 transition-colors text-sm font-medium tracking-tight">Profile</RouterLink>
        </div>
        <div class="flex items-center gap-4">
          <button class="material-symbols-outlined text-white/60 hover:text-white transition-colors">notifications</button>
          <div @click="$router.push('/profile')" class="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-white/10 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
            <img v-if="user?.image" class="w-full h-full object-cover" :src="user.image" alt="Avatar"/>
            <div v-else class="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
              {{ (user?.name || 'U').charAt(0) }}
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-[1440px] mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row justify-center items-start gap-16 relative">
      <!-- Form Section -->
      <section class="w-full max-w-[520px] mx-auto lg:mx-0">
        <header class="mb-10">
          <h1 class="font-headline italic text-4xl text-white mb-2">New habit</h1>
          <p class="text-on-surface-variant tracking-tight">Give it a name and a color.</p>
        </header>

        <form @submit.prevent="handleCreate" class="space-y-12">
          <!-- Habit Name -->
          <div class="space-y-3">
            <label class="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Name</label>
            <input 
              v-model="habitName"
              class="w-full bg-transparent text-white font-headline italic text-4xl h-[52px] px-0 border-b border-white/10 focus:border-primary focus:outline-none transition-all placeholder:text-white/20" 
              placeholder="Morning Meditation" 
              type="text"
              required
            />
          </div>

          <!-- Color Picker -->
          <div class="space-y-4">
            <label class="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Color Theme</label>
            <div class="flex flex-wrap gap-4">
              <button 
                v-for="color in colors" :key="color"
                @click="selectedColor = color"
                type="button"
                :class="[
                  'w-8 h-8 rounded-full transition-all',
                  selectedColor === color ? 'border-4 border-white/20 ring-2 ring-current' : 'hover:scale-110'
                ]"
                :style="{ backgroundColor: color, color: color }"
              ></button>
            </div>
          </div>

          <!-- Icon Picker -->
          <div class="space-y-4">
            <label class="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Iconography</label>
            <div class="grid grid-cols-8 gap-2">
              <button 
                v-for="icon in icons" :key="icon"
                @click="selectedIcon = icon"
                type="button"
                :class="[
                  'w-10 h-10 flex items-center justify-center rounded-xl transition-all',
                  selectedIcon === icon ? 'bg-surface-container-high text-primary' : 'bg-surface-container-low text-white/40 hover:bg-surface-container-high hover:text-white'
                ]"
              >
                <span class="material-symbols-outlined">{{ icon }}</span>
              </button>
            </div>
          </div>

          <!-- Frequency Segmented Control -->
          <div class="space-y-4">
            <label class="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Frequency</label>
            <div class="flex bg-surface-container-low p-1 rounded-full border border-white/5">
              <button 
                v-for="f in ['Daily', 'Weekdays', 'Custom']" :key="f"
                @click="frequency = f"
                type="button"
                :class="['flex-1 py-2 text-xs font-semibold rounded-full transition-all', frequency === f ? 'bg-surface-container-high text-white shadow-lg' : 'text-on-surface-variant hover:text-white']"
              >
                {{ f }}
              </button>
            </div>
          </div>

          <!-- Reminder & Goal Row -->
          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-4">
              <label class="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Reminder</label>
              <div class="flex items-center gap-3">
                <input v-model="reminderTime" class="bg-surface-container-low border-0 rounded-xl text-white font-medium p-3 w-full focus:ring-1 focus:ring-primary/20" type="time"/>
                <div class="relative inline-flex items-center cursor-pointer" @click="remindersEnabled = !remindersEnabled">
                  <div :class="['w-11 h-6 rounded-full transition-all relative', remindersEnabled ? 'bg-primary' : 'bg-surface-container-highest']">
                    <div :class="['absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-all', remindersEnabled ? 'translate-x-5' : '']"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <label class="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Daily Goal</label>
              <div class="relative">
                <input v-model="dailyGoal" class="w-full bg-surface-container-low border-0 rounded-xl text-white font-medium p-3 focus:ring-1 focus:ring-primary/20" placeholder="1" type="number" min="1"/>
                <span class="absolute right-3 top-3 text-[10px] text-on-surface-variant font-medium">TIMES</span>
              </div>
            </div>
          </div>

          <!-- Action Row -->
          <footer class="pt-8 flex items-center justify-between border-t border-white/5">
            <button @click="router.back()" type="button" class="text-on-surface-variant hover:text-white text-sm font-medium transition-colors">Cancel</button>
            <button 
              type="submit"
              :disabled="saving"
              class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
            >
              {{ saving ? 'Creating...' : 'Create habit →' }}
            </button>
          </footer>
        </form>
      </section>

      <!-- Preview Card -->
      <aside class="hidden lg:block w-[400px] sticky top-32">
        <div class="p-8 rounded-[32px] bg-surface-container-low border border-white/5 relative overflow-hidden group shadow-2xl">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50"></div>
          <header class="relative z-10 flex justify-between items-start mb-12">
            <div>
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all duration-500" :style="{ backgroundColor: selectedColor, color: getOnColor(selectedColor) }">
                <span class="material-symbols-outlined">{{ selectedIcon }}</span>
              </div>
              <h3 class="text-white font-headline italic text-2xl truncate max-w-[200px]">{{ habitName || 'Habit Name' }}</h3>
              <p class="text-on-surface-variant text-xs tracking-widest uppercase mt-1">{{ frequency }} Ritual</p>
            </div>
            <div class="text-right">
              <span class="font-headline text-4xl text-primary italic">0</span>
              <p class="text-[10px] text-on-surface-variant tracking-widest uppercase">Days Streak</p>
            </div>
          </header>

          <div class="relative z-10 space-y-6">
            <div class="h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div class="h-full bg-primary w-1/12 rounded-full"></div>
            </div>
            <div class="grid grid-cols-7 gap-2 opacity-40">
              <div v-for="i in 7" :key="i" :class="['aspect-square rounded-sm', i === 6 ? 'bg-primary' : 'bg-surface-container-highest']"></div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-white/5">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-on-surface-variant text-sm" :class="{'text-primary': remindersEnabled}">{{ remindersEnabled ? 'notifications_active' : 'notifications' }}</span>
                <span class="text-[10px] text-on-surface-variant font-bold tracking-widest">{{ reminderTime }} {{ remindersEnabled ? 'ON' : 'OFF' }}</span>
              </div>
              <button class="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline">Log Session</button>
            </div>
          </div>
          <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 blur-[80px] rounded-full"></div>
        </div>
        <p class="mt-6 text-center text-on-surface-variant/40 text-[10px] tracking-[0.2em] uppercase font-bold">Preview — Realtime</p>
      </aside>
    </main>

    <!-- Footer Component -->
    <footer class="bg-[#0e0e0e] border-t border-white/5 py-12 px-8 mt-12">
      <div class="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="text-2xl font-bold text-white tracking-tighter">KoVA</div>
        <div class="flex gap-8 text-white/40 text-[10px] uppercase font-black tracking-widest">
          <a href="#" class="hover:text-primary transition-all">Privacy</a>
          <a href="#" class="hover:text-primary transition-all">Terms</a>
          <a href="#" class="hover:text-primary transition-all">Support</a>
          <a href="#" class="hover:text-primary transition-all">Press</a>
        </div>
        <div class="text-white/20 text-[9px] uppercase tracking-[0.3em]">© 2024 KoVA. Made with obsession.</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { sql } from '../utils/db';
import { authClient } from '../utils/auth';

const router = useRouter();
const habitName = ref('');
const selectedColor = ref('#b1ff29');
const selectedIcon = ref('self_improvement');
const frequency = ref('Daily');
const reminderTime = ref('08:00');
const remindersEnabled = ref(true);
const dailyGoal = ref(1);
const saving = ref(false);
const user = ref(null);

const colors = [
  '#b1ff29', '#60a5fa', '#fb7185', '#fbbf24', 
  '#c084fc', '#34d399', '#38bdf8', '#ffffff'
];

const icons = [
  'self_improvement', 'fitness_center', 'water_drop', 'menu_book',
  'bedtime', 'eco', 'lightbulb', 'palette',
  'code', 'directions_run', 'payments', 'restaurant',
  'coffee', 'language', 'piano', 'edit'
];

function getOnColor(hex) {
  return hex === '#ffffff' ? '#000000' : '#3d5e00';
}

async function handleCreate() {
  if (saving.value) return;
  saving.value = true;
  try {
    const session = await authClient.getSession();
    if (!session.data) {
      router.push('/login');
      return;
    }
    const userId = session.data.user.id;
    const userName = session.data.user.name || session.data.user.email.split('@')[0];
    
    // Sync User to public schema (Foreign Key Requirement)
    await sql`
      INSERT INTO "User" ("id", "email", "name") 
      VALUES (${userId}, ${session.data.user.email}, ${userName})
      ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name"
    `;
    
    const id = crypto.randomUUID();
    const now = new Date();
    await sql`
      INSERT INTO "Habit" ("id", "name", "icon", "color", "frequency", "reminderTime", "dailyGoal", "userId", "updatedAt") 
      VALUES (${id}, ${habitName.value}, ${selectedIcon.value}, ${selectedColor.value}, ${frequency.value}, ${reminderTime.value}, ${dailyGoal.value}, ${userId}, ${now})
    `;
    
    router.push('/dashboard');
  } catch (err) {
    console.error("Failed to create habit:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  const session = await authClient.getSession();
  if (!session.data) router.push('/login');
  else user.value = session.data.user;
});
</script>

<style scoped>
input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.5;
  cursor: pointer;
}
.bg-grain::before {
  content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; opacity: 0.02;
  background-image: url(https://grainy-gradients.vercel.app/noise.svg);
}
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
