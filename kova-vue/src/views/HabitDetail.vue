<template>
  <div class="min-h-screen bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">
    <!-- TopNavBar Shared Component -->
    <nav class="bg-[#0e0e0e]/90 backdrop-blur-xl docked full-width top-0 sticky z-50 border-b border-white/5">
      <div class="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        <div @click="$router.push('/dashboard')" class="flex items-center gap-2 cursor-pointer group">
          <img src="/logo-full.png" alt="KoVA Logo" class="w-8 h-8 object-contain transition-transform group-hover:scale-110">
        </div>
        <div class="hidden md:flex items-center gap-2">
          <RouterLink to="/dashboard" class="text-white/60 hover:text-white px-4 py-1.5 transition-colors font-sans text-sm font-medium tracking-tight">Dashboard</RouterLink>
          <a class="text-white/60 hover:text-white px-4 py-1.5 transition-colors font-sans text-sm font-medium tracking-tight" href="#">Analytics</a>
          <RouterLink to="/profile" class="text-white/60 hover:text-white px-4 py-1.5 transition-colors font-sans text-sm font-medium tracking-tight">Profile</RouterLink>
        </div>
        <div class="flex items-center gap-4">
          <button class="text-white/60 hover:text-white transition-colors">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <div @click="$router.push('/profile')" class="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all border border-white/5">
            <img v-if="userAvatar" :src="userAvatar" alt="User avatar" class="w-full h-full object-cover">
            <div v-else class="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
              {{ (habit?.name || 'U').charAt(0) }}
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main v-if="!loading && habit" class="max-w-[1440px] mx-auto px-6 pt-12 pb-32">
      <!-- Habit Header -->
      <header class="flex items-center justify-between mb-12">
        <div class="flex items-center gap-6">
          <button @click="$router.push('/dashboard')" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-all active:scale-95 text-on-surface-variant hover:text-white">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="flex items-center gap-4">
            <input v-if="isEditing" 
                   v-model="editName" 
                   @blur="saveName"
                   @keyup.enter="saveName"
                   class="font-headline italic text-[28px] bg-white/5 border-b border-primary text-white leading-none outline-none px-2 py-1 w-64"
                   autoFocus>
            <h1 v-else class="font-headline italic text-[28px] text-white leading-none">{{ habit.name }}</h1>
            <div :style="{ backgroundColor: habit.color }" class="w-3 h-3 rounded-full shadow-[0_0_12px_rgba(177,255,41,0.4)]"></div>
          </div>
        </div>
        <button @click="isEditing = !isEditing" class="px-6 py-2 rounded-full border-[0.5px] border-white/10 text-primary text-sm font-medium hover:bg-primary/5 transition-all">
          {{ isEditing ? 'Cancel' : 'Edit' }}
        </button>
      </header>

      <!-- Hero Heatmap Container -->
      <section class="mb-8">
        <div class="bg-surface-container-low rounded-xl p-8 relative overflow-hidden">
          <!-- Streak Badge -->
          <div class="absolute top-8 right-8 flex flex-col items-end">
            <span class="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-medium">Momentum</span>
            <div class="flex items-baseline gap-1">
              <span class="font-headline italic text-4xl text-primary leading-none">{{ currentStreak }}</span>
              <span class="text-sm font-medium text-primary uppercase">Days</span>
            </div>
          </div>
          <div class="mb-6">
            <h3 class="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-6">Yearly Consistency</h3>
            <div class="overflow-x-auto pb-4 custom-scrollbar">
              <div class="heatmap-grid min-w-[1000px]">
                <div v-for="(cell, idx) in heatmapCells" :key="idx" 
                     :class="['w-4 h-4 rounded-sm transition-all duration-500', getIntensityClass(cell.count)]"
                     :title="`${cell.date}: ${cell.count} completions`">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Row -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <!-- Current Streak -->
        <div class="bg-surface-container-low rounded-xl p-6 shadow-sm">
          <span class="text-xs uppercase tracking-widest text-on-surface-variant font-medium block mb-2">Current Streak</span>
          <span class="font-headline italic text-5xl text-primary">{{ currentStreak }}</span>
        </div>
        <!-- Longest Streak -->
        <div class="bg-surface-container-low rounded-xl p-6">
          <span class="text-xs uppercase tracking-widest text-on-surface-variant font-medium block mb-2">Longest Streak</span>
          <span class="font-headline italic text-5xl text-white">{{ longestStreak }}</span>
        </div>
        <!-- Total Completions -->
        <div class="bg-surface-container-low rounded-xl p-6">
          <span class="text-xs uppercase tracking-widest text-on-surface-variant font-medium block mb-2">Completions</span>
          <span class="font-headline italic text-5xl text-white">{{ totalCompletions }}</span>
        </div>
        <!-- Completion Rate -->
        <div class="bg-surface-container-low rounded-xl p-6 shadow-sm">
          <span class="text-xs uppercase tracking-widest text-on-surface-variant font-medium block mb-2">Success Rate</span>
          <div class="flex items-baseline gap-1">
            <span class="font-headline italic text-5xl text-primary">{{ successRate }}</span>
            <span class="text-xl font-headline italic text-primary">%</span>
          </div>
        </div>
      </section>

      <!-- Main Content Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        <!-- Left: Consistency Bar Chart (60%) -->
        <section class="lg:col-span-6 bg-surface-container-low rounded-xl p-8">
          <div class="flex justify-between items-center mb-10">
            <h3 class="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Monthly Consistency</h3>
            <span class="text-xs text-on-surface-variant font-medium">Last 12 Months</span>
          </div>
          <div class="flex items-end justify-between h-64 gap-3">
            <div v-for="(m, idx) in monthlyActivity" :key="idx" class="flex-1 flex flex-col items-center gap-4">
              <div class="w-full bg-primary/20 rounded-full h-full relative overflow-hidden flex items-end">
                <div class="w-full bg-primary rounded-full transition-all duration-1000" :style="{ height: m.percent + '%' }"></div>
              </div>
              <span class="text-[10px] text-on-surface-variant font-bold uppercase">{{ m.label }}</span>
            </div>
          </div>
        </section>

        <!-- Right: Day Notes Journal (40%) -->
        <section class="lg:col-span-4 flex flex-col gap-6">
          <h3 class="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Recent Reflections</h3>
          <div class="space-y-4">
            <div v-for="note in recentReflections" :key="note.id" 
                 class="bg-surface-container-low rounded-xl p-6 border-b border-white/5 transition-all hover:bg-white/[0.02]">
              <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] uppercase tracking-widest text-primary font-bold">{{ formatDateLabel(note.date) }}</span>
                <span class="text-xs text-on-surface-variant">{{ formatTime(note.date) }}</span>
              </div>
              <p class="text-sm text-on-surface-variant leading-relaxed">{{ note.text }}</p>
            </div>
            <div v-if="recentReflections.length === 0" class="p-12 text-center bg-white/[0.01] rounded-xl border border-dashed border-white/5">
               <span class="material-symbols-outlined text-white/10 text-4xl mb-3">edit_note</span>
               <p class="text-[11px] uppercase tracking-widest text-white/20 font-bold">No reflections yet</p>
            </div>
          </div>
          <button v-if="recentReflections.length > 3" class="w-full py-4 border-[0.5px] border-white/5 rounded-xl text-on-surface-variant text-sm font-medium hover:bg-white/5 transition-all uppercase tracking-widest">
            View full archive
          </button>
        </section>
      </div>
    </main>

    <!-- Loading State -->
    <div v-else-if="loading" class="min-h-screen flex flex-col items-center justify-center p-8">
      <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p class="font-headline italic text-xl text-white/40">Synchronizing mastery data...</p>
    </div>

    <!-- Sticky Bottom Bar -->
    <footer v-if="!loading && habit" class="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-2xl border-t border-white/5 z-40">
      <div class="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div :class="['w-2 h-2 rounded-full shadow-[0_0_8px_rgba(177,255,41,0.6)]', completedToday ? 'bg-primary' : 'bg-white/10']"></div>
          <span class="font-headline italic text-xl text-white">{{ habit.name }}</span>
        </div>
        <div class="flex items-center gap-4">
          <input v-if="!completedToday" 
                 v-model="newNote"
                 type="text" 
                 placeholder="Reflect on today's session..." 
                 class="hidden md:block bg-white/5 border border-white/10 rounded-xl px-4 h-12 w-64 text-sm focus:border-primary/50 outline-none transition-all">
          <button @click="toggleToday" 
                  :class="['font-bold text-sm tracking-tight px-10 h-12 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_24px_rgba(177,255,41,0.2)]', 
                           completedToday ? 'bg-white/5 text-white/40 border border-white/10' : 'bg-primary text-on-primary hover:bg-primary-container']">
            {{ completedToday ? 'Completed' : 'Mark today' }}
            <span class="material-symbols-outlined text-[18px]">{{ completedToday ? 'done_all' : 'check' }}</span>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { neon } from '@neondatabase/serverless';
