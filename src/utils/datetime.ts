// Intl.DateTimeFormat().resolvedOptions()

/* {
  locale: "ru-RU",
  calendar: "gregory",
  numberingSystem: "latn",
  timeZone: "Europe/Moscow",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
} */

enum E_OPTIONS_LIST {
  numeric = 'numeric',
  digit = '2-digit',
  short = 'short',
  long = 'long'
}

enum E_TIME_ZONE_LIST {
  RU = 'Europe/Moscow'
  // RU = 'Australia/Melbourne'
}

enum E_ZONE_LIST {
  EN = 'en',
  RU = 'ru',
}

const TIME_ZONE: E_TIME_ZONE_LIST = E_TIME_ZONE_LIST.RU
const ZONE: E_ZONE_LIST = E_ZONE_LIST.RU

type T_OPTIONS = Intl.DateTimeFormatOptions

type TTodayYesterdayDate = {
  today: Date
  yesterday: Date
  todayShort: string
  yesterdayShort: string
  todayIso: string
  yesterdayIso: string
}

const OPTIONS_PRESETS: Record<string, T_OPTIONS> = {
  formattedDateAndTime: {
    year: E_OPTIONS_LIST.numeric,
    month: E_OPTIONS_LIST.digit,
    day: E_OPTIONS_LIST.digit,
    hour: E_OPTIONS_LIST.digit,
    minute: E_OPTIONS_LIST.digit,
    second: E_OPTIONS_LIST.digit,
    hour12: false,
    timeZone: TIME_ZONE,
  },
  formattedDateAndTimeMonthShort: {
    year: E_OPTIONS_LIST.numeric,
    month: E_OPTIONS_LIST.short,
    day: E_OPTIONS_LIST.digit,
    hour: E_OPTIONS_LIST.digit,
    minute: E_OPTIONS_LIST.digit,
    second: E_OPTIONS_LIST.digit,
    hour12: false,
    timeZone: TIME_ZONE,
  },
  longDateAndLongTime: {
    dateStyle: E_OPTIONS_LIST.long,
    timeStyle: E_OPTIONS_LIST.long,
    timeZone: TIME_ZONE,
  },
  shortDateAndLongTime: {
    dateStyle: E_OPTIONS_LIST.short,
    timeStyle: E_OPTIONS_LIST.long,
    hour12: false,
    timeZone: TIME_ZONE,
  },
  onlyTime: {
    hour: E_OPTIONS_LIST.digit,
    minute: E_OPTIONS_LIST.digit,
    second: E_OPTIONS_LIST.digit,
    hour12: false,
    timeZone: TIME_ZONE,
  },
}

const OPTIONS = OPTIONS_PRESETS.formattedDateAndTimeMonthShort

/**
 * Formats an ISO date string to an international date and time format.
 *
 * @param {string} isoDateString - The ISO date string to be formatted.
 * @return {string} The formatted date in international date and time format.
 */
export const formatISOToInternationalDateTime = (isoDate: string): string => {
  // Create a new Date object from the ISO string
  const date = new Date(isoDate)

  // Return the formatted date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat(ZONE, OPTIONS).format(date)
}

/**
 * Subtracts the specified number of days from the given date.
 *
 * @param {Date} date - The date to subtract days from.
 * @param {number} days - The number of days to subtract.
 * @return {Date} The resulting date after subtracting the specified number of days.
 */
export const subtractDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() - days)

  return date
}

/**
 * Retrieves today and yesterday's date and time in various formats.
 *
 * @param {string} isoDateString - An optional ISO date string to calculate today and yesterday from.
 * @return {TTodayYesterdayDate} An object containing today and yesterday's date and time in different formats.
 */
export const getTodayYesterdayDate = (isoDateString?: string): TTodayYesterdayDate => {
  const currentTime = isoDateString ? new Date(isoDateString).getTime() : new Date().getTime()

  const timeZoneOffset = new Date().getTimezoneOffset()

  const updatedTIme = new Date(currentTime - timeZoneOffset * 60 * 1000)

  const today = updatedTIme
  const yesterday = subtractDays(updatedTIme, 1)

  const todayIso = updatedTIme.toISOString()
  const yesterdayIso = subtractDays(updatedTIme, 1).toISOString()

  const todayShort = new Intl.DateTimeFormat(ZONE, OPTIONS_PRESETS.short).format(new Date())
  const yesterdayShort = new Intl.DateTimeFormat(ZONE, OPTIONS_PRESETS.short).format(subtractDays(new Date(), 1))

  const result = {
    today,
    yesterday,
    todayShort,
    yesterdayShort,
    todayIso,
    yesterdayIso,
  }

  return result
}

/**
 * Converts a date and time string to an ISO string.
 *
 * @param {string} date - The date string in the format "day.month.year".
 * @param {string} time - The time string in the format "hours:minutes".
 * @return {string} The ISO string representation of the combined date and time.
 */
export const convertDateTimeToISO = (date: string, time: string): string => {
  const [ day, month, year, ] = date.split('.')
  const [ hours, minutes, ] = time.split(':')
  const isoDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00.000Z`).toISOString()

  return isoDate
}
