<template>
  <div ref="tabRowRef" class="tab-row">
    <button
      v-for="habit in habits"
      :key="habit.id"
      :ref="el => setRef(el, habit.id)"
      class="tab-btn"
      :class="{ active: activeId === habit.id }"
      @click="select(habit.id)"
    >
      {{ habit.name }}
    </button>

    <!-- Sliding underline -->
    <div
      class="tab-indicator"
      :style="{ left: line.x + 'px', width: line.w + 'px' }"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  habits:   Array,
  activeId: String
})
const emit = defineEmits(['update:activeId'])

const tabRowRef = ref(null)
const btnMap    = ref({})
const line      = ref({ x: 0, w: 0 })

function setRef(el, id) {
  if (el) btnMap.value[id] = el
}

function measure() {
  const btn = btnMap.value[props.activeId]
  const row = tabRowRef.value
  if (!btn || !row) return

  const bRect = btn.getBoundingClientRect()
  const rRect = row.getBoundingClientRect()

  line.value = {
    x: bRect.left - rRect.left,
    w: bRect.width,
  }
}

function select(id) {
  emit('update:activeId', id)
}

watch(() => props.activeId, async () => {
  await nextTick()
  measure()
})

onMounted(async () => {
  await nextTick()
  measure()
})
</script>

<style scoped>
.tab-row {
  position: relative;
  display: flex;
  border-bottom: 0.5px solid rgba(255,255,255,0.07);
}

.tab-btn {
  position: relative;
  background: none;
  border: none;
  padding: 8px 14px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgba(240,237,232,0.40);
  transition: color 150ms ease;
}
.tab-btn.active {
  color:       #a0ec06;
  font-weight: 500;
}

.tab-indicator {
  position: absolute;
  bottom: -1px;
  height: 2px;
  background: #a0ec06;
  border-radius: 99px;
  /* Spring slide */
  transition:
    left  220ms cubic-bezier(0.34, 1.56, 0.64, 1),
    width 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
