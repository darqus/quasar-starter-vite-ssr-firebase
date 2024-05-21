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
          <q-input
            v-for="field in currentAuthFormRef"
            :key="field.id"
            v-model="field.model"
            :debounce="field.debounce"
            :mask="field.mask"
            :name="field.name"
            :required="field.required"
            :rules="field.rule"
            :type="field.inputType === INPUT_TYPE.PASSWORD ? storeAuth.currentInputType : field.inputType"
            class="q-mb-sm"
            label-slot
          >
            <template #prepend>
              <q-icon
                :name="field.iconPrepend"
                class="cursor-pointer"
              />
            </template>
            <template #append>
              <q-icon
                v-if="field.inputType === INPUT_TYPE.PASSWORD"
                :name="storeAuth.iconPassword"
                class="cursor-pointer"
                @click="storeAuth.togglePasswordVisible"
              />
            </template>
            <template #label>
              <span>{{ field.label }}</span>
              <sup
                v-if="field.required"
                class="text-red"
              >{{ INPUT_REQUIRED }}</sup>
            </template>
          </q-input>
        </template>

        <template #buttons>
          <div class="row">
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
              style="margin-left: 15px;"
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

<script setup lang="ts">
import { ref, watch, type Ref, nextTick, } from 'vue'

import { signInWithEmailAndPassword, } from 'firebase/auth'

import { Loading, } from 'quasar'

import { AUTH_TYPE, BUTTON_TYPE, INPUT_TYPE, ROUTE_TYPE, } from 'src/types/enums'
import type { FormField, } from 'src/types/models'

import { getCurrentAuthForm, } from 'src/stores/authForms'
import { useStoreAuth, } from 'src/stores/store-auth'

import { INPUT_REQUIRED, } from 'src/utils/constants'

import EssentialForm from 'src/components/form/EssentialForm.vue'

import { auth, } from 'src/boot/firebase'

const storeAuth = useStoreAuth()

const refLoginForm: Ref = ref(null)

const currentAuthFormRef = ref(getCurrentAuthForm(AUTH_TYPE.LOGIN_EMAIL))

const reset = async () => {
  if (refLoginForm.value) {
    currentAuthFormRef.value.forEach((item: FormField) => {
      item.model = ''

      return item
    })
    await nextTick()
    refLoginForm.value.resetValidation()
  }
}

const validate = async () => {
  await nextTick()
  refLoginForm.value?.validate()
    .then((success: boolean) => (storeAuth.valid = success))
}

const onLogin = () => {
  Loading.show()
  signInWithEmailAndPassword(
    auth,
    currentAuthFormRef.value[0].model,
    currentAuthFormRef.value[1].model
  )
    .then(() => {
      reset()
      storeAuth.onLoginSuccess()
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
    validate()
  },
  { deep: true, }
)
</script>
