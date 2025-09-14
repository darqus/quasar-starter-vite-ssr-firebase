<script setup lang="ts">
import { computed, toRefs, watchEffect } from 'vue'

import type { QForm } from 'quasar'

import FormDatePicker from 'src/components/form-fields/components/FormDatePicker.vue'
import FormInput from 'src/components/form-fields/components/FormInput.vue'
import FormSelect from 'src/components/form-fields/components/FormSelect.vue'
import FormTextArea from 'src/components/form-fields/components/FormTextArea.vue'
import {
  setupValidateOnChange,
  useForm,
  type UseFormOptions,
} from 'src/composables/useForm'
import { FIELD_TYPE } from 'src/types/form'

export type BaseFormProps = {
  // Appearance
  title?: string
  subtitle?: string
  showCard?: boolean
  cardClass?: string
  fieldsClass?: string

  // Form behavior
  autofocus?: boolean
  requireValidation?: boolean

  // Actions
  showActions?: boolean
  showResetButton?: boolean
  actionsAlign?: 'left' | 'center' | 'right'
  submitButtonLabel?: string
  submitButtonColor?: string
  resetButtonLabel?: string
} & UseFormOptions

const props = withDefaults(defineProps<BaseFormProps>(), {
  title: '',
  subtitle: '',
  showCard: true,
  cardClass: '',
  fieldsClass: 'q-gutter-md',
  autofocus: false,
  requireValidation: false,
  showActions: true,
  showResetButton: true,
  actionsAlign: 'right',
  submitButtonLabel: 'Отправить',
  submitButtonColor: 'primary',
  resetButtonLabel: 'Сбросить',
})

const emit = defineEmits<{
  submit: [formData: Record<string, unknown>]
  reset: []
  'update:valid': [valid: boolean]
}>()

// Use form composable
const {
  fields,
  formRef,
  isValid,
  isSubmitting,
  validate,
  reset,
  submit,
  setFieldValue,
  getFieldValue,
  getFormData,
  updateField,
  addField,
  removeField,
} = useForm({
  fields: props.fields,
  onSubmit: async (formData) => {
    emit('submit', formData)
    if (props.onSubmit) {
      await props.onSubmit(formData)
    }
  },
  onReset: async () => {
    emit('reset')
    if (props.onReset) {
      await props.onReset()
    }
  },
  validateOnChange: props.validateOnChange,
})

// Подключаем реактивную валидацию при изменении значений
setupValidateOnChange(formRef, fields, isValid, props.validateOnChange)

// Фильтруем поля по условной видимости
const visibleFields = computed(() =>
  fields.value.filter((f) => {
    const cond =
      typeof f.visible === 'function'
        ? f.visible({
            values: Object.fromEntries(
              fields.value.map((x) => [x.name, x.model])
            ),
          })
        : f.visible
    return cond !== false
  })
)

// Expose refs for parent access
const { formRef: internalFormRef } = toRefs({ formRef })

// Watch validation state and emit changes
watchEffect(() => {
  emit('update:valid', isValid.value)
})

// Form methods available to parent and slots
const formMethods = {
  validate,
  reset,
  submit,
  setFieldValue,
  getFieldValue,
  getFormData,
  updateField,
  addField,
  removeField,
  isValid,
  isSubmitting,
}

// Form event handlers
const handleSubmit = () => {
  void submit()
}

const handleReset = () => {
  void reset()
}

// Expose methods for parent component
defineExpose({
  ...formMethods,
  formRef: internalFormRef,
})
</script>

