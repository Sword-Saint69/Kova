<template>
  <div class="min-h-screen bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary bg-grain transition-all duration-700">
    <!-- 33. Scroll Progress Bar -->
    <div class="fixed top-0 left-0 h-[2px] bg-primary z-[100] transition-all duration-100" :style="{ width: `${scrollProgress}%` }"></div>
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] gap-6 overflow-hidden">
      <!-- 7. Skeleton Shimmer Background -->
      <div class="absolute inset-0 opacity-5">
        <div class="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
      <div class="spinner !w-12 !h-12 !border-4 relative z-10"></div>
      <p class="text-white/40 uppercase tracking-[0.3em] text-[10px] animate-pulse relative z-10">Initializing Protocol...</p>
      <button v-if="showRetry" @click="fetchDashboardData" class="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs hover:bg-white/10 transition-all relative z-10">
        Detection taking too long? Retry manually.
      </button>
    </div>

    <!-- TopNavBar -->
    <nav v-if="!loading" 
         :class="[
           'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo border-b border-white/5',
           scrollY > 20 ? 'py-3 bg-[#0e0e0e]/95 backdrop-blur-2xl' : 'py-5 bg-transparent backdrop-blur-md'
         ]">
      <div class="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        <div class="flex items-center gap-2">
          <img src="/logo-full.png" alt="KoVA Logo" class="h-8 w-auto object-contain cursor-pointer animate-logo-pulse" @click="$router.push('/dashboard')">
        </div>
        <div class="hidden md:flex items-center space-x-2 group/nav">
          <RouterLink to="/dashboard" class="text-secondary bg-secondary/10 rounded-full px-4 py-1.5 font-semibold text-sm relative group active:scale-95 transition-all group-hover/nav:opacity-30 hover:!opacity-100">
            Dashboard
            <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </RouterLink>
          <a class="text-white/40 hover:text-white px-4 py-1.5 transition-all text-sm font-medium relative group underlined-link group-hover/nav:opacity-30 hover:!opacity-100" href="#">Analytics</a>
          <RouterLink to="/profile" class="text-white/40 hover:text-white px-4 py-1.5 transition-all text-sm font-medium relative group underlined-link group-hover/nav:opacity-30 hover:!opacity-100">Profile</RouterLink>
        </div>
        <div class="flex items-center gap-4">
          <!-- 46. Search Expand -->
          <div class="relative flex items-center">
            <input 
              v-model="searchQuery"
              :class="['bg-white/5 border border-white/10 rounded-full text-xs text-white px-4 py-1.5 transition-all duration-500 ease-out-expo outline-none focus:border-primary/50', isSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0 pointer-events-none']"
              placeholder="Search protocol..."
            />
            <button @click="isSearchOpen = !isSearchOpen" class="text-white/40 hover:text-white transition-all icon-morph ml-2">
              <span class="material-symbols-outlined font-light">{{ isSearchOpen ? 'close' : 'search' }}</span>
            </button>
          </div>

          <button class="text-white/40 hover:text-white transition-all icon-morph relative group">
            <span class="material-symbols-outlined font-light">notifications</span>
            <!-- 39. Notifications Badge Pop -->
            <div class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-black animate-badge-pop scale-0 group-hover:scale-100 transition-transform"></div>
          </button>
          <button @click="$router.push('/profile')" class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-white/10 group active:scale-95 transition-all avatar-halo relative">
              <img v-if="user?.image" alt="User avatar" class="w-full h-full object-cover" :src="user.image"/>
              <div v-else class="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {{ (user?.name || 'U').charAt(0) }}
              </div>
            </div>
            <!-- 48. User Menu Arrow Rotation -->
            <span class="material-symbols-outlined text-white/20 text-xs group-hover:rotate-180 transition-transform duration-500">expand_more</span>
          </button>
        </div>
      </div>
    </nav>

    <transition name="page" appear>
      <main v-if="!loading" class="pt-24 pb-12 px-6 max-w-[1440px] mx-auto">
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 class="text-6xl font-headline italic font-medium leading-tight text-white capitalize">
            <span v-for="(char, i) in `Good morning, ${user.name}.`.split('')" 
                  :key="i" 
                  class="typewriter-char"
                  :style="{ animationDelay: `${i * 30}ms` }">
              {{ char === ' ' ? '\u00A0' : char }}
            </span>
          </h1>
          <div class="mt-2 flex items-center gap-3 animate-fade-in" style="animation-delay: 800ms;">
            <span class="text-on-surface-variant text-sm tracking-widest uppercase">{{ currentDate }}</span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
            <span class="text-primary text-sm font-semibold tracking-wide">{{ habits.filter(h => h.completed).length }} habits tracked today</span>
          </div>
        </div>
        <div class="flex gap-3 animate-fade-in" style="animation-delay: 1000ms;">
          <RouterLink v-magnetic to="/habits/new" class="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-primary/10 hover:scale-105 ghost-click">
            <span class="material-symbols-outlined text-[20px]">add</span>
            Add habit
          </RouterLink>
        </div>
      </header>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-[10px]">
        <!-- Consistency Overview -->
        <section v-tilt class="md:col-span-8 md:row-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group bento-item glass-sweep border-glow" style="animation-delay: 100ms;">
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
            <div class="bg-surface-container-highest px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/5 relative z-10">
              <span class="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
              <span class="text-[10px] font-bold text-white uppercase tracking-tighter">Top Streak: {{ topStreak }} Days</span>
            </div>
          </div>
          
          <div class="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto no-scrollbar py-4 z-10 group/heatmap">
            <div 
              v-for="(cell, i) in heatmapCells" :key="cell.date"
              class="w-2.5 h-2.5 rounded-[2px] transition-all duration-500 hover:scale-[1.8] hover:z-20 border border-white/5 animate-fade-in group-hover/heatmap:opacity-30 hover:!opacity-100"
              :class="getIntensityClass(cell.count)"
              :style="{ animationDelay: `${100 + (i * 2)}ms` }"
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
        <section v-tilt class="md:col-span-4 md:row-span-2 bg-primary rounded-xl p-8 flex flex-col justify-center items-center text-on-primary text-center relative overflow-hidden shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] bento-item glass-sweep" style="animation-delay: 200ms;">
          <div :class="['absolute inset-0 opacity-20 pointer-events-none', currentStreak > 10 ? 'animate-fire-glow' : '']"></div>
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <span class="material-symbols-outlined text-[120px]">auto_awesome</span>
          </div>
          <div class="serif-number text-[10rem] leading-none drop-shadow-lg tracking-tighter relative z-10">{{ displayedStreak }}</div>
          <div class="text-[11px] font-bold uppercase tracking-[0.3em] mt-2 opacity-80">Days In A Row</div>
          <div class="mt-8 text-[9px] bg-on-primary/10 px-6 py-2 rounded-full uppercase font-bold tracking-[0.3em] backdrop-blur-sm border border-on-primary/10">Personal Record</div>
        </section>

        <!-- Calendar -->
        <section class="md:col-span-4 md:row-span-4 bg-surface-container-low rounded-xl p-8 border border-white/5 bento-item" style="animation-delay: 300ms;">
          <div class="flex justify-between items-center mb-10">
            <h3 class="font-headline font-bold text-3xl text-white">{{ currentMonthName }}</h3>
            <div class="flex gap-3 text-white/20">
              <span class="material-symbols-outlined cursor-pointer hover:text-white transition-all chevron-wobble">chevron_left</span>
              <span class="material-symbols-outlined cursor-pointer hover:text-white transition-all chevron-wobble">chevron_right</span>
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
                <div v-if="day.isCurrent" class="absolute inset-0 rounded-full bg-primary/20 animate-date-pulse"></div>
                {{ day.label }}
              </div>
              <!-- Activity Marker -->
              <div v-if="day.hasActivity && !day.isCurrent" class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary/40 rounded-full"></div>
            </div>
          </div>
        </section>

        <!-- Today's Protocol -->
        <section class="md:col-span-4 md:row-span-4 bg-surface-container-low rounded-xl p-8 border border-white/5 flex flex-col bento-item" style="animation-delay: 400ms;">
          <div class="flex justify-between items-center mb-10">
            <h3 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Today's Protocol</h3>
            <span class="text-[10px] font-bold text-primary tracking-widest">{{ activeHabitsCount }} / {{ habits.length }}</span>
          </div>
          <transition-group name="habit-poof" tag="div" class="space-y-4 flex-1 overflow-y-auto no-scrollbar pr-2">
            <div v-for="(habit, idx) in habits" :key="habit.id" 
                 @click="$router.push(`/habits/${habit.id}`)"
                 class="flex items-center justify-between group cursor-pointer p-4 rounded-xl border border-transparent hover:bg-white/[0.02] hover:border-white/5 transition-all active:scale-[0.98] animate-slide-in-right ghost-click border-glow"
                 :style="{ animationDelay: `${500 + (idx * 100)}ms` }">
              <div class="flex items-center gap-5">
                <div :class="['w-2.5 h-2.5 rounded-full transition-all duration-500 shadow-sm', habit.completed ? 'bg-primary shadow-primary/40' : 'bg-outline-variant']"></div>
                <span :class="['text-[16px] font-medium transition-all duration-500', habit.completed ? 'text-white/30 line-through' : 'text-white group-hover:text-primary']">
                  {{ habit.name }}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <button @click.stop="deleteHabit(habit.id)" class="opacity-0 group-hover:opacity-100 p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
                <div @click.stop="toggleHabit(habit)" :class="[
                  'w-7 h-7 rounded-lg border-2 transition-all duration-500 flex items-center justify-center overflow-hidden',
                  habit.completed ? 'border-primary bg-primary/10' : 'border-outline-variant group-hover:border-primary/40'
                ]">
                  <svg v-if="habit.completed" class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" class="animate-check-trace"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </transition-group>
          <div class="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 italic text-[13px] text-white/60 text-center font-headline">
            "Your future is hidden in your daily routine."
          </div>
        </section>

        <!-- Stats Grid Column -->
        <div class="md:col-span-4 md:row-span-4 grid grid-rows-4 gap-[10px] bento-item" style="animation-delay: 500ms;">
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
            <div :class="['relative w-48 h-48 drop-shadow-[0_0_30px_rgba(177,255,41,0.05)] transition-transform duration-500', bloomEffect ? 'scale-110' : '']">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle class="text-white/[0.03] stroke-current" cx="50" cy="50" fill="transparent" r="38" stroke-width="5"></circle>
                <circle class="text-primary stroke-current transition-all duration-[2000ms] ease-out-expo" cx="50" cy="50" fill="transparent" r="38" 
                        stroke-dasharray="238.8" :stroke-dashoffset="238.8 - (238.8 * (efficiency / 100))" 
                        stroke-linecap="round" stroke-width="7"></circle>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-headline italic font-bold text-white transition-all duration-500" :class="bloomEffect ? 'text-primary scale-110' : ''">{{ displayedEfficiency }}%</span>
                <span class="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Efficiency</span>
              </div>
            </div>
            <p class="mt-6 text-[11px] font-bold text-white/30 uppercase tracking-[0.4em]">
              {{ habits.filter(h => h.completed).length }} of {{ habits.length }} completed
            </p>
          </section>

          <!-- Weekly Chart (Row 4) -->
          <section class="bg-surface-container-low rounded-xl p-8 flex items-end justify-between gap-3 border border-white/5">
            <div v-for="(day, idx) in ['M','T','W','T','F','S','S']" :key="idx" class="flex-1 flex flex-col items-center gap-4 group h-full justify-end relative">
              <!-- 36. Tooltip Slide -->
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all pointer-events-none z-20">
                {{ weeklyActivity[idx] }}
              </div>
              <div :class="['w-full rounded-full transition-all duration-[800ms] cubic-spring relative min-h-[4px]', idx === currentDOW ? 'bg-primary shadow-[0_0_20px_rgba(177,255,41,0.2)]' : 'bg-primary/10 group-hover:bg-primary/30']"
                   :style="{ height: Math.max(getBarHeight(idx), 5) + '%' }">
                <div v-if="idx === currentDOW" class="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div class="absolute inset-x-0 bottom-0 top-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span :class="['text-[9px] font-black tracking-widest uppercase', idx === currentDOW ? 'text-primary' : 'text-white/10 group-hover:text-white/30']">{{ day }}</span>
            </div>
          </section>
        </div>

        <section class="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex items-center border border-white/5 shadow-inner bento-item" style="animation-delay: 800ms;">
          <transition name="quote-slide" mode="out-in">
            <div :key="currentQuote" class="flex items-center">
              <p class="font-headline text-xl text-white/50 leading-relaxed italic pr-6 border-r border-white/5">
                {{ currentQuote }}
              </p>
              <div class="pl-6 flex-shrink-0">
                 <span class="material-symbols-outlined text-white/10 text-[40px]">format_quote</span>
              </div>
            </div>
          </transition>
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
              <span :class="['material-symbols-outlined text-primary group-hover:text-black text-3xl', isSyncing ? 'animate-sync-spin' : '']">bolt</span>
            </div>
            <span class="text-[13px] font-black text-white uppercase tracking-[0.3em]">Quick Habit Log</span>
          </div>
          <span class="material-symbols-outlined text-white/10 group-hover:text-primary transition-all text-4xl">add</span>
        </section>
      </div>
    </main>
    </transition>

    <!-- Footer -->
    <footer v-if="!loading" class="bg-background border-t border-white/5 mt-12 py-16 px-8">
      <div class="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div class="flex flex-col items-center gap-4">
          <img src="/logo-full.png" alt="KoVA Logo" class="h-10 w-auto opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" @click="$router.push('/dashboard')">
        </div>
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
            <img src="/logo-full.png" alt="KoVA Logo" class="h-6 w-auto opacity-20 grayscale">
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
const displayedEfficiency = ref(0);
const bloomEffect = ref(false);
const isSyncing = ref(false);
const selectedFilterId = ref(null);
const isShareModalOpen = ref(false);
const scrollY = ref(0);
const scrollProgress = ref(0);
const isSearchOpen = ref(false);
const searchQuery = ref('');

