import Cookies from 'js-cookie';

export default function ({ route, redirect, $axios, store }) {
  if (process.client) {
    const token = Cookies.get('token');

    // Si no hay token y la ruta no es /login, redirigir a /login
    if (!token && route.name !== 'login') {
      return redirect('/login');
    }

    // Si hay un token y la ruta es /login, redirigir a la página principal
    if (token && route.name === 'login') {
      return redirect('/');
    }

    // Si hay token y no estamos en login, verificar su validez
    if (token && route.name !== 'login') {
      $axios.get('/usuario/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Limpiar cookies
          Cookies.remove('token');
          Cookies.remove('rol');
          Cookies.remove('id');
          Cookies.remove('theme');

          // Mostrar diálogo
          store.commit('sessionDialog/showDialog');

          // Redirigir después de un breve delay para que el diálogo tenga tiempo de mostrarse
          setTimeout(() => {
            redirect('/login');
          }, 100);
        }
      });
    }
  }
}
