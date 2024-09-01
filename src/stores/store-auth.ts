import { defineStore, } from 'pinia'

import type { AuthError, } from 'firebase/auth'
import {
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'

import { Loading, } from 'quasar'

import type { TAuthLinks, TAuthState, CurrentUser, } from 'src/types/auth'
import { INPUT_TYPE, PASSWORD_VISIBILITY_ICON, } from 'src/types/form'
import { ROUTE_ICON, ROUTE_NAME, ROUTE_TYPE, } from 'src/types/route'
import { STORE_TYPES, } from 'src/types/store'

import { createNotify, } from 'src/utils/notify'

import { auth, } from 'src/boot/firebase'

const getDefaultAuthState = (): TAuthState => ({
  currentUser: null,
  loggedIn: false,
  isCheckedPolicy: true,
  passwordVisibility: false,
  loading: false,
  valid: false,
})

export const useStoreAuth = defineStore(STORE_TYPES.AUTH, {
  state: getDefaultAuthState,
  getters: {
    disabledSubmitButton: (state) => !state.valid,
    iconPassword: (state) => state.passwordVisibility
      ? PASSWORD_VISIBILITY_ICON.ON
      : PASSWORD_VISIBILITY_ICON.OFF,
    currentInputType: (state) => state.passwordVisibility
      ? INPUT_TYPE.TEXT
      : INPUT_TYPE.PASSWORD,
    routerMenuLinks (): TAuthLinks {
      return [
        {
          title: ROUTE_NAME.HOME,
          icon: ROUTE_ICON.HOME,
          path: import.meta.env.VITE_ROUTER_BASE,
          visible: this.loggedIn,
        },
        {
          title: ROUTE_NAME.REGISTER,
          icon: ROUTE_ICON.REGISTER,
          path: ROUTE_TYPE.REGISTER,
          visible: !this.loggedIn,
        },
        {
          title: ROUTE_NAME.LOGIN,
          icon: ROUTE_ICON.LOGIN,
          path: ROUTE_TYPE.LOGIN,
          visible: !this.loggedIn,
        },
        {
          title: ROUTE_NAME.FORGOT,
          icon: ROUTE_ICON.FORGOT,
          path: ROUTE_TYPE.FORGOT,
          visible: !this.loggedIn,
        },
        {
          title: ROUTE_NAME.ACCOUNT,
          icon: ROUTE_ICON.ACCOUNT,
          path: ROUTE_TYPE.ACCOUNT,
          visible: this.loggedIn,
        },
        {
          title: ROUTE_NAME.NEW_EMPLOYEE,
          icon: ROUTE_ICON.NEW_EMPLOYEE,
          path: ROUTE_TYPE.NEW_EMPLOYEE,
          visible: this.loggedIn,
        },
      ]
    },
  },
  actions: {
    togglePasswordVisible () {
      this.passwordVisibility = !this.passwordVisibility
    },
    watchAuthStateChanged () {
      onAuthStateChanged(auth, (user: CurrentUser) => {
        this.currentUser = user
        this.loggedIn = user !== null
      })
    },
    // https://firebase.google.com/docs/auth/web/password-auth?hl=en&authuser=0#create_a_password-based_account
    onRegisterSuccess (uid: string, email: string) {
      this.router.push({ path: ROUTE_TYPE.ACCOUNT, }).then(() =>
        createNotify(`Пользователь c id ${uid} зарегистрирован на email ${email}`, 'green-4', 'cloud_done')
      )
    },
    // https://firebase.google.com/docs/auth/web/password-auth?hl=en&authuser=0#sign_in_a_user_with_an_email_address_and_password
    onLoginSuccess () {
      this.router.push({ path: ROUTE_TYPE.ACCOUNT, })
    },
    onLogout (goToLogin?: boolean) {
      Loading.show()
      signOut(auth)
        .then(() => {
          goToLogin
            ? this.router.push({ path: ROUTE_TYPE.LOGIN, }).then(() => {
              this.onPostLogout()
            })
            : this.onPostLogout()
        }
        )
        .catch((error) => {
          this.createErrorMessage(error)
        })
        .finally(() => {
          Loading.hide()
        })
    },
    onForgotSuccess () {
      this.router.push({ path: ROUTE_TYPE.LOGIN, }).then(() => {
        createNotify('Проверьте почту и перейдите по ссылке для восстановления пароля', 'green-4', 'cloud_done')
      })
    },
    onPostLogout () {
      createNotify('Вы вышли из системы', 'green-4', 'cloud_done')
    },
    createErrorMessage (error: AuthError) {
      createNotify(error?.code, 'red-5', 'warning')
    },
  },
})
