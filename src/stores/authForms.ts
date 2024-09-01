import { AUTH_TYPE, FIELD_TYPE, INPUT_TYPE, } from 'src/types/form'
import { type Fields, } from 'src/types/form'

import { DEBOUNCE, } from 'src/utils/constants'
import { generateId, } from 'src/utils/generator'
import { email, password, requiredInput, } from 'src/utils/rules'

const FORM_LOGIN_EMAIL = (): Fields => [
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
    rule: [ ...requiredInput, ...email, ],
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
    rule: [ ...requiredInput, ...password, ],
  },
]

const FORM_REGISTER = (): Fields => [
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
    rule: [ ...requiredInput, ...email, ],
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
    rule: [ ...requiredInput, ...password, ],
  },
]

const FORM_FORGOT_PASSWORD = (): Fields => [
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
    rule: [ ...requiredInput, ...email, ],
  },
]

const formsAuth = {
  [AUTH_TYPE.LOGIN_EMAIL]: FORM_LOGIN_EMAIL(),
  [AUTH_TYPE.REGISTER]: FORM_REGISTER(),
  [AUTH_TYPE.FORGOT_PASSWORD]: FORM_FORGOT_PASSWORD(),
}

export const getCurrentAuthForm = (currentAuthFormType: AUTH_TYPE) => formsAuth[currentAuthFormType]
