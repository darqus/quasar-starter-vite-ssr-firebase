<template>
  <div class="q-pa-md q-gutter-md">
    <q-badge
      v-for="{ name, color, key } in LEVELS_MAP"
      :key="key"
      :color="color"
      class="shadow-2"
    >
      #{{ name }}
    </q-badge>
  </div>
</template>

<script setup lang="ts">
import { LEVELS_MAP, } from 'src/types/emloyee-card'
</script>
