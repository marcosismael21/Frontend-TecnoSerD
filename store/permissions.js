// store/permissions.js
export const state = () => ({
  roleRoutes: {
    1: ['*'], // Admin
    2: ['tecnico', 'tecnicoProceso', 'regaliaComercio'], // Técnico
    3: ['comercio', 'equipos', 'comodin', 'asignacion'] // Gestor logístico
  },
  defaultRoutes: {
    1: '/tablero',
    2: '/tecnico',
    3: '/comercio'
  }
})

export const getters = {
  getAllowedRoutes: (state) => (rol) => {
    return state.roleRoutes[rol] || []
  },
  getDefaultRoute: (state) => (rol) => {
    return state.defaultRoutes[rol] || '/'
  },
  canAccessRoute: (state) => (rol, route) => {
    if (rol === 1) return true // Admin puede acceder a todo
    const allowedRoutes = state.roleRoutes[rol] || []
    return allowedRoutes.includes(route)
  }
}

export const mutations = {
  // Por si necesitas modificar permisos dinámicamente
  updateRoleRoutes(state, { rol, routes }) {
    state.roleRoutes[rol] = routes
  }
}
