import { useRouter } from 'vue-router'

import { createFeedback } from '@/shared/ui/feedback'
import { ROUTE_NAME } from '@/types/route'

import { sendReset, signIn, signOutUser, signUp } from '../api/authApi'
import { mapAuthError } from '../model/authErrors'

/**
 * Auth scenarios used by pages: provider call + navigation + user feedback.
 *
 * The session store stays UI-free; everything that needs a router, a loading
 * overlay or a notification lives here.
 */
export const useAuthActions = () => {
  const router = useRouter()
  const { isPending, run } = createFeedback()

  const login = (email: string, password: string): Promise<boolean> =>
    run(() => signIn(email, password), {
      mapError: mapAuthError,
      onSuccess: async () => {
        await router.push({ name: ROUTE_NAME.ACCOUNT })
      },
    })

  const register = (email: string, password: string): Promise<boolean> =>
    run(() => signUp(email, password), {
      mapError: mapAuthError,
      successMessage: (credential) =>
        `Пользователь ${credential.user.email ?? email} зарегистрирован`,
      onSuccess: async () => {
        await router.push({ name: ROUTE_NAME.ACCOUNT })
      },
    })

  const requestPasswordReset = (email: string): Promise<boolean> =>
    run(() => sendReset(email), {
      mapError: mapAuthError,
      successMessage:
        'Проверьте почту и перейдите по ссылке для восстановления пароля',
      onSuccess: async () => {
        await router.push({ name: ROUTE_NAME.LOGIN })
      },
    })

  const logout = (options: { goToLogin?: boolean } = {}): Promise<boolean> =>
    run(() => signOutUser(), {
      mapError: mapAuthError,
      successMessage: 'Вы вышли из системы',
      onSuccess: async () => {
        if (options.goToLogin) {
          await router.push({ name: ROUTE_NAME.LOGIN })
        }
      },
    })

  return {
    isPending,
    login,
    register,
    requestPasswordReset,
    logout,
  }
}
