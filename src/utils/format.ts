/**
 * Declines depending on the number
 * @param {number} number
 * @param {string[]} titles Strings for decline
 * @param {boolean} [full=false] If true - returns number + string
 * @return {string}
 */
export const incline = (
  number: number,
  titles: string[],
  full: boolean = false
): string => {
  const cases = [2, 0, 1, 1, 1, 2]

  const index = number % 100 > 4 && number % 100 < 20
    ? 2
    : (cases[number % 10 < 5 ? number % 10 : 5] ?? 0)

  const result = titles[index] ?? titles[0] ?? ''

  return full ? `${number} ${result}` : result
}

/* Массив склонемых слов
первый элемент в массиве склоняется, если слово имеет количество 1
второй элемент в массиве склоняется, если слово имеет количество 2
третий элемент в массиве склоняется, если слово имеет количество 5 */
export const INCLINE = {
  YEAR: ['год', 'года', 'лет'],
  LIST: ['лист', 'листа', 'листов'],
  LESSON: ['урок', 'урока', 'уроков'],
  MINUTE: ['минута', 'минуты', 'минут'],
  DAY: ['день', 'дня', 'дней'],
  MONTH: ['месяц', 'месяца', 'месяцев'],
  HOUR: ['час', 'часа', 'часов'],
  TIMES: ['раз', 'раза', 'раз'],
  WEEK: ['неделя', 'недели', 'недель'],
  CARTOON: ['мультфильм', 'мультфильма', 'мультфильмов'],
  GAME: ['игра', 'игры', 'игр'],
  QUESTION: ['вопрос', 'вопроса', 'вопросов'],
}

// Example usage
// console.log(incline(1, ['стол', 'стола', 'столов'])) // Output: стол
// console.log(incline(2, ['стол', 'стола', 'столов'])) // Output: стола
// console.log(incline(5, ['стол', 'стола', 'столов'])) // Output: столов

export const toCapitalCase = (input: string): string =>
  input.charAt(0).toUpperCase() + input.slice(1)

export const formatNumberWithSpaces = (number: number): string => {
  const formatter = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
    style: 'decimal',
  })

  return formatter.format(number)
}

export const formatNumberToCurrency = (number: number): string => {
  const formatter = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
    style: 'currency',
    currency: 'RUB',
  })

  return formatter.format(number)
}
