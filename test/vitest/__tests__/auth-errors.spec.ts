import { describe, expect, it } from 'vitest'

import { mapAuthError } from '@/features/auth'

describe('mapAuthError', () => {
  it('maps credential errors to a single readable message', () => {
    expect(mapAuthError({ code: 'auth/invalid-credential' })).toBe(
      'Неверный email или пароль'
    )
    expect(mapAuthError({ code: 'auth/wrong-password' })).toBe(
      'Неверный email или пароль'
    )
    expect(mapAuthError({ code: 'auth/user-not-found' })).toBe(
      'Неверный email или пароль'
    )
  })

  it('maps registration and rate-limit errors', () => {
    expect(mapAuthError({ code: 'auth/email-already-in-use' })).toBe(
      'Аккаунт с таким email уже существует'
    )
    expect(mapAuthError({ code: 'auth/too-many-requests' })).toBe(
      'Слишком много попыток. Попробуйте позже или восстановите пароль'
    )
  })

  it('never exposes an unknown Firebase code to the user', () => {
    expect(mapAuthError({ code: 'auth/some-new-error' })).toBe(
      'Не удалось выполнить действие. Попробуйте позже'
    )
  })

  it('keeps a plain error message when there is no known code', () => {
    expect(mapAuthError(new Error('Network down'))).toBe('Network down')
  })
})
