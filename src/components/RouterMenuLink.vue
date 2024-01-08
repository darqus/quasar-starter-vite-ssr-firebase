<template>
  <q-item
    v-if="visible"
    :to="path"
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

<script setup lang="ts">
export type RouterMenuLinkProps = {
  title: string
  path?: string
  icon?: string
  visible?: boolean
}

withDefaults(defineProps<RouterMenuLinkProps>(), {
  path: '/',
  icon: '',
})
</script>
