<script setup lang="ts">
import { computed } from 'vue'

import type { Fields, SelectFormField } from '@/shared/form/types'
import { FIELD_TYPE } from '@/shared/form/types'

import FormDatePicker from './components/FormDatePicker.vue'
import FormInput from './components/FormInput.vue'
import FormSelect from './components/FormSelect.vue'
import FormTextArea from './components/FormTextArea.vue'

const props = defineProps<{
  fields: Fields
  errors?: Record<string, string[]>
}>()

const getFieldErrors = (name: string): string[] => props.errors?.[name] ?? []

const visibleFields = computed(() =>
  props.fields.filter((f) => {
    const ctx = {
      values: Object.fromEntries(props.fields.map((x) => [x.name, x.model])),
    }
    const cond = typeof f.visible === 'function' ? f.visible(ctx) : f.visible
    return cond !== false
  })
)
</script>

<template>
  <template
    v-for="field in visibleFields"
    :key="field.id"
  >
    <FormInput
      v-if="field.fieldType === FIELD_TYPE.INPUT"
      :errors="getFieldErrors(field.name)"
      :field="field"
      @update:model="field.model = $event"
    />
    <FormSelect
      v-else-if="field.fieldType === FIELD_TYPE.SELECT"
      :errors="getFieldErrors(field.name)"
      :field="field as unknown as SelectFormField"
      @update:model="
        (field as unknown as SelectFormField).model = $event as unknown as
          string | number | null
      "
    />
    <FormTextArea
      v-else-if="field.fieldType === FIELD_TYPE.TEXTAREA"
      :errors="getFieldErrors(field.name)"
      :field="field"
      @update:model="field.model = $event"
    />
    <FormDatePicker
      v-else-if="field.fieldType === FIELD_TYPE.DATE_PICKER"
      :errors="getFieldErrors(field.name)"
      :field="field"
      @update:model="field.model = $event"
    />
  </template>
</template>
