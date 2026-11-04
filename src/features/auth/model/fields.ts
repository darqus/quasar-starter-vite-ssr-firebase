// Centralized auth field-name constants to avoid stringly-typed usage
// and enable narrow string literal types in handlers

export const AUTH_FIELD = {
  LOGIN: 'login',
  PASSWORD: 'password',
} as const

export type AuthFieldName = (typeof AUTH_FIELD)[keyof typeof AUTH_FIELD]
