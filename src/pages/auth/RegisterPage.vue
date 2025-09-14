<script setup lang="ts">
import { nextTick, type Ref, ref, watch } from 'vue'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

import { Loading } from 'quasar'

import { auth } from 'src/boot/firebase'
import EssentialForm from 'src/components/form/EssentialForm.vue'
import FormFields from 'src/components/form-fields/FormFields.vue'
import { getCurrentAuthFields } from 'src/stores/authForms'
import { useStoreAuth } from 'src/stores/store-auth'
import { AUTH_FIELD } from 'src/types'
import { AUTH_TYPE, BUTTON_TYPE } from 'src/types/form'
import { ROUTE_TYPE } from 'src/types/route'
import { getFieldString } from 'src/utils/form'

const storeAuth = useStoreAuth()
const router = useRouter()

const refRegisterForm: Ref = ref(null)

const currentAuthFormRef = ref(getCurrentAuthFields(AUTH_TYPE.REGISTER))

const reset = async () => {
  if (refRegisterForm.value) {
    currentAuthFormRef.value.forEach((item) => {
      item.model = ''

      return item
    })
    await nextTick()
    refRegisterForm.value.resetValidation()
  }
}

const validate = async () => {
  if (refRegisterForm.value) {
    await nextTick()
    const isValid = await refRegisterForm.value.validate()
    storeAuth.valid = isValid
    return isValid
  }
  return false
}

const onRegister = async () => {
  const isValid = await validate()
  if (!isValid) {
    return
  }

  Loading.show()
  const email = getFieldString(currentAuthFormRef, AUTH_FIELD.LOGIN)
  const password = getFieldString(currentAuthFormRef, AUTH_FIELD.PASSWORD)
  createUserWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      const { uid, email: userEmail } = user

      if (userEmail && email === userEmail && uid) {
        storeAuth.onRegisterSuccess(uid, userEmail ?? '', router)
        void reset()
      }
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
    void validate()
  },
  { deep: true }
)
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refRegisterForm"
      @reset="reset"
      @submit.prevent="onRegister"
    >
      <EssentialForm
        card-style="min-width: 300px; max-width: 700px;"
        description="Для начала работы пройдите регистрацию!"
        title="Регистрация"
      >
        <template #fields>
          <FormFields :fields="currentAuthFormRef" />
        </template>

        <template #buttons>
          <!-- <q-toggle
            v-model="storeAuth.accept"
            label="I accept the license and terms"
          /> -->

          <div class="row q-pt-md">
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
              style="margin-left: 15px"
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
        </template>
      </EssentialForm>
    </q-form>
  </q-page>
</template>
