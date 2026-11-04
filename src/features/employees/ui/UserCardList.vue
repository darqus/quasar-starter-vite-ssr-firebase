<script setup lang="ts">
import { onMounted } from 'vue'

import { useStoreEmployeeCards } from '../model/store'

const storeEmployeeCards = useStoreEmployeeCards()

const reload = () => {
  void storeEmployeeCards.getEmployeeList()
}

onMounted(reload)
</script>

<template>
  <div class="row">
    <q-toggle
      v-model="storeEmployeeCards.isFilterVisible"
      class="q-mb-md q-mr-md"
      color="pink"
      icon="filter_list_alt"
      label="Фильтры"
      size="xl"
    />
    <template v-if="storeEmployeeCards.isFilterVisible">
      <q-select
        v-model="storeEmployeeCards.selectedFromLevel"
        :options="storeEmployeeCards.optionsEmployeeLevel"
        class="q-mb-md"
        label="По уровню"
        style="width: 200px"
        clearable
      />
      <div class="q-mr-md" />
      <q-select
        v-model="storeEmployeeCards.selectedFromPosition"
        :options="storeEmployeeCards.optionsEmployeePosition"
        class="q-mb-md"
        label="По должности"
        style="width: 200px"
        clearable
      />
      <div class="q-mr-md" />
      <q-select
        v-model="storeEmployeeCards.selectedFromRating"
        :options="storeEmployeeCards.optionsEmployeeRating"
        class="q-mb-md"
        label="По рейтингу"
        style="width: 160px"
        clearable
      />
    </template>
  </div>
  <q-linear-progress
    v-if="storeEmployeeCards.loading"
    class="q-mt-sm"
    indeterminate
  />
  <q-banner
    v-else-if="storeEmployeeCards.error"
    class="bg-negative q-mt-sm text-white"
    rounded
  >
    {{ storeEmployeeCards.error }}
    <template #action>
      <q-btn
        label="Повторить"
        flat
        no-caps
        @click="reload"
      />
    </template>
  </q-banner>
  <div
    v-else-if="!storeEmployeeCards.filteredEmployeeList.length"
    class="q-mt-md text-grey-7"
  >
    Сотрудники не найдены
  </div>
  <div
    v-else
    class="user-card-list"
  >
    <q-card
      v-for="{
        id,
        name,
        email,
        position,
        level,
        description,
        rate,
      } in storeEmployeeCards.filteredEmployeeList"
      :key="id"
      bordered
    >
      <q-card-section class="bg-primary text-white">
        <div class="text-subtitle1">
          {{ name }}
        </div>
      </q-card-section>

      <q-card-section>
        <div>
          <q-rating
            :max="5"
            :model-value="rate"
            color="primary"
            size="16px"
          />
          <q-badge
            :color="storeEmployeeCards.getColorFromLevel(level)"
            class="q-ml-sm shadow-2"
          >
            #{{ level }}
          </q-badge>
        </div>
        <div class="text-subtitle2 q-my-xs">
          {{ position }}
        </div>
        <div class="text-subtitle2">
          {{ email }}
        </div>
      </q-card-section>

      <q-card-section
        class="q-pt-none"
        style="height: 70px; overflow-y: auto"
      >
        {{ description }}
      </q-card-section>
    </q-card>
  </div>
</template>
