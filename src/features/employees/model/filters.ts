import type { TNewEmployee } from './types'

export type EmployeeFilters = {
  level: string | null
  position: string | null
  rating: number | null
}

/**
 * Pure employee filter. Every filled condition narrows the result (AND),
 * empty conditions are ignored. Kept outside the store to make the rule
 * testable without Pinia.
 */
export const filterEmployees = (
  employees: readonly TNewEmployee[],
  filters: EmployeeFilters
): TNewEmployee[] =>
  employees.filter(
    ({ level, position, rate }) =>
      (filters.level === null || level === filters.level) &&
      (filters.position === null || position === filters.position) &&
      (filters.rating === null || rate === filters.rating)
  )
