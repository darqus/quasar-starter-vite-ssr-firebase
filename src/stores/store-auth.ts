import { computed, ref } from 'vue'

import { type AuthError, onAuthStateChanged, signOut } from 'firebase/auth'

import { defineStore } from 'pinia'

import { Loading } from 'quasar'

import { auth } from 'src/boot/firebase'
import type { CurrentUser, TAuthLinks } from 'src/types/auth'
import { INPUT_TYPE, PASSWORD_VISIBILITY_ICON } from 'src/types/form'
import { ROUTE_ICON, ROUTE_NAME, ROUTE_TYPE } from 'src/types/route'
import { STORE_TYPES } from 'src/types/store'
import { createNotify } from 'src/utils/notify'

import type { Router } from 'vue-router'

export const useStoreAuth = defineStore(STORE_TYPES.AUTH, () => {
  // state
  const currentUser = ref<CurrentUser | null>(null)
  const loggedIn = ref(false)
  const isCheckedPolicy = ref(true)
  const passwordVisibility = ref(false)
  const loading = ref(false)
  const valid = ref(false)

  // getters (computed)
  const disabledSubmitButton = computed(() => !valid.value)
  const iconPassword = computed(() =>
    passwordVisibility.value
      ? PASSWORD_VISIBILITY_ICON.ON
      : PASSWORD_VISIBILITY_ICON.OFF
  )
  const currentInputType = computed(() =>
    passwordVisibility.value ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD
  )
  const routerMenuLinks = computed<TAuthLinks>(() => [
    {
      title: ROUTE_NAME.HOME,
      icon: ROUTE_ICON.HOME,
      path: import.meta.env.VITE_ROUTER_BASE,
      visible: loggedIn.value,
    },
    {
      title: ROUTE_NAME.REGISTER,
      icon: ROUTE_ICON.REGISTER,
      path: ROUTE_TYPE.REGISTER,
      visible: !loggedIn.value,
    },
    {
      title: ROUTE_NAME.LOGIN,
      icon: ROUTE_ICON.LOGIN,
      path: ROUTE_TYPE.LOGIN,
      visible: !loggedIn.value,
    },
    {
      title: ROUTE_NAME.FORGOT,
      icon: ROUTE_ICON.FORGOT,
      path: ROUTE_TYPE.FORGOT,
      visible: !loggedIn.value,
    },
    {
      title: ROUTE_NAME.ACCOUNT,
      icon: ROUTE_ICON.ACCOUNT,
      path: ROUTE_TYPE.ACCOUNT,
      visible: loggedIn.value,
    },
    {
      title: ROUTE_NAME.NEW_EMPLOYEE,
      icon: ROUTE_ICON.NEW_EMPLOYEE,
      path: ROUTE_TYPE.NEW_EMPLOYEE,
      visible: loggedIn.value,
    },
  ])

  // actions
  const togglePasswordVisible = () => {
    passwordVisibility.value = !passwordVisibility.value
  }

  const watchAuthStateChanged = () => {
    onAuthStateChanged(auth, (user: CurrentUser) => {
      currentUser.value = user
      loggedIn.value = user !== null
    })
  }

  // https://firebase.google.com/docs/auth/web/password-auth?hl=en&authuser=0#create_a_password-based_account
  const onRegisterSuccess = (uid: string, email: string, router: Router) => {
    void router
      .push({ path: ROUTE_TYPE.ACCOUNT })
      .then(() =>
        createNotify(
          `Пользователь c id ${uid} зарегистрирован на email ${email}`,
          'green-4',
          'cloud_done'
        )
      )
  }

  // https://firebase.google.com/docs/auth/web/password-auth?hl=en&authuser=0#sign_in_a_user_with_an_email_address_and_password
  const onLoginSuccess = (router: Router) => {
    void router.push({ path: ROUTE_TYPE.ACCOUNT })
  }

  const onPostLogout = () => {
    createNotify('Вы вышли из системы', 'green-4', 'cloud_done')
  }

  const createErrorMessage = (error: AuthError) => {
    createNotify(error?.code, 'red-5', 'warning')
  }

  const onLogout = (router: Router, goToLogin?: boolean) => {
    Loading.show()
    signOut(auth)
      .then(() => {
        if (goToLogin) {
          void router
            .push({ path: ROUTE_TYPE.LOGIN })
            .then(() => onPostLogout())
        } else {
          onPostLogout()
        }
      })
      .catch((error) => {
        createErrorMessage(error as AuthError)
      })
      .finally(() => {
        Loading.hide()
      })
  }

  const onForgotSuccess = (router: Router) => {
    void router.push({ path: ROUTE_TYPE.LOGIN }).then(() => {
      createNotify(
        'Проверьте почту и перейдите по ссылке для восстановления пароля',
        'green-4',
        'cloud_done'
      )
    })
  }

  return {
    // state
    currentUser,
    loggedIn,
    isCheckedPolicy,
    passwordVisibility,
    loading,
    valid,

    // getters
    disabledSubmitButton,
    iconPassword,
    currentInputType,
    routerMenuLinks,

    // actions
    togglePasswordVisible,
    watchAuthStateChanged,
    onRegisterSuccess,
    onLoginSuccess,
    onLogout,
    onForgotSuccess,
    onPostLogout,
    createErrorMessage,
  }
})
