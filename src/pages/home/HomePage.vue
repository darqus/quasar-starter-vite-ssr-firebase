<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="tab"
      class="text-primary"
    >
      <q-tab
        icon="people"
        label="Сотрудники"
        name="UserCardList"
        no-caps
      />
      <q-tab
        icon="noise_aware"
        label="Навыки"
        name="UserSkillList"
        no-caps
      />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
    >
      <q-tab-panel name="UserCardList">
        <UserCardList />
      </q-tab-panel>

      <q-tab-panel name="UserSkillList">
        <UserSkillList />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref, } from 'vue'

import UserCardList from 'src/components/UserCardList.vue'
import UserSkillList from 'src/components/UserSkillList.vue'

const tab = ref('UserCardList')
</script>
