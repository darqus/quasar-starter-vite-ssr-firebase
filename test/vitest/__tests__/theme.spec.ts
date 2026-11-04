import { describe, expect, it } from 'vitest'

import { parseDarkMode, resolveInitialDark } from '@/shared/lib/theme'

describe('parseDarkMode', () => {
  it('parses explicit booleans', () => {
    expect(parseDarkMode('true')).toBe(true)
    expect(parseDarkMode('TRUE')).toBe(true)
    expect(parseDarkMode(' false ')).toBe(false)
  })

  it('falls back to auto for auto, empty and unknown values', () => {
    expect(parseDarkMode('auto')).toBe('auto')
    expect(parseDarkMode(undefined)).toBe('auto')
    expect(parseDarkMode('')).toBe('auto')
    expect(parseDarkMode('unexpected')).toBe('auto')
  })
})

describe('resolveInitialDark', () => {
  it('uses the saved user preference first', () => {
    expect(resolveInitialDark(true, 'false', false)).toBe(true)
    expect(resolveInitialDark(false, 'true', true)).toBe(false)
  })

  it('uses VITE_DARK when nothing is saved', () => {
    expect(resolveInitialDark(null, 'true', false)).toBe(true)
    expect(resolveInitialDark(null, 'false', true)).toBe(false)
  })

  it('uses the system preference for auto', () => {
    expect(resolveInitialDark(null, 'auto', true)).toBe(true)
    expect(resolveInitialDark(null, 'auto', false)).toBe(false)
    expect(resolveInitialDark(null, undefined, true)).toBe(true)
  })
})
