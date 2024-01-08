<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refRegisterForm"
      @reset="reset"
      @submit.prevent="storeAuth.onRegister"
    >
      <q-card style="min-width: 300px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            Регистрация
          </div>
        </q-card-section>

        <q-card-section>
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

          <!-- <q-toggle
          v-model="storeAuth.accept"
          label="I accept the license and terms"
        /> -->

          <div class="row justify-center -justify-between">
            <q-btn
              v-if="false"
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
              class="full-width"
              color="primary"
              label="Зарегистрироваться"
              no-caps
            />
          </div>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, onUnmounted, nextTick, } from 'vue'

import { AUTH_TYPE, BUTTON_TYPE, INPUT_TYPE, } from '@/types/enums'

import { useStoreAuth, } from '@/stores/store-auth'

import { INPUT_REQUIRED, } from '@/utils/constants'

const storeAuth = useStoreAuth()

const refRegisterForm: Ref = ref(null)

const reset = () => {
  storeAuth.onResetForm()
  if (refRegisterForm.value) {
    refRegisterForm.value.resetValidation()
  }
}

onUnmounted(() => {
  nextTick(() => reset())
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
