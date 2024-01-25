import { defineStore, } from 'pinia'

import type { AuthError, } from 'firebase/auth'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail, // updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

import type { TAuthLinks, TAuthState, CurrentUser, } from '@/types/auth'
import { INPUT_TYPE, PASSWORD_VISIBILITY_ICON_MAP, ROUTE_ICON, ROUTE_NAME, ROUTE_TYPE, STORE_TYPES, } from '@/types/enums'
import { type Form, } from '@/types/models'

import { createNotify, } from '@/utils/notify'

import { auth, } from '@/boot/firebase'

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
      ? PASSWORD_VISIBILITY_ICON_MAP.ON
      : PASSWORD_VISIBILITY_ICON_MAP.OFF,
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
    toggleLoading () {
      this.loading = !this.loading
    },
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
    onRegister (currentAuthForm: Form) {
      this.toggleLoading()
      createUserWithEmailAndPassword(auth, currentAuthForm[0].model, currentAuthForm[1].model)
        .then(({ user, }) => {
          const { uid, email, } = user

          if (currentAuthForm[0].model === email && uid) {
            this.router.push({ path: ROUTE_TYPE.LOGIN, }).then(() =>
              createNotify(`Пользователь c id ${uid} зарегистрирован на email ${email}`)
            )
          }
        })
        .catch((error) => {
          this.createErrorMessage(error)
        })
        .finally(() => {
          this.toggleLoading()
        })
    },
    // https://firebase.google.com/docs/auth/web/password-auth?hl=en&authuser=0#sign_in_a_user_with_an_email_address_and_password
    onLogin (currentAuthForm: Form) {
      this.toggleLoading()
      signInWithEmailAndPassword(
        auth,
        currentAuthForm[0].model,
        currentAuthForm[1].model
      )
        .then(() => {
          this.router.push({ path: ROUTE_TYPE.ACCOUNT, })
          /* .then(() => {
            }) */
        }
        )
        .catch((error) => {
          this.createErrorMessage(error)
        })
        .finally(() => {
          this.toggleLoading()
        })
    },
    onLogout (goToLogin?: boolean) {
      this.toggleLoading()
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
          this.toggleLoading()
        })
    },
    onForgot (currentAuthForm: Form) {
      this.toggleLoading()
      sendPasswordResetEmail(auth, currentAuthForm[0].model)
        .then(() => {
          this.router.push({ path: ROUTE_TYPE.LOGIN, }).then(() => {
            createNotify('Проверьте почту и перейдите по ссылке для восстановления пароля', 'green-4', 'cloud_done')
            currentAuthForm[0].model = ''
          })
        })
        .catch((error) => {
          this.createErrorMessage(error)
        })
        .finally(() => {
          this.toggleLoading()
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