import { authClient } from '../utils/auth';

const route = useRoute();
const router = useRouter();
const sql = neon(import.meta.env.VITE_DATABASE_URL);

const habit = ref(null);
const logs = ref([]);
const loading = ref(true);
const newNote = ref('');
const userAvatar = ref(null);

// Stats
const currentStreak = ref(0);
const longestStreak = ref(0);
const totalCompletions = ref(0);
const successRate = ref(0);
const heatmapCells = ref([]);
const monthlyActivity = ref([]);
const recentReflections = ref([]);
const completedToday = ref(false);
const isEditing = ref(false);
const editName = ref('');

function getLocalDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function fetchHabitData() {
  loading.value = true;
  try {
    const session = await authClient.getSession();
    if (!session.data) return router.push('/login');
    userAvatar.value = session.data.user.image;

    const habitId = route.params.id;
    const [h] = await sql`SELECT * FROM "Habit" WHERE "id" = ${habitId}`;
    if (!h) return router.push('/dashboard');
    habit.value = h;
    editName.value = h.name;

    const allLogs = await sql`SELECT * FROM "Log" WHERE "habitId" = ${habitId} ORDER BY "date" ASC`;
    logs.value = allLogs;

    calculateAllStats(allLogs);
    processHeatmap(allLogs);
    processMonthlyChart(allLogs);
    processReflections(allLogs);
    
    completedToday.value = allLogs.some(l => getLocalDate(l.date) === getLocalDate());

  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function calculateAllStats(allLogs) {
  const sortedDates = [...new Set(allLogs.map(l => getLocalDate(l.date)))].sort();
  totalCompletions.value = allLogs.length;

  if (sortedDates.length === 0) {
    currentStreak.value = 0;
    longestStreak.value = 0;
    successRate.value = 0;
    return;
  }

  // Current Streak
  let cStreak = 0;
  let d = new Date();
  const dateSet = new Set(sortedDates);
  while (dateSet.has(getLocalDate(d))) {
    cStreak++;
    d.setDate(d.getDate() - 1);
  }
  currentStreak.value = cStreak;

  // Longest Streak
  let maxStreak = 0;
  let currentSeq = 0;
  let lastDate = null;
  sortedDates.forEach(dateStr => {
    if (!lastDate) currentSeq = 1;
    else {
      const prevDate = new Date(lastDate);
      prevDate.setDate(prevDate.getDate() + 1);
      if (getLocalDate(prevDate) === dateStr) currentSeq++;
      else currentSeq = 1;
    }
    maxStreak = Math.max(maxStreak, currentSeq);
    lastDate = dateStr;
  });
  longestStreak.value = maxStreak;

  // Success Rate (% of days since created)
  const created = new Date(habit.value.createdAt);
  created.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const rate = Math.round((sortedDates.length / diffDays) * 100);
  successRate.value = Math.min(rate, 100);
}

function processHeatmap(allLogs) {
  const cells = [];
  const now = new Date();
  const dateCounts = allLogs.reduce((acc, l) => {
    const dStr = getLocalDate(l.date);
    acc[dStr] = (acc[dStr] || 0) + 1;
    return acc;
  }, {});

  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dStr = getLocalDate(d);
    cells.push({ date: dStr, count: dateCounts[dStr] || 0 });
  }
  heatmapCells.value = cells;
}

function processMonthlyChart(allLogs) {
  const data = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = target.getMonth();
    const y = target.getFullYear();
    
    // Use local date strings for robust counting
    const count = allLogs.filter(l => {
      const ld = new Date(l.date);
      return ld.getMonth() === m && ld.getFullYear() === y;
    }).length;
    
    // Calculate max days in that month
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    data.push({ label: monthNames[m], count, percent: Math.max((count / daysInMonth) * 100, 5) });
  }
  monthlyActivity.value = data;
}

