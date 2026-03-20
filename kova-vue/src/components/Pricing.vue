<template>
  <section class="max-w-7xl mx-auto px-8 py-24 mb-12">
    <div class="text-center mb-16">
      <h3 class="text-5xl font-headline font-bold mb-4">Invest in your ritual.</h3>
      <p class="text-on-surface-variant">Simple, transparent, obsessive precision.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <!-- Free -->
      <div class="bg-surface-container-low p-10 rounded-2xl border-[0.5px] border-white/10">
        <h4 class="text-sm font-bold text-on-surface-variant tracking-widest mb-6 uppercase">Essential</h4>
        <div class="flex items-baseline gap-2 mb-8">
          <span class="text-5xl font-headline font-black italic">$0</span>
          <span class="text-on-surface-variant">/ forever</span>
        </div>
        <ul class="space-y-4 mb-10 text-sm">
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Up to 3 habits</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Standard Grid View</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Web Access</li>
        </ul>
        <button class="w-full py-4 rounded-xl border-[0.5px] border-outline-variant/30 font-bold hover:bg-surface-container-high transition-colors">Select Free</button>
      </div>
      <!-- Pro -->
      <div class="bg-surface-container-low p-10 rounded-2xl border-2 border-primary relative">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
        <h4 class="text-sm font-bold text-primary tracking-widest mb-6 uppercase">Pro</h4>
        <div class="flex items-baseline gap-2 mb-8">
          <span class="text-[52px] font-headline font-[900] italic">$4</span>
          <span class="text-on-surface-variant">/ month</span>
        </div>
        <ul class="space-y-4 mb-10 text-sm">
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Unlimited habits</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Custom heatmap colors</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> CLI & API Integration</li>
          <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Private Profiles</li>
        </ul>
        <button class="w-full py-4 rounded-xl bg-primary text-on-primary font-extrabold hover:opacity-90 transition-all">Go Pro Now</button>
      </div>
    </div>
  </section>
</template>