<template>
  <div class="base-form">
    <q-form
      ref="formRef"
      :autofocus="autofocus"
      class="q-gutter-md"
      @reset="handleReset"
      @submit="handleSubmit"
    >
      <q-card
        v-if="showCard"
        :class="cardClass"
      >
        <q-card-section v-if="title || subtitle">
          <div
            v-if="title"
            class="text-h6"
          >
            {{ title }}
          </div>
          <div
            v-if="subtitle"
            class="text-subtitle2 text-grey-6"
          >
            {{ subtitle }}
          </div>
        </q-card-section>

        <q-card-section>
          <div
            :class="fieldsClass"
            class="form-fields"
          >
            <slot name="before-fields" />

            <template
              v-for="field in visibleFields"
              :key="field.id"
            >
              <FormInput
                v-if="field.fieldType === FIELD_TYPE.INPUT"
                v-model="field.model"
                :field="field"
              />
              <FormSelect
                v-else-if="field.fieldType === FIELD_TYPE.SELECT"
                v-model="(field as any).model"
                :field="field as any"
              />
              <FormTextArea
                v-else-if="field.fieldType === FIELD_TYPE.TEXTAREA"
                v-model="field.model"
                :field="field"
              />
              <FormDatePicker
                v-else-if="field.fieldType === FIELD_TYPE.DATE_PICKER"
                v-model="field.model"
                :field="field"
              />
            </template>

            <slot name="after-fields" />
          </div>
        </q-card-section>

        <q-card-actions
          v-if="showActions"
          :align="actionsAlign"
        >
          <slot
            :form="formMethods"
            name="actions"
          >
            <q-btn
              v-if="showResetButton"
              :disable="isSubmitting"
              :label="resetButtonLabel"
              color="grey-6"
              type="reset"
              flat
            />
            <q-btn
              :color="submitButtonColor"
              :disable="!isValid && requireValidation"
              :label="submitButtonLabel"
              :loading="isSubmitting"
              type="submit"
            />
          </slot>
        </q-card-actions>
      </q-card>

      <!-- Form without card wrapper -->
      <template v-else>
        <div
          v-if="title || subtitle"
          class="form-header q-mb-md"
        >
          <div
            v-if="title"
            class="text-h6"
          >
            {{ title }}
          </div>
          <div
            v-if="subtitle"
            class="text-subtitle2 text-grey-6"
          >
            {{ subtitle }}
          </div>
        </div>

        <div
          :class="fieldsClass"
          class="form-fields"
        >
          <slot name="before-fields" />

          <template
            v-for="field in visibleFields"
            :key="field.id"
          >
            <FormInput
              v-if="field.fieldType === FIELD_TYPE.INPUT"
              v-model="field.model"
              :field="field"
            />
            <FormSelect
              v-else-if="field.fieldType === FIELD_TYPE.SELECT"
              v-model="(field as any).model"
              :field="field as any"
            />
            <FormTextArea
              v-else-if="field.fieldType === FIELD_TYPE.TEXTAREA"
              v-model="field.model"
              :field="field"
            />
            <FormDatePicker
              v-else-if="field.fieldType === FIELD_TYPE.DATE_PICKER"
              v-model="field.model"
              :field="field"
            />
          </template>

          <slot name="after-fields" />
        </div>

        <div
          v-if="showActions"
          :class="`text-${actionsAlign}`"
          class="form-actions q-mt-md"
        >
          <slot
            :form="formMethods"
            name="actions"
          >
            <q-btn
              v-if="showResetButton"
              :disable="isSubmitting"
              :label="resetButtonLabel"
              class="q-mr-sm"
              color="grey-6"
              type="reset"
              flat
            />
            <q-btn
              :color="submitButtonColor"
              :disable="!isValid && requireValidation"
              :label="submitButtonLabel"
              :loading="isSubmitting"
              type="submit"
            />
          </slot>
        </div>
      </template>
    </q-form>
  </div>
</template>

<style scoped>
.base-form {
  width: 100%;
}

.form-fields {
  display: flex;
  flex-direction: column;
}

.form-header {
  text-align: center;
}

.form-actions {
  display: flex;
  gap: 8px;
}

.form-actions.text-center {
  justify-content: center;
}

.form-actions.text-right {
  justify-content: flex-end;
}

.form-actions.text-left {
  justify-content: flex-start;
}
</style>
