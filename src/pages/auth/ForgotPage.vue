<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForgotForm"
      @reset="reset"
      @submit.prevent="storeAuth.onForgot"
    >
      <q-card style="min-width: 300px; max-width: 700px;">
        <q-card-section>
          <div class="row">
            <div class="col-0 col-sm-5 bg-primary xs-hide">
              <div class="row full-width q-px-xl q-pb-xl full-height flex flex-center">
                <div class="text-right">
                  <div
                    class="text-h4 text-white"
                    style="min-width: 220px"
                  >
                    Добро пожаловать
                  </div>
                  <div class="text-white q-my-sm text-subtitle1">
                    Для начала работы восстановите доступ в ваш аккаунт!
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-7">
              <div class="row q-ml-sm q-mt-sm sm-and-up-hide">
                <div class="col-12 text-subtitle1">
                  <router-link
                    class="text-primary text-decoration-none"
                    to="/"
                  >
                    На Главную
                  </router-link>
                </div>
              </div>
              <div class="row q-pa-sm-sm q-pa-md">
                <div class="col-12">
                  <div class="q-mb-xl">
                    <div class="flex justify-center">
                      <div class="text-h5 q-my-none text-weight-bold text-primary">
                        Восстановить доступ
                      </div>
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
                    lazy-rules
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
        </q-card-section>
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
