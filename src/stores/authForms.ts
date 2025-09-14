import { AUTH_TYPE, FIELD_TYPE, INPUT_TYPE } from 'src/types/form'
import { type Fields } from 'src/types/form'
import { DEBOUNCE } from 'src/utils/constants'
import { generateId } from 'src/utils/generator'
import { rulesFromZodField } from 'src/validation/quasar-rules'
import {
  forgotSchema,
  loginSchema,
  registerSchema,
} from 'src/validation/schemas'

const LOGIN_EMAIL_FIELDS = (): Fields => [
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

const REGISTER_FIELDS = (): Fields => [
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

const FORGOT_PASSWORD_FIELDS = (): Fields => [
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

const formsAuth = {
  [AUTH_TYPE.LOGIN_EMAIL]: LOGIN_EMAIL_FIELDS(),
  [AUTH_TYPE.REGISTER]: REGISTER_FIELDS(),
  [AUTH_TYPE.FORGOT_PASSWORD]: FORGOT_PASSWORD_FIELDS(),
}

export const getCurrentAuthFields = (currentAuthFormType: AUTH_TYPE) =>
  formsAuth[currentAuthFormType]
