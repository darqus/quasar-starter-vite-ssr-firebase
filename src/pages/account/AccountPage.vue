<template>
  <q-page class="row items-center justify-evenly">
    <q-card style="min-width: 300px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
          Профиль
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          :model-value="storeAuth.currentUser?.email"
          label="Email"
          dense
          disable
          outlined
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useStoreAuth, } from '@/stores/store-auth'

const storeAuth = useStoreAuth()
</script>
