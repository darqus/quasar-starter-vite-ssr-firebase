<script setup lang="ts">
import { nextTick, type Ref, ref, watch } from 'vue'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

import { Loading } from 'quasar'

import { auth } from 'src/boot/firebase'
import EssentialForm from 'src/components/form/EssentialForm.vue'
import FormFields from 'src/components/form-fields/FormFields.vue'
import { getCurrentAuthFields } from 'src/stores/authForms'
import { useStoreAuth } from 'src/stores/store-auth'
import { AUTH_TYPE, BUTTON_TYPE } from 'src/types/form'
import { ROUTE_TYPE } from 'src/types/route'
import { getFieldString } from 'src/utils/form'

const storeAuth = useStoreAuth()
const router = useRouter()

const refLoginForm: Ref = ref(null)

const currentAuthFormRef = ref(getCurrentAuthFields(AUTH_TYPE.LOGIN_EMAIL))

const reset = async () => {
  if (refLoginForm.value) {
    currentAuthFormRef.value.forEach((item) => {
      item.model = ''

      return item
    })
    await nextTick()
    refLoginForm.value.resetValidation()
  }
}

const validate = async () => {
  if (refLoginForm.value) {
    await nextTick()
    const isValid = await refLoginForm.value.validate()
    storeAuth.valid = isValid
    return isValid
  }
  return false
}

const onLogin = async () => {
  const isValid = await validate()
  if (!isValid) {
    return
  }

  Loading.show()
  const email = getFieldString(currentAuthFormRef, 'login')
  const password = getFieldString(currentAuthFormRef, 'password')
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      void reset()
      storeAuth.onLoginSuccess(router)
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
      ref="refLoginForm"
      @reset="reset"
      @submit.prevent="onLogin"
    >
      <EssentialForm
        card-style="min-width: 300px; max-width: 700px;"
        description="Для начала работы войдите в ваш аккаунт!"
        title="Вход"
      >
        <template #fields>
          <FormFields :fields="currentAuthFormRef" />
        </template>

        <template #buttons>
          <div class="row q-pt-md">
            <q-btn
              :disable="storeAuth.loading"
              :type="BUTTON_TYPE.RESET"
              color="primary"
              label="Очистить"
              no-caps
              outline
              rounded
            />
            <q-btn
              :disable="storeAuth.disabledSubmitButton"
              :loading="storeAuth.loading"
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
                  :to="ROUTE_TYPE.FORGOT"
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
                  :to="ROUTE_TYPE.REGISTER"
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
