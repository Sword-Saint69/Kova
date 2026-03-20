<template>
  <div class="filter-row">
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="cat-pill"
      :class="{ active: modelValue === cat.id }"
      @click="$emit('update:modelValue', cat.id)"
    >
      <div
        v-if="cat.color"
        class="cat-dot"
        :style="{ background: cat.color }"
      />
      {{ cat.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: { id: string; label: string; color?: string }[]
  modelValue: string
}>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; }

.cat-pill {
  display: flex; align-items: center; gap: 7px;
  height: 34px; padding: 0 14px;
  border-radius: 99px;
  border: 0.5px solid rgba(255,255,255,0.13);
  background: transparent;
  color: rgba(240,237,232,0.45);
  font-size: 13px; font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition:
    background-color 200ms ease,
    border-color     200ms ease,
    color            200ms ease,
    font-weight      100ms ease;
}
.cat-pill:hover {
  background: rgba(255,255,255,0.04);
  color: #f0ede8;
}
.cat-pill.active {
  background: #a0ec06;
  border-color: #a0ec06;
  color: #0a0a0a;
  font-weight: 600;
}

.cat-dot {
  width: 6px; height: 6px;
  border-radius: 50%; flex-shrink: 0;
}
</style>
