<script setup lang="ts">
import { useQuasar } from 'quasar'

const { VITE_ROUTER_BASE: BASE } = import.meta.env

const $q = useQuasar()
</script>

<template>
  <div class="bg-blue text-white text-center q-pa-md flex flex-center">
    <div
      class="q-pa-xl q-gutter-y-xl q-gutter-y-lg q-gutter-y-md q-gutter-y-sm q-gutter-y-xs"
    >
      <div :style="`font-size: ${$q.screen.gt.sm ? '20vh' : '15vh'}`">404</div>

      <div
        :class="$q.screen.gt.sm ? 'text-h4' : 'text-h6'"
        style="opacity: 0.4"
      >
        Упс. Такой страницы здесь нет...
      </div>

      <q-btn
        :to="BASE"
        color="white"
        label="На Главную"
        text-color="primary"
        no-caps
        unelevated
      />
    </div>
  </div>
</template>
