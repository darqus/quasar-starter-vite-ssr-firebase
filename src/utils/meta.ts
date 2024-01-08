const { VITE_NAME_FULL, VITE_VERSION, VITE_BUILD_DATE, VITE_DESCRIPTION, } =
  import.meta.env

export const TITLE = `${VITE_NAME_FULL}: ${VITE_VERSION} build: ${VITE_BUILD_DATE}`

export const APP_NAME = VITE_NAME_FULL

export const DESCRIPTION = VITE_DESCRIPTION

export const VERSION = VITE_VERSION

export const meta = {
  title: TITLE,
  meta: {
    description: {
      name: 'description',
      content: VITE_DESCRIPTION,
    },
    keywords: { name: 'keywords', content: VITE_DESCRIPTION, },
    equiv: {
      'http-equiv': 'Content-Type',
      content: 'text/html; charset=UTF-8',
    },
    noscript: {
      default: 'Это содержимое для браузеров без JS (или с отключенным JS)',
    },
  },
}
