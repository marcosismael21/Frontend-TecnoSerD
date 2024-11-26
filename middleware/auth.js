import Cookies from 'js-cookie'

export default function ({ route, redirect, store }) {
  // Solo ejecutar en el cliente
  if (process.client) {
    const token = Cookies.get('token')
    const rol = Cookies.get('rol')

    // Si no hay token y no estamos en la página de login
    if (!token && route.path !== '/') {
      return redirect('/')
    }

    // Si hay token, actualizar el store
    if (token && !store.state.authenticated) {
      store.commit('setAuthenticated', true)
      store.commit('setUser', { role: rol })
    }

    // Verificar permisos de ruta
    if (rol && route.path !== '/') {
      const allowedRoutes = {
        '1': ['*'],
        '2': ['/tecnico', '/tecnicoProceso', '/regaliaComercio'],
        '3': ['/comercio', '/equipos', '/comodin', '/asignacion']
      }

      const currentRoleRoutes = allowedRoutes[rol] || []

      // Si es admin o la ruta está permitida, continuar
      if (rol === '1' || currentRoleRoutes.includes(route.path)) {
        return
      }

      // Si no tiene permisos, redirigir a su ruta por defecto
      if (rol === '2') {
        return redirect('/tecnico')
      } else if (rol === '3') {
        return redirect('/comercio')
      }
    }
  }
}
