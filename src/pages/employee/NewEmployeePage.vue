<script setup lang="ts">
import { computed } from 'vue'

import { Loading } from 'quasar'

import { addDoc } from 'src/boot/firebase'
import EssentialForm from 'src/components/form/EssentialForm.vue'
import FormFields from 'src/components/form-fields/FormFields.vue'
import { useForm } from 'src/composables/useForm'
import { getNewEmployeeFields } from 'src/stores/employeeForms'
import { EMPLOYEE_FIELD } from 'src/types'
import { BUTTON_TYPE } from 'src/types/form'
import { getFieldString } from 'src/utils/form'
import { createNotify } from 'src/utils/notify'
import { newEmployeeSchema } from 'src/validation/schemas'

// Variant A: useForm with Zod schema for New Employee
const { fields, formRef, reset, submit, isValid, isSubmitting } = useForm({
  fields: getNewEmployeeFields,
  schema: newEmployeeSchema,
  validateOnChange: true,
  onSubmit: async () => {
    Loading.show()
    const name = getFieldString(fields, EMPLOYEE_FIELD.FIO)
    const email = getFieldString(fields, EMPLOYEE_FIELD.LOGIN)
    const position = getFieldString(fields, EMPLOYEE_FIELD.POSITION)
    const level = getFieldString(fields, EMPLOYEE_FIELD.LEVEL)
    const rate = getFieldString(fields, EMPLOYEE_FIELD.RATE)
    const description = getFieldString(fields, EMPLOYEE_FIELD.DESCRIPTION)

    return addDoc('employees', {
      name,
      email,
      position,
      level,
      rate,
      description,
    })
      .then(async () => {
        createNotify(`Сотрудник "${name}" добавлен`, 'green-4', 'how_to_reg')
        await reset()
      })
      .catch((error) => {
        createNotify(error)
      })
      .finally(() => {
        Loading.hide()
      })
  },
})

const disabledSubmitButton = computed(() => !isValid.value)
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="formRef"
      @reset="reset"
      @submit.prevent="submit"
    >
      <EssentialForm
        card-style="min-width: 300px; max-width: 700px;"
        description="Создайте нового сотрудника!"
        title="Новый сотрудник"
      >
        <template #fields>
          <FormFields :fields="fields" />
        </template>

        <template #buttons>
          <div class="row justify-between q-mt-md">
            <q-btn
              :disable="isSubmitting"
              :type="BUTTON_TYPE.RESET"
              color="primary"
              label="Сбросить"
              no-caps
              outline
              rounded
            />
            <q-btn
              :disable="disabledSubmitButton"
              :loading="isSubmitting"
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
