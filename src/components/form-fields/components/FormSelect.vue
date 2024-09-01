<template>
  <q-select
    v-model.trim="localModel"
    :bg-color="field.bgColor"
    :clearable="field.clearable"
    :disable="field.disable"
    :options="field.options"
    :required="field.required"
    :rounded="field.rounded"
    :rules="field.rule"
    emit-value
    label-slot
    map-options
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
  </q-select>
</template>

<script setup lang="ts">
import { ref, } from 'vue'

import type { SelectFormField, } from 'src/types/form'

import { INPUT_REQUIRED, } from 'src/utils/constants'

defineEmits([ 'update:model', ])

const props = defineProps<{
  field: SelectFormField
}>()

const localModel = ref(props.field.model)
</script>
