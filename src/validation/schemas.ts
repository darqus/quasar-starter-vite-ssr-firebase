import { z } from 'zod'

import {
  zEmail,
  zRequiredInputString,
  zRequiredSelect,
} from 'src/validation/zod-helpers'

// Auth
export const loginSchema = z.object({
  login: zEmail(),
  // Auth flows in tests expect simple password validation (min length 6)
  password: z.string().min(6),
})
export type LoginDTO = z.infer<typeof loginSchema>

export const registerSchema = loginSchema
export type RegisterDTO = z.infer<typeof registerSchema>

export const forgotSchema = z.object({
  login: zEmail(),
})
export type ForgotDTO = z.infer<typeof forgotSchema>

// Employee new
export const newEmployeeSchema = z.object({
  // ФИО может быть из нескольких слов, запрещаем только ведущие/замыкающие пробелы и пустоту
  fio: zRequiredInputString(),
  login: zEmail(),
  // Должность также может содержать несколько слов
  position: zRequiredInputString(),
  level: zRequiredSelect<string | number>(),
  rate: zRequiredSelect<string | number>(),
  description: z.string().optional().or(z.literal('')),
})
export type NewEmployeeDTO = z.infer<typeof newEmployeeSchema>
