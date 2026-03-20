import { ref } from 'vue'

const isVisible = ref(false)
const message   = ref('')
let timer: ReturnType<typeof setTimeout>

export function useToast() {
  function show(msg: string) {
    message.value   = msg
    isVisible.value = true

    clearTimeout(timer)
    timer = setTimeout(() => {
      isVisible.value = false
    }, 3000)
  }

  return { isVisible, message, show }
}
