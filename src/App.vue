<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMeta, } from 'quasar'

import { meta, } from '@/utils/meta'

useMeta(meta)
</script>
