import type { QInputProps, QSelectProps } from 'quasar'

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
  DATE = 'date',
}

export const INPUT_MASK = '##.##.####'

export const DATE_MASK = 'DD.MM.YYYY'

export enum AUTH_TYPE {
  LOGIN_EMAIL = 'LOGIN_EMAIL',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
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

// Обобщённые опции для Select с выводом типа значения
export type Option<V> = V | { label: string; value: V }
export type Options<V> = ReadonlyArray<Option<V>>

export type BaseField = {
  id: string
  label: string
  name: string
  bgColor?: string
  iconPrepend?: string
  required?: boolean
  clearable?: boolean
  disable?: boolean
  rounded?: boolean
  // Новые доп. возможности
  defaultValue?: unknown
  // Условная видимость поля: true/false или функция от текущих значений формы
  visible?: boolean | ((ctx: { values: Record<string, unknown> }) => boolean)
}

export type InputFormField = {
  fieldType: FIELD_TYPE.INPUT
  model: string
  mask?: string
  debounce?: number
  inputType: INPUT_TYPE
  rule: QInputProps['rules']
} & BaseField

export type TextareaFormField = {
  fieldType: FIELD_TYPE.TEXTAREA
  model: string
  mask?: string
  debounce?: number
  inputType: INPUT_TYPE
  rule: QInputProps['rules']
} & BaseField

// V — тип значения для select; по умолчанию string | number
export type SelectFormField<V = string | number> = {
  fieldType: FIELD_TYPE.SELECT
  model: V | null
  rule: QSelectProps['rules']
  options: Options<V> | string[]
} & BaseField

export type DatePickerFormField = {
  fieldType: FIELD_TYPE.DATE_PICKER
  model: string
  bgColor?: string
  iconPrepend?: string
  debounce?: number
  inputType: INPUT_TYPE
  rule: QInputProps['rules']
} & BaseField

// Универсальное объединение всех полей формы
export type AnyFormField =
  | InputFormField
  | TextareaFormField
  | DatePickerFormField
  | SelectFormField<unknown>

// Базовый список полей (обратная совместимость)
export type Fields = AnyFormField[]

// Имя поля для заданного списка полей
export type FieldName<F extends readonly AnyFormField[]> = F[number]['name']

// Тип модели по имени для заданного списка полей
export type FieldModelByName<
  F extends readonly AnyFormField[],
  N extends FieldName<F>,
> = {
  [K in F[number] as K['name']]: K['model']
}[N]
