<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForgotForm"
      @reset="reset"
      @submit.prevent="storeAuth.onForgot"
    >
      <q-card style="min-width: 300px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            Восстановить доступ
          </div>
        </q-card-section>

        <q-card-section>
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
            outlined
          >
            <template #prepend>
              <q-icon
                :name="field.iconPrepend"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <div class="row justify-center">
            <q-btn
              :disable="storeAuth.disabledSubmitButton"
              :loading="storeAuth.loading"
              :type="BUTTON_TYPE.SUBMIT"
              class="full-width"
              color="primary"
              label="Сбросить пароль"
              no-caps
            />
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
