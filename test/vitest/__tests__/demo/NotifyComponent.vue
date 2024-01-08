<template>
  <q-btn @click="onClick">
    Click me!
  </q-btn>
</template>

<script lang="ts" setup>
import { Notify, } from 'quasar'

const onClick = () => {
  Notify.create('Hello there!')
}
</script>
