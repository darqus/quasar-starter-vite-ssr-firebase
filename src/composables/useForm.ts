import { nextTick, ref, type Ref } from 'vue'

import type { QForm } from 'quasar'

import type { AnyFormField, FieldModelByName, FieldName, Fields, InferShape } from 'src/types/form'
import { FIELD_TYPE } from 'src/types/form'

export type FormData = Record<string, unknown>

export type UseFormOptions<F extends readonly AnyFormField[] = Fields> = {
  fields: F | Fields
  onSubmit?: (formData: FormData) => Promise<void> | void
  onReset?: () => Promise<void> | void
  validateOnChange?: boolean
}

export type UseFormReturn<F extends readonly AnyFormField[] = Fields> = {
  // Reactive data
  fields: Ref<Fields>
  formRef: Ref<QForm | null>
  isValid: Ref<boolean>
  isSubmitting: Ref<boolean>

  // Form methods
  validate: () => Promise<boolean>
  reset: () => Promise<void>
  submit: () => Promise<void>
  setFieldValue: <N extends FieldName<F>>(fieldName: N, value: FieldModelByName<F, N>) => void
  getFieldValue: <N extends FieldName<F>>(fieldName: N) => FieldModelByName<F, N> | undefined
  getFormData: () => Partial<InferShape<F>>

  // Field helpers
  updateField: (fieldId: string, updates: Partial<Fields[0]>) => void
  addField: (field: Fields[0], index?: number) => void
  removeField: (fieldId: string) => void
}

export function useForm<F extends readonly AnyFormField[]>(options: UseFormOptions<F>): UseFormReturn<F> {
  const fields = ref([...options.fields] as Fields)
  const formRef = ref<QForm | null>(null)
  const isValid = ref(false)
  const isSubmitting = ref(false)

  // Validate form
  const validate = async (): Promise<boolean> => {
    if (!formRef.value) return false

    await nextTick()
    const valid = await formRef.value.validate()
    isValid.value = valid
    return valid
  }

  // Reset form
  const reset = async (): Promise<void> => {
    fields.value.forEach(field => {
      field.model = field.fieldType === FIELD_TYPE.SELECT ? null : ''
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
  const setFieldValue = <N extends FieldName<F>>(fieldName: N, value: FieldModelByName<F, N>): void => {
    const field = fields.value.find(f => f.name === fieldName)
    if (field) {
      ;(field as unknown as { model: FieldModelByName<F, N> }).model = value
    }
  }

  // Get field value by name
  const getFieldValue = <N extends FieldName<F>>(fieldName: N): FieldModelByName<F, N> | undefined => {
    const field = fields.value.find(f => f.name === fieldName)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return field ? (field.model as unknown as FieldModelByName<F, N>) : undefined
  }

  // Get all form data as object
  const getFormData = (): Partial<InferShape<F>> => {
    return fields.value.reduce((data, field) => {
      const key = field.name as keyof InferShape<F>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      data[key] = field.model as unknown as InferShape<F>[typeof key]
      return data
    }, {} as Partial<InferShape<F>>)
  }

  // Update field by id
  const updateField = (fieldId: string, updates: Partial<Fields[0]>): void => {
    const fieldIndex = fields.value.findIndex(f => f.id === fieldId)
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
      fields.value.splice(index, 0, field as unknown as (typeof fields.value)[number])
    } else {
      fields.value.push(field as unknown as (typeof fields.value)[number])
    }
  }

  // Remove field
  const removeField = (fieldId: string): void => {
    const fieldIndex = fields.value.findIndex(f => f.id === fieldId)
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
    removeField
  }
}
