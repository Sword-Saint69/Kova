<template>
  <div ref="containerRef" class="seg-wrap">

    <!-- Sliding lime indicator -->
    <div
      class="seg-indicator"
      :style="{
        left:  pill.x + 'px',
        width: pill.w + 'px',
      }"
    />

    <!-- Option buttons -->
    <button
      v-for="(opt, i) in options"
      :key="opt"
      :ref="el => { btnRefs[i] = el }"
      class="seg-btn"
      :class="{ active: modelValue === opt }"
      @click="select(opt)"
    >
      {{ opt }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  options:    Array,
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const containerRef = ref(null)
const btnRefs      = ref([])
const pill         = ref({ x: 4, w: 0 })

function measure() {
  const i   = props.options.indexOf(props.modelValue)
  const btn = btnRefs.value[i]
  const box = containerRef.value
  if (!btn || !box) return

  const bRect = btn.getBoundingClientRect()
  const cRect = box.getBoundingClientRect()

  pill.value = {
    x: bRect.left - cRect.left - 4,
    w: bRect.width,
  }
}

function select(opt) {
  emit('update:modelValue', opt)
}

// Re-measure whenever value changes
watch(() => props.modelValue, async () => {
  await nextTick()   // wait for DOM to update
  measure()
})

onMounted(async () => {
  await nextTick()
  measure()
})
</script>

<style scoped>
.seg-wrap {
  position: relative;
  display: flex;
  background: #181818;
  border-radius: 10px;
  padding: 4px;
  gap: 0;
}

.seg-indicator {
  position: absolute;
  top: 4px;
  height: calc(100% - 8px);
  background: #a0ec06;
  border-radius: 8px;
  z-index: 0;
  /* Spring-like slide */
  transition:
    left  220ms cubic-bezier(0.34, 1.56, 0.64, 1),
    width 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.seg-btn {
  position: relative;
  z-index: 1;
  flex: 1;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  color: rgba(240,237,232,0.45);
  transition: color 150ms ease, font-weight 150ms ease;
}
.seg-btn.active {
  color:       #0a0a0a;
  font-weight: 600;
}
</style>
