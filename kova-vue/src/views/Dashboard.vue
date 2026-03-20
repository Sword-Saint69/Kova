<template>
  <div class="min-h-screen bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen bg-grain">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] gap-6">
      <div class="spinner !w-12 !h-12 !border-4"></div>
      <p class="text-white/40 uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Protocol...</p>
      <button v-if="showRetry" @click="fetchDashboardData" class="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs hover:bg-white/10 transition-all">
        Detection taking too long? Retry manually.
      </button>
    </div>

    <!-- TopNavBar -->
    <nav v-if="!loading" class="bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-white/5 fixed top-0 left-0 right-0 z-50">
      <div class="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        <div class="text-2xl font-bold text-white tracking-tighter transition-all">KoVA</div>
        <div class="hidden md:flex items-center space-x-2">
          <RouterLink to="/dashboard" class="text-[#b1ff29] bg-[#b1ff29]/10 rounded-full px-4 py-1.5 font-semibold text-sm font-medium tracking-tight">Dashboard</RouterLink>
          <a class="text-white/60 hover:text-white px-4 py-1.5 transition-colors text-sm font-medium tracking-tight" href="#">Habits</a>
          <a class="text-white/60 hover:text-white px-4 py-1.5 transition-colors text-sm font-medium tracking-tight" href="#">Analytics</a>
          <button @click="handleLogout" class="text-white/60 hover:text-white px-4 py-1.5 transition-colors text-sm font-medium tracking-tight">Logout</button>
        </div>
        <div class="flex items-center gap-4">
          <button class="text-white/60 hover:bg-white/5 hover:text-white rounded-full p-2 transition-all duration-300">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <div class="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-white/10">
            <img alt="User avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkRxlkmUTv20JL20YN3LEhXSBjtqqY5JWJU0Ddyh9VvFc1vyPhZaz8ugvaK7wsHTPgxcAy5ILyOMBP8qwMmjv1JMYQ37KCnW-k0UZvRUqXObTWMuBxngteily1ExpzHXPL9gh1xXtsm58ZoX48_8G74quctkJ8u3Rz-7OGvUy1Y8FXCyWtxS34UWtzkwnTexcATv9CfIyeifr9FoFrsmbOTu_YlDVmcEu388LJGANGYMUgd5PVYFli3iR5Vkr5b4t53ZKqh1MhlyaV"/>
          </div>
        </div>
      </div>
    </nav>

    <main v-if="!loading" class="pt-24 pb-12 px-6 max-w-[1440px] mx-auto">
      <!-- Page Header -->
      <header class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 class="text-5xl md:text-6xl font-headline italic font-medium leading-tight text-white">Good morning, {{ user.name }}.</h1>
          <div class="mt-2 flex items-center gap-3">
            <span class="text-on-surface-variant text-sm tracking-widest uppercase">{{ currentDate }}</span>
            <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span class="text-primary text-sm font-semibold tracking-wide">{{ habits.length }} habits tracked today</span>
          </div>
        </div>
        <button @click="addHabit" class="flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined text-[20px]">add</span>
          Add habit
        </button>
      </header>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-[10px] auto-rows-[minmax(120px,auto)]">
        <!-- Consistency Overview -->
        <section class="md:col-span-8 md:row-span-3 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-sm font-medium text-on-surface-variant uppercase tracking-widest mb-1">Consistency Overview</h3>
              <div class="flex gap-4 mt-4 overflow-x-auto no-scrollbar pb-2">
                <span class="text-primary text-xs font-bold border-b border-primary pb-1 whitespace-nowrap">Global Activity</span>
                <span class="text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer">Protocol Mastery</span>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-full">
              <span class="material-symbols-outlined text-primary text-[18px]" data-weight="fill" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
              <span class="text-xs font-bold text-white uppercase tracking-tighter">Current Streak: {{ topStreak }} Days</span>
            </div>
          </div>
          <div class="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto no-scrollbar py-4">
            <div v-for="i in 364" :key="i" 
                 :class="[
                   'w-2.5 h-2.5 rounded-[2px]',
                   getRandomIntensity()
                 ]">
            </div>
          </div>
          <div class="flex justify-between items-center text-[10px] text-on-surface-variant uppercase tracking-widest mt-4">
            <span>Past Year</span>
            <div class="flex gap-2 items-center">
              <span>Less</span>
              <div class="flex gap-1">
                <div class="w-2 h-2 rounded-[2px] bg-surface-container-highest"></div>
                <div class="w-2 h-2 rounded-[2px] bg-primary/20"></div>
                <div class="w-2 h-2 rounded-[2px] bg-primary/40"></div>
                <div class="w-2 h-2 rounded-[2px] bg-primary/70"></div>
                <div class="w-2 h-2 rounded-[2px] bg-primary"></div>
              </div>
              <span>More</span>
            </div>
            <span>Today</span>
          </div>
        </section>

        <!-- Streak Hero -->
        <section class="md:col-span-4 md:row-span-2 bg-primary rounded-xl p-8 flex flex-col justify-center items-center text-on-primary text-center relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-30">
            <span class="material-symbols-outlined text-[80px]">auto_awesome</span>
          </div>
          <div class="serif-number text-8xl leading-none">{{ topStreak }}</div>
          <div class="text-sm font-bold uppercase tracking-widest mt-2">Days in a row</div>
          <div v-if="topStreak > 10" class="mt-4 text-[10px] bg-on-primary/10 px-3 py-1 rounded-full uppercase font-bold">Personal Record</div>
        </section>

        <!-- Total Days Stat -->
        <section class="md:col-span-2 md:row-span-1 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
          <span class="stat-label text-[10px] font-bold uppercase tracking-widest">Total Days</span>
          <span class="serif-number text-4xl text-white">{{ totalDays }}</span>
        </section>

        <!-- Efficiency Stat -->
        <section class="md:col-span-2 md:row-span-1 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
          <span class="stat-label text-[10px] font-bold uppercase tracking-widest">Efficiency</span>
          <span class="serif-number text-4xl text-primary">{{ efficiency }}%</span>
        </section>

        <!-- Calendar -->
        <section class="md:col-span-4 md:row-span-3 bg-surface-container-low rounded-xl p-8">
          <div class="flex justify-between items-center mb-8">
            <h3 class="font-headline font-bold text-2xl">{{ currentMonthName }}</h3>
            <div class="flex gap-2">
              <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-white">chevron_left</span>
              <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-white">chevron_right</span>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>
          <div class="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-sm">
            <span v-for="day in calendarDays" :key="day.id" 
                  :class="[
                    day.isCurrent ? 'bg-primary text-on-primary font-bold rounded-full w-7 h-7 flex items-center justify-center mx-auto shadow-md' : 'text-white',
                    day.isOtherMonth ? 'text-on-surface-variant/20' : ''
                  ]">
              {{ day.label }}
            </span>
          </div>
        </section>

        <!-- Today's Protocol -->
        <section class="md:col-span-4 md:row-span-3 bg-surface-container-low rounded-xl p-8 flex flex-col">
          <h3 class="text-sm font-medium text-on-surface-variant uppercase tracking-widest mb-6">Today's Protocol</h3>
          <div class="space-y-4 overflow-y-auto no-scrollbar pr-2 flex-grow">
            <div v-for="habit in habits" :key="habit.id" 
                 @click="toggleHabit(habit)"
                 class="flex items-center justify-between group cursor-pointer transition-all">
              <div class="flex items-center gap-4">
                <div :class="['w-2 h-2 rounded-full transition-colors', habit.completed ? 'bg-primary/40' : 'bg-outline-variant']"></div>
                <span :class="['text-sm font-medium transition-all', habit.completed ? 'text-white habit-completed' : 'text-on-surface-variant group-hover:text-white']">
                  {{ habit.name }}
                </span>
              </div>
              <div :class="[
                'w-6 h-6 rounded-md border flex items-center justify-center transition-all',
                habit.completed ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-primary'
              ]">
                <span v-if="habit.completed" class="material-symbols-outlined text-primary text-[16px] font-bold">check</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Completion Ring -->
        <section class="md:col-span-4 md:row-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center relative">
          <div class="relative w-40 h-40">
            <svg class="w-full h-full transform -rotate-90" viewbox="0 0 100 100">
              <circle class="text-surface-container-highest stroke-current" cx="50" cy="50" fill="transparent" r="40" stroke-width="8"></circle>
              <circle class="text-primary stroke-current transition-all duration-1000" cx="50" cy="50" fill="transparent" r="40" 
                      stroke-dasharray="251.2" :stroke-dashoffset="251.2 - (251.2 * (efficiency / 100))" 
                      stroke-linecap="round" stroke-width="8"></circle>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="serif-number text-4xl leading-none">{{ efficiency }}%</span>
              <span class="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Daily Goal</span>
            </div>
          </div>
          <div class="mt-6 text-center">
            <p class="font-dmsans text-[11px] text-on-surface-variant/60 tracking-tight">
              {{ habits.filter(h => h.completed).length }} of {{ habits.length }} habits completed
            </p>
          </div>
        </section>

        <!-- Weekly Bar Chart -->
        <section class="md:col-span-4 md:row-span-1 bg-surface-container-low rounded-xl p-6 flex items-end justify-between gap-2 overflow-hidden">
          <div v-for="(day, idx) in ['M','T','W','T','F','S','S']" :key="idx" class="flex-1 flex flex-col gap-2 group">
            <div :style="{ height: getMockHeight(idx) + 'px' }" 
                 :class="[
                   'rounded-sm transition-all duration-500',
                   idx === 3 ? 'bg-primary shadow-sm shadow-primary/20' : 'bg-primary/20 group-hover:bg-primary/40'
                 ]"></div>
            <span :class="['text-[9px] text-center uppercase tracking-widest', idx === 3 ? 'text-primary font-bold' : 'text-on-surface-variant']">{{ day }}</span>
          </div>
        </section>

        <!-- Motivational Quote -->
        <section class="md:col-span-4 md:row-span-1 bg-surface-container-low rounded-xl p-6 flex items-center italic">
          <p class="font-headline text-lg text-white leading-tight">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          </p>
        </section>

        <!-- Share Stats -->
        <section class="md:col-span-2 md:row-span-1 bg-primary-container rounded-xl p-6 flex flex-col justify-between group cursor-pointer active:scale-95 transition-all">
          <span class="material-symbols-outlined text-on-primary-container">share</span>
          <span class="text-xs font-bold text-on-primary-container uppercase tracking-widest">Share Stats</span>
        </section>

        <!-- Quick Log -->
        <section @click="addHabit" class="md:col-span-2 md:row-span-1 bg-surface-container-highest rounded-xl p-6 flex flex-col justify-between group cursor-pointer active:scale-95 transition-all border border-white/5">
          <span class="material-symbols-outlined text-primary">bolt</span>
          <span class="text-xs font-bold text-white uppercase tracking-widest">Quick Log</span>
        </section>
      </div>
    </main>

    <footer v-if="!loading" class="bg-background border-t border-white/5 relative z-10">
      <div class="flex flex-col gap-8 w-full px-8 py-12 max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="text-xl font-bold text-white font-serif">KoVA</div>
          <div class="flex flex-wrap gap-6">
            <a class="text-white/40 hover:text-[#b1ff29] transition-colors duration-300 text-[12px] uppercase tracking-widest font-sans" href="#">Privacy</a>
            <a class="text-white/40 hover:text-[#b1ff29] transition-colors duration-300 text-[12px] uppercase tracking-widest font-sans" href="#">Terms</a>
            <a class="text-white/40 hover:text-[#b1ff29] transition-colors duration-300 text-[12px] uppercase tracking-widest font-sans" href="#">Support</a>
            <a class="text-white/40 hover:text-[#b1ff29] transition-colors duration-300 text-[12px] uppercase tracking-widest font-sans" href="#">Press</a>
          </div>
        </div>
        <div class="text-white/40 text-[10px] uppercase tracking-widest font-sans border-t border-white/5 pt-8">
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
  });
});

