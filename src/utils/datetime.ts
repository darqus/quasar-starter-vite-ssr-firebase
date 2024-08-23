// Intl.DateTimeFormat().resolvedOptions()

import { INCLINE, incline, } from './format'

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

export const DATE_TIME_OPTIONS_PRESET: Record<string, T_OPTIONS> = {
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
  formattedDateAndTimeMonthLong: {
    year: E_OPTIONS_LIST.numeric,
    month: E_OPTIONS_LIST.long,
    day: E_OPTIONS_LIST.digit,
    hour: E_OPTIONS_LIST.digit,
    minute: E_OPTIONS_LIST.digit,
    hour12: false,
    timeZone: TIME_ZONE,
  },
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
  numericDayLongMonth: {
    month: E_OPTIONS_LIST.long,
    day: E_OPTIONS_LIST.numeric,
    timeZone: TIME_ZONE,
  },
  longDate: {
    dateStyle: E_OPTIONS_LIST.long,
    timeZone: TIME_ZONE,
  },
  longDateAndLongTime: {
    dateStyle: E_OPTIONS_LIST.long,
    timeStyle: E_OPTIONS_LIST.long,
  },
  shortDateAndLongTime: {
    dateStyle: E_OPTIONS_LIST.short,
    timeStyle: E_OPTIONS_LIST.long,
    hour12: false,
    timeZone: TIME_ZONE,
  },
  monthDayWeekday: {
    month: E_OPTIONS_LIST.long,
    day: E_OPTIONS_LIST.numeric,
    weekday: E_OPTIONS_LIST.short,
  },
  monthDay: {
    month: E_OPTIONS_LIST.long,
    day: E_OPTIONS_LIST.numeric,
  },
  onlyDate: {
    year: E_OPTIONS_LIST.numeric,
    month: E_OPTIONS_LIST.digit,
    day: E_OPTIONS_LIST.digit,
  },
  onlyMonth: {
    month: E_OPTIONS_LIST.long,
  },
  onlyDayMonth: {
    day: E_OPTIONS_LIST.numeric,
  },
  onlyDayWeek: {
    weekday: E_OPTIONS_LIST.short,
  },
  onlyTime: {
    hour: E_OPTIONS_LIST.digit,
    minute: E_OPTIONS_LIST.digit,
    second: E_OPTIONS_LIST.digit,
    hour12: false,
  },
  onlyTimeHM: {
    hour: E_OPTIONS_LIST.digit,
    minute: E_OPTIONS_LIST.digit,
    hour12: false,
  },
  minutesSeconds: {
    hour: E_OPTIONS_LIST.digit,
    minute: E_OPTIONS_LIST.digit,
    hour12: false,
  },
}

/**
 * Formats an ISO date string to an international date and time string.
 *
 * @param {string} isoDate - The ISO date string to format.
 * @param {Intl.DateTimeFormatOptions} [options=DATE_TIME_OPTIONS_PRESET.formattedDateAndTimeMonthShort] - The formatting options for the date and time.
 * @returns {string} The formatted date and time string.
 */
export const formatISOToInternationalDateTime = (isoDate: string, options: Intl.DateTimeFormatOptions = DATE_TIME_OPTIONS_PRESET.formattedDateAndTimeMonthShort): string => {
  // Create a new Date object from the ISO string
  const date = new Date(isoDate)

  // Return the formatted date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat(ZONE, options).format(date)
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

  const todayShort = new Intl.DateTimeFormat(ZONE, DATE_TIME_OPTIONS_PRESET.short).format(new Date())
  const yesterdayShort = new Intl.DateTimeFormat(ZONE, DATE_TIME_OPTIONS_PRESET.short).format(subtractDays(new Date(), 1))

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
 * Converts a custom date format to ISO date format.
 * @param {string} customDate - The date in custom format (DD.MM.YYYY)
 * @returns {string | null} - The date in ISO format (YYYY-MM-DD) or null if the input is null
 */
export const convertCustomFormatToIso = (customDate: string | null): string | null => {
  if (customDate === null) {
    return null
  }

  const [ day, month, year, ] = customDate.split('.')

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

/**
 * Converts a date string to a custom format.
 *
 * @param {string} date - The date string to convert.
 * @returns {string} The date string in custom format.
 */
export const convertDateToCustomFormat = (date: string): string => {
  // Split the date string into day, month, and year
  const [ year, month, day, ] = date.split('-')

  // Return the date string in custom format
  return `${day}.${month}.${year}`
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

/**
 * Check if the given date string is a valid date.
 * @param {string} dateString - The date string to be checked.
 * @returns {boolean} - True if the date string is a valid date, false otherwise.
 */
export const isCorrectDate = (dateString: string): boolean => {
  // Convert the date string to a Date object using the correct format
  const date = new Date(dateString.split('.').reverse().join('-'))

  // Return true if the date is valid, false otherwise
  return !isNaN(date.getTime())
}

type TDateRange = {
  dateFrom: string
  dateTo: string
}

/**
 * Retrieves today's date range in ISO format.
 *
 * @returns {TDateRange} An object containing the ISO strings for the start
 *   and end of the day (inclusive).
 */
export const getTodayDateRange = (): TDateRange => {
  const currentTime = new Date().getTime()

  const timeZoneOffset = new Date().getTimezoneOffset()

  const updatedTIme = new Date(currentTime - timeZoneOffset * 60 * 1000)

  const dateFrom = `${updatedTIme.toISOString().split('T')[0]}T00:00:00.000Z`
  const dateTo = `${updatedTIme.toISOString().split('T')[0]}T23:59:59.999Z`

  return {
    /**
     * The start of the day in ISO format (inclusive).
     */
    dateFrom,
    /**
     * The end of the day in ISO format (inclusive).
     */
    dateTo,
  }
}

export const getCurrentIsoDateTime = (date?: Date | null, onlyDate = false): string => {
  const currentDate = date ? date.getTime() : new Date().getTime()

  const timeZoneOffset = date ? date.getTimezoneOffset() : new Date().getTimezoneOffset()

  const updatedTIme = new Date(currentDate - timeZoneOffset * 60 * 1000)

  const today = updatedTIme

  return onlyDate ? today.toISOString().split('T')[0] : today.toISOString()
}

export const getIsoDateFromIsoDateAndMinutes = (isoDate: string, minutes: number): string => {
  const date = new Date(isoDate)

  date.setMinutes(date.getMinutes() + minutes)

  return date.toISOString()
}

export const getCurrentMonthPrepositionalCase = (): string => {
  const date = new Date()
  const month = new Intl.DateTimeFormat('ru', { month: 'long', }).format(date)

  return [ 'март', 'август', ].includes(month)
    ? month + 'е'
    : month.slice(0, -1) + 'е'
}

/**
 * Calculates the time remaining until a given end date.
 *
 * @param endDate - The end date as a string in ISO 8601 format with timezone offset.
 * @returns A string representing the remaining time, formatted as "X day(s), Y hour(s), Z minute(s)".
 */
export const getRemainingTime = (endDate: string): string => {
  const end = new Date(endDate)

  end.setHours(0, 0, 0, 0)

  const diff = end.getTime() - new Date().getTime()
  const day = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0
  const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0
  const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0

  return `${day} ${incline(day, INCLINE.DAY)} ${hours} ${incline(hours, INCLINE.HOUR)} ${minutes} ${incline(minutes, INCLINE.MINUTE)}`
}
