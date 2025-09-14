import { describe, expect, it } from 'vitest'

import {
  formatNumberToCurrency,
  formatNumberWithSpaces,
  incline,
  INCLINE,
  toCapitalCase,
} from 'src/utils/format'

describe('utils/format', () => {
  it('incline basic cases', () => {
    expect(incline(1, INCLINE.DAY)).toBe('день')
    expect(incline(2, INCLINE.DAY)).toBe('дня')
    expect(incline(5, INCLINE.DAY)).toBe('дней')
  })

  it('toCapitalCase', () => {
    expect(toCapitalCase('тест')).toBe('Тест')
  })

  it('formatNumberWithSpaces', () => {
    expect(formatNumberWithSpaces(1234567)).toBe('1\u00A0234\u00A0567')
  })

  it('formatNumberToCurrency', () => {
    // Happy-dom locale may format currency with non-breaking spaces and symbol
    const formatted = formatNumberToCurrency(1234567)
    expect(formatted).toMatch(/1\u00A0234\u00A0567|1\s234\s567/)
  })
})
