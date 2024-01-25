<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForgotForm"
      @reset="reset"
      @submit.prevent="storeAuth.onForgot(currentAuthForm)"
    >
      <EssentialForm
        card-style="min-width: 300px; max-width: 700px;"
        description="Для начала работы восстановите доступ в ваш аккаунт!"
        title="Восстановить доступ"
      >
        <template #fields>
          <q-input
            v-for="field in currentAuthForm"
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
import { ref, watch, type Ref, computed, nextTick, } from 'vue'

import { AUTH_TYPE, BUTTON_TYPE, INPUT_TYPE, } from '@/types/enums'
import type { FormField, } from '@/types/models'

import { getCurrentAuthForm, } from '@/stores/authForms'
import { useStoreAuth, } from '@/stores/store-auth'

import { INPUT_REQUIRED, } from '@/utils/constants'

import EssentialForm from '@/components/form/EssentialForm.vue'

const storeAuth = useStoreAuth()

const refForgotForm: Ref = ref(null)

const currentAuthForm = computed(() => getCurrentAuthForm(AUTH_TYPE.FORGOT_PASSWORD))

const reset = async () => {
  if (refForgotForm.value) {
    currentAuthForm.value.forEach((item: FormField) => {
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

watch(
  () => currentAuthForm,
  () => {
    validate()
  },
  { deep: true, }
)
</script>
