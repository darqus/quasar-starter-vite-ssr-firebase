import { getTodayYesterdayDate, formatISOToInternationalDateTime, subtractDays, convertDateTimeToISO, } from '@/utils/datetime'

import { describe, expect, it, } from 'vitest'

describe('getTodayYesterdayDate', () => {
  it('should retrieve today and yesterday date and time in various formats', () => {
    const result = getTodayYesterdayDate()

    expect(result).toBeDefined()
    expect(result.today).toBeInstanceOf(Date)
    expect(result.yesterday).toBeInstanceOf(Date)
    expect(result.todayShort).toEqual(expect.any(String))
    expect(result.yesterdayShort).toEqual(expect.any(String))
    expect(result.todayIso).toEqual(expect.any(String))
    expect(result.yesterdayIso).toEqual(expect.any(String))
  })

  it('should calculate today and yesterday from a given ISO date string', () => {
    const isoDateString = '2022-01-01T00:00:00Z'
    const result = getTodayYesterdayDate(isoDateString)

    expect(result).toBeDefined()
    expect(result.today).toBeInstanceOf(Date)
    expect(result.yesterday).toBeInstanceOf(Date)
    expect(result.todayShort).toEqual(expect.any(String))
    expect(result.yesterdayShort).toEqual(expect.any(String))
    expect(result.todayIso).toEqual(expect.any(String))
    expect(result.yesterdayIso).toEqual(expect.any(String))
  })
})

describe('formatISOToInternationalDateTime', () => {
  it('should format ISO date string to international date time', () => {
    const isoDateString = '2020-02-28T12:00:00Z'
    const expectedFormattedDate = '28 февр. 2020 г., 15:00:00'

    const formattedDate = formatISOToInternationalDateTime(isoDateString)

    expect(formattedDate).toEqual(expectedFormattedDate)
  })

  it('should handle different time zones', () => {
    const isoDateString = '2020-02-28T12:00:00Z'
    const expectedFormattedDate = '28 февр. 2020 г., 15:00:00'

    const formattedDate = formatISOToInternationalDateTime(isoDateString)

    expect(formattedDate).toEqual(expectedFormattedDate)
  })
})

describe('subtractDays', () => {
  it('should subtract the specified number of days from the given date', () => {
    const date = new Date('2021-10-10')
    const days = 5

    const result = subtractDays(date, days)

    expect(result).toEqual(new Date('2021-10-05'))
  })

  it('should return the same date when subtracting 0 days', () => {
    const date = new Date('2021-10-10')
    const days = 0

    const result = subtractDays(date, days)

    expect(result).toEqual(new Date('2021-10-10'))
  })

  it('should handle negative number of days', () => {
    const date = new Date('2021-10-10')
    const days = -5

    const result = subtractDays(date, days)

    expect(result).toEqual(new Date('2021-10-15'))
  })

  it('should handle negative number of days', () => {
    const date = new Date('2021-10-01')
    const days = 1

    const result = subtractDays(date, days)

    expect(result).toEqual(new Date('2021-09-30'))
  })

  it('should handle negative number of days', () => {
    const date = new Date('2021-10-31')
    const days = -9

    const result = subtractDays(date, days)

    expect(result).toEqual(new Date('2021-11-09'))
  })
})

describe('convertDateTimeToISO', () => {
  it('should convert a date and time string to an ISO string', () => {
    const date = '15.10.2022'
    const time = '12:30'
    const expected = '2022-10-15T12:30:00.000Z'

    const result = convertDateTimeToISO(date, time)

    expect(result).toEqual(expected)
  })

  it('should handle different date and time formats', () => {
    const date = '01.01.2023'
    const time = '00:00'
    const expected = '2023-01-01T00:00:00.000Z'

    const result = convertDateTimeToISO(date, time)

    expect(result).toEqual(expected)
  })
})
