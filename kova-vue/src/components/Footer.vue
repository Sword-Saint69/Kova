<template>
  <footer class="bg-surface w-full py-12 border-t border-white/5" ref="footerEl">
    <div class="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
      <!-- ANIMATION 28: Footer columns fade in group by group -->
      <div class="footer-col space-y-4 text-center md:text-left mb-8 md:mb-0"
           :class="{ visible: isVisible }" style="--col-delay: 0ms">
        <img src="/logo-text.png" alt="KoVA" class="h-8 w-auto mx-auto md:mx-0 opacity-90">
        <p class="font-body text-xs uppercase tracking-widest text-[#adaaaa]">© 2024 KoVA. Made with obsession.</p>
      </div>
      <div class="footer-col flex flex-wrap justify-center gap-8"
           :class="{ visible: isVisible }" style="--col-delay: 150ms">
        <a class="footer-link" href="#">Privacy</a>
        <a class="footer-link" href="#">Terms</a>
        <a class="footer-link" href="#">Twitter</a>
        <a class="footer-link" href="#">Changelog</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const footerEl = ref(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    isVisible.value = true;
  }, { threshold: 0.3 });
  if (footerEl.value) observer.observe(footerEl.value);
});
</script>

<style scoped>
/* ANIMATION 28 — Footer groups fade in with delay offset */
.footer-col {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity  450ms ease var(--col-delay, 0ms),
    transform 450ms var(--ease-out, cubic-bezier(0.16,1,0.3,1)) var(--col-delay, 0ms);
}
.footer-col.visible {
  opacity: 1; transform: translateY(0);
}

.footer-link {
  color: #adaaaa;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 200ms ease, opacity 200ms ease;
  opacity: 0.8;
  text-decoration: none;
}
.footer-link:hover {
  color: #a0ec06;
  opacity: 1;
}
</style>
