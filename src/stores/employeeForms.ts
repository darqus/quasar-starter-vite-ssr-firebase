import { FIELD_TYPE, type Fields, INPUT_TYPE } from 'src/types/form'
import { DEBOUNCE } from 'src/utils/constants'
import { generateId } from 'src/utils/generator'
import { rulesFromZodField } from 'src/validation/quasar-rules'
import { newEmployeeSchema } from 'src/validation/schemas'

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
    rule: rulesFromZodField(newEmployeeSchema.shape.fio),
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
    rule: rulesFromZodField(newEmployeeSchema.shape.login),
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
    rule: rulesFromZodField(newEmployeeSchema.shape.position),
  },
  {
    id: generateId(),
    fieldType: FIELD_TYPE.SELECT,
    label: 'Уровень',
    name: 'level',
    model: null,
    required: true,
    iconPrepend: 'attribution',
    options: ['Падаван', 'Джедай', 'Ситх'],
    rule: rulesFromZodField(newEmployeeSchema.shape.level),
  },
  {
    id: generateId(),
    fieldType: FIELD_TYPE.SELECT,
    label: 'Рейтинг',
    name: 'rate',
    model: null,
    required: true,
    iconPrepend: 'star',
    options: ['1', '2', '3', '4', '5'],
    rule: rulesFromZodField(newEmployeeSchema.shape.rate),
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
    rule: rulesFromZodField(newEmployeeSchema.shape.description),
  },
]

export const getNewEmployeeFields = NEW_EMPLOYEE_FIELDS()
