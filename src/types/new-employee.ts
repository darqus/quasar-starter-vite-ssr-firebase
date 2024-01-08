import type { Form, Loading, Valid, } from './models'

export type TNewEmployee = {
  id: string
  name: string
  email:string
  position: string
  level:string
  description: string
  rate: number
}

export type TNewEmployeeState = {
  formEmployee: Form
} & Loading & Valid
