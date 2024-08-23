import { AUTH_TYPE, FORM_FIELD_TYPE, INPUT_TYPE, } from 'src/types/enums'
import { type Form, } from 'src/types/models'

import { DEBOUNCE, } from 'src/utils/constants'
import { generateId, } from 'src/utils/generator'
import { email, password, requiredInput, } from 'src/utils/rules'

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
    rule: [ ...requiredInput, ...email, ],
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
    rule: [ ...requiredInput, ...password, ],
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
    rule: [ ...requiredInput, ...email, ],
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
    rule: [ ...requiredInput, ...password, ],
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
    rule: [ ...requiredInput, ...email, ],
  },
]

const formsAuth = {
  [AUTH_TYPE.LOGIN_EMAIL]: FORM_LOGIN_EMAIL(),
  [AUTH_TYPE.REGISTER]: FORM_REGISTER(),
  [AUTH_TYPE.FORGOT_PASSWORD]: FORM_FORGOT_PASSWORD(),
}

export const getCurrentAuthForm = (currentAuthFormType: AUTH_TYPE) => formsAuth[currentAuthFormType]
