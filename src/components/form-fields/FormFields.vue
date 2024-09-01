<template>
  <template
    v-for="field in fields"
    :key="field.id"
  >
    <FormInput
      v-if="field.fieldType === FIELD_TYPE.INPUT"
      :field="field"
      @update:model="field.model = $event"
    />
    <FormSelect
      v-else-if="field.fieldType === FIELD_TYPE.SELECT"
      :field="field"
      @update:model="field.model = $event"
    />
    <FormTextArea
      v-else-if="field.fieldType === FIELD_TYPE.TEXTAREA"
      :field="field"
      @update:model="field.model = $event"
    />
    <FormDatePicker
      v-else-if="field.fieldType === FIELD_TYPE.DATE_PICKER"
      :field="field"
      @update:model="field.model = $event"
    />
  </template>
</template>

<script setup lang="ts">
import type { Fields, } from 'src/types/form'
import { FIELD_TYPE, } from 'src/types/form'

import FormDatePicker from './components/FormDatePicker.vue'
import FormInput from './components/FormInput.vue'
import FormSelect from './components/FormSelect.vue'
import FormTextArea from './components/FormTextArea.vue'

defineProps<{
  fields: Fields
}>()
</script>
