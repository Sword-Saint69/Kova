<template>
  <div class="min-h-screen bg-background text-on-surface font-sans selection:bg-primary selection:text-on-primary">
    <!-- TopNavBar Shared Component -->
    <nav class="bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-white/5 docked full-width top-0 sticky z-50">
      <div class="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        <div @click="$router.push('/dashboard')" class="flex items-center gap-2 cursor-pointer group">
          <img src="/logo-full.png" alt="KoVA Logo" class="h-8 w-auto object-contain transition-transform group-hover:scale-110">
        </div>
        <div class="hidden md:flex gap-2">
          <RouterLink to="/dashboard" class="text-white/60 hover:text-white px-4 py-1.5 transition-colors font-sans text-sm font-medium tracking-tight">Dashboard</RouterLink>
          <a class="text-white/60 hover:text-white px-4 py-1.5 transition-colors font-sans text-sm font-medium tracking-tight" href="#">Analytics</a>
          <RouterLink to="/profile" class="text-[#b1ff29] bg-[#b1ff29]/10 rounded-full px-4 py-1.5 font-semibold font-sans text-sm tracking-tight">Profile</RouterLink>
        </div>
        <div class="flex items-center gap-4">
          <button class="text-white/60 hover:text-white transition-all">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <div @click="$router.push('/profile')" class="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
            <img v-if="user?.image" class="w-full h-full object-cover" :src="user.image" :alt="user.name">
            <div v-else class="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
               {{ (user?.name || 'U').charAt(0) }}
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main v-if="!loading" class="max-w-[760px] mx-auto px-6 py-12 md:py-20 space-y-16">
      <!-- Profile Header Section -->
      <header class="flex flex-col items-center text-center space-y-8">
        <div class="relative group">
          <div class="w-[80px] h-[80px] rounded-full p-0.5 border-2 border-primary overflow-hidden transition-all group-hover:shadow-[0_0_20px_rgba(177,255,41,0.3)]">
            <img v-if="user?.image" class="w-full h-full object-cover rounded-full" :src="user.image" :alt="user.name">
            <div v-else class="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
               {{ (user?.name || 'U').charAt(0) }}
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <h1 class="text-[32px] font-serif italic text-white leading-tight">{{ user?.name || 'User Name' }}</h1>
          <p class="text-on-surface-variant font-sans font-light max-w-md mx-auto leading-relaxed">
            Mastering daily rituals and technical precision. Currently tracking {{ globalStats.totalHabits }} habits towards absolute excellence.
          </p>
        </div>
        <!-- Stats Row -->
        <div class="flex gap-12 py-4 border-y border-white/5 w-full justify-center">
          <div class="flex flex-col">
            <span class="text-[28px] font-serif text-primary">{{ globalStats.totalHabits }}</span>
            <span class="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Habits Tracked</span>
          </div>
          <div class="flex flex-col border-x border-white/5 px-12">
            <span class="text-[28px] font-serif text-primary">{{ globalStats.bestStreak }}</span>
            <span class="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Best Streak</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[28px] font-serif text-primary">{{ globalStats.avgCompletion }}%</span>
            <span class="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Avg Completion</span>
          </div>
        </div>
        <div class="flex gap-4 pt-2">
          <button @click="copyProfileLink" class="bg-primary text-on-primary px-8 py-3 rounded-full font-sans font-bold text-sm tracking-tight transition-all active:scale-95 shadow-lg shadow-primary/10 hover:bg-primary-container">
            Share profile
          </button>
          <button class="border border-primary/20 text-primary px-8 py-3 rounded-full font-sans font-bold text-sm tracking-tight transition-all hover:bg-primary/5 active:scale-95">
            Follow
          </button>
        </div>
      </header>

      <!-- Heatmap Cards Section -->
      <section class="space-y-6">
        <h2 class="text-[12px] uppercase tracking-[0.2em] text-on-surface-variant font-bold px-1">Annual Momentum</h2>
        
        <div v-for="habit in habitsWithStats" :key="habit.id" 
             class="bg-surface-container-low rounded-xl p-6 md:p-8 border border-white/5 space-y-6 group transition-all hover:border-white/10">
          <div class="flex justify-between items-end">
            <div>
              <h3 class="text-xl font-serif text-white group-hover:text-primary transition-colors">{{ habit.name }}</h3>
              <p class="text-xs text-on-surface-variant mt-1 font-sans">{{ habit.description || 'Consistency building' }}</p>
            </div>
            <div class="text-right">
              <span class="text-2xl font-serif text-primary block">{{ habit.streak }}</span>
              <span class="text-[10px] uppercase tracking-widest text-on-surface-variant">Day Streak</span>
            </div>
          </div>
          <div class="overflow-x-auto hide-scrollbar">
            <div class="flex gap-1 min-w-max">
              <div class="grid grid-rows-7 grid-flow-col gap-1">
                <div v-for="(cell, cIdx) in habit.heatmap" :key="cIdx" 
                     :class="['w-2.5 h-2.5 rounded-[2px] transition-all duration-700', getIntensityClass(cell.count)]">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="habitsWithStats.length === 0" class="p-12 text-center bg-white/[0.01] rounded-xl border border-dashed border-white/5">
           <span class="material-symbols-outlined text-white/10 text-4xl mb-3">auto_awesome</span>
           <p class="text-[11px] uppercase tracking-widest text-white/20 font-bold tracking-[0.2em]">Start your first mastery protocol</p>
        </div>
      </section>

      <!-- Identity Snapshot Section -->
      <section class="space-y-6 pt-8">
        <h2 class="text-[12px] uppercase tracking-[0.2em] text-on-surface-variant font-bold px-1 text-center">Identity Snapshot</h2>
        <div class="group relative bg-surface-container-low rounded-xl border border-white/5 overflow-hidden">
          <div class="aspect-[2/1] relative flex items-center justify-center p-12 bg-gradient-to-br from-surface via-surface-container-low to-[#1a220a]">
            <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, #b1ff29 1px, transparent 0); background-size: 24px 24px;"></div>
            <div class="relative z-10 flex flex-col items-center text-center">
              <div class="text-[10px] uppercase tracking-[0.4em] text-primary mb-4">Official KoVA Identity</div>
              <h4 class="text-4xl font-serif italic text-white mb-2">{{ user?.name || 'Habit Master' }}</h4>
              <div class="flex gap-8 mt-6">
                <div class="text-center">
                  <div class="text-2xl font-serif text-primary">{{ globalStats.bestStreak }}</div>
                  <div class="text-[8px] uppercase tracking-widest text-on-surface-variant">Best Streak</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-serif text-primary">{{ globalStats.avgCompletion }}%</div>
                  <div class="text-[8px] uppercase tracking-widest text-on-surface-variant">Completion</div>
                </div>
              </div>
              <div class="mt-8 px-4 py-1 border border-primary/20 rounded-full text-[10px] text-primary/80 font-mono">kova.app/u/{{ (user?.name || '').toLowerCase().replace(/\s+/g, '') }}</div>
            </div>
          </div>
          <div class="flex divide-x divide-white/5 border-t border-white/5">
            <button class="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors font-sans text-xs font-bold uppercase tracking-widest text-white">
              <span class="material-symbols-outlined text-sm">download</span>
              Download card
            </button>
            <button @click="copyProfileLink" class="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors font-sans text-xs font-bold uppercase tracking-widest text-white">
              <span class="material-symbols-outlined text-sm">link</span>
              Copy link
            </button>
          </div>
        </div>
      </section>

      <!-- Footer of Profile -->
      <footer class="pt-12 pb-24 text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-8 h-px bg-primary/20"></div>
          <p class="font-sans text-[12px] uppercase tracking-widest text-on-surface-variant">
            Tracked with perfection · kova.app
          </p>
          <div class="flex gap-6 mt-4">
            <a class="text-white/40 hover:text-primary transition-colors text-[10px] uppercase tracking-widest" href="#">Privacy</a>
            <a class="text-white/40 hover:text-primary transition-colors text-[10px] uppercase tracking-widest" href="#">Terms</a>
            <a class="text-white/40 hover:text-primary transition-colors text-[10px] uppercase tracking-widest" href="#">Support</a>
          </div>
        </div>
      </footer>
    </main>

    <!-- Global Footer -->
    <footer class="bg-[#0e0e0e] border-t border-white/5">
      <div class="flex flex-col gap-8 w-full px-8 py-12 max-w-7xl mx-auto items-center md:items-start">
        <img src="/logo-full.png" class="h-10 w-auto grayscale opacity-50 contrast-125" alt="KoVA Logo">
        <div class="flex flex-wrap justify-center md:justify-start gap-8">
          <a class="text-white/40 hover:text-[#b1ff29] transition-colors duration-300 font-sans text-[12px] uppercase tracking-widest" href="#">Privacy</a>
          <a class="text-white/40 hover:text-[#b1ff29] transition-colors duration-300 font-sans text-[12px] uppercase tracking-widest" href="#">Terms</a>
          <a class="text-white/40 hover:text-[#b1ff29] transition-colors duration-300 font-sans text-[12px] uppercase tracking-widest" href="#">Support</a>
          <a class="text-white/40 hover:text-[#b1ff29] transition-colors duration-300 font-sans text-[12px] uppercase tracking-widest" href="#">Press</a>
        </div>
        <div class="text-white/40 font-sans text-[12px] uppercase tracking-widest">
          © 2024 KoVA. Made with obsession.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { neon } from '@neondatabase/serverless';
