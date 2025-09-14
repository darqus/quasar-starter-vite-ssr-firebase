import { flushPromises, mount } from '@vue/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

import { createPinia } from 'pinia'


import FormFields from 'src/components/form-fields/FormFields.vue'
import LoginPage from 'src/pages/auth/LoginPage.vue'
import RegisterPage from 'src/pages/auth/RegisterPage.vue'
import { ROUTE_TYPE } from 'src/types/route'

// Minimal router for pages
function makeRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: `/${ROUTE_TYPE.LOGIN}`, component: LoginPage },
      { path: `/${ROUTE_TYPE.REGISTER}`, component: RegisterPage },
      { path: '/', component: { template: '<div>home</div>' } },
      { path: `/${ROUTE_TYPE.FORGOT}`, component: { template: '<div>forgot</div>' } },
  { path: `/${ROUTE_TYPE.ACCOUNT}`, component: { template: '<div>account</div>' } },
    ],
  })
}

// Mock store-auth actions used in pages to avoid Firebase calls
const onLoginSuccessSpy = vi.fn()
const onRegisterSuccessSpy = vi.fn()
const createErrorMessageSpy = vi.fn()

vi.mock('src/stores/store-auth', () => ({
  useStoreAuth: () => ({
    loading: false,
    valid: true,
    disabledSubmitButton: false,
    onLoginSuccess: onLoginSuccessSpy,
    onRegisterSuccess: onRegisterSuccessSpy,
    createErrorMessage: createErrorMessageSpy,
  }),
}))

// Simulate Firebase auth functions used in pages
vi.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  signInWithEmailAndPassword: () => Promise.resolve({}),
  createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'uid', email: 'user@example.com' } }),
}))

function setFieldModel(wrapper: ReturnType<typeof mount>, name: string, value: unknown) {
  const formFields = wrapper.findComponent(FormFields)
  if (!formFields.exists()) throw new Error('FormFields component not found')
  const props = formFields.props() as { fields: Array<{ name: string; model: unknown }> }
  const f = props.fields.find((x) => x.name === name)
  if (!f) throw new Error(`Field ${name} not found`)
  f.model = value
}

beforeEach(() => {
  onLoginSuccessSpy.mockReset()
  onRegisterSuccessSpy.mockReset()
  createErrorMessageSpy.mockReset()
})

async function clickByText(wrapper: ReturnType<typeof mount>, text: string) {
  const btn = wrapper.findAll('button').find((b) => b.text().includes(text))
  if (!btn) throw new Error(`Button ${text} not found`)
  await btn.trigger('click')
}

function emitFormSubmit(wrapper: ReturnType<typeof mount>) {
  const qform = wrapper.findComponent({ name: 'QForm' })
  if (!qform.exists()) throw new Error('QForm component not found')
  const vm = qform.vm as unknown as {
    $emit: (e: string, evt: { preventDefault: () => void }) => void
  }
  vm.$emit('submit', { preventDefault: () => {} })
}

describe('Auth pages happy path', () => {
  it('LoginPage submits and calls success handler', async () => {
  const pinia = createPinia()
    const router = makeRouter()

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          QPage: { template: '<div><slot /></div>' },
          QForm: {
            name: 'QForm',
            template: '<form @submit.prevent="$emit(\'submit\')" @reset="$emit(\'reset\')"><slot /></form>',
            methods: { resetValidation() {}, validate: () => true },
            expose: ['resetValidation', 'validate'],
          },
        },
      },
    })

    await router.isReady()

    setFieldModel(wrapper, 'login', 'user@example.com')
    setFieldModel(wrapper, 'password', '123456')

  emitFormSubmit(wrapper)
  await flushPromises()
  await flushPromises()

    // ensure no crash and page rendered
    expect(wrapper.html()).toContain('Вход')
    expect(onLoginSuccessSpy).toHaveBeenCalled()
  })

  it('RegisterPage submits and calls success handler', async () => {
  const pinia = createPinia()
    const router = makeRouter()

    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          QPage: { template: '<div><slot /></div>' },
          QForm: {
            name: 'QForm',
            template: '<form @submit.prevent="$emit(\'submit\')" @reset="$emit(\'reset\')"><slot /></form>',
            methods: { resetValidation() {}, validate: () => true },
            expose: ['resetValidation', 'validate'],
          },
        },
      },
    })

    await router.isReady()

    setFieldModel(wrapper, 'login', 'user@example.com')
    setFieldModel(wrapper, 'password', '123456')

  emitFormSubmit(wrapper)
  await flushPromises()
  await flushPromises()

    expect(wrapper.html()).toContain('Регистрация')
    expect(onRegisterSuccessSpy).toHaveBeenCalled()
  })

  it('LoginPage: validation blocks submit when invalid', async () => {
    const pinia = createPinia()
    const router = makeRouter()

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          QPage: { template: '<div><slot /></div>' },
          // Stub QForm with validate() returning false
          QForm: {
            name: 'QForm',
            template: '<form @submit.prevent="$emit(\'submit\')" @reset="$emit(\'reset\')"><slot /></form>',
            methods: { resetValidation() {}, validate: () => false },
            expose: ['resetValidation', 'validate'],
          },
        },
      },
    })

    await router.isReady()

    setFieldModel(wrapper, 'login', 'user@example.com')
    setFieldModel(wrapper, 'password', '')

    await clickByText(wrapper, 'Войти')
    await flushPromises()

    expect(onLoginSuccessSpy).not.toHaveBeenCalled()
    expect(createErrorMessageSpy).not.toHaveBeenCalled() // страница сама не кидает ошибок в этом месте
  })
})
