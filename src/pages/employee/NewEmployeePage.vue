<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForm"
      @reset="reset"
      @submit.prevent="add"
    >
      <EssentialForm
        card-style="min-width: 300px; max-width: 700px;"
        description="Создайте нового сотрудника!"
        title="Новый сотрудник"
      >
        <template #fields>
          <FormFields :fields="employeeFormRef" />
        </template>

        <template #buttons>
          <div class="row justify-between q-mt-md">
            <q-btn
              :disable="loading"
              :type="BUTTON_TYPE.RESET"
              color="primary"
              label="Сбросить"
              no-caps
              outline
              rounded
            />
            <q-btn
              :disable="disabledSubmitButton"
              :loading="loading"
              :type="BUTTON_TYPE.SUBMIT"
              class="col-grow"
              color="primary"
              label="Добавить"
              style="margin-left: 15px;"
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
import { ref, watch, type Ref, nextTick, computed, } from 'vue'

import { Loading, } from 'quasar'

import { BUTTON_TYPE, } from 'src/types/form'

import { getNewEmployeeFields, } from 'src/stores/employeeForms'

import { createNotify, } from 'src/utils/notify'

import EssentialForm from 'src/components/form/EssentialForm.vue'
import FormFields from 'src/components/form-fields/FormFields.vue'

import { addDoc, } from 'src/boot/firebase'

const loading = ref(false)
const valid = ref(false)
const refForm: Ref = ref(null)
const employeeFormRef = ref(getNewEmployeeFields)

const toggleLoading = () => {
  loading.value = !loading.value
}

const disabledSubmitButton = computed(() => !valid.value)

const reset = async () => {
  if (refForm.value) {
    employeeFormRef.value.forEach((item) => {
      item.model = ''

      return item
    })
    await nextTick()
    refForm.value.resetValidation()
  }
}

const validate = async () => {
  await nextTick()
  refForm.value?.validate()
    .then((success: boolean) => (valid.value = success))
}

const add = () => {
  toggleLoading()
  Loading.show()
  addDoc('employees', {
    name: employeeFormRef.value[0].model,
    email: employeeFormRef.value[1].model,
    position: employeeFormRef.value[2].model,
    level: employeeFormRef.value[3].model,
    rate: employeeFormRef.value[4].model,
    description: employeeFormRef.value[5].model,
  })
    .then(() => {
      createNotify(`Сотрудник "${employeeFormRef.value[0].model}" добавлен`, 'green-4', 'how_to_reg')
      reset()
    })
    .catch((error) => {
      createNotify(error)
    })
    .finally(() => {
      toggleLoading()
      Loading.hide()
    })
}

watch(
  () => employeeFormRef,
  () => {
    validate()
  },
  { deep: true, }
)
</script>
