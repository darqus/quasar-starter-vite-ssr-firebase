import { nextTick } from 'vue'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'

const employeeRepositoryMocks = vi.hoisted(() => ({
  listEmployees: vi.fn(),
}))
vi.mock(
  '@/features/employees/api/employeeRepository',
  () => employeeRepositoryMocks
)

import { type TNewEmployee, useStoreEmployeeCards } from '@/features/employees'

const employees: TNewEmployee[] = [
  {
    id: '1',
    name: 'Jedi Developer',
    email: 'jedi@example.com',
    position: 'Разработчик',
    level: 'Джедай',
    description: '',
    rate: 5,
  },
  {
    id: '2',
    name: 'Jedi Manager',
    email: 'manager@example.com',
    position: 'Менеджер',
    level: 'Джедай',
    description: '',
    rate: 3,
  },
  {
    id: '3',
    name: 'Sith Developer',
    email: 'sith@example.com',
    position: 'Разработчик',
    level: 'Ситх',
    description: '',
    rate: 5,
  },
]

describe('store-employee-cards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    employeeRepositoryMocks.listEmployees.mockReset()
  })

  it('matches all selected filters (AND)', () => {
    const store = useStoreEmployeeCards()
    store.employeeList = employees
    store.selectedFromLevel = 'Джедай'
    store.selectedFromPosition = 'Разработчик'

    expect(store.filteredEmployeeList.map(({ id }) => id)).toEqual(['1'])
  })

  it('returns all employees when no filters are selected', () => {
    const store = useStoreEmployeeCards()
    store.employeeList = employees

    expect(store.filteredEmployeeList).toHaveLength(3)
  })

  it('clears selections when the filter panel is hidden', async () => {
    const store = useStoreEmployeeCards()
    store.employeeList = employees
    store.isFilterVisible = true
    await nextTick()
    store.selectedFromLevel = 'Ситх'
    store.selectedFromRating = 5

    store.isFilterVisible = false
    await nextTick()

    expect(store.selectedFromLevel).toBeNull()
    expect(store.selectedFromRating).toBeNull()
    expect(store.filteredEmployeeList).toHaveLength(3)
  })

  it('loads employees from the repository', async () => {
    employeeRepositoryMocks.listEmployees.mockResolvedValue(employees)

    const store = useStoreEmployeeCards()
    await store.getEmployeeList()

    expect(store.employeeList).toEqual(employees)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('exposes loading state while the request is in flight', async () => {
    let resolveEmployees: ((value: TNewEmployee[]) => void) | undefined
    employeeRepositoryMocks.listEmployees.mockImplementation(
      () =>
        new Promise<TNewEmployee[]>((resolve) => {
          resolveEmployees = resolve
        })
    )

    const store = useStoreEmployeeCards()
    const request = store.getEmployeeList()

    expect(store.loading).toBe(true)

    resolveEmployees?.(employees)
    await request

    expect(store.loading).toBe(false)
    expect(store.employeeList).toEqual(employees)
  })

  it('clears the list on an empty response', async () => {
    employeeRepositoryMocks.listEmployees.mockResolvedValue([])

    const store = useStoreEmployeeCards()
    store.employeeList = employees

    await store.getEmployeeList()

    expect(store.employeeList).toEqual([])
    expect(store.isEmployeeList).toBe(false)
  })

  it('maps repository errors to a readable message and clears the list', async () => {
    employeeRepositoryMocks.listEmployees.mockRejectedValue({
      code: 'permission-denied',
    })

    const store = useStoreEmployeeCards()
    store.employeeList = employees

    await store.getEmployeeList()

    expect(store.employeeList).toEqual([])
    expect(store.error).toBe('Недостаточно прав для выполнения операции')
    expect(store.loading).toBe(false)
  })
})
