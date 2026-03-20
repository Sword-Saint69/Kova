<template>
  <nav class="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-xl no-line-rule border-none">
    <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
      <div class="flex items-center gap-[10px]">
        <img src="/logo-full.png" alt="Mark" class="h-[60px] w-[100px] object-cover object-left" style="object-position: 0% 50%;">
        <span class="font-headline font-black text-[22px] text-[#a0ec06]"></span>
      </div>
      <div class="hidden md:flex gap-8 items-center">
        <a class="text-[#a0ec06] font-bold border-b-2 border-[#a0ec06] pb-1 font-body text-sm tracking-tight" href="#">Features</a>
        <a class="text-[#adaaaa] hover:text-white transition-colors font-body text-sm tracking-tight" href="#">Dashboard</a>
        <a class="text-[#adaaaa] hover:text-white transition-colors font-body text-sm tracking-tight" href="#">How it Works</a>
        <a class="text-[#adaaaa] hover:text-white transition-colors font-body text-sm tracking-tight" href="#">Pricing</a>
      </div>
      <button class="bg-primary text-on-primary font-semibold px-6 h-[36px] flex items-center gap-1 rounded-full text-sm hover:scale-95 transition-all duration-200">
        Get Started <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  </nav>
</template>
