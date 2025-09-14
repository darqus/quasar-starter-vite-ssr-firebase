<script setup lang="ts">
const { VITE_ROUTER_BASE: BASE } = import.meta.env

type Form = {
  cardStyle: string
  title: string
  description: string
}

withDefaults(defineProps<Form>(), {
  cardStyle: '',
  title: '',
  description: '',
})
</script>

<template>
  <q-card
    :style="cardStyle"
    class="shadow-up-1"
  >
    <div class="row">
      <q-card class="col-sm-5 bg-blue-8 xs-hide text-right">
        <div class="bg-blue-6 text-white q-pa-md">
          <div
            class="text-h6 text-white q-px-md"
            style="min-width: 220px"
            v-text="'Добро пожаловать'"
          />
        </div>
        <div class="bg-blue-5 text-white q-pa-md">
          <div
            class="text-white q-my-sm text-subtitle1"
            v-text="description"
          />
        </div>
      </q-card>

      <div class="col-sm-7 shadow-1">
        <div class="q-pa-lg">
          <div class="row">
            <div class="col-12 text-subtitle1">
              <router-link
                :to="BASE"
                class="text-primary"
              >
                На Главную
              </router-link>
            </div>
            <div class="col-12">
              <div class="flex justify-center">
                <div
                  class="text-h5 q-my-lg text-weight-bold text-primary"
                  v-text="title"
                />
              </div>

              <slot name="fields" />

              <slot name="buttons" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>
