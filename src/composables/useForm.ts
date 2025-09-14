import { nextTick, ref, type Ref, watch } from 'vue'

import type { QForm } from 'quasar'

import type {
  AnyFormField,
  FieldModelByName,
  FieldName,
  Fields,
  InferShape,
} from 'src/types/form'
import { parseAndCollectErrors } from 'src/validation/quasar-rules'

import type { ZodTypeAny } from 'zod'

export type FormData = Record<string, unknown>

export type UseFormOptions<F extends readonly AnyFormField[] = Fields> = {
  fields: F | Fields
  onSubmit?: (formData: FormData) => Promise<void> | void
  onReset?: () => Promise<void> | void
  validateOnChange?: boolean
  schema?: ZodTypeAny
}

export type UseFormReturn<F extends readonly AnyFormField[] = Fields> = {
  // Reactive data
  fields: Ref<Fields>
  formRef: Ref<QForm | null>
  isValid: Ref<boolean>
  isSubmitting: Ref<boolean>
  errors: Ref<Record<string, string[]>>

  // Form methods
  validate: () => Promise<boolean>
  reset: () => Promise<void>
  submit: () => Promise<void>
  setFieldValue: <N extends FieldName<F>>(
    fieldName: N,
    value: FieldModelByName<F, N>
  ) => void
  getFieldValue: <N extends FieldName<F>>(
    fieldName: N
  ) => FieldModelByName<F, N> | undefined
  getFormData: () => Partial<InferShape<F>>

  // Field helpers
  updateField: (fieldId: string, updates: Partial<Fields[0]>) => void
  addField: (field: Fields[0], index?: number) => void
  removeField: (fieldId: string) => void
}

export function useForm<F extends readonly AnyFormField[]>(
  options: UseFormOptions<F>
): UseFormReturn<F> {
  const fields = ref([...options.fields] as Fields)
  const formRef = ref<QForm | null>(null)
  const isValid = ref(false)
  const isSubmitting = ref(false)
  const errors = ref<Record<string, string[]>>({})

  // Validate form
  const validate = async (): Promise<boolean> => {
    let ok = true
    if (formRef.value) {
      await nextTick()
      ok = await formRef.value.validate()
    }
    if (options.schema) {
      const data = getFormData()
      const res = parseAndCollectErrors(options.schema, data)
      if (res.ok) {
        errors.value = {}
      } else {
        errors.value = res.errors
        ok = false
      }
    }
    isValid.value = ok
    return ok
  }

  // Reset form
  const reset = async (): Promise<void> => {
    fields.value.forEach((field) => {
      // если есть defaultValue — используем его; иначе поведение по умолчанию
      const hasDefault = Object.prototype.hasOwnProperty.call(
        field,
        'defaultValue'
      )
      // Для единообразия: сбрасываем в пустую строку
      const fallback = ''
      const f = field as { model: unknown; defaultValue?: unknown }
      f.model = hasDefault ? f.defaultValue : fallback
    })

    if (formRef.value) {
      await nextTick()
      formRef.value.resetValidation()
    }

    isValid.value = false

    if (options.onReset) {
      await options.onReset()
    }
  }

  // Submit form
  const submit = async (): Promise<void> => {
    if (isSubmitting.value) return

    const valid = await validate()
    if (!valid) return

    isSubmitting.value = true

    try {
      if (options.onSubmit) {
        await options.onSubmit(getFormData())
      }
    } finally {
      isSubmitting.value = false
    }
  }

  // Set field value by name
  const setFieldValue = <N extends FieldName<F>>(
    fieldName: N,
    value: FieldModelByName<F, N>
  ): void => {
    const field = fields.value.find((f) => f.name === fieldName)
    if (field) {
      ;(field as unknown as { model: FieldModelByName<F, N> }).model = value
    }
  }

  // Get field value by name
  const getFieldValue = <N extends FieldName<F>>(
    fieldName: N
  ): FieldModelByName<F, N> | undefined => {
    const field = fields.value.find((f) => f.name === fieldName)

    return field ? (field.model as FieldModelByName<F, N>) : undefined
  }

  // Get all form data as object
  const getFormData = (): Partial<InferShape<F>> => {
    return fields.value.reduce(
      (data, field) => {
        // накапливаем значения в объекте, затем приводим тип результата
        const dict = data as unknown as Record<string, unknown>
        dict[field.name] = field.model
        return data
      },
      {} as Partial<InferShape<F>>
    )
  }

  // Update field by id
  const updateField = (fieldId: string, updates: Partial<Fields[0]>): void => {
    const fieldIndex = fields.value.findIndex((f) => f.id === fieldId)
    if (fieldIndex !== -1) {
      const field = fields.value[fieldIndex]
      if (field) {
        Object.assign(field, updates)
      }
    }
  }

  // Add field
  const addField = (field: Fields[0], index?: number): void => {
    if (index !== undefined) {
      fields.value.splice(
        index,
        0,
        field as unknown as (typeof fields.value)[number]
      )
    } else {
      fields.value.push(field as unknown as (typeof fields.value)[number])
    }
  }

  // Remove field
  const removeField = (fieldId: string): void => {
    const fieldIndex = fields.value.findIndex((f) => f.id === fieldId)
    if (fieldIndex !== -1) {
      fields.value.splice(fieldIndex, 1)
    }
  }

  return {
    // Reactive data
    fields,
    formRef,
    isValid,
    isSubmitting,
    errors,

    // Form methods
    validate,
    reset,
    submit,
    setFieldValue,
    getFieldValue,
    getFormData,

    // Field helpers
    updateField,
    addField,
    removeField,
  }
}

// Включение валидации на изменение значения поля
export function setupValidateOnChange(
  formRef: Ref<QForm | null>,
  fields: Ref<Fields>,
  isValid: Ref<boolean>,
  enabled?: boolean
) {
  if (!enabled) return
  watch(
    () => fields.value.map((f) => f.model),
    async () => {
      if (!formRef.value) return
      await nextTick()
      const valid = await formRef.value.validate()
      isValid.value = valid
    },
    { deep: true }
  )
}
