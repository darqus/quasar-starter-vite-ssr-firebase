import { FORM_FIELD_TYPE, INPUT_TYPE, } from 'src/types/enums'
import { type Form, } from 'src/types/models'

import { DEBOUNCE, } from 'src/utils/constants'
import { generateId, } from 'src/utils/generator'
import rules from 'src/utils/rules'

export const NEW_EMPLOYEE_FORM = (): Form => [
  {
    id: generateId(),
    formFieldType: FORM_FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'ФИО',
    name: 'fio',
    inputType: INPUT_TYPE.TEXT,
    model: '',
    required: true,
    iconPrepend: 'person',
    rule: [ ...rules.requiredInput, ...rules.word, ],
  },
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
    label: 'Должность',
    name: 'position',
    inputType: INPUT_TYPE.TEXT,
    model: '',
    required: true,
    iconPrepend: 'person',
    rule: [ ...rules.requiredInput, ...rules.word, ],
  },
  {
    id: generateId(),
    formFieldType: FORM_FIELD_TYPE.SELECT,
    debounce: DEBOUNCE,
    label: 'Уровень',
    name: 'level',
    model: '',
    required: true,
    options: [
      'Падаван',
      'Джедай',
      'Ситх',
    ],
    rule: [ ...rules.requiredSelect, ],
  },
  {
    id: generateId(),
    formFieldType: FORM_FIELD_TYPE.SELECT,
    debounce: DEBOUNCE,
    label: 'Рейтинг',
    name: 'rate',
    model: '',
    required: true,
    options: [
      1,
      2,
      3,
      4,
      5,
    ],
    rule: [ ...rules.requiredSelect, ],
  },
  {
    id: generateId(),
    formFieldType: FORM_FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'Описание',
    name: 'description',
    inputType: INPUT_TYPE.TEXT,
    model: '',
    required: false,
    iconPrepend: 'description',
    rule: [],
  },
]

export const newEmployeeForm = NEW_EMPLOYEE_FORM()
