<script setup>
import { computed } from 'vue';

const props = defineProps({
  rows: { type: Number, default: 7 },
  cols: { type: Number, default: 52 },
  cellSize: { type: String, default: '12px' },
  gap: { type: String, default: '3px' },
  showLabels: { type: Boolean, default: false },
  showLegend: { type: Boolean, default: false },
  stretch: { type: Boolean, default: false }
});

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Precise color scale from FIX 2
const colors = {
  empty: '#181818',
  level1: '#085041',
  level2: '#0F6E56',
  level3: '#1D9E75',
  level4: '#5DCAA5',
  level5: '#a0ec06'
};

const cells = computed(() => {
  const result = [];
  for (let i = 0; i < props.cols * props.rows; i++) {
    const col = Math.floor(i / props.rows);
    let level = 0;
    
    // Exact weighting spec:
    const random = Math.random();
    if (col >= 0 && col <= 15) { // Jan-Mar: 80% empty, rest levels 1-2
      if (random < 0.80) level = 0;
      else if (random < 0.95) level = 1;
      else level = 2;
    } else if (col >= 16 && col <= 30) { // Apr-Jun: 40% empty, 60% levels 1-3
      if (random < 0.40) level = 0;
      else if (random < 0.60) level = 1;
      else if (random < 0.80) level = 2;
      else level = 3;
    } else if (col >= 31 && col <= 43) { // Jul-Aug: 20% empty, 80% levels 2-4
      if (random < 0.20) level = 0;
      else if (random < 0.45) level = 2;
      else if (random < 0.70) level = 3;
      else level = 4;
    } else if (col >= 44 && col <= 51) { // Sep-Oct: 8% empty, 70% levels 4-5
      if (random < 0.08) level = 0;
      else if (random < 0.30) level = 3;
      else if (random < 0.65) level = 4;
      else level = 5;
    }

    result.push({
      id: i,
      level,
      color: level === 0 ? colors.empty : colors[`level${level}`]
    });
  }
  return result;
});

const legendLevels = [0, 1, 2, 3, 4, 5];
</script>

<template>
  <div class="flex flex-col" :class="{ 'w-full': stretch }">
    <!-- Grid -->
    <div 
      class="grid" 
      :style="{ 
        gridTemplateColumns: `repeat(${cols}, ${cellSize})`, 
        gridTemplateRows: `repeat(${rows}, ${cellSize})`,
        gap: gap 
      }"
    >
      <div
        v-for="cell in cells"
        :key="cell.id"
        class="rounded-[2px] transition-all duration-500"
        :class="{ 'shadow-[0_0_8px_rgba(160,236,6,0.4)]': cell.level === 5 }"
        :style="{ 
          width: cellSize, 
          height: cellSize, 
          backgroundColor: cell.color,
          border: cell.level === 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none'
        }"
      ></div>
    </div>

    <!-- Month Labels -->
    <div v-if="showLabels" class="flex mt-2 opacity-25 text-[10px] font-body tracking-tight" :style="{ gap: '2px' }">
        <div v-for="(month, idx) in months.slice(0, 10)" :key="month" :style="{ width: `${(props.cols / 10) * 15}px` }">
            {{ month }}
        </div>
    </div>

    <!-- Legend -->
    <div v-if="showLegend" class="flex justify-between items-center mt-4">
        <div class="flex items-center gap-2">
            <span class="text-[10px] opacity-20 font-body">Less</span>
            <div class="flex" :style="{ gap: gap }">
                <div 
                    v-for="lvl in legendLevels" 
                    :key="lvl" 
                    class="rounded-[1px]"
                    :style="{ 
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: lvl === 0 ? colors.empty : colors[`level${lvl}`],
                        border: lvl === 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none'
                    }"
                ></div>
            </div>
            <span class="text-[10px] opacity-20 font-body">More</span>
        </div>
        
        <!-- Streak Badge -->
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25">
            <span class="text-primary text-[12px] font-medium leading-none">🔥 32-day streak</span>
        </div>
    </div>
  </div>
</template>
