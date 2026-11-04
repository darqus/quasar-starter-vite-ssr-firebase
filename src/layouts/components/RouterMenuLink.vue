<script setup lang="ts">
export type RouterMenuLinkProps = {
  name: string
  title: string
  icon?: string
}

withDefaults(defineProps<RouterMenuLinkProps>(), {
  icon: '',
})
</script>

<template>
  <q-item
    :to="{ name }"
    clickable
    exact
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
