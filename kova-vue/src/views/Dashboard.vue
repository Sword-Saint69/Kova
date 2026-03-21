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
            <span class="material-symbols-outlined font-light">notifications</span>
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
          <h1 class="text-6xl font-headline italic font-medium leading-tight text-white capitalize">Good morning, {{ user.name }}.</h1>
          <div class="mt-2 flex items-center gap-3">
            <span class="text-on-surface-variant text-sm tracking-widest uppercase">{{ currentDate }}</span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
            <span class="text-primary text-sm font-semibold tracking-wide">{{ habits.filter(h => h.completed).length }} habits tracked today</span>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="seedData" v-if="totalDays < 5" class="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/40 px-6 py-3 rounded-xl font-bold text-sm hover:text-white hover:bg-white/10 transition-all">
            <span class="material-symbols-outlined text-[20px]">magic_button</span>
            Seed demo data
          </button>
          <RouterLink to="/habits/new" class="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-primary/10">
            <span class="material-symbols-outlined text-[20px]">add</span>
            Add habit
          </RouterLink>
        </div>
      </header>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-[10px]">
        <!-- Consistency Overview -->
        <section class="md:col-span-8 md:row-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group">
          <div class="flex justify-between items-start mb-6 z-10">
            <div>
              <h3 class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 opacity-60">Consistency Overview</h3>
              <div class="flex gap-4 mt-4 overflow-x-auto no-scrollbar pb-2">
                <button 
                  v-for="h in [null, ...habits.slice(0, 3)]" :key="h?.id || 'all'"
                  @click="selectedFilterId = h?.id || null"
                  :class="['text-xs font-bold pb-1 transition-all border-b-2', selectedFilterId === (h?.id || null) ? 'text-primary border-primary' : 'text-white/20 border-transparent hover:text-white/40']"
                >
                  {{ h?.name || 'All Activity' }}
                </button>
              </div>
            </div>
            <div class="bg-surface-container-highest px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/5">
              <span class="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
              <span class="text-[10px] font-bold text-white uppercase tracking-tighter">Top Streak: {{ topStreak }} Days</span>
            </div>
          </div>
          
          <div class="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto no-scrollbar py-4 z-10">
            <div 
              v-for="cell in heatmapCells" :key="cell.date"
              class="w-2.5 h-2.5 rounded-[2px] transition-all duration-500 hover:scale-125 hover:z-20 border border-white/5"
              :class="getIntensityClass(cell.count)"
              :title="`${cell.date}: ${cell.count} habits`"
            ></div>
          </div>

          <div class="flex justify-between items-center text-[9px] text-white/20 uppercase tracking-[0.2em] mt-2 z-10">
            <span>{{ heatmapLabels.start }}</span>
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
            <span>{{ heatmapLabels.end }}</span>
          </div>
        </section>

        <!-- Streak Hero -->
        <section class="md:col-span-4 md:row-span-2 bg-primary rounded-xl p-8 flex flex-col justify-center items-center text-on-primary text-center relative overflow-hidden shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01]">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <span class="material-symbols-outlined text-[120px]">auto_awesome</span>
          </div>
          <div class="serif-number text-[10rem] leading-none drop-shadow-lg tracking-tighter">{{ currentStreak }}</div>
          <div class="text-[11px] font-bold uppercase tracking-[0.3em] mt-2 opacity-80">Days In A Row</div>
          <div class="mt-8 text-[9px] bg-on-primary/10 px-6 py-2 rounded-full uppercase font-bold tracking-[0.3em] backdrop-blur-sm border border-on-primary/10">Personal Record</div>
        </section>

        <!-- Calendar -->
        <section class="md:col-span-4 md:row-span-4 bg-surface-container-low rounded-xl p-8 border border-white/5">
          <div class="flex justify-between items-center mb-10">
            <h3 class="font-headline font-bold text-3xl text-white">{{ currentMonthName }}</h3>
            <div class="flex gap-3 opacity-20">
              <span class="material-symbols-outlined cursor-pointer hover:text-white transition-all">chevron_left</span>
              <span class="material-symbols-outlined cursor-pointer hover:text-white transition-all">chevron_right</span>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-8">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>
          <div class="grid grid-cols-7 gap-y-5 gap-x-2 text-center">
            <div v-for="day in calendarDays" :key="day.id" class="relative group cursor-default">
              <div v-if="day.label" :class="[
                'text-sm font-medium transition-all duration-300 w-9 h-9 flex items-center justify-center mx-auto rounded-full',
                day.isCurrent ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 scale-110' : 'text-white/60 hover:text-white hover:bg-white/5',
                day.isOtherMonth ? 'opacity-10' : ''
              ]">
                {{ day.label }}
              </div>
              <!-- Activity Marker -->
              <div v-if="day.hasActivity && !day.isCurrent" class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary/40 rounded-full"></div>
            </div>
          </div>
        </section>

        <!-- Today's Protocol -->
        <section class="md:col-span-4 md:row-span-4 bg-surface-container-low rounded-xl p-8 border border-white/5 flex flex-col">
          <div class="flex justify-between items-center mb-10">
            <h3 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Today's Protocol</h3>
            <span class="text-[10px] font-bold text-primary tracking-widest">{{ activeHabitsCount }} / {{ habits.length }}</span>
          </div>
          <div class="space-y-4 flex-1 overflow-y-auto no-scrollbar pr-2">
            <div v-for="habit in habits" :key="habit.id" 
                 @click="toggleHabit(habit)"
                 class="flex items-center justify-between group cursor-pointer p-4 rounded-xl border border-transparent hover:bg-white/[0.02] hover:border-white/5 transition-all active:scale-[0.98]">
              <div class="flex items-center gap-5">
                <div :class="['w-2.5 h-2.5 rounded-full transition-all duration-500 shadow-sm', habit.completed ? 'bg-primary shadow-primary/40' : 'bg-outline-variant']"></div>
                <span :class="['text-[16px] font-medium transition-all duration-500', habit.completed ? 'text-white/30 line-through' : 'text-white group-hover:text-primary']">
                  {{ habit.name }}
                </span>
              </div>
              <div :class="[
                'w-7 h-7 rounded-lg border-2 transition-all duration-500 flex items-center justify-center',
                habit.completed ? 'border-primary bg-primary/10' : 'border-outline-variant group-hover:border-primary/40'
              ]">
                <span v-if="habit.completed" class="material-symbols-outlined text-primary text-[20px] font-black">check</span>
              </div>
            </div>
          </div>
          <div class="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 italic text-[13px] text-white/60 text-center font-headline">
            "Your future is hidden in your daily routine."
          </div>
        </section>

        <!-- Stats Grid Column -->
        <div class="md:col-span-4 md:row-span-4 grid grid-rows-4 gap-[10px]">
          <!-- Top Stats (Row 1) -->
          <div class="grid grid-cols-2 gap-[10px]">
            <section class="bg-surface-container-low rounded-xl p-8 flex flex-col justify-center border border-white/5">
              <span class="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2">Total Days</span>
              <span class="serif-number text-5xl text-white">{{ totalDays }}</span>
            </section>
            <section class="bg-surface-container-low rounded-xl p-8 flex flex-col justify-center border border-white/5">
              <span class="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2">Efficiency</span>
              <span class="serif-number text-5xl text-primary">{{ efficiency }}%</span>
            </section>
          </div>

          <!-- Completion Ring (Row 2-3) -->
          <section class="row-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center relative border border-white/5">
            <div class="relative w-48 h-48 drop-shadow-[0_0_30px_rgba(177,255,41,0.05)]">
              <svg class="w-full h-full transform -rotate-90" viewbox="0 0 100 100">
                <circle class="text-white/[0.03] stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-width="6"></circle>
                <circle class="text-primary stroke-current transition-all duration-1000 ease-out" cx="50" cy="50" fill="transparent" r="42" 
                        stroke-dasharray="263.8" :stroke-dashoffset="263.8 - (263.8 * (efficiency / 100))" 
                        stroke-linecap="round" stroke-width="8"></circle>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="serif-number text-6xl leading-none text-white transition-all duration-500">{{ efficiency }}%</span>
                <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mt-2">Daily Goal</span>
              </div>
            </div>
            <p class="mt-6 text-[11px] font-bold text-white/20 uppercase tracking-[0.4em]">
              {{ habits.filter(h => h.completed).length }} of {{ habits.length }} completed
            </p>
          </section>

          <!-- Weekly Chart (Row 4) -->
          <section class="bg-surface-container-low rounded-xl p-8 flex items-end justify-between gap-3 border border-white/5">
            <div v-for="(day, idx) in ['M','T','W','T','F','S','S']" :key="idx" class="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
              <div :class="['w-full rounded-full transition-all duration-1000 ease-out relative', idx === currentDOW ? 'bg-primary shadow-[0_0_20px_rgba(177,255,41,0.2)]' : 'bg-primary/10 group-hover:bg-primary/30']"
                   :style="{ height: getBarHeight(idx) + '%' }">
                <div v-if="idx === currentDOW" class="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span :class="['text-[9px] font-black tracking-widest uppercase', idx === currentDOW ? 'text-primary' : 'text-white/10 group-hover:text-white/30']">{{ day }}</span>
            </div>
          </section>
        </div>

        <!-- Sticky Footer Row -->
        <section class="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex items-center border border-white/5 shadow-inner">
          <p class="font-headline text-xl text-white/50 leading-relaxed italic pr-6 border-r border-white/5">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          </p>
          <div class="pl-6 flex-shrink-0">
             <span class="material-symbols-outlined text-white/10 text-[40px]">format_quote</span>
          </div>
        </section>

        <section @click="isShareModalOpen = true" class="md:col-span-4 bg-secondary rounded-xl p-8 flex items-center justify-between group cursor-pointer hover:shadow-2xl hover:shadow-secondary/20 transition-all active:scale-[0.98]">
          <div class="flex items-center gap-5">
            <span class="material-symbols-outlined text-black font-extrabold text-3xl">share</span>
            <div class="flex flex-col">
              <span class="text-[13px] font-black text-black uppercase tracking-[0.3em]">Share Progress</span>
              <span class="text-[10px] text-black/40 font-bold uppercase tracking-widest">Post to Social</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-black/30 group-hover:translate-x-3 transition-all text-4xl">arrow_forward</span>
        </section>

        <section @click="handleQuickLog" class="md:col-span-4 bg-surface-container-highest rounded-xl p-8 flex items-center justify-between group cursor-pointer border border-white/5 hover:bg-white/[0.04] transition-all active:scale-[0.98]">
          <div class="flex items-center gap-5">
            <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
              <span class="material-symbols-outlined text-primary group-hover:text-black text-3xl">bolt</span>
            </div>
            <span class="text-[13px] font-black text-white uppercase tracking-[0.3em]">Quick Habit Log</span>
          </div>
          <span class="material-symbols-outlined text-white/10 group-hover:text-primary transition-all text-4xl">add</span>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer v-if="!loading" class="bg-background border-t border-white/5 mt-12 py-16 px-8">
      <div class="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div class="text-2xl font-black text-white/20 tracking-[0.5em] uppercase">KoVA</div>
        <div class="flex gap-12 text-white/30 text-[11px] font-black uppercase tracking-[0.4em]">
          <a href="#" class="hover:text-primary transition-all">Privacy</a>
          <a href="#" class="hover:text-primary transition-all">Terms</a>
          <a href="#" class="hover:text-primary transition-all">Support</a>
        </div>
        <div class="text-white/10 text-[9px] uppercase tracking-[0.5em]">
          © 2024 KOVA. MADE WITH OBSESSION.
        </div>
      </div>
    </footer>

    <!-- Share Progress Modal -->
    <Teleport to="body">
      <div v-if="isShareModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div class="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-xl" @click="isShareModalOpen = false"></div>
        <div class="relative w-full max-w-[420px] bg-[#0d0d0d] rounded-[48px] border border-white/5 shadow-2xl overflow-hidden group">
          <!-- Card Glow -->
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 blur-[100px]"></div>
          
          <!-- Card Header -->
          <div class="p-10 pb-4 flex justify-between items-start relative z-10">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Mastery Profile</p>
              <h3 class="text-4xl font-headline italic text-white leading-none capitalize mb-2">{{ user.name }}</h3>
              <p class="text-[12px] font-bold text-white/40 uppercase tracking-[0.2em]">{{ currentLevel }}</p>
            </div>
            <button @click="isShareModalOpen = false" class="text-white/20 hover:text-white transition-colors bg-white/5 w-10 h-10 rounded-full flex items-center justify-center border border-white/5">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Card Content -->
          <div class="px-10 py-8 space-y-10 relative z-10">
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-5">
              <div class="bg-white/5 border border-white/5 p-6 rounded-[32px] hover:bg-white/[0.08] transition-colors">
                <p class="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Streak</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-5xl font-headline italic text-white">{{ currentStreak }}</span>
                  <span class="text-[11px] font-bold text-white/40 uppercase">Days</span>
                </div>
              </div>
              <div class="bg-white/5 border border-white/5 p-6 rounded-[32px] hover:bg-white/[0.08] transition-colors text-right">
                <p class="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Mastery</p>
                <div class="flex items-baseline gap-1 justify-end">
                  <span class="text-5xl font-headline italic text-primary">{{ efficiency }}</span>
                  <span class="text-[11px] font-bold text-primary/40 uppercase">%</span>
                </div>
              </div>
            </div>

            <!-- Mini Heatmap -->
            <div class="p-8 bg-black/40 rounded-[40px] border border-white/5">
               <p class="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-5 text-center">Activity Sequence (49d)</p>
               <div class="grid grid-cols-7 gap-2">
                 <div 
                   v-for="cell in heatmapCells.slice(-49)" :key="cell.date"
                   class="aspect-square rounded-[4px] transition-all"
                   :class="getIntensityClass(cell.count)"
                 ></div>
               </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="p-10 pt-6 flex items-center justify-between border-t border-white/5 relative z-10 bg-[#0d0d0d]">
            <div class="text-2xl font-black text-white/20 tracking-[0.4em] uppercase">KoVA</div>
            <div class="text-[9px] font-black text-white/10 uppercase tracking-[0.4em] text-right">Mastery through<br>Consistency</div>
          </div>

          <!-- Interaction Overlay -->
          <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity"></div>
        </div>
        
        <!-- Action Toolbar -->
        <div class="fixed bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-[210]">
          <button @click="isShareModalOpen = false" class="bg-white text-black px-10 py-4 rounded-full font-bold text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Download Card</button>
          <button @click="isShareModalOpen = false" class="bg-white/10 backdrop-blur-xl border border-white/10 text-white px-10 py-4 rounded-full font-bold text-[12px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all">Copy Link</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { authClient } from '../utils/auth';
