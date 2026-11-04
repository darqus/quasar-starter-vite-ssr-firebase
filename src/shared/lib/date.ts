/**
 * Checks whether a `DD.MM.YYYY` string represents a real calendar date.
 * Used by zod helpers to validate date fields.
 */
export const isCorrectDate = (dateString: string): boolean => {
  const date = new Date(dateString.split('.').reverse().join('-'))

  return !Number.isNaN(date.getTime())
}
