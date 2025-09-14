<script setup lang="ts">
import { useRouter } from 'vue-router'

import RouterMenuLink from 'src/components/RouterMenuLink.vue'
import ThemeToggler from 'src/components/ThemeToggler.vue'
import UserAvatar from 'src/components/UserAvatar.vue'
import { useStoreAuth } from 'src/stores/store-auth'

const storeAuth = useStoreAuth()
const router = useRouter()
</script>

<template>
  <q-list>
    <q-item-label header>Главное меню</q-item-label>

    <UserAvatar v-if="storeAuth.loggedIn" />

    <RouterMenuLink
      v-for="link in storeAuth.routerMenuLinks"
      :key="link.title"
      v-bind="link"
    />

    <div class="q-pa-md">
      <ThemeToggler />
    </div>
  </q-list>

  <div
    v-if="storeAuth.loggedIn"
    class="q-pa-md"
  >
    <q-btn
      :disable="storeAuth.loading"
      :loading="storeAuth.loading"
      color="primary"
      label="Выйти"
      size="md"
      no-caps
      @click="storeAuth.onLogout(router, true)"
    />
  </div>
</template>
