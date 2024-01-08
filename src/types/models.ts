import type { QInputProps, QSelectProps, } from 'quasar'

import type { FORM_FIELD_TYPE, INPUT_TYPE, } from './enums'

export type Todo = {
  id: number
  content: string
}

export type Meta = {
  totalCount: number
}

export type Loading = {
  loading: boolean
}

export type Valid = {
  valid: boolean
}

export type FormField = {
  formFieldType: FORM_FIELD_TYPE
  debounce?: number
  id: string
  label: string
  name: string
  model: string
  required: boolean
  inputType?: INPUT_TYPE
  iconPrepend?: string
  options?: string[] | number[]
  mask?: QInputProps['mask']
  rule: QInputProps['rules'] | QSelectProps['rules']
}

export type Form = FormField[]
