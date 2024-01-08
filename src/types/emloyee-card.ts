import type { TNewEmployee, } from './new-employee'

type TLevel = {
  key: string
  name: string
  color: string
}

export const LEVELS_MAP: TLevel[] = [
  {
    key: 'PADAVAN',
    name: 'Падаван',
    color: 'secondary',
  },
  {
    key: 'JEDY',
    name: 'Джедай',
    color: 'primary',
  },
  {
    key: 'SITH',
    name: 'Ситх',
    color: 'dark',
  },
]

export type TEmployeeCardsState = {
  isFilterVisible: boolean
  employeeList: TNewEmployee[],
  selectedFromLevel: TNewEmployee | null,
  selectedFromPosition: TNewEmployee | null,
  selectedFromRating: TNewEmployee | null,
}
