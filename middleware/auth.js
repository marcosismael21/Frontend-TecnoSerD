import Cookies from 'js-cookie';

export default function ({ route, redirect }) {
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
  }
}
