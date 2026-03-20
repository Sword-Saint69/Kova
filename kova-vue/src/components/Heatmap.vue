<script setup>
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
  rows:       { type: Number,  default: 7 },
  cols:       { type: Number,  default: 52 },
  cellSize:   { type: String,  default: '12px' },
  gap:        { type: String,  default: '3px' },
  showLabels: { type: Boolean, default: false },
  showLegend: { type: Boolean, default: false },
  stretch:    { type: Boolean, default: false },
  liveFill:   { type: Boolean, default: false }, // enable bottom-right spread
});

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const colors = {
  empty: '#181818', level1: '#085041', level2: '#0F6E56',
  level3: '#1D9E75', level4: '#5DCAA5', level5: '#a0ec06'
};

const cells = computed(() => {
  const result = [];
  for (let i = 0; i < props.cols * props.rows; i++) {
    const col = Math.floor(i / props.rows);
    const row = i % props.rows;
    let level = 0;
    const random = Math.random();

    if      (col <= 15) { if (random < 0.80) level = 0; else if (random < 0.95) level = 1; else level = 2; }
    else if (col <= 30) { if (random < 0.40) level = 0; else if (random < 0.60) level = 1; else if (random < 0.80) level = 2; else level = 3; }
    else if (col <= 43) { if (random < 0.20) level = 0; else if (random < 0.45) level = 2; else if (random < 0.70) level = 3; else level = 4; }
    else                { if (random < 0.08) level = 0; else if (random < 0.30) level = 3; else if (random < 0.65) level = 4; else level = 5; }

    // ANIMATION: Live fill — distance from bottom-right corner determines stagger delay
    const distFromBR = props.liveFill
      ? (props.cols - 1 - col) + (props.rows - 1 - row)
      : 0;

    result.push({
      id: i, col, row, level,
      color: level === 0 ? colors.empty : colors[`level${level}`],
      fillDelay: distFromBR * 18 // ms
    });
  }
  return result;
});

const legendLevels = [0, 1, 2, 3, 4, 5];

// Live heatmap typing support
const highlightedCells = ref(new Set());
function lightRandomCell() {
  const idx = Math.floor(Math.random() * (props.cols * props.rows));
  highlightedCells.value.add(idx);
  setTimeout(() => {
    highlightedCells.value.delete(idx);
    highlightedCells.value = new Set(highlightedCells.value);
  }, 800);
}

// Expose for parent to call
defineExpose({ lightRandomCell });
</script>

<template>
  <div class="flex flex-col" :class="{ 'w-full': stretch }">
    <!-- Grid -->
    <div
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${cols}, ${cellSize})`,
        gridTemplateRows:    `repeat(${rows}, ${cellSize})`,
        gap:                 gap
      }"
    >
      <!-- ANIMATION 1: Live fill — each cell fades in from bottom-right, stagger via delay -->
      <!-- ANIMATION 9: Live heatmap typing — highlighted cells pulse lime -->
      <!-- ANIMATION 1 (hover): scale + glow on hover -->
      <div
        v-for="cell in cells"
        :key="cell.id"
        class="heatmap-cell rounded-[2px]"
        :class="{
          'cell-lime': cell.level === 5,
          'cell-typing-hit': highlightedCells.has(cell.id)
        }"
        :style="{
          width:           cellSize,
          height:          cellSize,
          backgroundColor: highlightedCells.has(cell.id) ? colors.level5 : cell.color,
          border:          cell.level === 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
          ...(liveFill ? {
            opacity: 0,
            animation: `cell-fill-in 300ms ease-out ${cell.fillDelay}ms forwards`
          } : {})
        }"
      ></div>
    </div>

    <!-- Month Labels -->
    <div v-if="showLabels" class="flex mt-2 opacity-25 text-[10px] font-body tracking-tight" :style="{ gap: '2px' }">
      <div v-for="month in months.slice(0, 10)" :key="month" :style="{ width: `${(props.cols / 10) * 15}px` }">{{ month }}</div>
    </div>

    <!-- Legend row -->
    <div v-if="showLegend" class="flex justify-between items-center mt-4">
      <div class="flex items-center gap-2">
        <span class="text-[10px] opacity-20 font-body">Less</span>
        <div class="flex" :style="{ gap: gap }">
          <div
            v-for="lvl in legendLevels" :key="lvl"
            class="rounded-[1px]"
            :style="{
              width: '10px', height: '10px',
              backgroundColor: lvl === 0 ? colors.empty : colors[`level${lvl}`],
              border: lvl === 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none'
            }"
          ></div>
        </div>
        <span class="text-[10px] opacity-20 font-body">More</span>
      </div>

      <!-- ANIMATION 10 Streak Badge pulse ring -->
      <div class="streak-badge">
        <span class="streak-flame">🔥</span>
        <span class="text-primary text-[12px] font-medium leading-none">32-day streak</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ANIMATION 1 — Cell hover: scale + glow */
.heatmap-cell {
  transition: transform 120ms cubic-bezier(0.34,1.56,0.64,1),
              box-shadow 120ms ease,
              background-color 300ms ease;
  cursor: default;
}
.heatmap-cell:hover {
  transform: scale(1.6);
  z-index: 10; position: relative;
  box-shadow: 0 0 6px rgba(160,236,6,0.35);
}
.cell-lime { box-shadow: 0 0 8px rgba(160,236,6,0.4); }
.cell-lime:hover { box-shadow: 0 0 14px rgba(160,236,6,0.7); }

/* ANIMATION 1 — Live fill spreading from bottom-right */
@keyframes cell-fill-in {
  from { opacity: 0; transform: scale(0.5); }
  to   { opacity: 1; transform: scale(1); }
}

/* ANIMATION 9 — Typing hit: brief lime flash */
.cell-typing-hit {
  box-shadow: 0 0 10px rgba(160,236,6,0.8) !important;
  transition: background-color 60ms ease !important;
}

/* ANIMATION 10 — Streak badge: glow ring pulse + flame bob */
.streak-badge {
  display: flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 99px;
  background: rgba(160,236,6,0.08);
  border: 0.5px solid rgba(160,236,6,0.25);
  position: relative;
}
.streak-badge::after {
  content: '';
  position: absolute; inset: -3px; border-radius: 99px;
  border: 1px solid rgba(160,236,6,0.35);
  animation: streak-ring-pulse 2.4s ease-in-out infinite;
  pointer-events: none;
}
.streak-flame {
  display: inline-block;
  animation: flame-bob 1.8s ease-in-out infinite;
}
@keyframes streak-ring-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 0;   transform: scale(1.18); }
}
@keyframes flame-bob {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50%       { transform: translateY(-2px) rotate(3deg); }
}
</style>
