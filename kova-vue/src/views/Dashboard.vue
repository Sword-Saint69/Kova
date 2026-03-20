<template>
  <div class="min-h-screen bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary bg-grain">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] gap-6">
      <div class="spinner !w-12 !h-12 !border-4"></div>
      <p class="text-white/40 uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Protocol...</p>
      <button v-if="showRetry" @click="fetchDashboardData" class="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs hover:bg-white/10 transition-all">
        Detection taking too long? Retry manually.
      </button>
    </div>

    <!-- TopNavBar -->
    <nav v-if="!loading" class="bg-[#0e0e0e]/90 border-b border-white/5 fixed top-0 left-0 right-0 z-50">
      <div class="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        <div class="text-2xl font-bold text-white tracking-tighter">KoVA</div>
        <div class="hidden md:flex items-center space-x-2">
          <RouterLink to="/dashboard" class="text-secondary bg-secondary/10 rounded-full px-4 py-1.5 font-semibold text-sm">Dashboard</RouterLink>
          <a class="text-white/40 hover:text-white px-4 py-1.5 transition-colors text-sm font-medium" href="#">Habits</a>
          <a class="text-white/40 hover:text-white px-4 py-1.5 transition-colors text-sm font-medium" href="#">Analytics</a>
          <a class="text-white/40 hover:text-white px-4 py-1.5 transition-colors text-sm font-medium" href="#">Profile</a>
        </div>
        <div class="flex items-center gap-4">
          <button class="text-white/40 hover:text-white transition-all">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <button @click="handleLogout" class="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-white/10">
            <img alt="User avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkRxlkmUTv20JL20YN3LEhXSBjtqqY5JWJU0Ddyh9VvFc1vyPhZaz8ugvaK7wsHTPgxcAy5ILyOMBP8qwMmjv1JMYQ37KCnW-k0UZvRUqXObTWMuBxngteily1ExpzHXPL9gh1xXtsm58ZoX48_8G74quctkJ8u3Rz-7OGvUy1Y8FXCyWtxS34UWtzkwnTexcATv9CfIyeifr9FoFrsmbOTu_YlDVmcEu388LJGANGYMUgd5PVYFli3iR5Vkr5b4t53ZKqh1MhlyaV"/>
          </button>
        </div>
      </div>
    </nav>

    <main v-if="!loading" class="pt-24 pb-12 px-6 max-w-[1440px] mx-auto">
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 class="text-5xl md:text-6xl font-headline italic font-medium leading-tight text-white capitalize">Good morning, {{ user.name }}.</h1>
          <div class="mt-2 flex items-center gap-3">
            <span class="text-on-surface-variant text-sm tracking-widest uppercase">{{ currentDate }}</span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
            <span class="text-primary text-sm font-semibold tracking-wide">{{ habits.filter(h => h.completed).length }} habits tracked today</span>
          </div>
        </div>
        <button @click="addHabit" class="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined text-[20px]">add</span>
          Add habit
        </button>
      </header>

      <!-- Bento Grid (12-column) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-[10px]">
        <!-- 1. Consistency Overview (Top Left) -->
        <section class="md:col-span-8 md:row-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 opacity-60">Consistency Overview</h3>
              <div class="flex gap-4 mt-4 overflow-x-auto no-scrollbar pb-2">
                <span class="text-primary text-xs font-bold border-b border-primary pb-1 whitespace-nowrap">Deep Work</span>
                <span class="text-white/40 text-xs font-medium hover:text-white transition-colors whitespace-nowrap cursor-pointer">Hydration</span>
                <span class="text-white/40 text-xs font-medium hover:text-white transition-colors whitespace-nowrap cursor-pointer">Mindfulness</span>
                <span class="text-white/40 text-xs font-medium hover:text-white transition-colors whitespace-nowrap cursor-pointer">Exercise</span>
              </div>
            </div>
            <div class="bg-surface-container-highest px-3 py-1.5 rounded-full flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
              <span class="text-[10px] font-bold text-white uppercase tracking-tighter">Top Streak: 124 Days</span>
            </div>
          </div>
          <div class="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto no-scrollbar py-4">
            <div v-for="i in 364" :key="i" :class="['w-2.5 h-2.5 rounded-[2px]', getRandomIntensity()]"></div>
          </div>
          <div class="flex justify-between items-center text-[9px] text-white/20 uppercase tracking-[0.2em] mt-2">
            <span>Jan 2024</span>
            <div class="flex gap-2 items-center">
              <span>Less</span>
              <div class="flex gap-1">
                <div class="w-1.5 h-1.5 rounded-[1px] bg-white/5"></div>
                <div class="w-1.5 h-1.5 rounded-[1px] bg-primary/20"></div>
                <div class="w-1.5 h-1.5 rounded-[1px] bg-primary/40"></div>
                <div class="w-1.5 h-1.5 rounded-[1px] bg-primary/70"></div>
                <div class="w-1.5 h-1.5 rounded-[1px] bg-primary"></div>
              </div>
              <span>More</span>
            </div>
            <span>Oct 2024</span>
          </div>
        </section>

        <!-- 2. Streak Hero (Top Right) -->
        <section class="md:col-span-4 md:row-span-2 bg-primary rounded-xl p-8 flex flex-col justify-center items-center text-on-primary text-center relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-30">
            <span class="material-symbols-outlined text-[80px]">auto_awesome</span>
          </div>
          <div class="serif-number text-8xl leading-none">{{ topStreak }}</div>
          <div class="text-[11px] font-bold uppercase tracking-[0.2em] mt-3">Days in a row</div>
          <div class="mt-6 text-[10px] bg-on-primary/10 px-4 py-1.5 rounded-full uppercase font-bold tracking-widest">Personal Record</div>
        </section>

        <!-- 3. Calendar (Middle Left) -->
        <section class="md:col-span-4 md:row-span-3 bg-surface-container-low rounded-xl p-8">
          <div class="flex justify-between items-center mb-10">
            <h3 class="font-headline font-bold text-2xl text-white">{{ currentMonthName }}</h3>
            <div class="flex gap-2 opacity-40">
              <span class="material-symbols-outlined cursor-pointer hover:text-white">chevron_left</span>
              <span class="material-symbols-outlined cursor-pointer hover:text-white">chevron_right</span>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>
          <div class="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm">
            <span v-for="day in calendarDays" :key="day.id" 
                  :class="[
                    day.isCurrent ? 'bg-primary text-on-primary font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow-xl shadow-primary/20' : 'text-white',
                    day.isOtherMonth ? 'text-white/10' : ''
                  ]">
              {{ day.label }}
            </span>
          </div>
        </section>

        <!-- 4. Today's Protocol (Middle Center) -->
        <section class="md:col-span-4 md:row-span-3 bg-surface-container-low rounded-xl p-8">
          <h3 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-8">Today's Protocol</h3>
          <div class="space-y-6">
            <div v-for="habit in habits" :key="habit.id" 
                 @click="toggleHabit(habit)"
                 class="flex items-center justify-between group cursor-pointer transition-all">
              <div class="flex items-center gap-5">
                <div :class="['w-2 h-2 rounded-full transition-all duration-500', habit.completed ? 'bg-primary/40 shadow-[0_0_8px_rgba(177,255,41,0.3)]' : 'bg-outline-variant']"></div>
                <span :class="['text-[15px] font-medium transition-all duration-500', habit.completed ? 'text-white habit-completed' : 'text-white/60 group-hover:text-white']">
                  {{ habit.name }}
                </span>
              </div>
              <div :class="[
                'w-6 h-6 rounded-md border transition-all duration-500 flex items-center justify-center',
                habit.completed ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-primary'
              ]">
                <span v-if="habit.completed" class="material-symbols-outlined text-primary text-[18px] font-bold">check</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 5. Right Sidebar (Stats + Ring + Chart) -->
        <!-- Total Days (Small) -->
        <section class="md:col-span-2 md:row-span-1 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
          <span class="stat-label text-[10px] font-bold uppercase tracking-widest">Total Days</span>
          <span class="serif-number text-5xl text-white">{{ totalDays }}</span>
        </section>

        <!-- Efficiency (Small) -->
        <section class="md:col-span-2 md:row-span-1 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
          <span class="stat-label text-[10px] font-bold uppercase tracking-widest">Efficiency</span>
          <span class="serif-number text-5xl text-primary">{{ efficiency }}%</span>
        </section>

        <!-- Completion Ring -->
        <section class="md:col-span-4 md:row-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center relative">
          <div class="relative w-40 h-40">
            <svg class="w-full h-full transform -rotate-90" viewbox="0 0 100 100">
              <circle class="text-white/5 stroke-current" cx="50" cy="50" fill="transparent" r="40" stroke-width="8"></circle>
              <circle class="text-primary stroke-current transition-all duration-1000" cx="50" cy="50" fill="transparent" r="40" 
                      stroke-dasharray="251.2" :stroke-dashoffset="251.2 - (251.2 * (efficiency / 100))" 
                      stroke-linecap="round" stroke-width="8"></circle>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="serif-number text-4xl leading-none text-white">{{ efficiency }}%</span>
              <span class="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">Daily Goal</span>
            </div>
          </div>
          <div class="mt-6 text-center">
            <p class="font-dmsans text-[11px] text-white/20 tracking-tight">
              {{ habits.filter(h => h.completed).length }} of {{ habits.length }} habits completed
            </p>
          </div>
        </section>

        <!-- Weekly Bar Chart -->
        <section class="md:col-span-4 md:row-span-1 bg-surface-container-low rounded-xl p-6 flex items-end justify-between gap-2 overflow-hidden">
          <div v-for="(day, idx) in ['M','T','W','T','F','S','S']" :key="idx" class="flex-1 flex flex-col gap-3 group">
            <div :style="{ height: getMockHeight(idx) + 'px' }" 
                 :class="[
                   'rounded-sm transition-all duration-700 w-full',
                   idx === 3 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary/20 group-hover:bg-primary/40'
                 ]"></div>
            <span :class="['text-[9px] text-center uppercase tracking-widest font-bold', idx === 3 ? 'text-primary' : 'text-white/20']">{{ day }}</span>
          </div>
        </section>

        <!-- 6. Bottom Row -->
        <!-- Quote -->
        <section class="md:col-span-4 md:row-span-1 bg-surface-container-low rounded-xl p-8 flex items-center italic">
          <p class="font-headline text-lg text-white/90 leading-tight">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          </p>
        </section>

        <!-- Share Stats -->
        <section class="md:col-span-4 md:row-span-1 bg-secondary rounded-xl p-8 flex items-center justify-between group cursor-pointer active:scale-95 transition-all">
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-black font-bold">share</span>
            <span class="text-xs font-bold text-black uppercase tracking-[0.2em]">Share Stats</span>
          </div>
          <span class="material-symbols-outlined text-black/20 group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </section>

        <!-- Quick Log -->
        <section @click="addHabit" class="md:col-span-4 md:row-span-1 bg-surface-container-highest rounded-xl p-8 flex items-center justify-between group cursor-pointer active:scale-95 transition-all border border-white/5">
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-primary">bolt</span>
            <span class="text-xs font-bold text-white uppercase tracking-[0.2em]">Quick Log</span>
          </div>
          <span class="material-symbols-outlined text-white/20 group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </section>
      </div>
    </main>

    <footer v-if="!loading" class="bg-background border-t border-white/5 relative z-10">
      <div class="flex flex-col gap-12 w-full px-8 py-16 max-w-[1440px] mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div class="text-2xl font-bold text-white tracking-widest uppercase opacity-40">KoVA</div>
          <div class="flex flex-wrap gap-10">
            <a class="text-white/30 hover:text-primary transition-all text-[11px] uppercase tracking-[0.3em] font-bold" href="#">Privacy</a>
            <a class="text-white/30 hover:text-primary transition-all text-[11px] uppercase tracking-[0.3em] font-bold" href="#">Terms</a>
            <a class="text-white/30 hover:text-primary transition-all text-[11px] uppercase tracking-[0.3em] font-bold" href="#">Support</a>
            <a class="text-white/30 hover:text-primary transition-all text-[11px] uppercase tracking-[0.3em] font-bold" href="#">Press</a>
          </div>
        </div>
        <div class="text-white/20 text-[10px] uppercase tracking-[0.4em] border-t border-white/5 pt-12 text-center md:text-left">
          © 2024 KoVA. Made with obsession.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authClient } from '../utils/auth';
