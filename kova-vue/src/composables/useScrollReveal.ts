import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const target  = ref<HTMLElement | null>(null)
  const visible = ref(false)

  useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        // once: true by default — never re-triggers
      } else if (!options.once) {
        visible.value = false
      }
    },
    {
      threshold:  options.threshold  ?? 0.12,
      rootMargin: options.rootMargin ?? '-8% 0px',
    }
  )

  return { target, visible }
}
