/* eslint-disable import/order */
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

import FormFields from 'src/components/form-fields/FormFields.vue'
import NewEmployeePage from 'src/pages/employee/NewEmployeePage.vue'
import { ROUTE_TYPE } from 'src/types/route'

// Router with just the page route
function makeRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: `/${ROUTE_TYPE.NEW_EMPLOYEE}`, component: NewEmployeePage },
      { path: '/', component: { template: '<div>home</div>' } },
    ],
  })
}

// Spy on addDoc used by the page (use hoisted ref to be available during mock hoisting)
const addDocSpy = vi.hoisted(() => vi.fn(() => Promise.resolve()))
vi.mock('src/boot/firebase', () => ({
  addDoc: addDocSpy,
}))

// Stub Quasar Loading and Notify used by the page
// No need to mock 'quasar' module; Quasar plugin is registered in test setup

function setFieldModel(wrapper: ReturnType<typeof mount>, name: string, value: unknown) {
  const formFields = wrapper.findComponent(FormFields)
  if (!formFields.exists()) throw new Error('FormFields component not found')
  const props = formFields.props() as { fields: Array<{ name: string; model: unknown }> }
  const f = props.fields.find((x) => x.name === name)
  if (!f) throw new Error(`Field ${name} not found`)
  f.model = value
}

function emitFormSubmit(wrapper: ReturnType<typeof mount>) {
  const qform = wrapper.findComponent({ name: 'QForm' })
  if (!qform.exists()) throw new Error('QForm component not found')
  const vm = qform.vm as unknown as { $emit: (e: string) => void }
  ;(vm as unknown as { $emit: (e: string, evt: { preventDefault: () => void }) => void }).$emit(
    'submit',
    { preventDefault: () => {} }
  )
}

describe('NewEmployeePage smoke', () => {
  it('submits form and sends correct payload', async () => {
    const pinia = createPinia()
    const router = makeRouter()

    const wrapper = mount(NewEmployeePage, {
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

    setFieldModel(wrapper, 'fio', 'Иван Иванов')
    setFieldModel(wrapper, 'login', 'ivan@example.com')
    setFieldModel(wrapper, 'position', 'Разработчик')
    setFieldModel(wrapper, 'level', 'Джедай')
    setFieldModel(wrapper, 'rate', '5')
    setFieldModel(wrapper, 'description', 'Отличный специалист')

  emitFormSubmit(wrapper)
    await flushPromises()

  expect(addDocSpy).toHaveBeenCalledTimes(1)
  const calls = addDocSpy.mock.calls as unknown as unknown[][]
  expect(Array.isArray(calls) && calls.length === 1).toBe(true)
  const collectionName = String(calls[0]?.[0])
  const payload = (calls[0]?.[1] ?? {}) as Record<string, unknown>
    expect(collectionName).toBe('employees')
    expect(payload).toMatchObject({
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      position: 'Разработчик',
      level: 'Джедай',
      rate: '5',
      description: 'Отличный специалист',
    })

    // After success, reset should clear fields
    const formFields = wrapper.findComponent(FormFields)
    const props = formFields.props() as { fields: Array<{ name: string; model: unknown }> }
    expect(props.fields.find((f) => f.name === 'fio')?.model).toBe('')
    expect(props.fields.find((f) => f.name === 'login')?.model).toBe('')
    expect(props.fields.find((f) => f.name === 'position')?.model).toBe('')
  expect(props.fields.find((f) => f.name === 'level')?.model).toBe('')
  expect(props.fields.find((f) => f.name === 'rate')?.model).toBe('')
    expect(props.fields.find((f) => f.name === 'description')?.model).toBe('')
  })
})
