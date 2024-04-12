<template>
  <div class="q-pa-md q-gutter-md row justify-center">
    <q-avatar
      color="primary"
      font-size="52px"
      icon="o_person"
      size="70px"
      text-color="white"
    />
    <q-input
      :model-value="userEmail"
      label="Ваш Email"
      readonly
    />
  </div>
</template>

<script setup lang="ts">
type UserAvatar = {
  userEmail?: string | null
}

withDefaults(defineProps<UserAvatar>(), {
  userEmail: '',
})
</script>
