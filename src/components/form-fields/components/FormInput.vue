<script setup lang="ts">
import { computed, ref } from 'vue'

import { INPUT_TYPE, PASSWORD_VISIBILITY_ICON } from 'src/types/form'
import type { InputFormField } from 'src/types/form'
import { INPUT_REQUIRED } from 'src/utils/constants'

const emit = defineEmits<{
  'update:model': [value: string]
}>()

const props = defineProps<{
  field: InputFormField
}>()

const passwordVisibility = ref(false)

const iconPassword = computed(() =>
  passwordVisibility.value
    ? PASSWORD_VISIBILITY_ICON.ON
    : PASSWORD_VISIBILITY_ICON.OFF
)

const currentInputType = computed(() =>
  passwordVisibility.value ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD
)

// Вычисляемое свойство для v-model
const modelValue = computed({
  get: () => props.field.model,
  set: (value: string) => emit('update:model', value)
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
    :type="
      field.inputType === INPUT_TYPE.PASSWORD
        ? currentInputType
        : field.inputType
    "
    bottom-slots
    label-slot
    lazy-rules
  >
    <template #prepend>
      <q-icon :name="field.iconPrepend" />
    </template>
    <template #append>
      <q-icon
        v-if="field.inputType === INPUT_TYPE.PASSWORD"
        :name="iconPassword"
        class="cursor-pointer"
        @click="passwordVisibility = !passwordVisibility"
      />
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
