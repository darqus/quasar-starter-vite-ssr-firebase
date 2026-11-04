import { toAppError } from '@/shared/lib/errors'

const DEFAULT_AUTH_ERROR_MESSAGE =
  'Не удалось выполнить действие. Попробуйте позже'

/**
 * `auth/*` codes are Firebase implementation details. Users should never
 * see them, so every known code gets a human-readable message.
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Неверный email или пароль',
  'auth/wrong-password': 'Неверный email или пароль',
  'auth/user-not-found': 'Неверный email или пароль',
  'auth/invalid-email': 'Введите корректный email',
  'auth/missing-password': 'Введите пароль',
  'auth/missing-email': 'Введите email',
  'auth/email-already-in-use': 'Аккаунт с таким email уже существует',
  'auth/weak-password': 'Пароль слишком простой',
  'auth/user-disabled': 'Аккаунт заблокирован',
  'auth/too-many-requests':
    'Слишком много попыток. Попробуйте позже или восстановите пароль',
  'auth/network-request-failed': 'Проблема с сетью. Проверьте подключение',
  'auth/operation-not-allowed': 'Этот способ входа сейчас недоступен',
  'auth/requires-recent-login':
    'Требуется повторный вход. Войдите в аккаунт ещё раз',
}

export const mapAuthError = (error: unknown): string =>
  toAppError(error, DEFAULT_AUTH_ERROR_MESSAGE, AUTH_ERROR_MESSAGES).message
