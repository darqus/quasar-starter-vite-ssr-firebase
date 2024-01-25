import { AUTH_TYPE, FORM_FIELD_TYPE, INPUT_TYPE, } from '@/types/enums'
import { type Form, } from '@/types/models'

import { DEBOUNCE, } from '@/utils/constants'
import { generateId, } from '@/utils/generator'
import rules from '@/utils/rules'

const FORM_LOGIN_EMAIL = (): Form => [
  {
    id: generateId(),
    formFieldType: FORM_FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Email',
    name: 'login',
    inputType: INPUT_TYPE.EMAIL,
    model: '',
    required: true,
    iconPrepend: 'email',
    rule: [ ...rules.requiredInput, ...rules.email, ],
  },
  {
    id: generateId(),
    formFieldType: FORM_FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Пароль',
    name: 'password',
    inputType: INPUT_TYPE.PASSWORD,
    model: '',
    required: true,
    iconPrepend: 'lock',
    rule: [ ...rules.requiredInput, ...rules.password, ],
  },
]

const FORM_REGISTER = (): Form => [
  {
    id: generateId(),
    formFieldType: FORM_FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Email',
    name: 'login',
    inputType: INPUT_TYPE.EMAIL,
    model: '',
    required: true,
    iconPrepend: 'email',
    rule: [ ...rules.requiredInput, ...rules.email, ],
  },
  {
    id: generateId(),
    formFieldType: FORM_FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Пароль',
    name: 'password',
    inputType: INPUT_TYPE.PASSWORD,
    model: '',
    required: true,
    iconPrepend: 'lock',
    rule: [ ...rules.requiredInput, ...rules.password, ],
  },
]

const FORM_FORGOT_PASSWORD = (): Form => [
  {
    id: generateId(),
    formFieldType: FORM_FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Email',
    name: 'login',
    inputType: INPUT_TYPE.TEXT,
    model: '',
    required: true,
    iconPrepend: 'email',
    rule: [ ...rules.requiredInput, ...rules.email, ],
  },
]

const formsAuth = {
  [AUTH_TYPE.LOGIN_EMAIL]: FORM_LOGIN_EMAIL(),
  [AUTH_TYPE.REGISTER]: FORM_REGISTER(),
  [AUTH_TYPE.FORGOT_PASSWORD]: FORM_FORGOT_PASSWORD(),
}

export const getCurrentAuthForm = (currentAuthFormType: AUTH_TYPE) => formsAuth[currentAuthFormType]
