/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string

    VITE_NAME_FULL: string
    VITE_NAME_SHORT: string
    VITE_DESCRIPTION: string

    VITE_BUILD_DATE: string
    VITE_VERSION: string

    VITE_API_PROTOCOL: string
    VITE_API_DOMAIN: string
    VITE_API_PORT: string
    VITE_API_HOST: string
    VITE_API_VERSION: string
    VITE_API_BASE_URL: string
    VITE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VITE_ROUTER_BASE: string
  }
}
