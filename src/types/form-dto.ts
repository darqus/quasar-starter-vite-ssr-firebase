import type { Ref } from 'vue'

import { getFieldString } from 'src/utils/form'

import type { Fields } from './form'
import { AUTH_FIELD, type AuthFieldName, EMPLOYEE_FIELD } from './form-names'

// Auth DTOs
export type LoginDTO = {
  email: string
  password: string
}

export type RegisterDTO = {
  email: string
  password: string
}

export function getAuthString(
  fields: Ref<Fields> | Fields,
  name: AuthFieldName
) {
  return getFieldString(fields, name)
}

export function buildLoginDTO(fields: Ref<Fields> | Fields): LoginDTO {
  return {
    email: getFieldString(fields, AUTH_FIELD.LOGIN),
    password: getFieldString(fields, AUTH_FIELD.PASSWORD),
  }
}

export function buildRegisterDTO(fields: Ref<Fields> | Fields): RegisterDTO {
  return {
    email: getFieldString(fields, AUTH_FIELD.LOGIN),
    password: getFieldString(fields, AUTH_FIELD.PASSWORD),
  }
}

// Employee DTO example (align names → API fields)
export type NewEmployeeDTO = {
  name: string
  email: string
  position: string
  level: string
  rate: number
  description: string
}

export function buildNewEmployeeDTO(
  fields: Ref<Fields> | Fields
): NewEmployeeDTO {
  return {
    name: getFieldString(fields, EMPLOYEE_FIELD.FIO),
    email: getFieldString(fields, EMPLOYEE_FIELD.LOGIN),
    position: getFieldString(fields, EMPLOYEE_FIELD.POSITION),
    level: getFieldString(fields, EMPLOYEE_FIELD.LEVEL),
    rate: Number(getFieldString(fields, EMPLOYEE_FIELD.RATE)) || 0,
    description: getFieldString(fields, EMPLOYEE_FIELD.DESCRIPTION),
  }
}
