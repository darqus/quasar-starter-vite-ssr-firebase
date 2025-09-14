// Centralized field-name constants to avoid stringly-typed usage
// and enable narrow string literal types in handlers

export const AUTH_FIELD = {
  LOGIN: 'login',
  PASSWORD: 'password',
} as const

export type AuthFieldName = (typeof AUTH_FIELD)[keyof typeof AUTH_FIELD]

export const EMPLOYEE_FIELD = {
  FIO: 'fio',
  LOGIN: 'login',
  POSITION: 'position',
  LEVEL: 'level',
  RATE: 'rate',
  DESCRIPTION: 'description',
} as const

export type EmployeeFieldName =
  (typeof EMPLOYEE_FIELD)[keyof typeof EMPLOYEE_FIELD]
