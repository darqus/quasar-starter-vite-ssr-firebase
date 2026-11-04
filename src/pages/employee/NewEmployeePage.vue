<script setup lang="ts">
import { computed } from 'vue'

import {
  createEmployee,
  createNewEmployeeFields,
  EMPLOYEE_FIELD,
} from '@/features/employees'
import { getFieldModel, getFieldString } from '@/shared/form/access'
import EssentialForm from '@/shared/form/EssentialForm.vue'
import FormFields from '@/shared/form/FormFields.vue'
import { BUTTON_TYPE } from '@/shared/form/types'
import { useForm } from '@/shared/form/useForm'
import { createFeedback } from '@/shared/ui/feedback'
import { newEmployeeSchema } from '@/validation/schemas'

const { run } = createFeedback()

// Variant A: useForm with Zod schema for New Employee
const { fields, formRef, reset, submit, isValid, isSubmitting, errors } =
  useForm({
    fields: createNewEmployeeFields(),
    schema: newEmployeeSchema,
    validateOnChange: true,
    onSubmit: async () => {
      const name = getFieldString(fields, EMPLOYEE_FIELD.FIO)
      const email = getFieldString(fields, EMPLOYEE_FIELD.LOGIN)
      const position = getFieldString(fields, EMPLOYEE_FIELD.POSITION)
      const level = getFieldString(fields, EMPLOYEE_FIELD.LEVEL)
      const rate = getFieldModel(fields, EMPLOYEE_FIELD.RATE)
      const description = getFieldString(fields, EMPLOYEE_FIELD.DESCRIPTION)

      const success = await run(
        () =>
          createEmployee({
            name,
            email,
            position,
            level,
            rate: rate === null ? '' : String(rate),
            description,
          }),
        {
          successMessage: `Сотрудник "${name}" добавлен`,
          successIcon: 'how_to_reg',
        }
      )

      if (success) {
        await reset()
      }
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
          <FormFields
            :errors="errors"
            :fields="fields"
          />
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
