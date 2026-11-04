import { AUTH_TYPE, FIELD_TYPE, INPUT_TYPE } from '@/shared/form/types'
import { type Fields } from '@/shared/form/types'
import { DEBOUNCE } from '@/shared/lib/constants'
import { generateId } from '@/shared/lib/generator'
import { rulesFromZodField } from '@/validation/quasar-rules'
import { forgotSchema, loginSchema, registerSchema } from '@/validation/schemas'

const createLoginFields = (): Fields => [
  {
    id: generateId(),
    fieldType: FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Email',
    name: 'login',
    inputType: INPUT_TYPE.EMAIL,
    model: '',
    required: true,
    iconPrepend: 'email',
    rule: rulesFromZodField(loginSchema.shape.login),
  },
  {
    id: generateId(),
    fieldType: FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Пароль',
    name: 'password',
    inputType: INPUT_TYPE.PASSWORD,
    model: '',
    required: true,
    iconPrepend: 'lock',
    rule: rulesFromZodField(loginSchema.shape.password),
  },
]

const createRegisterFields = (): Fields => [
  {
    id: generateId(),
    fieldType: FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Email',
    name: 'login',
    inputType: INPUT_TYPE.EMAIL,
    model: '',
    required: true,
    iconPrepend: 'email',
    rule: rulesFromZodField(registerSchema.shape.login),
  },
  {
    id: generateId(),
    fieldType: FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Пароль',
    name: 'password',
    inputType: INPUT_TYPE.PASSWORD,
    model: '',
    required: true,
    iconPrepend: 'lock',
    rule: rulesFromZodField(registerSchema.shape.password),
  },
]

const createForgotPasswordFields = (): Fields => [
  {
    id: generateId(),
    fieldType: FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Email',
    name: 'login',
    inputType: INPUT_TYPE.TEXT,
    model: '',
    required: true,
    iconPrepend: 'email',
    rule: rulesFromZodField(forgotSchema.shape.login),
  },
]

const AUTH_FIELD_FACTORIES: Record<AUTH_TYPE, () => Fields> = {
  [AUTH_TYPE.LOGIN_EMAIL]: createLoginFields,
  [AUTH_TYPE.REGISTER]: createRegisterFields,
  [AUTH_TYPE.FORGOT_PASSWORD]: createForgotPasswordFields,
}

/**
 * Returns a fresh field list on every call. Field configs are mutable at
 * runtime (they carry `model`), so they must never be shared between forms.
 */
export const createAuthFields = (currentAuthFormType: AUTH_TYPE): Fields =>
  AUTH_FIELD_FACTORIES[currentAuthFormType]()
