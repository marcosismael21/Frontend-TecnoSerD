import Vue from 'vue';
import Cookies from 'js-cookie';

const initializeAcl = () => {
  // Definir permisos por rol
  const rolePermissions = {
    '1': ['*'], // Admin - acceso total
    '2': ['tecnico', 'tecnicoProceso', 'regaliaComercio'], // Técnico
    '3': ['comercio', 'equipos', 'comodin', 'asignacion'] // Gestor Logístico
  };

  // Obtener rol actual
  const currentRole = Cookies.get('rol');

  if (currentRole) {
    // Asignar permisos según el rol
    const permissions = rolePermissions[currentRole] || [];

    // Si es admin, dar acceso total
    if (currentRole === '1') {
      Vue.acl.allow('1', '*');
    } else {
      // Para otros roles, asignar permisos específicos
      Vue.acl.allow(currentRole, permissions);
    }

    // Establecer el rol actual
    Vue.acl.setRole(currentRole);
  }
};

export default ({ app, store }) => {
  if (process.client) {
    initializeAcl();

    app.router.beforeEach((to, from, next) => {
      const token = Cookies.get('token');
      const role = Cookies.get('rol');

      // Si no hay token y no es la página de inicio, redirigir
      if (!token && to.path !== '/') {
        next('/');
        return;
      }

      // Si hay token pero no está en store, actualizar store
      if (token && !store.state.authenticated) {
        store.commit('setAuthenticated', true);
        store.commit('setUser', { role });
        initializeAcl(); // Reinicializar ACL con el rol actual
      }

      // Verificar permisos de ruta
      const routePath = to.path.substring(1); // Remover el '/' inicial
      if (routePath && role) {
        const rolePerms = Vue.acl.getRolePermissions(role);
        // Permitir acceso si el rol es admin o tiene el permiso específico
        if (role === '1' || rolePerms.includes(routePath)) {
          next();
        } else {
          // Redirigir según el rol si no tiene permiso
          if (role === '2') {
            next('/tecnico');
          } else if (role === '3') {
            next('/comercio');
          } else {
            next('/unauthorized');
          }
        }
      } else {
        next();
      }
    });
  }
};
