<script setup lang="ts">
import { nextTick, type Ref, ref, watch } from 'vue'

import { sendPasswordResetEmail } from 'firebase/auth'

import { Loading } from 'quasar'

import { auth } from 'src/boot/firebase'
import EssentialForm from 'src/components/form/EssentialForm.vue'
import FormFields from 'src/components/form-fields/FormFields.vue'
import { getCurrentAuthFields } from 'src/stores/authForms'
import { useStoreAuth } from 'src/stores/store-auth'
import { AUTH_TYPE, BUTTON_TYPE } from 'src/types/form'

const storeAuth = useStoreAuth()

const refForgotForm: Ref = ref(null)

const currentAuthFormRef = ref(getCurrentAuthFields(AUTH_TYPE.FORGOT_PASSWORD))

const reset = async () => {
  if (refForgotForm.value) {
    currentAuthFormRef.value.forEach((item) => {
      item.model = ''

      return item
    })
    await nextTick()
    refForgotForm.value.resetValidation()
  }
}

const validate = async () => {
  await nextTick()
  refForgotForm.value
    ?.validate()
    .then((success: boolean) => (storeAuth.valid = success))
}

const onForgot = () => {
  Loading.show()
  sendPasswordResetEmail(auth, currentAuthFormRef.value[0]?.model ?? '')
    .then(() => {
      storeAuth.onForgotSuccess()
      void reset()
    })
    .catch((error) => {
      storeAuth.createErrorMessage(error)
    })
    .finally(() => {
      Loading.hide()
    })
}

watch(
  () => currentAuthFormRef,
  () => {
    void validate()
  },
  { deep: true }
)
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForgotForm"
      @reset="reset"
      @submit.prevent="onForgot"
    >
      <EssentialForm
        card-style="min-width: 300px; max-width: 700px;"
        description="Для начала работы восстановите доступ в ваш аккаунт!"
        title="Восстановить доступ"
      >
        <template #fields>
          <FormFields :fields="currentAuthFormRef" />
        </template>

        <template #buttons>
          <div class="row">
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
