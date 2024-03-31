<template>
  <q-page class="row items-center justify-evenly">
    <EssentialForm
      card-style="min-width: 300px; max-width: 700px;"
      description="Это данные вашего аккаунта!"
      title="Профиль"
    >
      <template #fields>
        <q-input
          :model-value="storeAuth.currentUser?.email"
          label="Email"
          dense
          disable
          outlined
        />
      </template>

      <template #buttons />
    </EssentialForm>
  </q-page>
</template>

<script setup lang="ts">
import { useStoreAuth, } from 'src/stores/store-auth'

import EssentialForm from 'src/components/form/EssentialForm.vue'

const storeAuth = useStoreAuth()
</script>
