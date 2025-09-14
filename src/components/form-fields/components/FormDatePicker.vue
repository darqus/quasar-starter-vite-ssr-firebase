<script setup lang="ts">
import { computed } from 'vue'

import { DATE_MASK, INPUT_MASK } from 'src/types/form'
import type { DatePickerFormField } from 'src/types/form'
import { INPUT_REQUIRED, OFFSET_POPUP_PROXY } from 'src/utils/constants'

const emit = defineEmits<{
  'update:model': [value: string]
}>()

const props = defineProps<{
  field: DatePickerFormField
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
    :disable="field.disable"
    :mask="INPUT_MASK"
    :name="field.name"
    :required="field.required"
    :rules="field.required ? field.rule : []"
    bottom-slots
    label-slot
    lazy-rules
    readonly
  >
    <template #prepend>
      <q-icon
        class="cursor-pointer"
        name="event"
      >
        <q-popup-proxy
          :offset="OFFSET_POPUP_PROXY"
          transition-hide="scale"
          transition-show="scale"
          cover
        >
          <q-date
            v-model="modelValue"
            :mask="DATE_MASK"
            no-unset
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                color="primary"
                label="ОК"
                flat
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
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
