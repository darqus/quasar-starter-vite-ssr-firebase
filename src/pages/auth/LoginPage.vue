<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refLoginForm"
      @reset="reset"
      @submit.prevent="storeAuth.onLogin"
    >
      <q-card style="min-width: 300px">
        <div class="row">
          <div class="col-sm-5 bg-blue-8 xs-hide text-right">
            <div class="bg-blue-6 text-white q-pa-md">
              <div
                class="text-h6 text-white"
                style="min-width: 220px"
              >
                Добро пожаловать
              </div>
            </div>
            <div class="bg-blue-5 text-white q-pa-md">
              <div class="text-white q-my-sm text-subtitle1">
                Для начала работы войдите в ваш аккаунт!
              </div>
            </div>
          </div>

          <div class="col-sm-7">
            <div class="q-pa-lg">
              <div class="row">
                <div class="col-12 text-subtitle1">
                  <router-link
                    class="text-primary"
                    to="/"
                  >
                    На Главную
                  </router-link>
                </div>
                <div class="col-12">
                  <div class="q-mb-xl">
                    <div class="flex justify-center">
                      <div class="text-h5 q-my-none text-weight-bold text-primary">
                        Вход
                      </div>
                    </div>
                  </div>

                  <q-input
                    v-for="field in storeAuth.formsAuth[AUTH_TYPE.LOGIN_EMAIL]"
                    :key="field.id"
                    v-model="field.model"
                    :debounce="field.debounce"
                    :label="field.required ? `${field.label}${INPUT_REQUIRED}` : field.label"
                    :mask="field.mask"
                    :name="field.name"
                    :required="field.required"
                    :rules="field.rule"
                    :type="field.inputType === INPUT_TYPE.PASSWORD ? storeAuth.currentInputType : field.inputType"
                    class="q-mb-sm"
                    lazy-rules
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
                  </q-input>

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
                    <q-btn
                      class="full-width"
                      color="primary"
                      size="12px"
                      no-caps
                      outline
                      rounded
                      @click="$router.push(ROUTE_TYPE.FORGOT)"
                    >
                      Забыли пароль?
                    </q-btn>
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
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, onUnmounted, } from 'vue'

import { AUTH_TYPE, BUTTON_TYPE, INPUT_TYPE, ROUTE_TYPE, } from '@/types/enums'

import { useStoreAuth, } from '@/stores/store-auth'

import { INPUT_REQUIRED, } from '@/utils/constants'

const storeAuth = useStoreAuth()

const refLoginForm: Ref = ref(null)

const reset = () => {
  storeAuth.onResetForm(AUTH_TYPE.LOGIN_EMAIL)
  if (refLoginForm.value) {
    refLoginForm.value.resetValidation()
  }
}

onUnmounted(() => {
  reset()
})

watch(
  () => storeAuth.formsAuth[AUTH_TYPE.LOGIN_EMAIL],
  () => {
    refLoginForm.value?.validate()
      .then((success: boolean) => success
        ? storeAuth.setValidForm()
        : storeAuth.unsetValidForm())
  },
  { deep: true, }
)
</script>
