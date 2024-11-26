import colors from 'vuetify/es5/util/colors'

export default {
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '',
        redirect: '/login2',
        middleware: [
          'auth',           // Tu middleware de autenticación existente
          'routeProtection' // Nuevo middleware de protección de rutas
        ]
      })
    },
  },

  // Definir las rutas y sus meta datos
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

  // Global page headers: https://go.nuxtjs.dev/config-head
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

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios.js',
    { src: '~/plugins/acl.js', mode: 'client' },
    { src: '~/plugins/apexcharts.client.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://ook40o44ks444kg4ssw04w4w.34.71.253.116.sslip.io/api/v1',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
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

  // Configuración de SSR para evitar problemas de hidratación
  render: {
    ssr: true,
    bundleRenderer: {
      directives: {
        custom: function (el, binding) {
          // Manejo personalizado de directivas
        }
      }
    }
  },


  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
   transpile: [
      'vuetify/lib'
    ]
  },

  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },


}
