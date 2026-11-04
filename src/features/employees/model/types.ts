export type TNewEmployee = {
  id: string
  name: string
  email: string
  position: string
  level: string
  description: string
  rate: number
}

export type TLevel = {
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
