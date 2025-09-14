<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMeta } from 'quasar'

import { meta } from 'src/utils/meta'

defineOptions({
  name: 'App',
})

useMeta(meta)
</script>
