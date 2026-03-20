import { ref, onMounted, onUnmounted } from 'vue'

export function useReducedMotion() {
  const isReduced = ref(false)
  let mediaQuery: MediaQueryList | null = null

  function update(e: MediaQueryListEvent | MediaQueryList) {
    isReduced.value = e.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    update(mediaQuery)
    mediaQuery.addEventListener('change', update)
  })

  onUnmounted(() => {
    if (mediaQuery) mediaQuery.removeEventListener('change', update)
  })

  return isReduced
}
