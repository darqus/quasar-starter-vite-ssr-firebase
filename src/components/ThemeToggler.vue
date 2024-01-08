<template>
  <q-toggle
    v-model="isThemeDark"
    :icon="isThemeDark ? 'dark_mode' : 'light_mode'"
    :label="isThemeDark ? 'dark' : 'light'"
    size="xl"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
import { ref, } from 'vue'

import { useQuasar, } from 'quasar'

const $q = useQuasar()

$q.dark.set(import.meta.env.VITE_DARK)

const isThemeDark = ref($q.dark.isActive)

const toggleTheme = () => {
  $q.dark.toggle()
}
</script>
