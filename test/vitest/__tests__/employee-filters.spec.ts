import { describe, expect, it } from 'vitest'

import { filterEmployees, type TNewEmployee } from '@/features/employees'

const employee = (
  id: string,
  overrides: Partial<TNewEmployee> = {}
): TNewEmployee => ({
  id,
  name: `Employee ${id}`,
  email: `${id}@example.com`,
  position: 'Разработчик',
  level: 'Джедай',
  description: '',
  rate: 5,
  ...overrides,
})

const employees: TNewEmployee[] = [
  employee('1'),
  employee('2', { position: 'Менеджер', rate: 3 }),
  employee('3', { level: 'Ситх' }),
]

describe('filterEmployees', () => {
  it('returns every employee when all filters are empty', () => {
    expect(
      filterEmployees(employees, {
        level: null,
        position: null,
        rating: null,
      })
    ).toHaveLength(3)
  })

  it('applies every filled filter with AND semantics', () => {
    const result = filterEmployees(employees, {
      level: 'Джедай',
      position: 'Разработчик',
      rating: null,
    })

    expect(result.map(({ id }) => id)).toEqual(['1'])
  })

  it('filters by rating only', () => {
    const result = filterEmployees(employees, {
      level: null,
      position: null,
      rating: 3,
    })

    expect(result.map(({ id }) => id)).toEqual(['2'])
  })

  it('returns an empty list when no employee matches', () => {
    const result = filterEmployees(employees, {
      level: 'Ситх',
      position: 'Менеджер',
      rating: null,
    })

    expect(result).toEqual([])
  })
})
