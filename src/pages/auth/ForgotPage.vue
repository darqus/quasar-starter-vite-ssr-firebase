<script setup lang="ts">
import { AUTH_FIELD, createAuthFields, useAuthActions } from '@/features/auth'
import { getFieldString } from '@/shared/form/access'
import EssentialForm from '@/shared/form/EssentialForm.vue'
import FormFields from '@/shared/form/FormFields.vue'
import { AUTH_TYPE, BUTTON_TYPE } from '@/shared/form/types'
import { useForm } from '@/shared/form/useForm'
import { forgotSchema } from '@/validation/schemas'

const { requestPasswordReset } = useAuthActions()

// Variant A: useForm with Zod schema
const { fields, formRef, reset, submit, isValid, isSubmitting, errors } =
  useForm({
    fields: createAuthFields(AUTH_TYPE.FORGOT_PASSWORD),
    schema: forgotSchema,
    validateOnChange: true,
    onSubmit: async () => {
      const email = getFieldString(fields, AUTH_FIELD.LOGIN)
      const success = await requestPasswordReset(email)

      if (success) {
        await reset()
      }
    },
  })
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
        description="Для начала работы восстановите доступ в ваш аккаунт!"
        title="Восстановить доступ"
      >
        <template #fields>
          <FormFields
            :errors="errors"
            :fields="fields"
          />
        </template>

        <template #buttons>
          <div class="row q-pt-md">
            <q-btn
              :disable="!isValid"
              :loading="isSubmitting"
              :type="BUTTON_TYPE.SUBMIT"
              class="full-width"
              color="primary"
              label="Сбросить пароль"
              no-caps
              rounded
            />
          </div>
        </template>
      </EssentialForm>
    </q-form>
  </q-page>
</template>
