<script setup lang="ts">
import { computed } from 'vue'

import { useStoreAuth } from 'src/stores/store-auth'

const storeAuth = useStoreAuth()

// Email текущего пользователя из стора (пустая строка, если нет)
const userEmail = computed(() => storeAuth.currentUser?.email ?? '')

// Первая буква email в верхнем регистре; фолбэк — '?'
const initial = computed(() => {
  const ch = userEmail.value.trim().charAt(0)
  return ch ? ch.toUpperCase() : '?'
})
</script>

<template>
  <div class="q-pa-md q-gutter-md row justify-center">
    <q-avatar
      :aria-label="`Аватар пользователя ${userEmail || ''}`"
      color="primary"
      font-size="52px"
      size="70px"
      text-color="white"
    >
      {{ initial }}
    </q-avatar>
    <q-input
      :model-value="userEmail"
      label="Ваш Email"
      readonly
    />
  </div>
</template>
