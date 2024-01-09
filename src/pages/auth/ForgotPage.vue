<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForgotForm"
      @reset="reset"
      @submit.prevent="storeAuth.onForgot"
    >
      <q-card
        class="shadow-up-1"
        style="min-width: 300px; max-width: 700px;"
      >
        <div class="row">
          <q-card class="col-sm-5 bg-blue-8 xs-hide text-right">
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
                Для начала работы восстановите доступ в ваш аккаунт!
              </div>
            </div>
          </q-card>

          <div class="col-sm-7 shadow-1">
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
                  <div class="flex justify-center">
                    <div class="text-h5 q-my-lg text-weight-bold text-primary">
                      Восстановить доступ
                    </div>
                  </div>

                  <q-input
                    v-for="field in storeAuth.formsAuth[AUTH_TYPE.FORGOT_PASSWORD]"
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
                  >
                    <template #prepend>
                      <q-icon
                        :name="field.iconPrepend"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>

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

import { AUTH_TYPE, BUTTON_TYPE, INPUT_TYPE, } from '@/types/enums'

import { useStoreAuth, } from '@/stores/store-auth'

import { INPUT_REQUIRED, } from '@/utils/constants'

const storeAuth = useStoreAuth()

const refForgotForm: Ref = ref(null)

const reset = () => {
  storeAuth.onResetForm(AUTH_TYPE.FORGOT_PASSWORD)
  if (refForgotForm.value) {
    refForgotForm.value.resetValidation()
  }
}

onUnmounted(() => {
  reset()
})

watch(
  () => storeAuth.formsAuth[AUTH_TYPE.FORGOT_PASSWORD],
  () => {
    refForgotForm.value?.validate()
      .then((success: boolean) => success
        ? storeAuth.setValidForm()
        : storeAuth.unsetValidForm())
  },
  { deep: true, }
)
</script>
