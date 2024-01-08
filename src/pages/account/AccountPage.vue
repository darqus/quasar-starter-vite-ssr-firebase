<template>
  <q-page class="row items-center justify-evenly">
    <q-card
      class="shadow-up-1"
      style="min-width: 300px; max-width: 700px;"
    >
      <div class="row">
        <q-card class="col-sm-5 bg-blue-8 xs-hide text-right">
          <div class="bg-blue-6 text-white q-pa-md">
            <div
              class="text-h6 text-white"
              style="min-width: 220px"
            >
              Добро пожаловать
            </div>
          </div>
          <div class="bg-blue-5 text-white q-pa-md">
            <div class="text-white q-my-sm text-subtitle1">
              Это данные вашего аккаунта!
            </div>
          </div>
        </q-card>

        <div class="col-sm-7 shadow-1">
          <div class="q-pa-lg">
            <div class="row">
              <div class="col-12 text-subtitle1">
                <router-link
                  class="text-primary"
                  to="/"
                >
                  На Главную
                </router-link>
              </div>
              <div class="col-12">
                <div class="flex justify-center">
                  <div class="text-h5 q-my-lg text-weight-bold text-primary">
                    Профиль
                  </div>
                </div>

                <q-input
                  :model-value="storeAuth.currentUser?.email"
                  label="Email"
                  dense
                  disable
                  outlined
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useStoreAuth, } from '@/stores/store-auth'

const storeAuth = useStoreAuth()
</script>
