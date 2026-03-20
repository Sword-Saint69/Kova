<script setup>
// StaggerContainer wraps items but in Vue, we typically rely on passing indices to the items directly
// or using the custom motion variants. This component acts as a logical grouping boundary.
</script>

<template>
  <div class="stagger-container">
    <slot />
  </div>
</template>