const handleScroll = () => {
  scrollY.value = window.scrollY;
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.value = (winScroll / height) * 100;
};

// Quotes
const quotes = [
  "\"The DNA of mastery is composed of small, daily repetitions.\"",
  "\"Excellence is not an act, but a habit.\"",
  "\"Discipline is the bridge between goals and accomplishment.\"",
  "\"Your habits are the secret to your future.\"",
  "\"Consistency transforms average into elite.\"",
  "\"Mastery is a journey, not a destination.\"",
  "\"Small wins daily, massive results eventually.\"",
  "\"The only way to achieve the impossible is to believe it is possible.\""
];
const currentQuote = ref(quotes[Math.floor(Math.random() * quotes.length)]);

// Stats
const totalDays = ref(0);
const currentStreak = ref(0);
const displayedStreak = ref(0);
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

function animateEfficiency() {
  const duration = 2000;
  const start = 0;
  const end = efficiency.value;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    displayedEfficiency.value = parseFloat((ease * end).toFixed(1));

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
  
  // Bloom effect
  bloomEffect.value = true;
  setTimeout(() => bloomEffect.value = false, 1000);
}

function animateStreak() {
  const duration = 1500;
  const start = 0;
  const end = currentStreak.value;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out expo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    displayedStreak.value = Math.floor(ease * end);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
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
      name: sessionResp.data.user.name || sessionResp.data.user.email.split('@')[0],
      image: sessionResp.data.user.image
    };

    // Ensure user exists in "public.User" table (Sync)
    await sql`
      INSERT INTO "User" ("id", "email", "name") 
      VALUES (${user.value.id}, ${sessionResp.data.user.email}, ${user.value.name})
      ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name"
    `;

    // Habits
    const userHabits = await sql`SELECT id, name, icon, color FROM "Habit" WHERE "userId" = ${user.value.id} ORDER BY "createdAt" ASC`;

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
  animateStreak();
  animateEfficiency();
}

