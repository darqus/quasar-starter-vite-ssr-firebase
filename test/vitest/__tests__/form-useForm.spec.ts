import { describe, expect, it } from 'vitest'

import { createAuthFields } from '@/features/auth'
import { createNewEmployeeFields } from '@/features/employees'
import {
  AUTH_TYPE,
  FIELD_TYPE,
  INPUT_TYPE,
  type Fields,
} from '@/shared/form/types'
import { useForm } from '@/shared/form/useForm'
import { newEmployeeSchema } from '@/validation/schemas'

describe('form factories', () => {
  it('returns fresh arrays and field objects on every call', () => {
    const first = createNewEmployeeFields()
    const second = createNewEmployeeFields()

    expect(first).not.toBe(second)
    expect(first[0]).not.toBe(second[0])
    expect(first[0]?.rule).not.toBe(second[0]?.rule)
  })

  it('returns fresh auth fields on every call', () => {
    const first = createAuthFields(AUTH_TYPE.LOGIN_EMAIL)
    const second = createAuthFields(AUTH_TYPE.LOGIN_EMAIL)

    expect(first).not.toBe(second)
    expect(first[0]).not.toBe(second[0])
  })
})

describe('useForm isolation', () => {
  it('does not share field models between form instances', () => {
    const first = useForm({ fields: createNewEmployeeFields() })
    const second = useForm({ fields: createNewEmployeeFields() })

    first.setFieldValue('fio', 'LEAKED')

    expect(second.getFieldValue('fio')).toBe('')
    expect(first.fields.value[0]).not.toBe(second.fields.value[0])
  })

  it('does not mutate the source field list', () => {
    const source = createNewEmployeeFields()
    const form = useForm({ fields: source })

    form.setFieldValue('fio', 'Иван')

    expect(source[0]?.model).toBe('')
  })
})

describe('useForm reset', () => {
  it('resets text fields to an empty string and selects to null', async () => {
    const form = useForm({ fields: createNewEmployeeFields() })
    form.setFieldValue('fio', 'Иван')
    form.setFieldValue('description', 'Текст')
    form.setFieldValue('level', 'Джедай')
    form.setFieldValue('rate', 5)

    await form.reset()

    expect(form.getFieldValue('fio')).toBe('')
    expect(form.getFieldValue('description')).toBe('')
    expect(form.getFieldValue('level')).toBeNull()
    expect(form.getFieldValue('rate')).toBeNull()
  })

  it('prefers an explicit defaultValue', async () => {
    const fields: Fields = [
      {
        id: 'text',
        fieldType: FIELD_TYPE.INPUT,
        label: 'Text',
        name: 'text',
        inputType: INPUT_TYPE.TEXT,
        model: 'filled',
        defaultValue: 'preset',
        rule: [],
      },
      {
        id: 'select',
        fieldType: FIELD_TYPE.SELECT,
        label: 'Select',
        name: 'select',
        model: 'a',
        options: ['a', 'b'],
        defaultValue: 'b',
        rule: [],
      },
    ]
    const form = useForm({ fields })

    await form.reset()

    expect(form.getFieldValue('text')).toBe('preset')
    expect(form.getFieldValue('select')).toBe('b')
  })

  it('clears validation errors on reset', async () => {
    const form = useForm({
      fields: createNewEmployeeFields(),
      schema: newEmployeeSchema,
    })

    await form.validate()

    expect(Object.keys(form.errors.value).length).toBeGreaterThan(0)

    await form.reset()

    expect(form.errors.value).toEqual({})
  })
})
