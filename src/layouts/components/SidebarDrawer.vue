<script setup lang="ts">
import { computed } from 'vue'

import { useAuthActions, useStoreAuth } from '@/features/auth'
import { isMenuLinkVisible } from '@/router/menu'
import { ROUTE_MENU } from '@/router/routes'

import RouterMenuLink from './RouterMenuLink.vue'
import ThemeToggler from './ThemeToggler.vue'
import UserAvatar from './UserAvatar.vue'

const storeAuth = useStoreAuth()
const { isPending, logout } = useAuthActions()

const menuLinks = computed(() =>
  ROUTE_MENU.filter((link) =>
    isMenuLinkVisible(link, storeAuth.isAuthenticated)
  )
)

const onLogout = async () => {
  await logout({ goToLogin: true })
}
</script>

<template>
  <q-list>
    <q-item-label header>Главное меню</q-item-label>

    <UserAvatar v-if="storeAuth.loggedIn" />

    <RouterMenuLink
      v-for="link in menuLinks"
      :key="link.name"
      :icon="link.icon"
      :name="link.name"
      :title="link.title"
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
      :disable="isPending"
      :loading="isPending"
      color="primary"
      label="Выйти"
      size="md"
      no-caps
      @click="onLogout"
    />
  </div>
</template>
