// store/auth.js
export const state = () => ({
  currentRole: null,
  allowedRoutes: {
    1: ['*'],
    2: ['tecnico', 'tecnicoProceso', 'regaliaComercio'],
    3: ['comercio', 'equipos', 'comodin', 'asignacion']
  }
})

export const mutations = {
  setCurrentRole(state, role) {
    state.currentRole = role
  }
}

export const getters = {
  isRouteAllowed: (state) => (route) => {
    if (!state.currentRole) return false
    if (state.currentRole === 1) return true

    const allowedRoutes = state.allowedRoutes[state.currentRole] || []
    return allowedRoutes.some(allowed => route.startsWith(allowed))
  },

  getCurrentRole: (state) => state.currentRole
}

export const actions = {
  checkRouteAccess({ getters }, route) {
    return getters.isRouteAllowed(route)
  }
}
