<template>
  <div class="page-content">
    <slot />
  </div>
</template>

<style scoped>
.page-content {
  animation: fade-up 0.4s var(--ease-out) both;
}
</style>
