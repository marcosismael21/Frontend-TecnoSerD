import colors from 'vuetify/es5/util/colors'

export default {
  router: {
    extendRoutes(routes, resolve) {
      const filteredRoutes = routes.filter(route => route.name !== 'tablero')

      filteredRoutes.push({
        path: '',
        redirect: '/login2',
        middleware: ['auth', 'routeProtection']
      })

      filteredRoutes.push({
        name: 'tablero',
        path: '/tablero',
        component: resolve(__dirname, 'pages/tablero/index.vue'),
        chunkName: 'pages/tablero/index',
        ssr: false
      })

      return filteredRoutes
    }
  },

  routeRules: {
    '/tecnico/**': { middleware: ['routeProtection'] },
    '/comercio/**': { middleware: ['routeProtection'] },
    '/equipos/**': { middleware: ['routeProtection'] },
    '/comodin/**': { middleware: ['routeProtection'] },
    '/asignacion/**': { middleware: ['routeProtection'] },
    '/usuarios/**': { middleware: ['routeProtection'] },
    '/tecnicoProceso/**': { middleware: ['routeProtection'] },
    '/regaliaComercio/**': { middleware: ['routeProtection'] },
    '/ciudad/**': { middleware: ['routeProtection'] },
    '/canal/**': { middleware: ['routeProtection'] },
    '/proveedores/**': { middleware: ['routeProtection'] },
    '/regalia/**': { middleware: ['routeProtection'] }
  },

  head: {
    titleTemplate: '%s - TecnoSerD',
    title: 'TecnoSerD',
    htmlAttrs: {
      lang: 'es',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: [],

  plugins: [
    '~/plugins/axios.js',
    { src: '~/plugins/acl.js', mode: 'client' },
    { src: '~/plugins/apexcharts', mode: 'client' }
  ],

  components: true,

  buildModules: [
    '@nuxtjs/vuetify',
  ],

  modules: [
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL: 'http://localhost:3010/api/v1',
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.blue.lighten2,
          accent: colors.grey.lighten3,
          secondary: colors.indigo.lighten5,
          info: colors.teal.darken1,
          warning: colors.amber.lighten2,
          error: colors.deepOrange.lighten1,
          success: colors.green.lighten2,
          background: colors.indigo.lighten3
        },
      },
      options: { customProperties: true },
    },
  },

  ssr: true,

  render: {
    resourceHints: false,
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },

  build: {
    transpile: [
      'vuetify/lib',
      'vue-apexcharts',
      'apexcharts'
    ],
    babel: {
      compact: true,
      presets: [
        ['@nuxt/babel-preset-app', {
          corejs: { version: 3 }
        }]
      ]
    },
    extend(config, { isDev, isClient }) {
      config.node = {
        fs: 'empty'
      }
      if (isClient) {
        config.optimization = {
          splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '.',
            name: isDev,
            maxSize: 244000
          }
        }
      }
    },
    terser: {
      terserOptions: {
        compress: {
          drop_console: false
        }
      }
    }
  },

  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },

  loading: {
    color: 'blue',
    height: '5px'
  },

  // Configuración para manejo de errores y warnings
  quiet: false,
  telemetry: false,
}
