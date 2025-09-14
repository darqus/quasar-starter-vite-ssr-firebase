<script setup lang="ts">
import { ref } from 'vue'

import { DATE_MASK, INPUT_MASK } from 'src/types/form'
import type { DatePickerFormField } from 'src/types/form'
import { INPUT_REQUIRED, OFFSET_POPUP_PROXY } from 'src/utils/constants'

defineEmits(['update:model'])

const props = defineProps<{
  field: DatePickerFormField
}>()

const localModel = ref(props.field.model)
</script>

<template>
  <q-input
    v-model.trim="localModel"
    :disable="field.disable"
    :mask="INPUT_MASK"
    :rules="field.rule"
    label-slot
  >
    <template #prepend>
      <q-icon
        class="cursor-pointer"
        name="event"
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
    <q-popup-proxy
      :offset="OFFSET_POPUP_PROXY"
      transition-hide="scale"
      transition-show="scale"
    >
      <q-date
        v-model.trim="localModel"
        :mask="DATE_MASK"
        no-unset
        @update:model-value="$emit('update:model', $event)"
      />
    </q-popup-proxy>
  </q-input>
</template>
