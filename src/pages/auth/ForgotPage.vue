<script setup lang="ts">
import { watch } from 'vue'

import { sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'vue-router'

import { Loading } from 'quasar'

import { auth } from '@/boot/firebase'
import FormFields from '@/components/form-fields/FormFields.vue'
import EssentialForm from '@/components/form/EssentialForm.vue'
import { useForm } from '@/composables/useForm'
import { getCurrentAuthFields } from '@/stores/authForms'
import { useStoreAuth } from '@/stores/store-auth'
import { AUTH_FIELD } from '@/types'
import { AUTH_TYPE, BUTTON_TYPE } from '@/types/form'
import { getFieldString } from '@/utils/form'
import { forgotSchema } from '@/validation/schemas'

const storeAuth = useStoreAuth()
const router = useRouter()

// Variant A: useForm with Zod schema
const { fields, formRef, reset, submit, isValid } = useForm({
  fields: getCurrentAuthFields(AUTH_TYPE.FORGOT_PASSWORD),
  schema: forgotSchema,
  validateOnChange: true,
  onSubmit: async () => {
    Loading.show()
    const email = getFieldString(fields, AUTH_FIELD.LOGIN)
    return sendPasswordResetEmail(auth, email)
      .then(async () => {
        storeAuth.onForgotSuccess(router)
        await reset()
      })
      .catch((error) => {
        storeAuth.createErrorMessage(error)
      })
      .finally(() => {
        Loading.hide()
      })
  },
})

watch(isValid, (v) => {
  storeAuth.valid = v
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
          <FormFields :fields="fields" />
        </template>

        <template #buttons>
          <div class="row q-pt-md">
            <q-btn
              :disable="storeAuth.disabledSubmitButton"
              :loading="storeAuth.loading"
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
