import { ref } from 'vue'

export function useToast() {
  const visible = ref(false)
  const message = ref('')
  let timer: ReturnType<typeof setTimeout>

  function show(msg: string) {
    clearTimeout(timer)
    message.value = msg
    visible.value = true
    timer = setTimeout(() => { visible.value = false }, 2600)
  }

  function dismiss() { visible.value = false }

  return { visible, message, show, dismiss }
}