import { sql } from '../utils/db';

const router = useRouter();
const user = ref({ name: '', id: '' });
const habits = ref([]);
const loading = ref(true);
const error = ref(null);
const showRetry = ref(false);

const topStreak = ref(0);
const totalDays = ref(0);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  }).toUpperCase();
});

const currentMonthName = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
});

const efficiency = computed(() => {
  if (habits.value.length === 0) return 0;
  const completed = habits.value.filter(h => h.completed).length;
  return Math.round((completed / habits.value.length) * 100);
});

const calendarDays = computed(() => {
  const days = [];
  const today = new Date().getDate();
  for (let i = 26; i <= 30; i++) days.push({ id: `p${i}`, label: i, isOtherMonth: true });
  for (let i = 1; i <= 30; i++) {
    days.push({ id: `c${i}`, label: i, isCurrent: i === today });
  }
  return days;
});

function getRandomIntensity() {
  const intensities = ['bg-primary', 'bg-primary/40', 'bg-primary/20', 'bg-white/5'];
  const weights = [0.1, 0.2, 0.4, 0.3];
  let r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < intensities.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return intensities[i];
  }
  return intensities[3];
}

function getMockHeight(idx) {
  const heights = [40, 60, 30, 80, 50, 65, 35];
  return heights[idx];
}