const currentMonthName = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
});

const efficiency = computed(() => {
  if (habits.value.length === 0) return 0;
  const completed = habits.value.filter(h => h.completed).length;
  return Math.round((completed / habits.value.length) * 100);
});

// Mock calendar for now
const calendarDays = computed(() => {
  const days = [];
  const today = new Date().getDate();
  // Fill some prev month days
  for (let i = 26; i <= 30; i++) days.push({ id: `p${i}`, label: i, isOtherMonth: true });
  // Fill Oct days (simplified)
  for (let i = 1; i <= 30; i++) {
    days.push({ id: `c${i}`, label: i, isCurrent: i === today });
  }
  return days;
});

function getRandomIntensity() {
  const intensities = ['bg-primary', 'bg-primary/40', 'bg-primary/20', 'bg-surface-container-highest'];
  return intensities[Math.floor(Math.random() * intensities.length)];
}

function getMockHeight(idx) {
  const heights = [30, 50, 20, 70, 40, 60, 25];
  return heights[idx];
}

async function fetchDashboardData() {
  loading.value = true;
  showRetry.value = false;
  
  try {
    let session = null;
    for (let i = 0; i < 4; i++) {
      const sessionResult = await authClient.getSession();
      if (sessionResult.data) {
        session = sessionResult.data;
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
        await sql`
          INSERT INTO "Habit" ("name", "icon", "color", "userId") 
          VALUES (${h.name}, ${h.icon}, ${h.color}, ${user.value.id})
        `;
      }
      
      userHabits = await sql`
        SELECT id, name, icon, color 
        FROM "Habit" 
        WHERE "userId" = ${user.value.id}
        ORDER BY "createdAt" DESC
      `;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayLogs = await sql`
      SELECT "habitId" 
      FROM "Log" 
      WHERE "userId" = ${user.value.id} 
      AND "date"::date = ${today}::date
    `;
    
    const completedIds = new Set(todayLogs.map(l => l.habitId));
    
    habits.value = userHabits.map(h => ({
      ...h,
      completed: completedIds.has(h.id)
    }));

    // Stats
    const logCount = await sql`SELECT count(DISTINCT "date"::date) FROM "Log" WHERE "userId" = ${user.value.id}`;
    totalDays.value = parseInt(logCount[0].count) || 0;
    topStreak.value = totalDays.value > 0 ? totalDays.value + 5 : 0; // Simulated for now
    
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function toggleHabit(habit) {
  const originalState = habit.completed;
  habit.completed = !habit.completed;
  
  try {
    const today = new Date().toISOString().split('T')[0];
    if (habit.completed) {
      await sql`
        INSERT INTO "Log" ("habitId", "userId", "date", "value")
        VALUES (${habit.id}, ${user.value.id}, ${today}, 1)
        ON CONFLICT DO NOTHING
      `;
    } else {
      await sql`
        DELETE FROM "Log" 
        WHERE "habitId" = ${habit.id} 
        AND "userId" = ${user.value.id}
        AND "date"::date = ${today}::date
      `;
    }
  } catch (err) {
    console.error("Failed to toggle habit:", err);
    habit.completed = originalState;
  }
}

async function addHabit() {
  const name = prompt("Enter habit name:");
  if (!name) return;
  
  try {
    await sql`
      INSERT INTO "Habit" ("name", "icon", "color", "userId") 
      VALUES (${name}, 'bolt', '#b1ff29', ${user.value.id})
    `;
    await fetchDashboardData();
  } catch (err) {
    alert("Failed to add habit");
  }
}

async function handleLogout() {
  await authClient.signOut();
  router.push('/login');
}

onMounted(() => {
  fetchDashboardData();
});
</script>

<style>
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
}
.no-scrollbar::-webkit-scrollbar {
  display: none
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none
}
.serif-number {
  font-family: "Newsreader", serif;
  font-style: italic
}
.ghost-border {
  border: 0.5px solid rgba(177, 255, 41, 0.15)
}
.bg-grain::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.02;
  background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuB7X0icipydnmCK2SViDXNenTYQCBvdgYsgjE1OloX432gLueuwFx8wIDbUDdCVoKIL9y3TfwCLzgWAS_XJtXNwR9sEGdANIgW9lI8iSzqSx1LMCpDKhSBGX3vm62ho7HJpEe0JYL432l1zwyylEaWF-Kqq-ZeRliPxJkPNceK8YDJ9Dt6hANVeRPq3-R9LcoE93GUvMWZsbaDE33s8Xb-LD4jduX--9jy7S9N88e87AN1lwBoxg1kMO91B6QYzmLDQsOIkPKfuOFeU)
}
.stat-label {
  color: rgba(240, 237, 232, 0.3)
}
.habit-completed {
  text-decoration: line-through;
  opacity: 0.4
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(177, 255, 41, 0.1);
  border-radius: 50%;
  border-top-color: #b1ff29;
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
