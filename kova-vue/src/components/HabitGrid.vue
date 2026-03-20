<template>
  <TransitionGroup name="card-list" tag="div" class="habit-grid">
    <div
      v-for="(habit, i) in filtered"
      :key="habit.id || i"
      class="habit-card tile-hover"
      :style="{ '--i': i }"
    >
      <slot :habit="habit">
        <!-- Default visualization if no slot provided -->
        <span>{{ habit.name }}</span>
      </slot>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
defineProps<{ filtered: any[] }>()
</script>

<style scoped>
.habit-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.habit-card {
  padding: 16px;
  background: #111;
  border-radius: 12px;
  border: 0.5px solid rgba(255,255,255,0.07);
}

.card-list-enter-active {
  transition: opacity 0.28s var(--ease-out), transform 0.28s var(--ease-out);
  transition-delay: calc(var(--i) * 45ms);
}
.card-list-leave-active {
  transition: opacity 0.18s ease-in, transform 0.18s ease-in;
  position: absolute; /* prevents layout shift during leave */
}
.card-list-enter-from { opacity: 0; transform: scale(0.94) translateY(10px); }
.card-list-leave-to   { opacity: 0; transform: scale(0.96); }
.card-list-move       { transition: transform 0.32s var(--ease-out); }
</style>
