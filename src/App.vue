<script setup lang="ts">
import { useMeta } from 'quasar'

import { meta } from '@/shared/lib/meta'

defineOptions({
  name: 'App',
})

useMeta(meta)
</script>

<template>
  <router-view />
</template>
