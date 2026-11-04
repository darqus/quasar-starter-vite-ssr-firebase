import { nextTick, ref, type Ref, watch } from 'vue'

import type { ZodTypeAny } from 'zod'

import type { QForm } from 'quasar'

import type {
  AnyFormField,
  FieldModelByName,
  FieldName,
  Fields,
} from '@/shared/form/types'
import { FIELD_TYPE } from '@/shared/form/types'
import { parseAndCollectErrors } from '@/validation/quasar-rules'

export type FormData = Record<string, unknown>

export type UseFormOptions<F extends readonly AnyFormField[] = Fields> = {
  fields: F | Fields
  onSubmit?: (formData: FormData) => Promise<void> | void
  onReset?: () => Promise<void> | void
  validateOnChange?: boolean
  schema?: ZodTypeAny | undefined
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
  getFormData: () => FormData
}

/**
 * Field configs are mutable (they store `model`), so each form instance must
 * own its own field objects and arrays. Otherwise state leaks between forms.
 */
const cloneField = (field: AnyFormField): AnyFormField => {
  const copy = { ...field }

  if (Array.isArray(field.rule)) {
    copy.rule = [...field.rule]
  }

  if ('options' in field && Array.isArray(field.options)) {
    ;(copy as unknown as { options: unknown[] }).options = [...field.options]
  }

  return copy
}

/**
 * Select models are `V | null`, while text fields use `''` after reset.
 * `defaultValue` always wins when it is declared explicitly.
 */
const getResetValue = (field: AnyFormField): unknown => {
  if (Object.prototype.hasOwnProperty.call(field, 'defaultValue')) {
    return field.defaultValue
  }

  return field.fieldType === FIELD_TYPE.SELECT ? null : ''
}

export function useForm<F extends readonly AnyFormField[]>(
  options: UseFormOptions<F>
): UseFormReturn<F> {
  const fields = ref(options.fields.map(cloneField))
  const formRef = ref<QForm | null>(null)
  const isValid = ref(false)
  const isSubmitting = ref(false)
  const errors = ref<Record<string, string[]>>({})

  // Validate form
  const validate = async (): Promise<boolean> => {
    // Zod is the single source of truth when a schema is provided: field
    // rules are generated from the same schema, so running QForm validation
    // as well would duplicate work and could produce conflicting messages.
    if (options.schema) {
      const result = parseAndCollectErrors(options.schema, getFormData())
      errors.value = result.ok ? {} : result.errors
      isValid.value = result.ok
      return result.ok
    }

    let ok = true
    if (formRef.value) {
      await nextTick()
      ok = await formRef.value.validate()
    }
    errors.value = {}
    isValid.value = ok
    return ok
  }

  // Reset form
  const reset = async (): Promise<void> => {
    fields.value.forEach((field) => {
      ;(field as unknown as { model: unknown }).model = getResetValue(field)
    })

    errors.value = {}

    if (formRef.value) {
      await nextTick()
      formRef.value.resetValidation()
    }

    isValid.value = false

    if (options.onReset) {
      await options.onReset()
    }
  }

  // Live validation on change (schema-based), if enabled
  if (options.validateOnChange) {
    watch(
      () => fields.value.map((f) => f.model),
      () => {
        if (!options.schema) {
          return
        }
        const res = parseAndCollectErrors(options.schema, getFormData())
        if (res.ok) {
          errors.value = {}
          isValid.value = true
        } else {
          errors.value = res.errors
          isValid.value = false
        }
      },
      { deep: true }
    )
  }

  // Submit form
  const submit = async (): Promise<void> => {
    if (isSubmitting.value) {
      return
    }

    const valid = await validate()
    if (!valid) {
      return
    }

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

  // Get all form data as a plain name -> value map
  const getFormData = (): FormData =>
    Object.fromEntries(fields.value.map((field) => [field.name, field.model]))

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
  }
}
