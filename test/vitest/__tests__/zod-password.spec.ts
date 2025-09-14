import { describe, expect, it } from 'vitest'

import { zPasswordStrict } from 'src/validation/zod-helpers'

// Password policy per utils/rules.ts:
// - Length: 8-20
// - At least 1 uppercase [A-Z]
// - At least 1 digit [0-9]
// - At least 1 special from !@#$%^&*
// - Allowed charset: A-Za-z\d!@#$%^&*

// Позитивные примеры (должны проходить по строгим правилам):
// 'Abcdef1!' — минимальная валидность (8 символов, есть заглавная, цифра и спецсимвол)
// 'Qwe123!@'
// 'Password9#'
// Негативные примеры (должны отклоняться):
// Слишком короткий: 'Ab1!' (< 8)
// Нет заглавной: 'abcdef1!'
// Нет цифры: 'Abcdefg!'
// Нет спецсимвола: 'Abcdefg1'
// Недопустимый спецсимвол: 'Abcdef1?' (вне !@#$%^&*)
// Слишком длинный: 21 символ

describe('zPasswordStrict', () => {
  const schema = zPasswordStrict()

  describe('positive examples', () => {
    it('minimal valid: 8 chars, has upper/digit/special', () => {
      const res = schema.safeParse('Abcdef1!')
      expect(res.success).toBe(true)
    })

    it('valid mixed: Qwe123!@', () => {
      const res = schema.safeParse('Qwe123!@')
      expect(res.success).toBe(true)
    })

    it('valid with different special: Password9#', () => {
      const res = schema.safeParse('Password9#')
      expect(res.success).toBe(true)
    })
  })

  describe('negative examples', () => {
    it('too short (<8)', () => {
      const res = schema.safeParse('Ab1!')
      expect(res.success).toBe(false)
    })

    it('no uppercase letter', () => {
      const res = schema.safeParse('abcdef1!')
      expect(res.success).toBe(false)
    })

    it('no digit', () => {
      const res = schema.safeParse('Abcdefg!')
      expect(res.success).toBe(false)
    })

    it('no special char', () => {
      const res = schema.safeParse('Abcdefg1')
      expect(res.success).toBe(false)
    })

    it('invalid special char (not in allowed set)', () => {
      const res = schema.safeParse('Abcdef1?') // ? is not in !@#$%^&*
      expect(res.success).toBe(false)
    })

    it('too long (>20)', () => {
      // 21 chars: start with valid core then pad to exceed length
      const long = 'Abcdef1!' + 'abcdefghij' + 'ABC' // 8 + 10 + 3 = 21
      const res = schema.safeParse(long)
      expect(res.success).toBe(false)
    })
  })
})
