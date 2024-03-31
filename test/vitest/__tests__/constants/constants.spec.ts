import { toggleLoading, } from 'src/utils/constants'

import { describe, expect, it, } from 'vitest'

describe('toggleLoading', () => {
  it('should toggle the value of the default property', () => {
    const state = { loading: false, }

    toggleLoading(state)
    expect(state.loading).toBe(true)
    toggleLoading(state)
    expect(state.loading).toBe(false)
  })

  it('should toggle the value of a specified property', () => {
    const state = { isLoading: false, }

    toggleLoading(state, 'isLoading')
    expect(state.isLoading).toBe(true)
    toggleLoading(state, 'isLoading')
    expect(state.isLoading).toBe(false)
  })
})
