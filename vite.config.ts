import { defineConfig, } from 'vitest/config'

export default defineConfig({
  // this rule set correct path in working project on subdomain/dir
  base: '',
  // enable hmr (hot mode reloading) in dev mode
  server: {
    hmr: process.env.NODE_ENV === 'development',
  },
})
