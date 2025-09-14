<script setup lang="ts">
import { computed, nextTick, type Ref, ref, watch } from 'vue'

import { Loading } from 'quasar'

import { addDoc } from 'src/boot/firebase'
import EssentialForm from 'src/components/form/EssentialForm.vue'
import FormFields from 'src/components/form-fields/FormFields.vue'
import { getNewEmployeeFields } from 'src/stores/employeeForms'
import { EMPLOYEE_FIELD } from 'src/types'
import { BUTTON_TYPE } from 'src/types/form'
import { getFieldString } from 'src/utils/form'
import { createNotify } from 'src/utils/notify'

const loading = ref(false)
const valid = ref(false)
const refForm: Ref = ref(null)
const employeeFormRef = ref(getNewEmployeeFields)

const toggleLoading = () => {
  loading.value = !loading.value
}

const disabledSubmitButton = computed(() => !valid.value)

const reset = async () => {
  if (refForm.value) {
    employeeFormRef.value.forEach((item) => {
      item.model = ''

      return item
    })
    await nextTick()
    refForm.value.resetValidation()
  }
}

const validate = async () => {
  if (refForm.value) {
    await nextTick()
    const isValid = await refForm.value.validate()
    valid.value = isValid
    return isValid
  }
  return false
}

const add = async () => {
  const isValid = await validate()
  if (!isValid) {
    return
  }

  toggleLoading()
  Loading.show()
  const name = getFieldString(employeeFormRef, EMPLOYEE_FIELD.FIO)
  const email = getFieldString(employeeFormRef, EMPLOYEE_FIELD.LOGIN)
  const position = getFieldString(employeeFormRef, EMPLOYEE_FIELD.POSITION)
  const level = getFieldString(employeeFormRef, EMPLOYEE_FIELD.LEVEL)
  const rate = getFieldString(employeeFormRef, EMPLOYEE_FIELD.RATE)
  const description = getFieldString(employeeFormRef, EMPLOYEE_FIELD.DESCRIPTION)

  addDoc('employees', {
    name,
    email,
    position,
    level,
    rate,
    description,
  })
    .then(() => {
      createNotify(`Сотрудник "${name}" добавлен`, 'green-4', 'how_to_reg')
      void reset()
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
    void validate()
  },
  { deep: true }
)
</script>

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
          <FormFields :fields="employeeFormRef" />
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
              style="margin-left: 15px"
              no-caps
              rounded
            />
          </div>
        </template>
      </EssentialForm>
    </q-form>
  </q-page>
</template>
