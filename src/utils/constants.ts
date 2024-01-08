export const HEADER_STYLE_LINE_BREAK = 'white-space: unset;'

export const DEBOUNCE = 1000

export const DATE_PICKER_DELIMETER = ' '

export const INPUT_REQUIRED = ' *'

export const RANGE_PICKER_DELIMETER = ' - '

export const DEFAULT_ROWS_PER_PAGE = 10

export const ROWS_PER_PAGE_OPTIONS = [ DEFAULT_ROWS_PER_PAGE, 1.5 * DEFAULT_ROWS_PER_PAGE, 2 * DEFAULT_ROWS_PER_PAGE, ]

/**
 * Toggles the value of a param in the state object.
 *
 * @param {any} state - The state object.
 * @param {string} property - The name of the property to toggle. Defaults to 'loading'.
 * @return {void} This function does not return a value.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toggleLoading = (state: any, property = 'loading'): void => {
  state[property] = !state[property]
}
