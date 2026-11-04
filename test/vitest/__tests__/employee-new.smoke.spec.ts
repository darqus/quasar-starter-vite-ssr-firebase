import { flushPromises, mount } from '@vue/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

import { createPinia } from 'pinia'

const employeeRepositoryMocks = vi.hoisted(() => ({
  createEmployee: vi.fn(() => Promise.resolve('employee-id')),
  listEmployees: vi.fn(() => Promise.resolve([])),
}))
vi.mock(
  '@/features/employees/api/employeeRepository',
  () => employeeRepositoryMocks
)

import NewEmployeePage from '@/pages/employee/NewEmployeePage.vue'
import FormFields from '@/shared/form/FormFields.vue'
import { ROUTE_NAME, ROUTE_PATH } from '@/types/route'

// Router with just the page route
function makeRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: ROUTE_PATH.NEW_EMPLOYEE,
        name: ROUTE_NAME.NEW_EMPLOYEE,
        component: NewEmployeePage,
      },
      {
        path: ROUTE_PATH.HOME,
        name: ROUTE_NAME.HOME,
        component: { template: '<div>home</div>' },
      },
    ],
  })
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

describe('NewEmployeePage smoke', () => {
  it('submits form and sends correct payload to the repository', async () => {
    const pinia = createPinia()
    const router = makeRouter()

    const wrapper = mount(NewEmployeePage, {
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

    setFieldModel(wrapper, 'fio', 'Иван Иванов')
    setFieldModel(wrapper, 'login', 'ivan@example.com')
    setFieldModel(wrapper, 'position', 'Разработчик')
    setFieldModel(wrapper, 'level', 'Джедай')
    setFieldModel(wrapper, 'rate', '5')
    setFieldModel(wrapper, 'description', 'Отличный специалист')

    emitFormSubmit(wrapper)
    await flushPromises()

    expect(employeeRepositoryMocks.createEmployee).toHaveBeenCalledTimes(1)
    expect(employeeRepositoryMocks.createEmployee).toHaveBeenCalledWith({
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      position: 'Разработчик',
      level: 'Джедай',
      rate: '5',
      description: 'Отличный специалист',
    })

    // After success, reset should clear fields
    const formFields = wrapper.findComponent(FormFields)
    const props = formFields.props() as {
      fields: Array<{ name: string; model: unknown }>
    }
    expect(props.fields.find((f) => f.name === 'fio')?.model).toBe('')
    expect(props.fields.find((f) => f.name === 'login')?.model).toBe('')
    expect(props.fields.find((f) => f.name === 'position')?.model).toBe('')
    expect(props.fields.find((f) => f.name === 'level')?.model).toBe(null)
    expect(props.fields.find((f) => f.name === 'rate')?.model).toBe(null)
    expect(props.fields.find((f) => f.name === 'description')?.model).toBe('')
  })
})
