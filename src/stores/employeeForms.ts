import { FIELD_TYPE, INPUT_TYPE, type Fields, } from 'src/types/form'

import { DEBOUNCE, } from 'src/utils/constants'
import { generateId, } from 'src/utils/generator'
import { email, requiredInput, requiredSelect, word, } from 'src/utils/rules'

export const NEW_EMPLOYEE_FIELDS = (): Fields => [
  {
    id: generateId(),
    fieldType: FIELD_TYPE.INPUT,
    debounce: DEBOUNCE,
    label: 'ФИО',
    name: 'fio',
    inputType: INPUT_TYPE.TEXT,
    model: '',
    required: true,
    iconPrepend: 'person',
    rule: [ ...requiredInput, ...word, ],
  },
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
    label: 'Должность',
    name: 'position',
    inputType: INPUT_TYPE.TEXT,
    model: '',
    required: true,
    iconPrepend: 'group',
    rule: [ ...requiredInput, ...word, ],
  },
  {
    id: generateId(),
    fieldType: FIELD_TYPE.SELECT,
    label: 'Уровень',
    name: 'level',
    model: null,
    required: true,
    iconPrepend: 'attribution',
    options: [
      'Падаван',
      'Джедай',
      'Ситх',
    ],
    rule: [ ...requiredSelect, ],
  },
  {
    id: generateId(),
    fieldType: FIELD_TYPE.SELECT,
    label: 'Рейтинг',
    name: 'rate',
    model: null,
    required: true,
    iconPrepend: 'star',
    options: [
      '1',
      '2',
      '3',
      '4',
      '5',
    ],
    rule: [ ...requiredSelect, ],
  },
  {
    id: generateId(),
    fieldType: FIELD_TYPE.INPUT,
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

export const getNewEmployeeFields = NEW_EMPLOYEE_FIELDS()
