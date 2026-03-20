<script setup>
const props = defineProps({
  enabled: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:enabled', 'toggle'])

const handleToggle = () => {
  const next = !props.enabled
  emit('update:enabled', next)
  emit('toggle', next)
}
</script>

<template>
  <button
    role="switch"
    :aria-checked="enabled"
    @click="handleToggle"
    class="kov-toggle"
    :style="{ backgroundColor: enabled ? '#a0ec06' : '#303030' }"
  >
    <div
      class="kov-toggle-thumb"
      :style="{ transform: enabled ? 'translateX(20px)' : 'translateX(0)' }"
    />
  </button>
</template>

<style scoped>
.kov-toggle {
  width: 44px;
  height: 24px;
  border-radius: 99px;
  padding: 0 3px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.18s ease;
}

.kov-toggle-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* spring equivalent */
}
</style>
