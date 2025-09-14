<script setup lang="ts">
import { computed } from 'vue'

type UserAvatar = {
  userEmail?: string | null
}

// Делаем пропсы доступными в скрипте и шаблоне
const props = withDefaults(defineProps<UserAvatar>(), {
  userEmail: '',
})

// Первая буква email в верхнем регистре; фолбэк — '?'
const initial = computed(() => {
  const ch = props.userEmail?.trim()?.charAt(0) ?? ''
  return ch ? ch.toUpperCase() : '?'
})
</script>

<template>
  <div class="q-pa-md q-gutter-md row justify-center">
    <q-avatar
      :aria-label="`Аватар пользователя ${props.userEmail || ''}`"
      color="primary"
      font-size="52px"
      size="70px"
      text-color="white"
    >
      {{ initial }}
    </q-avatar>
    <q-input
      :model-value="props.userEmail"
      label="Ваш Email"
      readonly
    />
  </div>
</template>
