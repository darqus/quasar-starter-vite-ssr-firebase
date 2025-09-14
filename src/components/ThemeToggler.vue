<script setup lang="ts">
import { ref } from 'vue'

import { LocalStorage, useQuasar } from 'quasar'

import { StorageKey } from 'src/types/storage'

const $q = useQuasar()

const isThemeDark = ref($q.dark.isActive)

const toggleTheme = () => {
  $q.dark.toggle()
  isThemeDark.value = $q.dark.isActive
  LocalStorage.set(StorageKey.ThemeDark, isThemeDark.value)
}
</script>

<template>
  <q-toggle
    v-model="isThemeDark"
    :icon="isThemeDark ? 'dark_mode' : 'light_mode'"
    :label="isThemeDark ? 'dark' : 'light'"
    size="xl"
    @click="toggleTheme"
  />
</template>
