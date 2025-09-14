<script setup lang="ts">
import { computed } from 'vue'

import type { SelectFormField } from 'src/types/form'
import { INPUT_REQUIRED } from 'src/utils/constants'

const emit = defineEmits<{
  'update:model': [value: unknown]
}>()

const props = defineProps<{
  field: SelectFormField<unknown>
}>()

// Вычисляемое свойство для v-model
const modelValue = computed({
  get: () => props.field.model,
  set: (value: unknown) => emit('update:model', value),
})
</script>

<template>
  <q-select
    v-model="modelValue"
    :bg-color="field.bgColor"
    :clearable="field.clearable"
    :disable="field.disable"
    :name="field.name"
    :options="field.options"
    :required="field.required"
    :rounded="field.rounded"
    :rules="field.required ? field.rule : []"
    bottom-slots
    emit-value
    label-slot
    lazy-rules
    map-options
  >
    <template #prepend>
      <q-icon :name="field.iconPrepend" />
    </template>
    <template #label>
      <span v-text="field.label" />
      <sup
        v-if="field.required"
        class="text-red"
        v-text="INPUT_REQUIRED"
      />
    </template>
  </q-select>
</template>
