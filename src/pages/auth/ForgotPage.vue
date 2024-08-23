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
          <q-input
            v-for="field in currentAuthFormRef"
            :key="field.id"
            v-model.trim="field.model"
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
import { ref, watch, type Ref, nextTick, } from 'vue'

import { sendPasswordResetEmail, } from 'firebase/auth'

import { Loading, } from 'quasar'

import { AUTH_TYPE, BUTTON_TYPE, INPUT_TYPE, } from 'src/types/enums'
import type { FormField, } from 'src/types/models'

import { getCurrentAuthForm, } from 'src/stores/authForms'
import { useStoreAuth, } from 'src/stores/store-auth'

import { INPUT_REQUIRED, } from 'src/utils/constants'

import EssentialForm from 'src/components/form/EssentialForm.vue'

import { auth, } from 'src/boot/firebase'

const storeAuth = useStoreAuth()

const refForgotForm: Ref = ref(null)

const currentAuthFormRef = ref(getCurrentAuthForm(AUTH_TYPE.FORGOT_PASSWORD))

const reset = async () => {
  if (refForgotForm.value) {
    currentAuthFormRef.value.forEach((item: FormField) => {
      item.model = ''

      return item
    })
    await nextTick()
    refForgotForm.value.resetValidation()
  }
}

const validate = async () => {
  await nextTick()
  refForgotForm.value?.validate()
    .then((success: boolean) => (storeAuth.valid = success))
}

const onForgot = () => {
  Loading.show()
  sendPasswordResetEmail(auth, currentAuthFormRef.value[0].model)
    .then(() => {
      storeAuth.onForgotSuccess()
      reset()
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
