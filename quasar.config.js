/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const path = require('node:path')

const { configure, } = require('quasar/wrappers')

module.exports = configure((/* ctx */) => ({
  supportTS: {
    tsCheckerConfig: {
      eslint: {
        enabled: true,
        files: './src/**/*.{ts,tsx,js,jsx,vue}',
      },
    },
  },

  eslint: {
    fix: true,
    include: [ 'src', ],
    exclude: [ 'node_modules', ],
    // rawOptions = {},
    warnings: true,
    errors: true,
  },

  // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
  preFetch: true,

  // app boot file (/src/boot)
  // --> boot files are part of "main.js"
  // https://v2.quasar.dev/quasar-cli-vite/boot-files
  boot: [
    'firebase',
    'auth',
  ],

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
  css: [
    'app.scss',
  ],

  // https://github.com/quasarframework/quasar/tree/dev/extras
  extras: [
    // 'ionicons-v4',
    // 'mdi-v5',
    // 'fontawesome-v6',
    // 'eva-icons',
    // 'themify',
    // 'line-awesome',
    // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

    // 'roboto-font', // optional, you are not bound to it
    'material-icons', // optional, you are not bound to it
    'material-icons-outlined',
  ],

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
  build: {
    alias: {
      '@': path.join(__dirname, './src'),
    },
    target: {
      browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1', ],
      node: 'node20',
    },
    vueRouterMode: 'history',
    // vueRouterBase,
    // vueDevtools,
    // vueOptionsAPI: false,

    // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

    // publicPath: '/',
    // analyze: true,
    // env: {},
    // rawDefine: {}
    // ignorePublicFolder: true,
    // minify: false,
    // polyfillModulePreload: true,
    // distDir

    vueOptionsAPI: false,

    sourcemap: process.env.NODE_ENV === 'development',

    /* extendViteConf (viteConf) {
      // this rule set correct path in working project on subdomain/dir
      viteConf.base = ''
      // enable hmr (hot mode reloading) in dev mode
      viteConf.server = {
        hmr: process.env.NODE_ENV === 'development',
      }
    }, */
    // viteVuePluginOptions: {},

    // vitePlugins: [
    //   [ 'package-name', { ..options.. } ]
    // ]
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
  devServer: {
    // https: true,
    // opens browser window automatically
    open: true,
  },

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
  framework: {
    config: {
      /* screen: {
        bodyClasses: true,
      }, */
    },

    // iconSet: 'material-icons', // Quasar icon set
    lang: 'ru', // Quasar language pack

    // For special cases outside of where the auto-import strategy can have an impact
    // (like functional components as one of the examples),
    // you can manually specify Quasar components/directives to be available everywhere:
    //
    // components: [],
    // directives: [],

    // Quasar plugins
    plugins: [
      'Notify',
      'Meta',
      'LocalStorage',
    ],
  },

  // animations: 'all', // --- includes all animations
  // https://quasar.dev/options/animations
  animations: [],

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
  sourceFiles: {
    // rootComponent: 'src/App.vue',
    // router: 'src/router/index',
    // store: 'src/store/index',
    // registerServiceWorker: 'src-pwa/register-service-worker',
    // serviceWorker: 'src-pwa/custom-service-worker',
    // pwaManifestFile: 'src-pwa/manifest.json',
    // electronMain: 'src-electron/electron-main',
    // electronPreload: 'src-electron/electron-preload'
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
  ssr: {
    pwa: true, // should a PWA take over (default: false), or just a SPA?

    /**
     * Manually serialize the store state and provide it yourself
     * as window.__INITIAL_STATE__ to the client-side (through a <script> tag)
     * (Requires @quasar/app-webpack v3.5+)
     */
    manualStoreSerialization: false,

    /**
     * Manually inject the store state into ssrContext.state
     * (Requires @quasar/app-webpack v3.5+)
     */
    manualStoreSsrContextInjection: false,

    /**
     * Manually handle the store hydration instead of letting Quasar CLI do it.
     * For Pinia: store.state.value = window.__INITIAL_STATE__
     * For Vuex: store.replaceState(window.__INITIAL_STATE__)
     */
    manualStoreHydration: false,

    /**
     * Manually call $q.onSSRHydrated() instead of letting Quasar CLI do it.
     * This announces that client-side code should takeover.
     */
    manualPostHydrationTrigger: false,

    prodPort: 3000, // The default port that the production server should use
    // (gets superseded if process∙env∙PORT is specified at runtime)

    maxAge: 1000 * 60 * 60 * 24 * 30,
    // Tell browser when a file from the server should expire from cache
    // (the default value, in ms)
    // Has effect only when server.static() is used

    // List of SSR middleware files (src-ssr/middlewares/*). Order is important.
    middlewares: [
      // ...
      'render', // Should not be missing, and should be last in the list.
    ],

    // optional; add/remove/change properties
    // of production generated package.json
    extendPackageJson (/* pkg */) {
      // directly change props of pkg;
      // no need to return anything
    },

    // optional;
    // handles the Webserver webpack config ONLY
    // which includes the SSR middleware
    extendWebpackWebserver (/* cfg */) {
      // directly change props of cfg;
      // no need to return anything
    },

    // optional; EQUIVALENT to extendWebpack() but uses webpack-chain;
    // handles the Webserver webpack config ONLY
    // which includes the SSR middleware
    chainWebpackWebserver (/* chain */) {
      // chain is a webpack-chain instance
      // of the Webpack configuration
    },
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
  pwa: {
    workboxMode: 'generateSW', // or 'injectManifest'
    injectPwaMetaTags: true,
    swFilename: 'sw.js',
    manifestFilename: 'manifest.json',
    useCredentialsForManifestTag: false,
    // useFilenameHashes: true,
    // extendGenerateSWOptions (cfg) {}
    // extendInjectManifestOptions (cfg) {},
    // extendManifestJson (json) {}
    // extendPWACustomSWConf (esbuildConf) {}
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
  cordova: {
    // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
  capacitor: {
    hideSplashscreen: true,
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
  electron: {
    // extendElectronMainConf (esbuildConf)
    // extendElectronPreloadConf (esbuildConf)

    inspectPort: 5858,

    bundler: 'packager', // 'packager' or 'builder'

    packager: {
      // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

      // OS X / Mac App Store
      // appBundleId: '',
      // appCategoryType: '',
      // osxSign: '',
      // protocol: 'myapp://path',

      // Windows only
      // win32metadata: { ... }
    },

    builder: {
      // https://www.electron.build/configuration/configuration

      appId: process.env.VITE_NAME_SHORT,
    },
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
  bex: {
    contentScripts: [ 'my-content-script', ],
    // extendBexScriptsConf (esbuildConf) {}
    // extendBexManifestJson (json) {}
  },
}))
