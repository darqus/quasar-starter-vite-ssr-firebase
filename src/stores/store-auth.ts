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
import { AUTH_TYPE, INPUT_TYPE, PASSWORD_VISIBILITY_ICON_MAP, ROUTE_ICON, ROUTE_NAME, ROUTE_TYPE, STORE_TYPES, } from '@/types/enums'

import { createNotify, } from '@/utils/notify'

import { FORM_FORGOT_PASSWORD, FORM_LOGIN_EMAIL, FORM_REGISTER, } from './authForms'

import { auth, } from '@/boot/firebase'

const getDefaultAuthState = (): TAuthState => ({
  formsAuth: {
    [AUTH_TYPE.LOGIN_EMAIL]: FORM_LOGIN_EMAIL(),
    [AUTH_TYPE.REGISTER]: FORM_REGISTER(),
    [AUTH_TYPE.FORGOT_PASSWORD]: FORM_FORGOT_PASSWORD(),
  },
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
    setValidForm () {
      this.valid = true
    },
    unsetValidForm () {
      this.valid = false
    },
    watchAuthStateChanged () {
      onAuthStateChanged(auth, (user: CurrentUser) => {
        this.currentUser = user
        this.loggedIn = user !== null
      })
    },
    // https://firebase.google.com/docs/auth/web/password-auth?hl=en&authuser=0#create_a_password-based_account
    onRegister () {
      this.toggleLoading()
      createUserWithEmailAndPassword(auth, this.formsAuth[AUTH_TYPE.REGISTER][0].model, this.formsAuth[AUTH_TYPE.REGISTER][1].model)
        .then(({ user, }) => {
          const { uid, email, } = user

          if (this.formsAuth[AUTH_TYPE.REGISTER][0].model === email && uid) {
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
    onLogin () {
      this.toggleLoading()
      signInWithEmailAndPassword(
        auth,
        this.formsAuth[AUTH_TYPE.LOGIN_EMAIL][0].model,
        this.formsAuth[AUTH_TYPE.LOGIN_EMAIL][1].model
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
    onResetForm (authType: string) {
      switch (authType) {
        case AUTH_TYPE.LOGIN_EMAIL: {
          this.formsAuth[AUTH_TYPE.LOGIN_EMAIL] = FORM_LOGIN_EMAIL()
          break
        }

        case AUTH_TYPE.REGISTER: {
          this.formsAuth[AUTH_TYPE.REGISTER] = FORM_REGISTER()
          break
        }

        default: {
          this.formsAuth[AUTH_TYPE.FORGOT_PASSWORD] = FORM_FORGOT_PASSWORD()
        }
      }
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
    onForgot () {
      this.toggleLoading()
      sendPasswordResetEmail(auth, this.formsAuth[AUTH_TYPE.FORGOT_PASSWORD][0].model)
        .then(() => {
          this.router.push({ path: ROUTE_TYPE.LOGIN, }).then(() => {
            createNotify('Проверьте почту и перейдите по ссылке для восстановления пароля', 'green-4', 'cloud_done')
            this.formsAuth[AUTH_TYPE.FORGOT_PASSWORD][0].model = ''
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
