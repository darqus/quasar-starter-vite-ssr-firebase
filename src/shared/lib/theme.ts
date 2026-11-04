export type DarkModeSetting = boolean | 'auto'

export const parseDarkMode = (raw: string | undefined): DarkModeSetting => {
  const normalized = raw?.trim().toLowerCase()

  if (normalized === 'true') {
    return true
  }

  if (normalized === 'false') {
    return false
  }

  return 'auto'
}

export const systemPrefersDark = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

export const resolveInitialDark = (
  saved: boolean | null,
  raw: string | undefined,
  systemDark: boolean = systemPrefersDark()
): boolean => {
  if (typeof saved === 'boolean') {
    return saved
  }

  const parsed = parseDarkMode(raw)

  return parsed === 'auto' ? systemDark : parsed
}
