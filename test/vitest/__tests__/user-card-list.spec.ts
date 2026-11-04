import { flushPromises, mount } from '@vue/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createPinia } from 'pinia'

import { UserCardList } from '@/features/employees'

/**
 * Regression guard for the card grid.
 *
 * Quasar's stylesheet is loaded unlayered, so it beats every `@layer` rule
 * of the app. When the grid container also carried Quasar's `.row` class,
 * the unlayered `display: flex` won over the layered `display: grid` and
 * the employee cards ended up with content-dependent, unequal widths.
 */

const employees = [
  {
    id: '1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    position: 'Engineer',
    level: 'Senior',
    description: '',
    rate: 5,
  },
  {
    id: '2',
    name: 'Grace Hopper',
    email: 'grace@example.com',
    position: 'Engineer',
    level: 'Lead',
    description: '',
    rate: 4,
  },
]

const store = {
  isFilterVisible: false,
  isEmployeeList: true,
  loading: false,
  error: null as string | null,
  optionsEmployeeLevel: [] as string[],
  optionsEmployeePosition: [] as string[],
  optionsEmployeeRating: [] as number[],
  selectedFromLevel: null as string | null,
  selectedFromPosition: null as string | null,
  selectedFromRating: null as number | null,
  filteredEmployeeList: [...employees],
  getColorFromLevel: () => 'primary',
  getEmployeeList: vi.fn(() => Promise.resolve()),
}

vi.mock('@/features/employees/model/store', () => ({
  useStoreEmployeeCards: () => store,
}))

function mountList() {
  return mount(UserCardList, {
    global: { plugins: [createPinia()] },
  })
}

const LAYOUT_UTILITY = /^(row|column|flex|col(-|$))/

beforeEach(() => {
  store.loading = false
  store.error = null
  store.filteredEmployeeList = [...employees]
  store.getEmployeeList.mockClear()
})

describe('UserCardList', () => {
  it('loads employees on mount', () => {
    mountList()

    expect(store.getEmployeeList).toHaveBeenCalledTimes(1)
  })

  it('renders the grid container without Quasar layout utilities', () => {
    const wrapper = mountList()
    const grid = wrapper.find('.user-card-list')
    const layoutUtilities = grid
      .classes()
      .filter((name) => LAYOUT_UTILITY.test(name))

    expect(grid.exists()).toBe(true)
    expect(layoutUtilities).toEqual([])
  })

  it('renders one card per employee', () => {
    const wrapper = mountList()
    const grid = wrapper.find('.user-card-list')

    expect(grid.findAll('.q-card')).toHaveLength(2)
  })

  it('shows a progress bar while loading', () => {
    store.loading = true
    store.filteredEmployeeList = []

    const wrapper = mountList()

    expect(wrapper.find('.q-linear-progress').exists()).toBe(true)
    expect(wrapper.find('.user-card-list').exists()).toBe(false)
  })

  it('shows an error with a retry button', async () => {
    store.error = 'Не удалось загрузить список сотрудников'
    store.filteredEmployeeList = []

    const wrapper = mountList()

    expect(wrapper.text()).toContain('Не удалось загрузить список сотрудников')

    const retry = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Повторить'))
    expect(retry).toBeTruthy()

    await retry?.trigger('click')
    await flushPromises()

    expect(store.getEmployeeList).toHaveBeenCalledTimes(2)
  })

  it('shows an empty state when there is nothing to render', () => {
    store.filteredEmployeeList = []

    const wrapper = mountList()

    expect(wrapper.text()).toContain('Сотрудники не найдены')
    expect(wrapper.find('.user-card-list').exists()).toBe(false)
  })
})
