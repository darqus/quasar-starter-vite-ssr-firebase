import { describe, expect, it } from 'vitest'

import { zRequiredInputString, zWordMin2 } from 'src/validation/zod-helpers'

describe('zod-helpers', () => {
  describe('zRequiredInputString', () => {
    const schema = zRequiredInputString()

    it('accepts multi-word Cyrillic strings (FIO)', () => {
      const res = schema.safeParse('Иван Иванов')
      expect(res.success).toBe(true)
    })

    it('accepts multi-word Latin strings (position)', () => {
      const res = schema.safeParse('Senior Software Engineer')
      expect(res.success).toBe(true)
    })

    it('rejects strings with leading/trailing spaces', () => {
      const res1 = schema.safeParse(' Иван')
      const res2 = schema.safeParse('Иван ')
      expect(res1.success).toBe(false)
      expect(res2.success).toBe(false)
    })
  })

  describe('zWordMin2', () => {
    const schema = zWordMin2()

    it('rejects multi-word strings (single word expected)', () => {
      const res = schema.safeParse('Иван Иванов')
      expect(res.success).toBe(false)
    })

    it('accepts single word with >= 2 letters', () => {
      const res = schema.safeParse('Иван')
      expect(res.success).toBe(true)
    })
  })
})
