<script setup lang="ts">
import { AUTH_FIELD, createAuthFields, useAuthActions } from '@/features/auth'
import { getFieldString } from '@/shared/form/access'
import EssentialForm from '@/shared/form/EssentialForm.vue'
import FormFields from '@/shared/form/FormFields.vue'
import { AUTH_TYPE, BUTTON_TYPE } from '@/shared/form/types'
import { useForm } from '@/shared/form/useForm'
import { ROUTE_NAME } from '@/types/route'
import { loginSchema } from '@/validation/schemas'

const { login } = useAuthActions()

// Variant A: useForm with Zod schema inside composable
const { fields, formRef, reset, submit, isValid, isSubmitting, errors } =
  useForm({
    fields: createAuthFields(AUTH_TYPE.LOGIN_EMAIL),
    schema: loginSchema,
    validateOnChange: true,
    onSubmit: async () => {
      const email = getFieldString(fields, AUTH_FIELD.LOGIN)
      const password = getFieldString(fields, AUTH_FIELD.PASSWORD)
      const success = await login(email, password)

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
        description="Для начала работы войдите в ваш аккаунт!"
        title="Вход"
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
              :disable="isSubmitting"
              :type="BUTTON_TYPE.RESET"
              color="primary"
              label="Очистить"
              no-caps
              outline
              rounded
            />
            <q-btn
              :disable="!isValid"
              :loading="isSubmitting"
              :type="BUTTON_TYPE.SUBMIT"
              class="col-grow"
              color="primary"
              label="Войти"
              style="margin-left: 15px"
              no-caps
              rounded
            />
          </div>

          <div class="row q-mt-md">
            <div class="q-mt-lg">
              <div class="q-mt-sm">
                Забыли пароль?
                <router-link
                  :to="{ name: ROUTE_NAME.FORGOT }"
                  class="text-primary"
                >
                  Восстановить доступ
                </router-link>
              </div>
            </div>

            <div class="q-mt-lg">
              <div class="q-mt-sm">
                Нет аккаунта?
                <router-link
                  :to="{ name: ROUTE_NAME.REGISTER }"
                  class="text-primary"
                >
                  Зарегистрироваться
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </EssentialForm>
    </q-form>
  </q-page>
</template>
