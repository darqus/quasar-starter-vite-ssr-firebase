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
      autogrow
      label-slot
      @update:model-value="$emit('update:model', $event)"
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
    <div
      v-if="!field.required"
      class="q-field__bottom"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, } from 'vue'

import type { TextareaFormField, } from 'src/types/form'

import { INPUT_REQUIRED, } from 'src/utils/constants'

defineEmits([ 'update:model', ])

const props = defineProps<{
  field: TextareaFormField
}>()

const localModel = ref(props.field.model)
</script>