import { authClient } from '../utils/auth';

const router = useRouter();
const sql = neon(import.meta.env.VITE_DATABASE_URL);

const user = ref(null);
const loading = ref(true);
const globalStats = ref({
  totalHabits: 0,
  bestStreak: 0,
  avgCompletion: 0,
});
const habitsWithStats = ref([]);

function getLocalDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function fetchProfileData() {
  loading.value = true;
  try {
    const session = await authClient.getSession();
    if (!session.data) return router.push('/login');
    user.value = session.data.user;

    // Fetch habits
    const habitsList = await sql`SELECT * FROM "Habit" WHERE "userId" = ${session.data.user.id}`;
    globalStats.value.totalHabits = habitsList.length;

    const allStats = [];
    let cumulativeRate = 0;
    let absoluteBest = 0;

    for (const h of habitsList) {
      const logs = await sql`SELECT * FROM "Log" WHERE "habitId" = ${h.id} ORDER BY "date" ASC`;
      const stats = calculateHabitStats(h, logs);
      
      allStats.push({
        ...h,
        streak: stats.currentStreak,
        heatmap: generateMiniHeatmap(logs),
      });

      cumulativeRate += stats.successRate;
      absoluteBest = Math.max(absoluteBest, stats.longestStreak);
    }

    habitsWithStats.value = allStats;
    globalStats.value.bestStreak = absoluteBest;
    globalStats.value.avgCompletion = habitsList.length > 0 ? Math.round(cumulativeRate / habitsList.length) : 0;

  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function calculateHabitStats(habit, allLogs) {
  const sortedDates = [...new Set(allLogs.map(l => getLocalDate(l.date)))].sort();
  
  // Current Streak
  let cStreak = 0;
  let d = new Date();
  const dateSet = new Set(sortedDates);
  while (dateSet.has(getLocalDate(d))) {
    cStreak++;
    d.setDate(d.getDate() - 1);
  }

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

  // Success Rate
  const created = new Date(habit.createdAt);
  created.setHours(0,0,0,0);
  const now = new Date();
  now.setHours(0,0,0,0);
  const diffDays = Math.floor(Math.abs(now - created) / (1000 * 60 * 60 * 24)) + 1;
  const successRate = Math.min(Math.round((sortedDates.length / diffDays) * 100), 100);

  return { currentStreak: cStreak, longestStreak: maxStreak, successRate };
}

function generateMiniHeatmap(allLogs) {
  const cells = [];
  const now = new Date();
  const dateCounts = allLogs.reduce((acc, l) => {
    const dStr = getLocalDate(l.date);
    acc[dStr] = (acc[dStr] || 0) + 1;
    return acc;
  }, {});

  // For mini heatmap, show about 26 weeks (182 days)
  for (let i = 181; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dStr = getLocalDate(d);
    cells.push({ date: dStr, count: dateCounts[dStr] || 0 });
  }
  return cells;
}

function getIntensityClass(count) {
  if (count === 0) return 'bg-surface-container-highest opacity-40';
  if (count === 1) return 'bg-primary/20';
  if (count === 2) return 'bg-primary/50';
  return 'bg-primary shadow-[0_0_8px_rgba(177,255,41,0.2)]';
}

function copyProfileLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  alert('Profile link copied to clipboard!');
}

onMounted(fetchProfileData);
</script>

<style>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

[data-icon]::after {
  content: attr(data-icon);
}
</style>
