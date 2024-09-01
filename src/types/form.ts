import type { QInputProps, QSelectProps, } from 'quasar'

export enum INPUT_TYPE {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  PASSWORD = 'password',
  TEL = 'tel',
  TEXTAREA = 'textarea',
  SEARCH = 'search',
  FILE = 'file',
  URL = 'url',
  TIME = 'time',
  DATE = 'date'
}

export const PHONE_MASK = '+7 (###) ###-##-##'

export const INPUT_MASK = '##.##.####'

export const DATE_MASK = 'DD.MM.YYYY'

export enum AUTH_TYPE {
  LOGIN_EMAIL = 'LOGIN_EMAIL',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export enum AUTH_TITLE {
  LOGIN_EMAIL = 'Войти по email',
  LOGIN_PHONE = 'Войти по номеру телефона',
  REGISTER = 'Зарегистрироваться',
  FORGOT_PASSWORD = 'Восстановить пароль',
}

export enum AUTH_ICON {
  LOGIN_EMAIL = 'email',
  LOGIN_PHONE = 'phone',
  REGISTER = 'person_add',
  FORGOT_PASSWORD = 'lock',
}

export enum FIELD_TYPE {
  INPUT = 'INPUT',
  SELECT = 'SELECT',
  DATE_PICKER = 'DATE_PICKER',
  TEXTAREA = 'TEXTAREA', // use input with "autogrow"
}

export enum PASSWORD_VISIBILITY_ICON {
  ON = 'visibility',
  OFF = 'visibility_off',
}

export enum BUTTON_TYPE {
  SUBMIT = 'submit',
  RESET = 'reset',
}

type SelectOption = QSelectProps['options'] | { label: string; value: unknown }
type SelectOptions = SelectOption[] | string[]

export type BaseFormField = {
  id: string
  label: string
  name: string
  bgColor?: string
  iconPrepend?: string
  required?: boolean
  clearable?: boolean
  disable?: boolean
  rounded?: boolean
}

export type InputFormField = {
  fieldType: FIELD_TYPE.INPUT
  model: string
  mask?: string
  debounce?: number
  inputType: INPUT_TYPE
  rule: QInputProps['rules']
} & BaseFormField

export type TextareaFormField = {
  fieldType: FIELD_TYPE.TEXTAREA
  model: string
  mask?: string
  debounce?: number
  inputType: INPUT_TYPE
  rule: QInputProps['rules']
} & BaseFormField

export type SelectFormField = {
  fieldType: FIELD_TYPE.SELECT
  model: string | null
  rule: QSelectProps['rules']
  options: SelectOptions
} & BaseFormField

export type DatePickerFormField = {
  fieldType: FIELD_TYPE.DATE_PICKER
  model: string
  bgColor?: string
  iconPrepend?: string
  debounce?: number
  inputType: INPUT_TYPE
  rule: QInputProps['rules']
} & BaseFormField

export type FormFeild<T extends FIELD_TYPE> = T extends FIELD_TYPE.INPUT
  ? InputFormField
  : T extends FIELD_TYPE.TEXTAREA
    ? TextareaFormField
    : T extends FIELD_TYPE.SELECT
      ? SelectFormField
      : T extends FIELD_TYPE.DATE_PICKER
        ? DatePickerFormField
        : never

export type Fields = FormFeild<FIELD_TYPE>[]