import { sql } from '../utils/db';

const router = useRouter();
const user = ref({ name: '', id: '' });
const habits = ref([]);
const loading = ref(true);
const showRetry = ref(false);
const logs = ref([]);
const selectedFilterId = ref(null);
const isShareModalOpen = ref(false);

// Stats
const totalDays = ref(0);
const currentStreak = ref(0);
const topStreak = ref(0);

// Heatmap Labels
const heatmapLabels = computed(() => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 364);
  return {
    start: start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
    end: end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
  };
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
});

const currentMonthName = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
});

const activeHabitsCount = computed(() => habits.value.filter(h => h.completed).length);

const efficiency = computed(() => {
  if (habits.value.length === 0) return 0;
  return Math.round((activeHabitsCount.value / habits.value.length) * 100);
});

const currentLevel = computed(() => {
  if (totalDays.value < 5) return "The Aspirant";
  if (totalDays.value < 15) return "The Traveler";
  if (totalDays.value < 30) return "The Disciplined";
  return "The Master";
});

const currentDOW = computed(() => {
  let dow = new Date().getDay(); // 0 is Sunday
  return dow === 0 ? 6 : dow - 1; // Map to 0=M, 6=S
});

const heatmapCells = ref([]);
const weeklyActivity = ref([0, 0, 0, 0, 0, 0, 0]);

