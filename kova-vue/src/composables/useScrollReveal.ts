import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export function useScrollReveal(options = {}) {
  const target  = ref(null)
  const visible = ref(false)

  useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) visible.value = true
      // Once revealed, stays revealed — no re-trigger
    },
    {
      threshold: 0.12,
      rootMargin: '-8% 0px',
      ...options,
    }
  )

  return { target, visible }
}
