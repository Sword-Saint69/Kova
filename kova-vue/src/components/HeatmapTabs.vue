<template>
  <div ref="tabRowRef" class="tab-row">
    <button
      v-for="habit in habits"
      :key="habit.id"
      :ref="el => setRef(el as HTMLElement, habit.id)"
      class="tab-btn"
      :class="{ active: activeId === habit.id }"
      @click="select(habit.id)"
    >
      {{ habit.name }}
    </button>

    <!-- Sliding underline — absolutely positioned -->
    <div
      class="tab-indicator"
      :style="{
        left:  indicator.x + 'px',
        width: indicator.w + 'px',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps<{
  habits:   { id: string; name: string }[]
  activeId: string
}>()
const emit = defineEmits<{
  'update:activeId': [id: string]
}>()

const tabRowRef = ref<HTMLElement | null>(null)
const btnMap    = ref<Record<string, HTMLElement>>({})
const indicator = ref({ x: 0, w: 0 })

function setRef(el: HTMLElement, id: string) {
  if (el) btnMap.value[id] = el
}

async function measureIndicator() {
  await nextTick() // wait for DOM to reflect new active state
  const btn = btnMap.value[props.activeId]
  const row = tabRowRef.value
  if (!btn || !row) return

  const bRect = btn.getBoundingClientRect()
  const rRect = row.getBoundingClientRect()

  indicator.value = {
    x: bRect.left - rRect.left,
    w: bRect.width,
  }
}

function select(id: string) {
  emit('update:activeId', id)
}

watch(() => props.activeId, measureIndicator)
onMounted(measureIndicator)
</script>

<style scoped>
.tab-row {
  position: relative;
  display: flex;
  border-bottom: 0.5px solid rgba(255,255,255,0.07);
}

.tab-btn {
  position: relative;
  background: none; border: none;
  padding: 9px 16px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 400;
  color: rgba(240,237,232,0.40);
  transition: color 150ms ease;
}
.tab-btn.active {
  color: #a0ec06;
  font-weight: 500;
}

/* Sliding underline */
.tab-indicator {
  position: absolute;
  bottom: -1px;
  height: 2px;
  background: #a0ec06;
  border-radius: 99px;
  /* Spring slide — overshoots slightly */
  transition:
    left  220ms cubic-bezier(0.34, 1.56, 0.64, 1),
    width 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
