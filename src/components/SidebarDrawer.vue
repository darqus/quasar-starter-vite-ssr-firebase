<template>
  <q-list>
    <q-item-label header>
      Главное меню
    </q-item-label>

    <UserAvatar
      v-if="storeAuth.loggedIn"
      :user-email="storeAuth.currentUser?.email"
    />

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
      @click="storeAuth.onLogout(true)"
    />
  </div>
</template>

<script setup lang="ts">
import { useStoreAuth, } from '@/stores/store-auth'

import RouterMenuLink from '@/components/RouterMenuLink.vue'
import ThemeToggler from '@/components/ThemeToggler.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const storeAuth = useStoreAuth()
</script>