async function saveName() {
  if (!editName.value.trim() || editName.value === habit.value.name) {
    isEditing.value = false;
    return;
  }
  try {
    await sql`UPDATE "Habit" SET "name" = ${editName.value} WHERE "id" = ${habit.value.id}`;
    habit.value.name = editName.value;
    isEditing.value = false;
  } catch (err) {
    console.error(err);
  }
}

function processReflections(allLogs) {
  recentReflections.value = allLogs
    .filter(l => l.note)
    .slice(-5)
    .reverse()
    .map(l => ({ id: l.id, date: l.date, text: l.note }));
}

async function toggleToday() {
  if (completedToday.value) return;
  const today = new Date().toISOString();
  try {
    await sql`INSERT INTO "Log" ("id", "habitId", "userId", "date", "note") 
              VALUES (${crypto.randomUUID()}, ${habit.value.id}, ${habit.value.userId}, ${today}, ${newNote.value})`;
    newNote.value = '';
    await fetchHabitData();
  } catch (err) {
    console.error(err);
  }
}

function getIntensityClass(count) {
  if (count === 0) return 'bg-white/5 opacity-50';
  if (count === 1) return 'bg-primary/40';
  return 'bg-primary shadow-[0_0_10px_rgba(177,255,41,0.4)]';
}

function formatDateLabel(date) {
  const d = new Date(date);
  const now = new Date();
  if (getLocalDate(d) === getLocalDate(now)) return 'Today';
  if (getLocalDate(d) === getLocalDate(new Date(now.setDate(now.getDate()-1)))) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

onMounted(fetchHabitData);
</script>

<style>
.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 4px;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #0e0e0e;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #262626;
  border-radius: 10px;
}
</style>
