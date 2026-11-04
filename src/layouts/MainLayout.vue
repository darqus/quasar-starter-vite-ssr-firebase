<script setup lang="ts">
import { ref } from 'vue'

import SidebarDrawer from '@/layouts/components/SidebarDrawer.vue'
import { TITLE } from '@/shared/lib/meta'
import { ROUTE_NAME } from '@/types/route'

const leftDrawerOpen = ref(false)
const title = ref(TITLE)
const APP_NAME = import.meta.env.VITE_NAME_FULL

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          :icon="leftDrawerOpen ? 'menu_open' : 'menu'"
          aria-label="Menu"
          dense
          flat
          round
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <router-link
            :to="{ name: ROUTE_NAME.HOME }"
            class="text-white text-decoration-none"
          >
            {{ APP_NAME }}
          </router-link>
        </q-toolbar-title>

        <div>{{ title }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="main-layout__drawer"
      bordered
      show-if-above
    >
      <SidebarDrawer />
    </q-drawer>
    <q-page-container class="main-layout__page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