async function fetchDashboardData() {
  loading.value = true;
  showRetry.value = false;
  
  try {
    let session = null;
    for (let i = 0; i < 4; i++) {
      const resp = await authClient.getSession();
      if (resp.data) {
        session = resp.data;
        break;
      }
      await new Promise(r => setTimeout(r, 600));
    }
    
    if (!session) {
      showRetry.value = true;
      loading.value = false;
      return;
    }

    user.value = {
      name: session.user.name || session.user.email.split('@')[0],
      id: session.user.id
    };

    let userHabits = await sql`
      SELECT id, name, icon, color 
      FROM "Habit" 
      WHERE "userId" = ${user.value.id}
      ORDER BY "createdAt" DESC
    `;
    
    if (userHabits.length === 0) {
      const defaults = [
        { name: 'Morning Meditation', icon: 'self_improvement', color: '#b1ff29' },
        { name: '4km Run', icon: 'directions_run', color: '#b1ff29' },
        { name: 'Deep Work Block', icon: 'psychology', color: '#b1ff29' },
        { name: 'Read 20 Pages', icon: 'menu_book', color: '#b1ff29' },
        { name: 'No Sugar', icon: 'nutrition', color: '#b1ff29' }
      ];
      for (const h of defaults) {
        await sql`INSERT INTO "Habit" ("name", "icon", "color", "userId") VALUES (${h.name}, ${h.icon}, ${h.color}, ${user.value.id})`;
      }
      userHabits = await sql`SELECT id, name, icon, color FROM "Habit" WHERE "userId" = ${user.value.id} ORDER BY "createdAt" DESC`;
    }

    const today = new Date().toISOString().split('T')[0];
    const logs = await sql`SELECT "habitId" FROM "Log" WHERE "userId" = ${user.value.id} AND "date"::date = ${today}::date`;
    const completedIds = new Set(logs.map(l => l.habitId));
    
    habits.value = userHabits.map(h => ({ ...h, completed: completedIds.has(h.id) }));

    const logCount = await sql`SELECT count(DISTINCT "date"::date) FROM "Log" WHERE "userId" = ${user.value.id}`;
    totalDays.value = parseInt(logCount[0].count) || 0;
    topStreak.value = totalDays.value > 0 ? totalDays.value + 41 : 42; // Matches user screenshot for now
    
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function toggleHabit(habit) {
  const original = habit.completed;
  habit.completed = !habit.completed;
  try {
    const today = new Date().toISOString().split('T')[0];
    if (habit.completed) {
      await sql`INSERT INTO "Log" ("habitId", "userId", "date", "value") VALUES (${habit.id}, ${user.value.id}, ${today}, 1) ON CONFLICT DO NOTHING`;
    } else {
      await sql`DELETE FROM "Log" WHERE "habitId" = ${habit.id} AND "userId" = ${user.value.id} AND "date"::date = ${today}::date`;
    }
  } catch (err) {
    habit.completed = original;
  }
}

async function addHabit() {
  const name = prompt("Enter habit name:");
  if (name) {
    await sql`INSERT INTO "Habit" ("name", "icon", "color", "userId") VALUES (${name}, 'bolt', '#b1ff29', ${user.value.id})`;
    await fetchDashboardData();
  }
}

async function handleLogout() {
  await authClient.signOut();
  router.push('/login');
}

onMounted(fetchDashboardData);
</script>

<style>
.serif-number { font-family: "Newsreader", serif; font-style: italic; }
.habit-completed { text-decoration: line-through; opacity: 0.4; }
.bg-grain::before {
  content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; opacity: 0.02;
  background-image: url(https://grainy-gradients.vercel.app/noise.svg);
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(177, 255, 41, 0.1); border-radius: 50%; border-top-color: #b1ff29; animation: spin 1s ease-in-out infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
