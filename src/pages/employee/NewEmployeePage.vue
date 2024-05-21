<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForm"
      @reset="reset"
      @submit.prevent="add"
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
              :disable="loading"
              :type="BUTTON_TYPE.RESET"
              color="primary"
              label="Сбросить"
              no-caps
              outline
              rounded
            />
            <q-btn
              :disable="disabledSubmitButton"
              :loading="loading"
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
import { ref, watch, type Ref, nextTick, computed, } from 'vue'

import { Loading, } from 'quasar'

import { BUTTON_TYPE, FORM_FIELD_TYPE, } from 'src/types/enums'
import type { FormField, } from 'src/types/models'

import { newEmployeeForm, } from 'src/stores/employeeForms'

import { INPUT_REQUIRED, } from 'src/utils/constants'
import { createNotify, } from 'src/utils/notify'

import EssentialForm from 'src/components/form/EssentialForm.vue'

import { addDoc, } from 'src/boot/firebase'

const loading = ref(false)
const valid = ref(false)
const refForm: Ref = ref(null)
const employeeFormRef = ref(newEmployeeForm)

const toggleLoading = () => {
  loading.value = !loading.value
}

const disabledSubmitButton = computed(() => !valid.value)

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
    .then((success: boolean) => (valid.value = success))
}

const add = () => {
  toggleLoading()
  Loading.show()
  addDoc('employees', {
    name: employeeFormRef.value[0].model,
    email: employeeFormRef.value[1].model,
    position: employeeFormRef.value[2].model,
    level: employeeFormRef.value[3].model,
    rate: employeeFormRef.value[4].model,
    description: employeeFormRef.value[5].model,
  })
    .then(() => {
      createNotify(`Сотрудник "${employeeFormRef.value[0].model}" добавлен`, 'green-4', 'how_to_reg')
      reset()
    })
    .catch((error) => {
      createNotify(error)
    })
    .finally(() => {
      toggleLoading()
      Loading.hide()
    })
}

watch(
  () => employeeFormRef,
  () => {
    validate()
  },
  { deep: true, }
)
</script>
