// Configuration for your app
// https://quasar.dev/quasar-cli-vite/quasar-config-file

import { readFileSync } from 'node:fs'

import { defineConfig } from '#q-app'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
) as { version: string }

const BUILD_DATE = new Date().toISOString()

export default defineConfig((/* ctx */) => {
  return {
    // https://quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli-vite/boot-files
    boot: ['auth', 'firebase'],

    // https://quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v7',
      // 'fontawesome-v7',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node22',
      },

      typescript: {
        strict: true,
        vueShim: true,
        // extendTsConfig (tsConfig) {}
      },

      // Only variables carrying this prefix are exposed to the client code.
      // Quasar CLI v3 defaults to QCLI_, the project keeps the Vite convention.
      env: {
        clientPrefix: 'VITE_',
      },

      vueRouterMode: 'history', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // ignorePublicFolder: true,
      // minify: false,
      // distDir

      // Build metadata is generated at build time instead of being committed
      // into .env by publish.sh.
      extendViteConf(viteConf) {
        viteConf.define = {
          ...viteConf.define,
          __APP_VERSION__: JSON.stringify(pkg.version),
          __BUILD_DATE__: JSON.stringify(BUILD_DATE),
        }
      },
      // viteVuePluginOptions: {},

      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
          },
          { server: false },
        ],
      ],
    },

    // Full list of options: https://quasar.dev/quasar-cli-vite/quasar-config-file#devserver
    devServer: {
      // https: true,
      open: true, // opens browser window automatically
    },

    // https://quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Loading', 'Notify', 'LocalStorage'],
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],
  }
})
