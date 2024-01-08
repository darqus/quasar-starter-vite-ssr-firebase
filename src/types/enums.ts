export enum ROUTE_TYPE {
  REGISTER = 'register',
  LOGIN = 'login',
  FORGOT = 'forgot',
  ACCOUNT = 'account',
  NEW_EMPLOYEE = 'new-employee',
}

export enum ROUTE_NAME {
  HOME = 'Главная',
  ERROR = 'Ошибка',
  REGISTER = 'Регистрация',
  LOGIN = 'Войти',
  FORGOT = 'Забыли пароль?',
  ACCOUNT = 'Профиль',
  NEW_EMPLOYEE = 'Новый сотрудник',
}

export enum ROUTE_ICON {
  HOME = 'home',
  REGISTER = 'person_add',
  LOGIN = 'login',
  FORGOT = 'lock_reset',
  ACCOUNT = 'account_circle',
  NEW_EMPLOYEE = 'badge',
}

export enum STORE_TYPES {
  AUTH = 'auth',
  ACCOUNT = 'account',
  EMPLOYEE_CARDS = 'employee-cards',
  NEW_EMPLOYEE = 'new-employee',
}

export enum FORM_FIELD_TYPE {
  INPUT = 'input',
  SELECT = 'select',
}

export enum AUTH_TYPE {
  LOGIN_EMAIL = 'LOGIN_EMAIL',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export enum AUTH_TITLE {
  LOGIN_EMAIL = 'Войти по email',
  LOGIN_PHONE = 'Войти по номеру телефона',
  REGISTER = 'Зарегистрироваться',
  FORGOT_PASSWORD = 'Восстановить пароль',
}

export enum AUTH_ICON {
  LOGIN_EMAIL = 'email',
  LOGIN_PHONE = 'phone',
  REGISTER = 'person_add',
  FORGOT_PASSWORD = 'lock',
}

export enum PASSWORD_VISIBILITY_ICON_MAP {
  ON = 'visibility',
  OFF = 'visibility_off',
}

export enum INPUT_TYPE {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  PASSWORD = 'password',
  TEL = 'tel',
  TEXTAREA = 'textarea',
  SEARCH = 'search',
  FILE = 'file',
  URL = 'url',
  TIME = 'time',
  DATE = 'date'
}

export enum BUTTON_TYPE {
  SUBMIT = 'submit',
  RESET = 'reset',
}
