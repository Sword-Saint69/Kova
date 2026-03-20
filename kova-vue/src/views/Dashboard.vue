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
    <nav class="bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-white/5 fixed top-0 left-0 right-0 z-50">
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
          <h1 class="text-5xl md:text-6xl font-headline italic font-medium leading-tight text-white line-clamp-2">Good morning, {{ user.name }}.</h1>
          <div class="mt-2 flex items-center gap-3">
            <span class="text-on-surface-variant text-sm tracking-widest uppercase">{{ currentDate }}</span>
            <div class="h-px w-8 bg-white/10"></div>
            <span class="text-[#b1ff29] text-xs font-medium uppercase tracking-wider">Protocol Active</span>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col items-end">
            <span class="text-white/40 text-[10px] uppercase tracking-tighter mb-1">Current Focus</span>
            <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-md">
              <span class="material-symbols-outlined text-[#b1ff29]">bolt</span>
              <span class="text-white font-medium">Deep Work</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[160px]">
        <!-- Hero Stats -->
        <div class="md:col-span-2 lg:col-span-3 row-span-2 bg-[#121212] rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
          <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#b1ff29]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div class="relative z-10 flex flex-col h-full">
            <div class="flex justify-between items-start mb-auto">
              <div>
                <p class="text-white/40 text-xs uppercase tracking-[0.2em] mb-2 font-medium">Monthly Completion</p>
                <h3 class="text-4xl font-headline italic font-medium text-white">Consistently High</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[#b1ff29]">
                <span class="material-symbols-outlined">trending_up</span>
              </div>
            </div>
            <div class="mt-8">
              <div class="flex items-end justify-between mb-4">
                <span class="text-6xl font-headline font-semibold text-[#b1ff29]">84<span class="text-2xl opacity-40">%</span></span>
                <div class="flex gap-1 items-end h-16">
                  <div v-for="h in [40, 60, 45, 80, 55, 90, 75]" :key="h" :style="{ height: h + '%' }" class="w-1.5 bg-[#b1ff29]/20 rounded-t-full transition-all duration-500 group-hover:bg-[#b1ff29]"></div>
                </div>
              </div>
              <p class="text-white/50 text-sm leading-relaxed max-w-[280px]">Your discipline is currently <span class="text-white font-medium">12% above</span> your previous 30-day average. Keep the momentum.</p>
            </div>
          </div>
        </div>

        <!-- Habits List (Dynamic) -->
        <div class="md:col-span-2 lg:col-span-3 row-span-3 bg-[#0e0e0e] rounded-[32px] border border-white/5 p-8 flex flex-col">
          <div class="flex justify-between items-center mb-10">
            <h3 class="text-xl font-headline italic font-medium text-white">Daily Operations</h3>
            <button class="text-[10px] uppercase tracking-widest text-[#b1ff29] hover:opacity-70 transition-opacity">Manage All</button>
          </div>
          
          <div class="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="habit in habits" :key="habit.id" 
                 @click="toggleHabit(habit)"
                 :class="[
                   'flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 cursor-pointer group',
                   habit.completed ? 'bg-[#b1ff29]/5 border-[#b1ff29]/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                 ]">
              <div class="flex items-center gap-5">
                <div :style="{ backgroundColor: habit.completed ? '#b1ff29' : 'rgba(255,255,255,0.05)' }" 
                     class="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-500">
                  <span class="material-symbols-outlined !text-xl" :class="habit.completed ? 'text-black' : 'text-white/30'">{{ habit.icon }}</span>
                </div>
                <div>
                  <h4 class="font-medium text-[15px] transition-colors" :class="habit.completed ? 'text-white' : 'text-white/60'">{{ habit.name }}</h4>
                  <p class="text-[10px] uppercase tracking-tighter opacity-40 mt-0.5">Frequency: Daily</p>
                </div>
              </div>
              <div :class="[
                'w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500',
                habit.completed ? 'bg-[#b1ff29] border-[#b1ff29]' : 'border-white/10 group-hover:border-white/30'
              ]">
                <span v-if="habit.completed" class="material-symbols-outlined text-[16px] text-black font-bold">check</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mini Stats -->
        <div class="md:col-span-1 lg:col-span-1 row-span-1 bg-[#121212] rounded-[32px] p-6 border border-white/5 flex flex-col justify-between">
          <span class="material-symbols-outlined text-white/20">calendar_today</span>
          <div>
            <p class="text-white/40 text-[10px] uppercase tracking-widest mb-1">Total Days</p>
            <p class="text-2xl font-headline text-white italic font-medium">{{ totalDays }}</p>
          </div>
        </div>

        <div class="md:col-span-1 lg:col-span-1 row-span-1 bg-[#b1ff29] rounded-[32px] p-6 flex flex-col justify-between">
          <span class="material-symbols-outlined text-black/40">workspace_premium</span>
          <div>
            <p class="text-black/60 text-[10px] uppercase tracking-widest mb-1">Streak</p>
            <p class="text-2xl font-headline text-black italic font-semibold">{{ topStreak }}</p>
          </div>
        </div>

        <div class="md:col-span-2 lg:col-span-1 row-span-1 bg-[#121212] rounded-[32px] p-6 border border-white/5 flex flex-col justify-between overflow-hidden relative group">
          <div class="relative z-10">
            <p class="text-white/40 text-[10px] uppercase tracking-widest mb-1">Status</p>
            <p class="text-xl font-headline text-white italic font-medium">Evolution</p>
          </div>
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-[#b1ff29]/20 transition-all duration-700"></div>
        </div>
      </div>
    </main>
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

const selectedHabitId = ref(null);
const topStreak = ref(0);
const totalDays = ref(0);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

async function fetchDashboardData() {
  loading.value = true;
  showRetry.value = false;
  
  try {
    // Try to get session with multiple retries to handle race conditions after login
    let session = null;
    for (let i = 0; i < 4; i++) {
      console.log(`Checking session (attempt ${i+1})...`);
      const sessionResult = await authClient.getSession();
      if (sessionResult.data) {
        console.log("Session found:", sessionResult.data);
        session = sessionResult.data;
        break;
      }
      await new Promise(r => setTimeout(r, 600)); // wait and retry
    }
    
    if (!session) {
      console.warn("No session detected after retries. showing retry button.");
      showRetry.value = true;
      loading.value = false;
      return;
    }

    user.value = {
      name: session.user.name || session.user.email.split('@')[0],
      id: session.user.id
    };

    // Fetch habits from Neon directly
    let userHabits = await sql`
      SELECT id, name, icon, color 
      FROM "Habit" 
      WHERE "userId" = ${user.value.id}
      ORDER BY "createdAt" DESC
    `;
    
    // If no habits, create defaults
    if (userHabits.length === 0) {
      const defaults = [
        { name: 'Morning Meditation', icon: 'self_improvement', color: '#b1ff29' },
        { name: 'Deep Work Block', icon: 'psychology', color: '#b1ff29' },
        { name: 'Read 20 Pages', icon: 'menu_book', color: '#b1ff29' }
      ];
      
      for (const h of defaults) {
        await sql`
          INSERT INTO "Habit" ("name", "icon", "color", "userId") 
          VALUES (${h.name}, ${h.icon}, ${h.color}, ${user.value.id})
        `;
      }
      
      // Fetch again after creation
      userHabits = await sql`
        SELECT id, name, icon, color 
        FROM "Habit" 
        WHERE "userId" = ${user.value.id}
        ORDER BY "createdAt" DESC
      `;
    }

    // Fetch logs for today
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

    if (habits.value.length > 0) {
      selectedHabitId.value = habits.value[0].id;
    }

    // Basic stats calculation
    const logCount = await sql`SELECT count(DISTINCT "date"::date) FROM "Log" WHERE "userId" = ${user.value.id}`;
    totalDays.value = parseInt(logCount[0].count) || 0;
    
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
      // Add log
      await sql`
        INSERT INTO "Log" ("habitId", "userId", "date", "value")
        VALUES (${habit.id}, ${user.value.id}, ${today}, 1)
        ON CONFLICT DO NOTHING
      `;
    } else {
      // Remove log
      await sql`
        DELETE FROM "Log" 
        WHERE "habitId" = ${habit.id} 
        AND "userId" = ${user.value.id}
        AND "date"::date = ${today}::date
      `;
    }
  } catch (err) {
    console.error("Failed to toggle habit:", err);
    habit.completed = originalState; // rollback on error
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

<style scoped>
.font-headline {
  font-family: 'Newsreader', serif;
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bg-grain {
  position: relative;
}
.bg-grain::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: url("https://grainy-gradients.vercel.app/noise.svg");
  opacity: 0.03;
  z-index: 100;
}
</style>