// Custom Directives for Premium Feel
const vMagnetic = {
  mounted(el) {
    el.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - (left + width / 2)) * 0.35;
      const y = (e.clientY - (top + height / 2)) * 0.35;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
    el.style.transition = 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)';
  }
};

const vTilt = {
  mounted(el) {
    el.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    });
    el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    el.style.zIndex = '10';
  }
};

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
  
  // Calculate Monday and Sunday once
  const monday = new Date();
  monday.setDate(now.getDate() - currentDOW.value);
  monday.setHours(0,0,0,0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);

  // Pre-filter logs that are roughly in the current month to avoid heavy date parsing on entire history
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  allLogs.forEach(l => {
    const d = l.date instanceof Date ? l.date : new Date(l.date);
    // Only process if it falls within our targeted week
    if (d >= monday && d <= sunday) {
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
  const today = getLocalDate();
  
  try {
    if (habit.completed) {
      const newLog = { 
        id: crypto.randomUUID(), 
        habitId: habit.id, 
        userId: user.value.id, 
        date: new Date(), 
        value: 1 
      };
      // Optimistic update
      logs.value.push(newLog);
      await sql`INSERT INTO "Log" ("id", "habitId", "userId", "date", "value") VALUES (${newLog.id}, ${newLog.habitId}, ${newLog.userId}, ${today}, 1)`;
    } else {
      // Optimistic update
      logs.value = logs.value.filter(l => !(l.habitId === habit.id && getLocalDate(l.date) === today));
      await sql`DELETE FROM "Log" WHERE "habitId" = ${habit.id} AND "userId" = ${user.value.id} AND "date"::date = ${today}::date`;
    }
    
    // Efficiently re-calculate stats locally without full refetch
    calculateStats(logs.value);
    processHeatmap(logs.value);
    processWeeklyChart(logs.value);
  } catch (err) {
    console.error("Toggle error:", err);
    habit.completed = original;
    // Re-fetch only on true failure to stay safe
    await fetchDashboardData();
  }
}


async function handleLogout() {
  await authClient.signOut();
  router.push('/login');
}

async function deleteHabit(habitId) {
  if (!confirm('Are you sure you want to delete this habit and all its history?')) return;
  try {
    await sql`DELETE FROM "Log" WHERE "habitId" = ${habitId}`;
    await sql`DELETE FROM "Habit" WHERE "id" = ${habitId}`;
    await fetchDashboardData();
  } catch (err) {
    console.error("Delete error:", err);
  }
}

function handleQuickLog() {
  // 29. Sync Spin
  isSyncing.value = true;
  setTimeout(() => isSyncing.value = false, 1000);

  const h = habits.value.find(h => !h.completed);
  if (h) toggleHabit(h);
}

function addHabit() {
  router.push('/habits/new');
}

watch(selectedFilterId, () => processHeatmap(logs.value));
onMounted(() => {
  fetchDashboardData();
  window.addEventListener('scroll', handleScroll, { passive: true });
});
</script>

<style>
/* 19. Elastic Routing Entrance */
.page-enter-active, .page-leave-active {
  transition: opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.page-enter-from {
  opacity: 0; transform: scale(0.98) translateY(10px);
}
.page-leave-to {
  opacity: 0; transform: scale(1.02) translateY(-10px);
}

/* 1. Staggered Bento Entrance */
@keyframes bentoReveal {
  from { opacity: 0; transform: translateY(30px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.bento-item {
  animation: bentoReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

/* 2. Logo Pulse-In */
@keyframes logoPulse {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-logo-pulse {
  animation: logoPulse 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* 6. Glass Card Sweep */
@keyframes sweep {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}
.glass-sweep::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
  animation: sweep 2s ease-in-out forwards;
  pointer-events: none;
}

/* 10. Background Noise Wake-up */
@keyframes noiseWakeup {
  from { opacity: 0; }
  to { opacity: 0.02; }
}

.serif-number { font-family: "Newsreader", serif; font-style: italic; }
.bg-grain::before {
  content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; 
  opacity: 0.02;
  background-image: url(https://grainy-gradients.vercel.app/noise.svg);
  animation: noiseWakeup 2s ease-out;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(177, 255, 41, 0.1); border-radius: 50%; border-top-color: #b1ff29; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* 3. Typewriter Effect */
.typewriter-char {
  display: inline-block;
  animation: typewriterChar 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes typewriterChar {
  from { opacity: 0; transform: translateX(-5px); filter: blur(2px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out both;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slideInRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s infinite linear;
}

.ease-out-expo {
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

/* 12. Squish Toggle removed */

/* 14. Ghost Click Ripple */
.ghost-click { position: relative; overflow: hidden; }
.ghost-click::after {
  content: ""; position: absolute; top: 50%; left: 50%; width: 5px; height: 5px; background: rgba(255,255,255,0.4);
  opacity: 0; border-radius: 100%; transform: scale(1, 1) translate(-50%, -50%); transform-origin: 50% 50%;
}
.ghost-click:active::after {
  animation: ripple 0.6s ease-out;
}
@keyframes ripple {
  0% { transform: scale(0, 0) translate(-50%, -50%); opacity: 0.5; }
  100% { transform: scale(40, 40) translate(-50%, -50%); opacity: 0; }
}

/* 16. Border Glow Trace */
.border-glow {
  transition: border-color 0.3s, box-shadow 0.3s;
}
.border-glow:hover {
  border-color: rgba(177, 255, 41, 0.3) !important;
  box-shadow: 0 0 20px rgba(177, 255, 41, 0.05);
}

/* 17. Icon Morph & 18. Avatar Halo */
.icon-morph:hover span {
  transform: scale(1.1) rotate(5deg);
}
.avatar-halo:hover {
  box-shadow: 0 0 15px rgba(177, 255, 41, 0.4);
  transform: scale(1.05);
}
/* 21. Bar Chart Spring */
.cubic-spring {
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 24. Quote Fade-and-Swap */
.quote-slide-enter-active, .quote-slide-leave-active {
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s;
}
.quote-slide-enter-from {
  opacity: 0; transform: translateY(20px);
}
.quote-slide-leave-to {
  opacity: 0; transform: translateY(-20px);
}

/* 23. Log Success Flash removed */

/* 26. Streak Fire Glow */
@keyframes fireGlow {
  0%, 100% { opacity: 0.1; background: radial-gradient(circle, #b1ff29 0%, transparent 70%); }
  50% { opacity: 0.3; background: radial-gradient(circle, #b1ff29 20%, transparent 80%); }
}
.animate-fire-glow {
  animation: fireGlow 2s infinite alternate ease-in-out;
}

/* 28. Calendar Date Pulse */
@keyframes datePulse {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.5); opacity: 0; }
}
.animate-date-pulse {
  animation: datePulse 2s infinite ease-out;
}

/* 29. Sync Spin */
.animate-sync-spin {
  animation: spin 1s linear infinite;
}

/* 31. Link Underline Growth */
.underlined-link::after {
  content: ""; position: absolute; bottom: 0; left: 50%; width: 0; height: 1.5px;
  background: currentColor; transform: translateX(-50%); transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.underlined-link:hover::after { width: calc(100% - 2rem); }

/* 32. Checkbox Trace */
@keyframes checkTrace {
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
}
.animate-check-trace {
  stroke-dasharray: 24;
  animation: checkTrace 0.4s cubic-bezier(.45, 0, .55, 1) forwards;
}

/* 34. Deleted Item Poof */
.habit-poof-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute; width: calc(100% - 4rem);
}
.habit-poof-leave-to {
  opacity: 0; transform: scale(1.1) translateY(-10px); filter: blur(4px);
}

/* 38. Chevron Wobble */
@keyframes wobble {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}
.chevron-wobble:hover {
  animation: wobble 0.4s ease-in-out infinite;
}

/* 37. Button Text Shift */
.btn-text-shift span { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.btn-text-shift:hover span { transform: translateY(-2px); }

/* Custom Scroll Momentum (Styling only, logic in component later) */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(177, 255, 41, 0.1); border-radius: 10px;
  transition: all 0.3s;
}
::-webkit-scrollbar-thumb:hover { background: rgba(177, 255, 41, 0.3); }

/* 39. Notifications Badge Pop */
@keyframes badgePop {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-badge-pop {
  animation: badgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* 45. Notification Dropdown Cloth (Mocked structure) */
.cloth-fold-enter-active {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: top;
}
.cloth-fold-enter-from {
  opacity: 0; transform: rotateX(-15deg) scaleY(0.9);
}

</style>
