<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refRegisterForm"
      @reset="reset"
      @submit.prevent="storeAuth.onRegister"
    >
      <q-card style="min-width: 300px">
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
                    Для начала работы пройдите регистрацию!
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
                        Регистрация
                      </div>
                    </div>
                  </div>

                  <q-input
                    v-for="field in storeAuth.formsAuth[AUTH_TYPE.REGISTER]"
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

                  <!-- <q-toggle
                      v-model="storeAuth.accept"
                      label="I accept the license and terms"
                    /> -->

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
                      label="Зарегистрироваться"
                      style="margin-left: 15px;"
                      no-caps
                      rounded
                    />
                  </div>

                  <div class="q-mt-lg">
                    <div class="q-mt-sm">
                      Уже есть аккаунт?
                      <router-link
                        :to="ROUTE_TYPE.LOGIN"
                        class="text-primary"
                      >
                        Войти
                      </router-link>
                    </div>
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

import { AUTH_TYPE, BUTTON_TYPE, INPUT_TYPE, ROUTE_TYPE, } from '@/types/enums'

import { useStoreAuth, } from '@/stores/store-auth'

import { INPUT_REQUIRED, } from '@/utils/constants'

const storeAuth = useStoreAuth()

const refRegisterForm: Ref = ref(null)

const reset = () => {
  storeAuth.onResetForm(AUTH_TYPE.REGISTER)
  if (refRegisterForm.value) {
    refRegisterForm.value.resetValidation()
  }
}

onUnmounted(() => {
  reset()
})

watch(
  () => storeAuth.formsAuth[AUTH_TYPE.REGISTER],
  () => {
    refRegisterForm.value?.validate()
      .then((success: boolean) => success
        ? storeAuth.setValidForm()
        : storeAuth.unsetValidForm())
  },
  { deep: true, }
)
</script>