function getBarHeight(idx) {
  const max = Math.max(...weeklyActivity.value, 1);
  return (weeklyActivity.value[idx] / max) * 100;
}

function getIntensityClass(count) {
  if (count === 0) return 'bg-white/5 opacity-50';
  if (count === 1) return 'bg-primary/20';
  if (count === 2) return 'bg-primary/40 shadow-[0_0_5px_rgba(177,255,41,0.1)]';
  if (count === 3) return 'bg-primary/70 shadow-[0_0_10px_rgba(177,255,41,0.2)]';
  return 'bg-primary shadow-[0_0_15px_rgba(177,255,41,0.4)] scale-110';
}

const calendarDays = computed(() => {
  const days = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let i = 0; i < offset; i++) days.push({ id: `off-${i}`, label: '', isOtherMonth: true });
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const hasActivity = logs.value.some(l => l.date.toISOString().startsWith(dStr));
    days.push({ id: `day-${i}`, label: i, isCurrent: i === now.getDate(), hasActivity });
  }
  return days;
});

function getLocalDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function fetchDashboardData() {
  loading.value = true;
  try {
    const sessionResp = await authClient.getSession();
    if (!sessionResp.data) {
      router.push('/login');
      return;
    }
    user.value = { 
      id: sessionResp.data.user.id, 
      name: sessionResp.data.user.name || sessionResp.data.user.email.split('@')[0] 
    };

    // Ensure user exists in "public.User" table (Sync)
    await sql`
      INSERT INTO "User" ("id", "email", "name") 
      VALUES (${user.value.id}, ${sessionResp.data.user.email}, ${user.value.name})
      ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name"
    `;

    // Habits
    let userHabits = await sql`SELECT id, name, icon, color FROM "Habit" WHERE "userId" = ${user.value.id} ORDER BY "createdAt" ASC`;
    if (userHabits.length === 0) {
      const defaults = [
        { name: 'Morning Meditation', icon: 'self_improvement' },
        { name: '4km Run', icon: 'directions_run' },
        { name: 'Deep Work Block', icon: 'psychology' },
        { name: 'No Sugar', icon: 'nutrition' }
      ];
      for (const h of defaults) {
        await sql`INSERT INTO "Habit" ("id", "name", "icon", "color", "frequency", "reminderTime", "dailyGoal", "userId", "updatedAt") 
                  VALUES (${crypto.randomUUID()}, ${h.name}, ${h.icon}, '#b1ff29', 'Daily', '08:00', 1, ${user.value.id}, ${new Date()})`;
      }
      userHabits = await sql`SELECT id, name, icon, color FROM "Habit" WHERE "userId" = ${user.value.id} ORDER BY "createdAt" ASC`;
    }

    const today = getLocalDate();
    const logData = await sql`SELECT "habitId", "date" FROM "Log" WHERE "userId" = ${user.value.id}`;
    logs.value = logData;
    
    const completedToday = new Set(logData.filter(l => getLocalDate(l.date) === today).map(l => l.habitId));
    habits.value = userHabits.map(h => ({ ...h, completed: completedToday.has(h.id) }));

    calculateStats(logData);
    processHeatmap(logData);
    processWeeklyChart(logData);

  } catch (err) {
    console.error("Dashboard error:", err);
    showRetry.value = true;
  } finally {
    loading.value = false;
  }
}

