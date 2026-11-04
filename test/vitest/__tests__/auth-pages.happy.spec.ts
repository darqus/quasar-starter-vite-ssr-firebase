import { flushPromises, mount } from '@vue/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

import { createPinia } from 'pinia'
import { Notify } from 'quasar'

const authApiMocks = vi.hoisted(() => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  sendReset: vi.fn(),
  signOutUser: vi.fn(),
  observeAuthState: vi.fn(() => () => {}),
}))
vi.mock('@/features/auth/api/authApi', () => authApiMocks)

import ForgotPage from '@/pages/auth/ForgotPage.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import FormFields from '@/shared/form/FormFields.vue'
import { ROUTE_NAME, ROUTE_PATH } from '@/types/route'

type PageComponent = typeof LoginPage

// Minimal router for pages
function makeRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: ROUTE_PATH.LOGIN, name: ROUTE_NAME.LOGIN, component: LoginPage },
      {
        path: ROUTE_PATH.REGISTER,
        name: ROUTE_NAME.REGISTER,
        component: RegisterPage,
      },
      {
        path: ROUTE_PATH.HOME,
        name: ROUTE_NAME.HOME,
        component: { template: '<div>home</div>' },
      },
      {
        path: ROUTE_PATH.FORGOT,
        name: ROUTE_NAME.FORGOT,
        component: ForgotPage,
      },
      {
        path: ROUTE_PATH.ACCOUNT,
        name: ROUTE_NAME.ACCOUNT,
        component: { template: '<div>account</div>' },
      },
    ],
  })
}

async function mountPage(Page: PageComponent) {
  const pinia = createPinia()
  const router = makeRouter()

  const wrapper = mount(Page, {
    global: {
      plugins: [pinia, router],
      stubs: {
        QPage: { template: '<div><slot /></div>' },
        QForm: {
          name: 'QForm',
          template:
            '<form @submit.prevent="$emit(\'submit\')" @reset="$emit(\'reset\')"><slot /></form>',
          methods: { resetValidation() {}, validate: () => true },
          expose: ['resetValidation', 'validate'],
        },
      },
    },
  })

  await router.isReady()

  return { wrapper, router }
}

function setFieldModel(
  wrapper: ReturnType<typeof mount>,
  name: string,
  value: unknown
) {
  const formFields = wrapper.findComponent(FormFields)
  if (!formFields.exists()) {
    throw new Error('FormFields component not found')
  }
  const props = formFields.props() as {
    fields: Array<{ name: string; model: unknown }>
  }
  const field = props.fields.find((item) => item.name === name)
  if (!field) {
    throw new Error(`Field ${name} not found`)
  }
  field.model = value
}

function getFieldModel(
  wrapper: ReturnType<typeof mount>,
  name: string
): unknown {
  const formFields = wrapper.findComponent(FormFields)
  const props = formFields.props() as {
    fields: Array<{ name: string; model: unknown }>
  }
  return props.fields.find((item) => item.name === name)?.model
}

function emitFormSubmit(wrapper: ReturnType<typeof mount>) {
  const qform = wrapper.findComponent({ name: 'QForm' })
  if (!qform.exists()) {
    throw new Error('QForm component not found')
  }
  const vm = qform.vm as unknown as {
    $emit: (event: string, payload: { preventDefault: () => void }) => void
  }
  vm.$emit('submit', { preventDefault: () => {} })
}

async function submitValidLogin(wrapper: ReturnType<typeof mount>) {
  setFieldModel(wrapper, 'login', 'user@example.com')
  // Strong password to satisfy zPasswordStrict
  setFieldModel(wrapper, 'password', 'Qwe123!@')
  emitFormSubmit(wrapper)
  await flushPromises()
  await flushPromises()
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

describe('Auth pages', () => {
  it('LoginPage signs in, navigates to account and resets fields', async () => {
    authApiMocks.signIn.mockResolvedValue({
      user: { email: 'user@example.com' },
    })

    const { wrapper, router } = await mountPage(LoginPage)
    const pushSpy = vi.spyOn(router, 'push')

    await submitValidLogin(wrapper)

    expect(authApiMocks.signIn).toHaveBeenCalledWith(
      'user@example.com',
      'Qwe123!@'
    )
    expect(pushSpy).toHaveBeenCalledWith({ name: ROUTE_NAME.ACCOUNT })
    expect(getFieldModel(wrapper, 'login')).toBe('')
    expect(getFieldModel(wrapper, 'password')).toBe('')
  })

  it('LoginPage shows a human-readable error and stays on the page', async () => {
    authApiMocks.signIn.mockRejectedValue({ code: 'auth/invalid-credential' })

    const { wrapper, router } = await mountPage(LoginPage)
    const pushSpy = vi.spyOn(router, 'push')
    const notifySpy = vi.spyOn(Notify, 'create')

    await submitValidLogin(wrapper)

    expect(pushSpy).not.toHaveBeenCalledWith({ name: ROUTE_NAME.ACCOUNT })
    expect(notifySpy).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Неверный email или пароль' })
    )
    // The form keeps user input on failure.
    expect(getFieldModel(wrapper, 'login')).toBe('user@example.com')
  })

  it('RegisterPage signs up, navigates to account and resets fields', async () => {
    authApiMocks.signUp.mockResolvedValue({
      user: { email: 'user@example.com' },
    })

    const { wrapper, router } = await mountPage(RegisterPage)
    const pushSpy = vi.spyOn(router, 'push')

    await submitValidLogin(wrapper)

    expect(authApiMocks.signUp).toHaveBeenCalledWith(
      'user@example.com',
      'Qwe123!@'
    )
    expect(pushSpy).toHaveBeenCalledWith({ name: ROUTE_NAME.ACCOUNT })
    expect(getFieldModel(wrapper, 'login')).toBe('')
    expect(getFieldModel(wrapper, 'password')).toBe('')
  })

  it('RegisterPage maps email-already-in-use errors', async () => {
    authApiMocks.signUp.mockRejectedValue({ code: 'auth/email-already-in-use' })

    const { wrapper } = await mountPage(RegisterPage)
    const notifySpy = vi.spyOn(Notify, 'create')

    await submitValidLogin(wrapper)

    expect(notifySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Аккаунт с таким email уже существует',
      })
    )
  })

  it('ForgotPage sends a reset email and returns to login', async () => {
    authApiMocks.sendReset.mockResolvedValue(undefined)

    const { wrapper, router } = await mountPage(ForgotPage)
    const pushSpy = vi.spyOn(router, 'push')

    setFieldModel(wrapper, 'login', 'user@example.com')
    emitFormSubmit(wrapper)
    await flushPromises()
    await flushPromises()

    expect(authApiMocks.sendReset).toHaveBeenCalledWith('user@example.com')
    expect(pushSpy).toHaveBeenCalledWith({ name: ROUTE_NAME.LOGIN })
    expect(getFieldModel(wrapper, 'login')).toBe('')
  })

  it('LoginPage: validation blocks submit when the form is invalid', async () => {
    const { wrapper } = await mountPage(LoginPage)

    setFieldModel(wrapper, 'login', 'user@example.com')
    setFieldModel(wrapper, 'password', '')
    emitFormSubmit(wrapper)
    await flushPromises()

    expect(authApiMocks.signIn).not.toHaveBeenCalled()
  })
})
