<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForgotForm"
      @reset="reset"
      @submit.prevent="storeAuth.onForgot"
    >
      <EssentialForm
        card-style="min-width: 300px; max-width: 700px;"
        description="Для начала работы восстановите доступ в ваш аккаунт!"
        title="Восстановить доступ"
      >
        <template #fields>
          <q-input
            v-for="field in storeAuth.formsAuth[AUTH_TYPE.FORGOT_PASSWORD]"
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

<script setup lang="ts">
import { ref, watch, type Ref, onUnmounted, } from 'vue'

import { AUTH_TYPE, BUTTON_TYPE, INPUT_TYPE, } from '@/types/enums'

import { useStoreAuth, } from '@/stores/store-auth'

import { INPUT_REQUIRED, } from '@/utils/constants'

import EssentialForm from '@/components/form/EssentialForm.vue'

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
      .then((success: boolean) => (storeAuth.valid = success))
  },
  { deep: true, }
)
</script>
