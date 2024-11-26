import Vue from 'vue'
import VueSimpleAcl from 'vue-simple-acl'

export default ({ app, store }) => {
  // Solo inicializar en el cliente
  if (process.client) {
    Vue.use(VueSimpleAcl, {
      init: (acl) => {
        // Definir roles
        acl.addRole('1')
        acl.addRole('2')
        acl.addRole('3')

        // Definir permisos base
        acl.allow('1', '*')
        acl.allow('2', ['tecnico', 'tecnicoProceso', 'regaliaComercio'])
        acl.allow('3', ['comercio', 'equipos', 'comodin', 'asignacion'])

        return true
      }
    })

    // Escuchar cambios en el store para actualizar el rol
    store.watch(
      (state) => state.user?.role,
      (newRole) => {
        if (newRole) {
          Vue.acl.setRole(newRole)
        }
      }
    )
  }
}
