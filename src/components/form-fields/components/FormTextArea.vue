<script setup lang="ts">
import { computed } from 'vue'

import type { TextareaFormField } from 'src/types/form'
import { INPUT_REQUIRED } from 'src/utils/constants'

const emit = defineEmits<{
  'update:model': [value: string]
}>()

const props = defineProps<{
  field: TextareaFormField
}>()

// Вычисляемое свойство для v-model
const modelValue = computed({
  get: () => props.field.model,
  set: (value: string) => emit('update:model', value),
})
</script>

<template>
  <q-input
    v-model.trim="modelValue"
    :bg-color="field.bgColor"
    :clearable="field.clearable"
    :debounce="field.debounce"
    :disable="field.disable"
    :mask="field.mask"
    :name="field.name"
    :required="field.required"
    :rounded="field.rounded"
    :rules="field.required ? field.rule : []"
    type="textarea"
    autogrow
    bottom-slots
    label-slot
    lazy-rules
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
  </q-input>
</template>
