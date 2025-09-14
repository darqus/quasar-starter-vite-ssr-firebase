import { ref, type Ref } from 'vue'

import { describe, expect, it } from 'vitest'

import { FIELD_TYPE, type Fields, INPUT_TYPE } from 'src/types/form'
import { getFieldModel, getFieldString, toFormDataMap } from 'src/utils/form'

function makeFields(): Fields {
  return [
    {
      id: '1',
      fieldType: FIELD_TYPE.INPUT,
      label: 'ФИО',
      name: 'fio',
      inputType: INPUT_TYPE.TEXT,
      model: 'Иванов Иван',
      required: true,
      rule: undefined,
    },
    {
      id: '2',
      fieldType: FIELD_TYPE.INPUT,
      label: 'Email',
      name: 'login',
      inputType: INPUT_TYPE.EMAIL,
      model: 'user@example.com',
      required: true,
      rule: undefined,
    },
    {
      id: '3',
      fieldType: FIELD_TYPE.SELECT,
      label: 'Уровень',
      name: 'level',
      model: 'Джедай',
      options: ['Падаван', 'Джедай', 'Ситх'],
      required: true,
      rule: undefined,
    },
    {
      id: '4',
      fieldType: FIELD_TYPE.SELECT,
      label: 'Рейтинг',
      name: 'rate',
      model: 5,
      options: ['1', '2', '3', '4', '5'],
      required: true,
      rule: undefined,
    },
    {
      id: '5',
      fieldType: FIELD_TYPE.INPUT,
      label: 'Описание',
      name: 'description',
      inputType: INPUT_TYPE.TEXT,
      model: '',
      required: false,
      rule: undefined,
    },
  ]
}

describe('utils/form', () => {
  it('getFieldModel returns raw value by name (array)', () => {
    const fields = makeFields()
    expect(getFieldModel(fields, 'fio')).toBe('Иванов Иван')
    expect(getFieldModel(fields, 'login')).toBe('user@example.com')
    expect(getFieldModel(fields, 'level')).toBe('Джедай')
    expect(getFieldModel(fields, 'rate')).toBe(5)
    expect(getFieldModel(fields, 'unknown')).toBeNull()
  })

  it('getFieldString returns string with fallback (array)', () => {
    const fields = makeFields()
    expect(getFieldString(fields, 'fio')).toBe('Иванов Иван')
    expect(getFieldString(fields, 'rate')).toBe('5')
    expect(getFieldString(fields, 'description')).toBe('')
    expect(getFieldString(fields, 'unknown')).toBe('')
    expect(getFieldString(fields, 'unknown', 'N/A')).toBe('N/A')
  })

  it('toFormDataMap converts fields to name->value map (array)', () => {
    const fields = makeFields()
    const map = toFormDataMap(fields)
    expect(map).toEqual({
      fio: 'Иванов Иван',
      login: 'user@example.com',
      level: 'Джедай',
      rate: 5,
      description: '',
    })
  })

  it('works with Ref<Fields> as well', () => {
    const fieldsRef: Ref<Fields> = ref(makeFields())

    expect(getFieldModel(fieldsRef, 'fio')).toBe('Иванов Иван')
    expect(getFieldString(fieldsRef, 'rate')).toBe('5')

    if (fieldsRef.value[0]) {
      fieldsRef.value[0].model = 'Петров Петр'
    }
    expect(getFieldString(fieldsRef, 'fio')).toBe('Петров Петр')

    const map = toFormDataMap(fieldsRef)
    expect(map.fio).toBe('Петров Петр')
  })

  it('handles empty fields array safely', () => {
    const fields: Fields = []
    expect(getFieldModel(fields, 'any')).toBeNull()
    expect(getFieldString(fields, 'any')).toBe('')
    expect(toFormDataMap(fields)).toEqual({})
  })

  it('ignores fields without a valid name', () => {
    const invalidField = {
      id: 'x',
      fieldType: FIELD_TYPE.INPUT as const,
      label: 'No Name',
      // simulate invalid name at runtime
      name: undefined as unknown as string,
      inputType: INPUT_TYPE.TEXT as const,
      model: 'val',
      rule: undefined,
    }
    const fields: Fields = [invalidField as unknown as Fields[number]]

    // lookups by any name should miss
    expect(getFieldModel(fields, 'missing')).toBeNull()
    expect(getFieldString(fields, 'missing', 'fallback')).toBe('fallback')
    // map should skip invalid name keys
    expect(toFormDataMap(fields)).toEqual({})
  })

  it('prefers the first field when duplicate names exist', () => {
    const fields: Fields = [
      {
        id: '1',
        fieldType: FIELD_TYPE.INPUT,
        label: 'A',
        name: 'dup',
        inputType: INPUT_TYPE.TEXT,
        model: 'first',
        rule: undefined,
      },
      {
        id: '2',
        fieldType: FIELD_TYPE.INPUT,
        label: 'B',
        name: 'dup',
        inputType: INPUT_TYPE.TEXT,
        model: 'second',
        rule: undefined,
      },
    ]

    expect(getFieldString(fields, 'dup')).toBe('first')
    // toFormDataMap will accumulate last occurrence due to reduce overwrite
    expect(toFormDataMap(fields)).toEqual({ dup: 'second' })
  })

  it('supports select with object options and null model', () => {
    const fields: Fields = [
      {
        id: 's1',
        fieldType: FIELD_TYPE.SELECT,
        label: 'Role',
        name: 'role',
        model: null,
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
        rule: undefined,
      },
    ]

    expect(getFieldModel(fields, 'role')).toBeNull()
    expect(getFieldString(fields, 'role')).toBe('')
    expect(toFormDataMap(fields)).toEqual({ role: null })
  })
})
