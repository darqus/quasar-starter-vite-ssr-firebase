<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refLoginForm"
      @reset="reset"
      @submit.prevent="storeAuth.onLogin"
    >
      <q-card style="min-width: 300px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <div>Вход</div>
          </div>
        </q-card-section>

        <q-card-section>
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
            outlined
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

          <div class="row -justify-between">
            <q-btn
              :disable="storeAuth.loading"
              :type="BUTTON_TYPE.RESET"
              color="primary"
              label="Очистить"
              no-caps
              outline
            />
            <q-btn
              :disable="storeAuth.disabledSubmitButton"
              :loading="storeAuth.loading"
              :type="BUTTON_TYPE.SUBMIT"
              color="primary"
              label="Войти"
              style="width: 200px; margin-left: 15px;"
              no-caps
            />
          </div>

          <div class="row q-mt-md">
            <q-btn
              class="full-width"
              color="primary"
              size="12px"
              no-caps
              outline
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
