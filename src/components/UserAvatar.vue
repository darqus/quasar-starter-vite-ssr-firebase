<template>
  <div
    v-if="storeAuth.loggedIn"
    class="q-pa-md q-gutter-md row justify-center"
  >
    <q-avatar
      color="primary"
      font-size="52px"
      icon="o_person"
      size="70px"
      text-color="white"
    />
    <q-input
      :model-value="storeAuth.currentUser?.email"
      label="Ваш Email"
      outlined
      readonly
    />
  </div>
</template>

<script setup lang="ts">
import { useStoreAuth, } from '@/stores/store-auth'

const storeAuth = useStoreAuth()
</script>
