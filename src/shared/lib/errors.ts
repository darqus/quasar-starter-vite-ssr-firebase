const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': 'Недостаточно прав для выполнения операции',
  unauthenticated: 'Требуется авторизация',
  unavailable: 'Сервис временно недоступен. Попробуйте позже',
  'not-found': 'Запрошенные данные не найдены',
  'resource-exhausted': 'Слишком много запросов. Попробуйте позже',
  'failed-precondition': 'Операция сейчас невозможна. Попробуйте позже',
  'network-request-failed': 'Проблема с сетью. Проверьте подключение',
}

export type AppErrorOptions = {
  code?: string
}

export class AppError extends Error {
  readonly code: string | undefined

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message)
    this.name = 'AppError'
    this.code = options.code
  }
}

export const getErrorCode = (error: unknown): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code
  }

  return ''
}

/**
 * Maps known Firebase/Firestore error codes to user-facing messages.
 * Unknown errors keep their message, so developer-facing failures stay visible.
 */
export const toAppError = (
  error: unknown,
  fallback: string,
  messages: Record<string, string> = {}
): AppError => {
  if (error instanceof AppError) {
    return error
  }

  const code = getErrorCode(error)
  const message =
    messages[code] ??
    FIREBASE_ERROR_MESSAGES[code] ??
    (error instanceof Error && error.message ? error.message : fallback)

  return new AppError(message, code ? { code } : {})
}

export const toErrorMessage = (
  error: unknown,
  fallback = 'Что-то пошло не так. Попробуйте позже'
): string => toAppError(error, fallback).message
