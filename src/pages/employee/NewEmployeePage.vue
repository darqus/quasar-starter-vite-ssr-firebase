<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForm"
      @reset="storeNewEmployee.onReset"
      @submit.prevent="storeNewEmployee.add"
    >
      <q-card style="min-width: 300px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            Новый сотрудник
          </div>
        </q-card-section>

        <q-card-section>
          <template
            v-for="field in storeNewEmployee.formEmployee"
            :key="field.id"
          >
            <template v-if="field.formFieldType === FORM_FIELD_TYPE.INPUT">
              <q-input
                v-model="field.model"
                :debounce="field.debounce"
                :label="field.required ? `${field.label}${INPUT_REQUIRED}` : field.label"
                :mask="field.mask"
                :name="field.name"
                :required="field.required"
                :rules="field.rule"
                :type="field.inputType"
                outlined
              />
            </template>
            <template v-if="field.formFieldType === FORM_FIELD_TYPE.SELECT">
              <q-select
                v-model="field.model"
                :label="field.required ? `${field.label}${INPUT_REQUIRED}` : field.label"
                :options="field.options"
                :required="field.required"
                :rules="field.rule"
                lazy-rules
                outlined
              />
            </template>
          </template>

          <div class="row justify-between q-mt-md">
            <q-btn
              :disable="storeNewEmployee.loading"
              :type="BUTTON_TYPE.RESET"
              color="primary"
              label="Сбросить"
              no-caps
              outline
            />
            <q-btn
              :disable="storeNewEmployee.disabledSubmitButton"
              :loading="storeNewEmployee.loading"
              :type="BUTTON_TYPE.SUBMIT"
              color="primary"
              label="Добавить"
              no-caps
            />
          </div>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, } from 'vue'

import { BUTTON_TYPE, FORM_FIELD_TYPE, } from '@/types/enums'

import { useStoreNewEmployee, } from '@/stores/store-new-employee'

import { INPUT_REQUIRED, } from '@/utils/constants'

const storeNewEmployee = useStoreNewEmployee()

const refForm: Ref = ref(null)

watch(
  () => storeNewEmployee.formEmployee,
  () => {
    refForm.value?.validate()
      .then((success: boolean) => success
        ? storeNewEmployee.setValidForm()
        : storeNewEmployee.unsetValidForm())
  },
  { deep: true, }
)
</script>
