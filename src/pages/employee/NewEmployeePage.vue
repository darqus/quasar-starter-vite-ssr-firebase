<template>
  <q-page class="row items-center justify-evenly">
    <q-form
      ref="refForm"
      @reset="storeNewEmployee.onReset"
      @submit.prevent="storeNewEmployee.add"
    >
      <q-card
        class="shadow-up-1"
        style="min-width: 300px; max-width: 700px;"
      >
        <div class="row">
          <q-card class="col-sm-5 bg-blue-8 xs-hide text-right">
            <div class="bg-blue-6 text-white q-pa-md">
              <div
                class="text-h6 text-white"
                style="min-width: 220px"
              >
                Добро пожаловать
              </div>
            </div>
            <div class="bg-blue-5 text-white q-pa-md">
              <div class="text-white q-my-sm text-subtitle1">
                Создайте нового сотрудника!
              </div>
            </div>
          </q-card>

          <div class="col-sm-7 shadow-1">
            <div class="q-pa-lg">
              <div class="row">
                <div class="col-12 text-subtitle1">
                  <router-link
                    :to="VITE_ROUTER_BASE"
                    class="text-primary"
                  >
                    На Главную
                  </router-link>
                </div>
                <div class="col-12">
                  <div class="flex justify-center">
                    <div class="text-h5 q-my-lg text-weight-bold text-primary">
                      Новый сотрудник
                    </div>
                  </div>

                  <template
                    v-for="field in storeNewEmployee.formEmployee"
                    :key="field.id"
                  >
                    <template v-if="field.formFieldType === FORM_FIELD_TYPE.INPUT">
                      <q-input
                        v-model="field.model"
                        :debounce="field.debounce"
                        :mask="field.mask"
                        :name="field.name"
                        :required="field.required"
                        :rules="field.rule"
                        :type="field.inputType"
                        class="q-mb-sm"
                        label-slot
                        outlined
                      >
                        <template #label>
                          <span>{{ field.label }}</span>
                          <sup
                            v-if="field.required"
                            class="text-red"
                          >{{ INPUT_REQUIRED }}</sup>
                        </template>
                      </q-input>
                    </template>
                    <template v-if="field.formFieldType === FORM_FIELD_TYPE.SELECT">
                      <q-select
                        v-model="field.model"
                        :label="field.required ? `${field.label}${INPUT_REQUIRED}` : field.label"
                        :options="field.options"
                        :required="field.required"
                        :rules="field.rule"
                        outlined
                      />
                    </template>
                  </template>

                  <div class="row justify-between q-mt-md">
                    <q-btn
                      :disable="storeNewEmployee.loading"
                      :type="BUTTON_TYPE.RESET"
                      color="primary"
                      label="Сбросить"
                      no-caps
                      outline
                      rounded
                    />
                    <q-btn
                      :disable="storeNewEmployee.disabledSubmitButton"
                      :loading="storeNewEmployee.loading"
                      :type="BUTTON_TYPE.SUBMIT"
                      class="col-grow"
                      color="primary"
                      label="Добавить"
                      style="margin-left: 15px;"
                      no-caps
                      rounded
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, } from 'vue'

import { BUTTON_TYPE, FORM_FIELD_TYPE, } from '@/types/enums'

import { useStoreNewEmployee, } from '@/stores/store-new-employee'

import { INPUT_REQUIRED, } from '@/utils/constants'

const { VITE_ROUTER_BASE, } = import.meta.env

const storeNewEmployee = useStoreNewEmployee()

const refForm: Ref = ref(null)

watch(
  () => storeNewEmployee.formEmployee,
  () => {
    refForm.value?.validate()
      .then((success: boolean) => (storeNewEmployee.valid = success))
  },
  { deep: true, }
)
</script>
