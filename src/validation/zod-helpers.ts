import { z } from 'zod'

import { isCorrectDate } from 'src/utils/datetime'

import { MESSAGES, REGEXP } from './rules'

// Basic required string with trimming and length limit
export const zRequiredInputString = () =>
  z
    .string({ required_error: MESSAGES.requiredInput })
    .min(1, MESSAGES.requiredInput)
    .refine((v) => REGEXP.string.test(v), MESSAGES.notTrailingSpaces)
    .refine((v) => REGEXP.overflowLimit.test(v), MESSAGES.overflowLimit)

// Word with min 2 letters (Cyrillic/Latin), consistent with legacy rules
export const zWordMin2 = () =>
  z
    .string({ required_error: MESSAGES.requiredInput })
    .regex(REGEXP.fewLetters, MESSAGES.fewLetters)
    .regex(REGEXP.word, MESSAGES.onlyWord)

// Email consistent with legacy rules
export const zEmail = () =>
  z
    .string({ required_error: MESSAGES.requiredInput })
    .trim()
    .regex(REGEXP.email, MESSAGES.email)

// Strong password according to legacy regex (not applied by default where tests expect len>=6)
export const zPasswordStrict = () =>
  z
    .string({ required_error: MESSAGES.requiredInput })
    .regex(REGEXP.password, MESSAGES.password)

// Phone according to legacy mask
export const zPhone = () => z.string().regex(REGEXP.phone, MESSAGES.phone)

// Date in DD.MM.YYYY and isCorrectDate
export const zDate = () =>
  z
    .string()
    .regex(REGEXP.date, MESSAGES.dateFormat)
    .refine((v) => isCorrectDate(v), MESSAGES.dateCorrect)

// Required select that may be string or number
export const zRequiredSelect = <T extends string | number>() =>
  z
    .union([z.string(), z.number()])
    .refine(
      (v) =>
        (typeof v === 'string' && v.trim().length > 0) ||
        (typeof v === 'number' && Number.isFinite(v)),
      MESSAGES.requiredSelect
    ) as unknown as z.ZodType<T>
