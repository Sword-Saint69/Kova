<script setup>
import Heatmap from './Heatmap.vue';
</script>

<template>
  <section class="hero-section relative w-full bg-[#0a0a0a] overflow-hidden">

    <div class="hero-grid relative z-10">
        <!-- Left Side -->
        <div class="hero-left">
            <div class="space-y-4">
                <span class="block text-[11px] font-medium uppercase tracking-[0.15em] text-primary/60">HABIT ENGINEERING</span>
                <h1 class="font-headline font-black leading-[0.9] tracking-tighter">
                    <span class="text-[#f0ede8] italic block text-[72px]">Your life,</span>
                    <span class="text-primary block text-[72px]">in squares.</span>
                </h1>
            </div>
            
            <div class="space-y-1 mb-10 max-w-[560px]">
                <p class="text-[16px] font-light text-on-surface-variant leading-[4]">Track every habit. See every pattern.</p>
                <p class="text-[16px] font-light text-on-surface-variant leading[0]">Share your consistency with the world.</p>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4">
                <!-- Primary Button (10px rounded rect) -->
                <button class="btn-primary flex items-center gap-2 hover:bg-[#b8f520] transition-all">
                    Start for free <span class="material-symbols-outlined">arrow_forward</span>
                </button>
                
                <!-- Ghost Button (10px rounded rect) -->
                <button class="btn-ghost-hero transition-all">
                    See a live profile
                </button>
            </div>

            <!-- Social Proof Row (Refined) -->
            <div class="flex items-center gap-3 pt-4">
                <div class="flex -space-x-2">
                    <img alt="" class="w-8 h-8 rounded-full border-[1.5px] border-primary bg-primary/12 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe3kCAHCETkT4YojhOPs9Ok1iyA8doQ9FGgXaT6qOspcFkJ7rY5UnATbe2NsdotPOAjDKmd4WFLHJ34ggixl7PFRkAHoQJ_xxV852h_TzZv64uPFGib5tWPppduMZYYdl8HrcyRydRV9pGdvPRDOsvT76taE6ivq3lyHH1iXhWr26X3sUSQhjvZzl7gIgDhW3MfcLY02P8OYOEu1uPfBBK8TktzBqetZjOkHpnoR-loEyl0RYs6Si37QA1tINS-LEpYh4h8u61G92f"/>
                    <img alt="" class="w-8 h-8 rounded-full border-[1.5px] border-primary bg-primary/12 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBloccDxiqZRNhOr1NEtmOC8u6KWGEnsTxhQozg-R4A6Opx6IYb7Wd1_YVvBsd61CqRCn1Apo6ahJtsZ9JRr5HOZ5ppS8D3zSNg-dYxrTgBHu_BLD3GkILGnlwMf6_2Oo2MQTGi_hGnez0NQtc8lpliyN0I0oNa2yN7FRWxc2VVvPTNwM1ER3d_2mwui7O9b3YBEYvnL5TX_fBHhNkVhohKoGlsJcMg-b_geKUICmsLPljiWSuEC4UwFfnlEhxSMEJ1NSf4Gv_xXKQy"/>
                    <img alt="" class="w-8 h-8 rounded-full border-[1.5px] border-primary bg-primary/12 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAiNMqSEAUGKzbMdl-oqy5Hdqz5CnnrL3CYsSis5Np-g3Lcal1ECM_REvLfP5efzjem3IktuSMKYQ9ORlCneHA0pFuUlL2exndqPXy8Ixtg1gQEw23LFWQem74MWfYQD-Sa-7jrrt0uyRH_S3i3QICIuiq21Q2hS9Ud6a1pWdKDZhakqCMu25O4VV8rXNbsZOCIQFwOiKKHnXmFoDTvFyyvqPIwfIgCnI3ZQV01uq_RzW_oqwRTAUUqHcpbnK8wu6WuRHn2LGIv6xa"/>
                </div>
                <p class="text-[13px] font-body font-normal text-[#f0ede8]/45">
                    Joined by <span class="font-medium">2,400+ builders</span>
                </p>
            </div>
        </div>

        <!-- Right Side Heatmap -->
        <div class="hero-right overflow-visible">
            <Heatmap 
                :rows="7" 
                :cols="52" 
                cellSize="11px" 
                gap="2px" 
                showLabels 
                showLegend 
            />
        </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
      <span class="text-[11px] font-light uppercase tracking-widest">Scroll to explore</span>
      <span class="material-symbols-outlined text-sm animate-bounce-subtle">keyboard_arrow_down</span>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: visible;
}

.hero-grid {
  display: grid;
  grid-template-columns: 52% 48%;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
}

.hero-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 560px;
  padding-right: 60px;
}

.hero-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: visible;
}

.btn-primary {
  border-radius: 10px;
  height: 52px;
  background: #a0ec06;
  color: #0a0a0a;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 0 24px;
}

.btn-ghost-hero {
  border-radius: 10px;
  height: 52px;
  padding: 0 20px;
  border: 0.5px solid rgba(255,255,255,0.13);
  color: rgba(240,237,232,0.55);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  background: transparent;
}
.btn-ghost-hero:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.2);
  color: #f0ede8;
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 60px;
    padding-top: 120px;
    padding-bottom: 80px;
  }
}
</style>