function calculateStats(allLogs) {
  const sortedDates = [...new Set(allLogs.map(l => getLocalDate(l.date)))].sort();
  totalDays.value = sortedDates.length;
  
  if (sortedDates.length === 0) {
    currentStreak.value = 0;
    topStreak.value = 0;
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

  // Top Streak
  let maxStreak = 0;
  let currentSeq = 0;
  let lastDate = null;

  sortedDates.forEach(dateStr => {
    if (!lastDate) {
      currentSeq = 1;
    } else {
      const prevDate = new Date(lastDate);
      prevDate.setDate(prevDate.getDate() + 1);
      if (getLocalDate(prevDate) === dateStr) {
        currentSeq++;
      } else {
        currentSeq = 1;
      }
    }
    maxStreak = Math.max(maxStreak, currentSeq);
    lastDate = dateStr;
  });

  topStreak.value = maxStreak;
}

function processHeatmap(allLogs) {
  const cells = [];
  const now = new Date();
  const filteredLogs = selectedFilterId.value 
    ? allLogs.filter(l => l.habitId === selectedFilterId.value)
    : allLogs;
  
  const counts = {};
  filteredLogs.forEach(l => {
    const d = getLocalDate(l.date);
    counts[d] = (counts[d] || 0) + 1;
  });

  for (let i = 363; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dStr = getLocalDate(d);
    cells.push({ date: dStr, count: counts[dStr] || 0 });
  }
  heatmapCells.value = cells;
}

function processWeeklyChart(allLogs) {
  const activity = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const monday = new Date();
  monday.setDate(now.getDate() - currentDOW.value);
  monday.setHours(0,0,0,0);

  const Sunday = new Date(monday);
  Sunday.setDate(monday.getDate() + 6);
  Sunday.setHours(23,59,59,999);

  allLogs.forEach(l => {
    const d = l.date instanceof Date ? l.date : new Date(l.date);
    if (d >= monday && d <= Sunday) {
      let dow = d.getDay();
      let idx = dow === 0 ? 6 : dow - 1;
      activity[idx]++;
    }
  });
  weeklyActivity.value = activity;
}

async function toggleHabit(habit) {
  const original = habit.completed;
  habit.completed = !habit.completed;
  try {
    const today = getLocalDate();
    if (habit.completed) {
      await sql`INSERT INTO "Log" ("id", "habitId", "userId", "date", "value") VALUES (${crypto.randomUUID()}, ${habit.id}, ${user.value.id}, ${today}, 1)`;
    } else {
      await sql`DELETE FROM "Log" WHERE "habitId" = ${habit.id} AND "userId" = ${user.value.id} AND "date"::date = ${today}::date`;
    }
    // Refresh local cache
    const logData = await sql`SELECT "habitId", "date" FROM "Log" WHERE "userId" = ${user.value.id}`;
    logs.value = logData;
    calculateStats(logData);
    processHeatmap(logData);
    processWeeklyChart(logData);
  } catch (err) {
    habit.completed = original;
  }
}

async function seedData() {
  loading.value = true;
  try {
    const now = new Date();
    for (let i = 0; i < 150; i++) {
      const d = new Date();
      d.setDate(now.getDate() - Math.floor(Math.random() * 365));
      const habit = habits.value[Math.floor(Math.random() * habits.value.length)];
      await sql`INSERT INTO "Log" ("id", "habitId", "userId", "date", "value") VALUES (${crypto.randomUUID()}, ${habit.id}, ${user.value.id}, ${d.toISOString()}, 1)`;
    }
    await fetchDashboardData();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function handleLogout() {
  await authClient.signOut();
  router.push('/login');
}

function handleQuickLog() {
  const h = habits.value.find(h => !h.completed);
  if (h) toggleHabit(h);
}

function addHabit() {
  router.push('/habits/new');
}

watch(selectedFilterId, () => processHeatmap(logs.value));
onMounted(fetchDashboardData);
</script>

<style>
.serif-number { font-family: "Newsreader", serif; font-style: italic; }
.bg-grain::before {
  content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; opacity: 0.02;
  background-image: url(https://grainy-gradients.vercel.app/noise.svg);
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(177, 255, 41, 0.1); border-radius: 50%; border-top-color: #b1ff29; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
