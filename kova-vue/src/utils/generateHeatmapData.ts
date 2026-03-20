// Generate realistic heatmap data — sparse past, dense recent

export function generateHeatmapData(cols = 52, rows = 7): number[][] {
  return Array.from({ length: cols }, (_, c) => {
    const recency = c / cols  // 0 = old, 1 = recent

    return Array.from({ length: rows }, () => {
      const rand = Math.random()

      if (recency < 0.30) {
        // Old weeks — mostly empty
        return rand < 0.20 ? Math.ceil(rand / 0.20 * 2) : 0
      } else if (recency < 0.60) {
        // Middle — building habit
        return rand < 0.50 ? Math.ceil(rand / 0.50 * 3) : 0
      } else if (recency < 0.85) {
        // Recent — strong
        return rand < 0.72 ? Math.ceil(rand / 0.72 * 4) : 0
      } else {
        // Last 4 weeks — maximum, glowing lime
        return rand < 0.88 ? Math.max(3, Math.ceil(rand / 0.88 * 5)) : 1
      }
    })
  })
}
