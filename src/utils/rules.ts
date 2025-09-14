import { isCorrectDate } from './datetime'

const INPUT_LIMIT = 255

const RE_OVERFLOW_LIMIT = new RegExp(`^.{0,${INPUT_LIMIT}}$`)

const EMAIL_RE_PART = {
  USERNAME: /[^\s@]/,
  AT: '+@',
  DOMAIN: /[^\s@]/,
  DOT: '+.',
  ZONE: /[A-Za-z]{2,4}/,
}

const RE_EMAIL = new RegExp(
  `^${EMAIL_RE_PART.USERNAME.source}${EMAIL_RE_PART.AT}${EMAIL_RE_PART.DOMAIN.source}${EMAIL_RE_PART.DOT}${EMAIL_RE_PART.ZONE.source}$`
)

const PASSWORD_DETAILS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 20,
  DIGIT_LENGTH: 1,
  CAPITAL_LETTER_LENGTH: 1,
  SPC_LENGTH: 1,
  SPC_CHAR: '!@#$%^&*',
}

const PASSWORD_RE_PART = {
  HAS_CAPITAL_LETTER: new RegExp(
    `(?=.*[A-Z]){${PASSWORD_DETAILS.CAPITAL_LETTER_LENGTH},${PASSWORD_DETAILS.MAX_LENGTH}}`
  ),
  HAS_DIGIT: new RegExp(
    `(?=.*\\d){${PASSWORD_DETAILS.DIGIT_LENGTH},${PASSWORD_DETAILS.MAX_LENGTH}}`
  ),
  HAS_SPECIAL_CHAR: new RegExp(
    `(?=.*[${PASSWORD_DETAILS.SPC_CHAR}]){${PASSWORD_DETAILS.SPC_LENGTH},${PASSWORD_DETAILS.MAX_LENGTH}}`
  ),
  IS_VALID: new RegExp(
    `[A-Za-z\\d${PASSWORD_DETAILS.SPC_CHAR}]{${PASSWORD_DETAILS.MIN_LENGTH},${PASSWORD_DETAILS.MAX_LENGTH}}`
  ),
}

const RE_PASSWORD = new RegExp(
  `^${PASSWORD_RE_PART.HAS_CAPITAL_LETTER.source}${PASSWORD_RE_PART.HAS_DIGIT.source}${PASSWORD_RE_PART.HAS_SPECIAL_CHAR.source}${PASSWORD_RE_PART.IS_VALID.source}$`
)

const MESSAGES = {
  requiredInput: 'Обязательно для заполнения',
  requiredSelect: 'Выберите значение из списка',
  notTrailingSpaces: 'Здесь не должно быть пробелов в начале и конце строки',
  onlyWord: 'Здесь должно быть слово',
  fewLetters: 'Слово должно состоять хотя бы из 2 букв',
  overflowLimit: `Превышен лимит данного поля ${INPUT_LIMIT} символов`,
  email: 'Формат username@domain.zone',
  password: `[${PASSWORD_DETAILS.MIN_LENGTH}÷${PASSWORD_DETAILS.MAX_LENGTH}] символов, 1 цифра и 1 заглавная буква`,
  phone: 'Неверный формат телефона',
  dateFormat: 'Введите дату в формате ДД.ММ.ГГГГ',
  dateCorrect: 'Введите корректную дату',
}

export const REGEXP = {
  required: /^.+$/,
  overfowLimit: RE_OVERFLOW_LIMIT,
  string: /^[^\s].*[^\s]+$/,
  word: /^[A-Za-zА-Яа-яЁё]+$/,
  fewLetters: /[A-Za-zА-Яа-яЁё]{2,}/,
  email: RE_EMAIL,
  password: RE_PASSWORD,
  phone: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
  date: /^\d{2}.\d{2}.\d{4}$/,
}

export const requiredInput = [
  (v: string) => REGEXP.required.test(v) || MESSAGES.requiredInput,
  (v: string) => REGEXP.string.test(v) || MESSAGES.notTrailingSpaces,
  (v: string) => REGEXP.overfowLimit.test(v) || MESSAGES.overflowLimit,
]

export const requiredSelect = [
  (v: string) => REGEXP.required.test(v) || MESSAGES.requiredSelect,
  (v: string) => REGEXP.string.test(v) || MESSAGES.notTrailingSpaces,
  (v: string) => REGEXP.overfowLimit.test(v) || MESSAGES.overflowLimit,
]

export const word = [
  (v: string) => REGEXP.fewLetters.test(v) || MESSAGES.fewLetters,
  (v: string) => REGEXP.word.test(v) || MESSAGES.onlyWord,
]

export const email = [(v: string) => REGEXP.email.test(v) || MESSAGES.email]

export const password = [
  (v: string) => REGEXP.password.test(v) || MESSAGES.password,
]

export const phone = [(v: string) => REGEXP.phone.test(v) || MESSAGES.phone]

export const date = [
  (v: string) => REGEXP.date.test(v) || MESSAGES.dateFormat,
  (v: string) => isCorrectDate(v) || MESSAGES.dateCorrect,
]
