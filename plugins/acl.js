// plugins/acl.js
import Vue from 'vue'
import VueSimpleAcl from 'vue-simple-acl'

Vue.use(VueSimpleAcl)

// Agrega los roles usando el nombre o ID como referencia
Vue.acl.addRole('1') // Administrador
Vue.acl.addRole('2') // Técnico
Vue.acl.addRole('3') // Gestor Logístico

// Define permisos para cada rol
Vue.acl.allow('1', '*') // Administrador tiene acceso total
Vue.acl.allow('2', ['read', 'update']) // Técnico puede leer y actualizar
Vue.acl.allow('3', ['read']) // Gestor Logístico solo puede leer
