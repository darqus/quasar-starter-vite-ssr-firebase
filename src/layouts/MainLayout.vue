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
            class="text-white text-decoration-none"
            to="/"
          >
            {{ APP_NAME }}
          </router-link>
        </q-toolbar-title>

        <div>{{ title }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      show-if-above
    >
      <SidebarDrawer />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, } from 'vue'

import { TITLE, } from '@/utils/meta'

import SidebarDrawer from '@/components/SidebarDrawer.vue'

const leftDrawerOpen = ref(false)
const title = ref(TITLE)
const APP_NAME = import.meta.env.VITE_NAME_FULL

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
