import { mount } from '@vue/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { createPinia } from 'pinia'

import UserCardList from '@/components/UserCardList.vue'

/**
 * Regression guard for the card grid.
 *
 * Quasar's stylesheet is loaded unlayered, so it beats every `@layer` rule
 * of the app. When the grid container also carried Quasar's `.row` class,
 * the unlayered `display: flex` won over the layered `display: grid` and
 * the employee cards ended up with content-dependent, unequal widths.
 */

const store = {
  isFilterVisible: false,
  isEmployeeList: true,
  optionsEmployeeLevel: [],
  optionsEmployeePosition: [],
  optionsEmployeeRating: [],
  selectedFromLevel: null,
  selectedFromPosition: null,
  selectedFromRating: null,
  filteredEmployeeList: [
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
  ],
  getColorFromLevel: () => 'primary',
  getEmployeeList: vi.fn(() => Promise.resolve()),
}

vi.mock('@/stores/store-employee-cards', () => ({
  useStoreEmployeeCards: () => store,
}))

function mountList() {
  return mount(UserCardList, {
    global: { plugins: [createPinia()] },
  })
}

const LAYOUT_UTILITY = /^(row|column|flex|col(-|$))/

describe('UserCardList', () => {
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
})
