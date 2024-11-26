// middleware/routeGuard.js
import Cookies from 'js-cookie';

export default function({ store, route, redirect }) {
  // Solo ejecutar en el cliente
  if (process.client) {
    const rol = parseInt(Cookies.get('rol'));
    const token = Cookies.get('token');

    // Si no hay token, redirigir al login
    if (!token) {
      return redirect('/');
    }

    // Definir rutas por rol
    const routesByRole = {
      1: {
        // Admin tiene acceso a todo
        allowed: [
          'tablero',
          'asignacion',
          'comercio',
          'equipos',
          'comodin',
          'usuarios',
          'ciudad',
          'canal',
          'proveedores',
          'regalia'
        ],
        default: '/tablero'
      },
      2: {
        // Técnico
        allowed: ['tecnico', 'tecnicoProceso', 'regaliaComercio'],
        default: '/tecnico'
      },
      3: {
        // Gestor logístico
        allowed: ['comercio', 'equipos', 'comodin', 'asignacion'],
        default: '/comercio'
      }
    };

    // Obtener configuración para el rol actual
    const roleConfig = routesByRole[rol];

    if (!roleConfig) {
      return redirect('/');
    }

    // Obtener el nombre de la ruta actual
    const currentRouteName = route.name;

    // Si es admin, permitir todo excepto rutas específicas de técnico
    if (rol === 1) {
      const technicianRoutes = ['tecnico', 'tecnicoProceso', 'regaliaComercio'];
      if (technicianRoutes.includes(currentRouteName)) {
        return redirect('/noacceso');
      }
      return;
    }

    // Para otros roles, verificar si la ruta está permitida
    if (!roleConfig.allowed.includes(currentRouteName)) {
      return redirect('/noacceso');
    }
  }
}
