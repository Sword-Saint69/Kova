<script setup>
</script>

<template>
  <!-- 
    Native Vue Transition wrapper replicating the Framer Motion PageWrapper behavior.
    Use this to wrap the root layout of each page.
  -->
  <Transition name="page" mode="out-in" appear>
    <div class="page-wrapper">
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
