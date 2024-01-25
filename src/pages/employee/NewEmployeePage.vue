<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForm"
      @reset="reset"
      @submit.prevent="storeNewEmployee.add(employeeFormRef)"
    >
      <EssentialForm
        card-style="min-width: 300px; max-width: 700px;"
        description="Создайте нового сотрудника!"
        title="Новый сотрудник"
      >
        <template #fields>
          <template
            v-for="field in employeeFormRef"
            :key="field.id"
          >
            <template v-if="field.formFieldType === FORM_FIELD_TYPE.INPUT">
              <q-input
                v-model="field.model"
                :debounce="field.debounce"
                :mask="field.mask"
                :name="field.name"
                :required="field.required"
                :rules="field.rule"
                :type="field.inputType"
                class="q-mb-sm"
                label-slot
                outlined
              >
                <template #label>
                  <span>{{ field.label }}</span>
                  <sup
                    v-if="field.required"
                    class="text-red"
                  >{{ INPUT_REQUIRED }}</sup>
                </template>
              </q-input>
            </template>
            <template v-if="field.formFieldType === FORM_FIELD_TYPE.SELECT">
              <q-select
                v-model="field.model"
                :options="field.options"
                :required="field.required"
                :rules="field.rule"
                label-slot
                outlined
              >
                <template #label>
                  <span>{{ field.label }}</span>
                  <sup
                    v-if="field.required"
                    class="text-red"
                  >{{ INPUT_REQUIRED }}</sup>
                </template>
              </q-select>
            </template>
          </template>
        </template>

        <template #buttons>
          <div class="row justify-between q-mt-md">
            <q-btn
              :disable="storeNewEmployee.loading"
              :type="BUTTON_TYPE.RESET"
              color="primary"
              label="Сбросить"
              no-caps
              outline
              rounded
            />
            <q-btn
              :disable="storeNewEmployee.disabledSubmitButton"
              :loading="storeNewEmployee.loading"
              :type="BUTTON_TYPE.SUBMIT"
              class="col-grow"
              color="primary"
              label="Добавить"
              style="margin-left: 15px;"
              no-caps
              rounded
            />
          </div>
        </template>
      </EssentialForm>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, nextTick, } from 'vue'

import { BUTTON_TYPE, FORM_FIELD_TYPE, } from '@/types/enums'
import type { FormField, } from '@/types/models'

import { newEmployeeForm, } from '@/stores/employeeForms'
import { useStoreNewEmployee, } from '@/stores/store-new-employee'

import { INPUT_REQUIRED, } from '@/utils/constants'

import EssentialForm from '@/components/form/EssentialForm.vue'

const storeNewEmployee = useStoreNewEmployee()

const refForm: Ref = ref(null)
const employeeFormRef: Ref = ref(newEmployeeForm)

const reset = async () => {
  if (refForm.value) {
    employeeFormRef.value.forEach((item: FormField) => {
      item.model = ''

      return item
    })
    await nextTick()
    refForm.value.resetValidation()
  }
}

const validate = async () => {
  await nextTick()
  refForm.value?.validate()
    .then((success: boolean) => (storeNewEmployee.valid = success))
}

watch(
  () => employeeFormRef,
  () => {
    validate()
  },
  { deep: true, }
)
</script>
