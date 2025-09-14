<script setup lang="ts">
import { computed, ref } from 'vue'

import { INPUT_TYPE, PASSWORD_VISIBILITY_ICON } from 'src/types/form'
import type { InputFormField } from 'src/types/form'
import { INPUT_REQUIRED } from 'src/utils/constants'

defineEmits(['update:model'])

const props = defineProps<{
  field: InputFormField
}>()

const localModel = ref(props.field.model)

const passwordVisibility = ref(false)

const iconPassword = computed(() =>
  passwordVisibility.value
    ? PASSWORD_VISIBILITY_ICON.ON
    : PASSWORD_VISIBILITY_ICON.OFF
)

const currentInputType = computed(() =>
  passwordVisibility.value ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD
)
</script>

<template>
  <div>
    <q-input
      v-model.trim="localModel"
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
      label-slot
      @update:model-value="$emit('update:model', $event)"
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
    <div
      v-if="!field.required"
      class="q-field__bottom"
    />
  </div>
</template>
